// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Timers.sol";

contract Trustee is Ownable, ReentrancyGuard {
    using Timers for Timers.Timestamp;

    /**
     * @dev Emitted when `Trust` is added from `testator` to `beneficiary`.
     */
    event TrustCreated(
        address indexed testator,
        address indexed beneficiary,
        uint index
    );

    /**
     * @dev Emitted when `Testator` canceled a `trust`.
     */
    event TrustCanceled(address indexed testator, uint index);

    /**
     * @dev Emitted when `Beneficiary` claim a `trust`.
     */
    event TrustClaimed(address indexed beneficiary, uint index);

    /**
     * @dev Emitted when `Testator` does a check-in.
     */
    event CheckInDeadlineUpdated(address testator, uint timestamp);

    /**
     * @dev Emitted when `Testator` updates how often it will do a check-in.
     */
    event CheckInFrequencyUpdated(address testator, uint time);

    // default time in days to set check in frequency
    uint public constant DEFAULT_CHECK_IN_FREQUENCY_IN_DAYS = 30 days;

    // counters
    uint public totalTestators = 0;
    uint public totalBeneficiaries = 0;
    uint public totalBalanceTrusted = 0;
    // custody fee = 0.3% by default
    uint public custodyFee = 3;

    // collection of trusts
    Trust[] private _trusts;

    // testators addresses are mapped to the dataType that must be unique
    mapping(address => Testator) private _testators;
    mapping(address => uint[]) private _testatorTrusts;
    // beneficiaries can have to multiple trusts from different testators
    mapping(address => uint[]) private _beneficiaryTrusts;

    // trust statusses
    enum TrustState {
        PENDING,
        CLAIMED,
        CANCELED
    }

    // trust
    struct Trust {
        uint id;
        address testator;
        address beneficiary;
        uint balance;
        uint timestamp;
        TrustState state;
    }

    struct Testator {
        // check-in must be done before this time
        Timers.Timestamp checkInDeadline;
        // how often a check-in is needed
        uint checkInFrequencyInDays;
        // all beneficiaries related to testator
        uint balanceInTrusts;
    }

    receive() external payable {}

    fallback() external payable {
        require(msg.data.length == 0);
    }

    /** Function Modifiers
     */

    /**
     * @dev Throws if called by any account that is not a testator.
     */
    modifier isTestator() {
        require(
            _testatorTrusts[msg.sender].length > 0,
            "You need to add a beneficiary first."
        );
        _;
    }

    /**
     * @dev Throws if called by any account that is not a beneficiary of the
     * especified trust.
     */
    modifier trustBelongs(uint _trustIndex, uint[] memory array) {
        bool found = false;
        for (uint i = 0; i < array.length; i++) {
            if (array[i] == _trustIndex) {
                found = true;
                break;
            }
        }
        require(found == true, "Trust does not belong.");
        _;
    }

    modifier trustIsPending(uint _trustIndex) {
        require(
            _trusts[_trustIndex].state == TrustState.PENDING,
            "Trust is already disabled."
        );
        _;
    }

    /**
     * @dev Throws if called by any account that is not a beneficiary.
     */
    modifier isBeneficiary() {
        require(
            _beneficiaryTrusts[msg.sender].length > 0,
            "You are not a beneficiary."
        );
        _;
    }

    /**
     * @dev Throws if called by testator and the beneficiary is not unique for him.
     */
    modifier isUnique(address _beneficiary) {
        bool found = false;
        for (uint i = 0; i < _testatorTrusts[msg.sender].length; i++) {
            uint _trustIndex = _testatorTrusts[msg.sender][i];
            if (_trusts[_trustIndex].beneficiary == _beneficiary) {
                found = true;
                break;
            }
        }
        require(found == false, "Beneficiary must be unique.");
        _;
    }

    /** Helper Functions
     */

    function _daysToSeconds(uint _days) internal pure returns (uint) {
        // 24 hours in a day * 60 minutes in an hour * 60 seconds in a minute
        return _days * (24 * 60 * 60);
    }

    /**
     * @dev Sets checkInDeadline property for Testator.
     */
    function _setCheckInDeadline() internal {
        uint _now = block.timestamp;
        if (_testators[msg.sender].checkInFrequencyInDays <= 0) {
            _setCheckInFrequencyInDays(0);
        }

        _testators[msg.sender].checkInDeadline.setDeadline(
            uint64(_now + _testators[msg.sender].checkInFrequencyInDays)
        );

        emit CheckInDeadlineUpdated(
            msg.sender,
            _testators[msg.sender].checkInDeadline.getDeadline()
        );
    }

    /**
     * @dev Returns the value that will be transfer over the beneficiary at
     * release time.
     * @param _amount amount to be relased.
     */
    function _valueAfterFees(uint _amount) internal view returns (uint) {
        // 1000 constant value used to calculate custody percentage to be
        // retained.
        return _amount - ((_amount * custodyFee) / 1000);
    }

    /**
     * @dev Sets default check-in frequency for Testator.
     * @param _days amount of days required before trust become claimable
     */
    function _setCheckInFrequencyInDays(uint _days) internal {
        uint newFrequency = _days == 0
            ? DEFAULT_CHECK_IN_FREQUENCY_IN_DAYS
            : _daysToSeconds(_days);

        _testators[msg.sender].checkInFrequencyInDays = newFrequency;

        emit CheckInFrequencyUpdated(msg.sender, newFrequency);
    }

    /** Owner Functions */

    /**
     * @dev Sets custody fee that will be retained as reward for keeping the
     * assets locked. This value is divided by 1000 to allow percentages of
     * 0.3% per example which is equals to 3/1000. See _valueAfterFees function.
     * @param _fee amount to be retained.
     */
    function setCustodyFee(uint _fee) public onlyOwner {
        custodyFee = _fee;
    }

    /** Testator Functions */

    /**
     * @notice Adds a beneficiary with it's Trust if it doesn't have one
     * @dev Turns the caller into a Testator by creating a Trust and relating
     * @dev the beneficiary with the Trust. Also asociates the Beneficiary with
     * @dev it's Testator. Updates deadline and initialize checkInFrequencyInDays
     * @dev property of the Testator if nothing is configured.
     * @param _beneficiary is the address that will received the trust assets.
     */
    function createTrust(address _beneficiary, uint amount)
        public
        payable
        isUnique(_beneficiary)
    {
        require(msg.value >= amount, "Not enough balance.");
        // id will always be the length of trusts array
        uint trustIndex = _trusts.length;

        // add trust to array
        _trusts.push(
            Trust(
                trustIndex,
                msg.sender,
                _beneficiary,
                msg.value,
                block.timestamp,
                TrustState.PENDING
            )
        );

        // get trust index
        totalBalanceTrusted += msg.value;

        // update testator properties
        if (_testatorTrusts[msg.sender].length == 0) totalTestators++;
        _testators[msg.sender].balanceInTrusts += msg.value;
        _testatorTrusts[msg.sender].push(trustIndex);
        _setCheckInDeadline();

        // update beneficiary
        if (_beneficiaryTrusts[_beneficiary].length == 0) totalBeneficiaries++;
        _beneficiaryTrusts[_beneficiary].push(trustIndex);

        emit TrustCreated(msg.sender, _beneficiary, trustIndex);
    }

    /**
     * @notice Set Trust state to CANCELED.
     * @dev Encapsulates updating trust to CANCELED and releasing the assets to
     * @dev Testator.
     * @param _id is the index of the trust that will be updated.
     */
    function cancelTrust(uint _id)
        public
        isTestator
        trustIsPending(_id)
        trustBelongs(_id, _testatorTrusts[msg.sender])
        nonReentrant
    {
        uint amount = _trusts[_id].balance;
        _testators[msg.sender].balanceInTrusts -= amount;

        // update state
        // remove from beneficiary
        address beneficiary = _trusts[_id].beneficiary;
        uint _length = _beneficiaryTrusts[beneficiary].length;
        for (uint i = 0; i < _length; i++) {
            if (_beneficiaryTrusts[beneficiary][i] == _id) {
                _beneficiaryTrusts[beneficiary][i] = _beneficiaryTrusts[
                    beneficiary
                ][_length - 1];
                _beneficiaryTrusts[beneficiary].pop();
                break;
            }
        }

        // update trust state
        _trusts[_id].beneficiary = address(0);
        _trusts[_id].state = TrustState.CANCELED;
        totalBalanceTrusted -= amount;
        _trusts[_id].balance = 0;
        _setCheckInDeadline();

        // send assets to testator
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Transfer Failed");

        emit TrustCanceled(msg.sender, _id);
    }

    /**
     * @notice Retrieve all trust realted to Testator.
     * @dev It will access the testators mapping and build the trusts list.
     * @return trusts for testators.
     */
    function testatorTrusts()
        external
        view
        isTestator
        returns (Trust[] memory)
    {
        Trust[] memory trusts = new Trust[](_testatorTrusts[msg.sender].length);
        for (uint i = 0; i < _testatorTrusts[msg.sender].length; i++) {
            trusts[i] = (_trusts[_testatorTrusts[msg.sender][i]]);
        }
        return trusts;
    }

    /**
     * @notice Retrieves testator details.
     * @return Testator details as object.
     */
    function testatorDetails()
        external
        view
        isTestator
        returns (Testator memory)
    {
        return _testators[msg.sender];
    }

    /**
     * @notice Register a check-in to keep assets locked for beneficiaries.
     * @notice Failing to check-in enables all beneficiaries to claim assets.
     * @dev This is a stand alone function just to affect the check-in property
     * @dev of the Testator. Needs to be abstracted to a helper function to
     * @dev enable the possibility to be called from other functions as well.
     */
    function setCheckInDeadline() external isTestator {
        _setCheckInDeadline();
    }

    /**
     * @notice Amount of days to do a check-in. Failing to check-in enables
     * @notice beneficiaries to claim the assets. A minimum of 30 days is
     * @notice required which is also the default amount if not configured.
     * @dev Days needs to be converted to seconds in order to do calculations.
     * @param _days amount of days required to do a check-in.
     */
    function setCheckInFrequencyInDays(uint _days) external isTestator {
        require(_days >= 30, "At least 30 days are require between check-ins.");
        _setCheckInFrequencyInDays(_days);
        _setCheckInDeadline();
    }

    /** Beneficiary Functions
     */

    /**
     * @notice List all trusts that are related to the caller where caller
     * @notice is the beneficiary.
     * @dev This function is the reason why _beneficiaryTrusts storage exist.
     * @return trusts related to beneficiary.
     */
    function beneficiaryTrusts()
        external
        view
        isBeneficiary
        returns (Trust[] memory)
    {
        Trust[] memory trusts = new Trust[](
            _beneficiaryTrusts[msg.sender].length
        );
        for (uint i = 0; i < _beneficiaryTrusts[msg.sender].length; i++) {
            trusts[i] = (_trusts[_beneficiaryTrusts[msg.sender][i]]);
        }
        return trusts;
    }

    /**
     * @notice Set Trust state to CLAIMED.
     * @dev Encapsulates updating trust to CLAIMED and releasing the assets to
     * Beneficiary. This is true only if checkInDeadline has expired.
     * @param _id is the index of the trust that will be updated.
     */
    function claimTrust(uint _id)
        public
        isBeneficiary
        trustIsPending(_id)
        trustBelongs(_id, _beneficiaryTrusts[msg.sender])
        nonReentrant
    {
        require(
            _testators[msg.sender].checkInDeadline.isExpired(),
            "Trust can not be claimed yet."
        );
        uint amount = _trusts[_id].balance;
        _testators[msg.sender].balanceInTrusts -= amount;

        // update state
        _trusts[_id].state = TrustState.CLAIMED;
        totalBalanceTrusted -= amount;
        _trusts[_id].balance = 0;

        // send assets to beneficiary
        address payable beneficiary = payable(_trusts[_id].beneficiary);
        (bool sent, ) = beneficiary.call{value: _valueAfterFees(amount)}("");
        require(sent, "Transfer Failed");

        emit TrustClaimed(msg.sender, _id);
    }
}
