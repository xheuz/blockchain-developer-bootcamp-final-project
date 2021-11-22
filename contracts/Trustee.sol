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
        uint256 index
    );

    /**
     * @dev Emitted when `Testator` canceled a `trust`.
     */
    event TrustCanceled(address indexed testator, uint256 index);

    /**
     * @dev Emitted when `Beneficiary` claim a `trust`.
     */
    event TrustClaimed(address indexed beneficiary, uint256 index);

    /**
     * @dev Emitted when `Testator` does a check-in.
     */
    event CheckInDeadlineUpdated(address testator, uint256 timestamp);

    /**
     * @dev Emitted when `Testator` updates how often it will do a check-in.
     */
    event CheckInFrequencyUpdated(address testator, uint256 time);

    // default time in days to set check in frequency
    uint256 public constant DEFAULT_CHECK_IN_FREQUENCY_IN_DAYS = 30 days;

    // counters
    uint256 public totalTestators = 0;
    uint256 public totalBeneficiaries = 0;
    uint256 public totalBalanceTrusted = 0;

    // all trusts
    Trust[] private _trusts;

    // testators addresses are mapped to the dataType that must be unique
    mapping(address => Testator) private _testators;
    mapping(address => uint256[]) private _testatorTrusts;
    // beneficiaries can have to multiple trusts from different testators
    mapping(address => uint256[]) private _beneficiaryTrusts;

    // trust statusses
    enum TrustState {
        PENDING,
        CLAIMED,
        CANCELED
    }

    // trust
    struct Trust {
        address testator;
        address beneficiary;
        uint256 balance;
        uint256 timestamp;
        TrustState state;
    }

    struct Testator {
        // check-in must be done before this time
        Timers.Timestamp checkInDeadline;
        // how often a check-in is needed
        uint256 checkInFrequencyInDays;
        // all beneficiaries related to testator
        uint256 balanceInTrusts;
    }

    receive() external payable {}

    fallback() external payable {}

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
    modifier trustBelongs(uint256 _trustIndex, uint256[] memory array) {
        bool found = false;
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == _trustIndex) {
                found = true;
                break;
            }
        }
        require(found == true, "Trust does not belong.");
        _;
    }

    modifier trustIsPending(uint256 _trustIndex) {
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
        for (uint256 i = 0; i < _testatorTrusts[msg.sender].length; i++) {
            uint256 _trustIndex = _testatorTrusts[msg.sender][i];
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

    function _daysToSeconds(uint256 _days) internal pure returns (uint256) {
        // 24 hours in a day * 60 minutes in an hour * 60 seconds in a minute
        return _days * (24 * 60 * 60);
    }

    function _secondsToDays(uint256 _seconds) internal pure returns (uint256) {
        // 24 hours in a day * 60 minutes in an hour * 60 seconds in a minute
        return _seconds / (24 * 60 * 60);
    }

    /**
     * @dev Sets checkInDeadline property for Testator.
     */
    function _setCheckInDeadline() internal {
        uint256 _now = block.timestamp;
        if (_testators[msg.sender].checkInFrequencyInDays <= 0) {
            _setCheckInFrequencyInDays(0);
        }

        _testators[msg.sender].checkInDeadline.setDeadline(
            uint64(_now + _testators[msg.sender].checkInFrequencyInDays)
        );

        emit CheckInDeadlineUpdated(msg.sender, _now);
    }

    /**
     * @dev Sets default check-in frequency for Testator.
     * @param _days amount of days required before trust become claimable
     */
    function _setCheckInFrequencyInDays(uint256 _days) internal {
        uint256 newFrequency = _days == 0
            ? DEFAULT_CHECK_IN_FREQUENCY_IN_DAYS
            : _daysToSeconds(_days);

        _testators[msg.sender].checkInFrequencyInDays = newFrequency;

        emit CheckInFrequencyUpdated(msg.sender, newFrequency);
    }

    /** Testator Functions
     */

    /**
     * @notice Adds a beneficiary with it's Trust if it doesn't have one
     * @dev Turns the caller into a Testator by creating a Trust and relating
     * @dev the beneficiary with the Trust. Also asociates the Beneficiary with
     * @dev it's Testator. Updates lastCheckIn and initialize checkInFrequencyInDays
     * @dev property of the Testator if nothing is configured.
     * @param _beneficiary is the address that will received the trust assets.
     */
    function createTrust(address _beneficiary, uint256 amount)
        public
        payable
        isUnique(_beneficiary)
    {
        require(msg.value >= amount, "Not enough balance.");
        uint256 trustIndex;

        // add trust to array
        _trusts.push(
            Trust(
                msg.sender,
                _beneficiary,
                amount,
                block.timestamp,
                TrustState.PENDING
            )
        );

        // get trust index
        trustIndex = _trusts.length - 1;
        totalBalanceTrusted += msg.value;

        // update testator properties
        if (_testatorTrusts[msg.sender].length == 0) totalTestators++;
        _testators[msg.sender].balanceInTrusts += msg.value;
        _testatorTrusts[msg.sender].push(trustIndex);
        _setCheckInDeadline();

        // update beneficiary
        _beneficiaryTrusts[msg.sender].push(trustIndex);
        totalBeneficiaries++;

        emit TrustCreated(msg.sender, _beneficiary, trustIndex);
    }

    /**
     * @notice Set Trust state to CANCELED.
     * @dev Encapsulates updating trust to CANCELED and releasing the assets to
     * @dev Testator.
     * @param _trustIndex is the index of the trust that will be updated.
     */
    function cancelTrust(uint256 _trustIndex)
        public
        payable
        isTestator
        trustIsPending(_trustIndex)
        trustBelongs(_trustIndex, _testatorTrusts[msg.sender])
        nonReentrant
    {
        // update state
        _trusts[_trustIndex].state = TrustState.CANCELED;
        _trusts[_trustIndex].balance = 0;
        totalBalanceTrusted -= _trusts[_trustIndex].balance;

        // send assets to testator
        _setCheckInDeadline();
        (bool sent, ) = msg.sender.call{value: _trusts[_trustIndex].balance}(
            ""
        );
        require(sent, "Transfer Failed");

        emit TrustCanceled(msg.sender, _trustIndex);
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
        for (uint256 i = 0; i < _testatorTrusts[msg.sender].length; i++) {
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
    function setCheckInFrequencyInDays(uint256 _days) external isTestator {
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
        Trust[] memory trusts = new Trust[](_beneficiaryTrusts[msg.sender].length);
        for (uint256 i = 0; i < _beneficiaryTrusts[msg.sender].length; i++) {
            trusts[i] = (_trusts[_beneficiaryTrusts[msg.sender][i]]);
        }
        return trusts;
    }

    /**
     * @notice Set Trust state to CLAIMED.
     * @dev Encapsulates updating trust to CLAIMED and releasing the assets to
     * Beneficiary. This is true only if checkInDeadline has expired.
     * @param _trustIndex is the index of the trust that will be updated.
     */
    function claimTrust(uint256 _trustIndex)
        public
        payable
        isBeneficiary
        trustIsPending(_trustIndex)
        trustBelongs(_trustIndex, _beneficiaryTrusts[msg.sender])
        nonReentrant
    {
        require(
            _testators[msg.sender].checkInDeadline.isExpired(),
            "Trust can not be claimed yet."
        );

        // update state
        _trusts[_trustIndex].state = TrustState.CLAIMED;
        _trusts[_trustIndex].balance = 0;
        totalBalanceTrusted -= _trusts[_trustIndex].balance;

        // send assets to testator
        (bool sent, ) = msg.sender.call{value: _trusts[_trustIndex].balance}(
            ""
        );
        require(sent, "Transfer Failed");

        emit TrustClaimed(msg.sender, _trustIndex);
    }
}
