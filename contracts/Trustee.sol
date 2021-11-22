// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Trust.sol";

contract Trustee is Ownable, ReentrancyGuard {
    // logs every time a beneficiary is added
    event BeneficiaryAdded(
        address indexed testator,
        address indexed beneficiary,
        address indexed trustAddress
    );
    // logs every time a beneficiary is removed
    event BeneficiaryRemoved(
        address indexed testator,
        address indexed beneficiary,
        address indexed trustAddress
    );
    // logs every time a beneficiary is replaced by another one
    event BeneficiaryChanged(
        address indexed testator,
        address oldBeneficiary,
        address newBeneficiary
    );
    event LastCheckInUpdated(address testator, uint time);
    event CheckInFrequencyUpdated(address testator, uint time);
    event Deposited(address indexed testator, uint value, address nft);
    event TrustClaimed(address indexed testator, address indexed trustAddress);

    uint public constant DEFAULT_CHECK_IN_FREQUENCY_IN_DAYS = 30 days;
    uint public testatorsCount = 0;
    uint public beneficiariesCount = 0;

    // testators addresses are mapped to the dataType that must be unique
    mapping(address => Testator) private testators;
    // beneficiaries can have to multiple trusts from different testators
    mapping(address => address[]) private beneficiaryToTrusts;
    mapping(address => address) private trustToTestator;

    // data structure that defines all information related to a testator
    struct Testator {
        // last time a check-in as registered
        uint lastCheckIn;
        // how often a check-in is needed
        uint checkInFrequencyInDays;
        // all beneficiaries related to testator
        address[] beneficiaries;
        // keeps track of beneficiary position in the array
        // beneficiary must be unique per testator
        mapping(address => uint) _indexes;
        // one to one relationship between beneficiary and trust address
        mapping(address => address) beneficiaryToTrust;
    }

    /** Function Modifiers
     */

    modifier isTestator() {
        require(
            testators[msg.sender].beneficiaries.length > 0,
            "You need to add a beneficiary first."
        );
        _;
    }

    modifier isBeneficiary() {
        require(
            beneficiaryToTrusts[msg.sender].length > 0,
            "You are not a beneficiary."
        );
        _;
    }

    modifier isBeneficiaryOf(address _trust) {
        bool found = false;
        for (uint i = 0; i < beneficiaryToTrusts[msg.sender].length; i++) {
            if (beneficiaryToTrusts[msg.sender][i] == _trust) {
                found = true;
                break;
            }
        }
        require(found == true, "Impossible to claim.");
        _;
    }

    /** Helper Functions
     */

    function _daysToSeconds(uint _days) internal pure returns (uint) {
        // 24 hours in a day * 60 minutes in an hour * 60 seconds in a minute
        return _days * (24 * 60 * 60);
    }

    function _secondsToDays(uint _seconds) internal pure returns (uint) {
        // 24 hours in a day * 60 minutes in an hour * 60 seconds in a minute
        return _seconds / (24 * 60 * 60);
    }

    /**
     * @notice Removes an element from array.
     * @dev Removes element from array but does not preserve order. This is very
     * @dev fast and cost efficient.
     */
    function _removeElementByIndex(address[] storage _array, uint _index)
        internal
    {
        _array[_index] = _array[_array.length - 1];
        _array.pop();
    }

    /**
     * @notice Returns index of an element from array.
     * @dev Returns index of an element from array.
     * @return index of the element.
     */
    function _getElementIndex(address[] memory _array, address _element)
        internal
        pure
        returns (uint index)
    {
        for (uint i = 0; i < _array.length; i++) {
            if (_array[i] == _element) {
                index = i;
                break;
            }
        }
    }

    /**
     * @dev Sets lastCheckIn property for Testator.
     */
    function _setLastCheckIn() internal {
        uint _now = block.timestamp;
        testators[msg.sender].lastCheckIn = _now;

        emit LastCheckInUpdated(msg.sender, _now);
    }

    /**
     * @dev Sets default check-in frequency for Testator.
     * @param _days amount of days required before trust become claimable
     */
    function _setCheckInFrequencyInDays(uint _days) internal {
        uint newFrequency = _days == 0
            ? DEFAULT_CHECK_IN_FREQUENCY_IN_DAYS
            : _daysToSeconds(_days);

        testators[msg.sender].checkInFrequencyInDays = newFrequency;

        emit CheckInFrequencyUpdated(msg.sender, newFrequency);
    }

    /**
     * @dev Creates a Trust that will received all beneficiary assets.
     * @return trustAddress which is the new Trust
     */
    function _createTrust()
        internal
        returns (address payable trustAddress)
    {
        trustAddress = payable(address(new Trust(address(this))));
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
    function addBeneficiary(address _beneficiary) public payable {
        // TODO: needs to add a check to confirm beneficiary doesn't have
        // a trust associated to it. A helper function that checks if _contains()
        // this is important because a trust can be lost forever if a new one is set
        // pointing to the same beneficiary.

        // 1. Create the Trust (call helper function)
        address payable trustAddress = _createTrust();
        // 2. Increment testatorsCount if new testator
        if (testators[msg.sender].beneficiaries.length == 0) testatorsCount++;
        // 3. Add beneficiary to testator
        testators[msg.sender].beneficiaries.push(_beneficiary);
        testators[msg.sender].beneficiaryToTrust[_beneficiary] = trustAddress;
        if (testators[msg.sender].checkInFrequencyInDays == 0)
            _setCheckInFrequencyInDays(0);
        _setLastCheckIn();
        // 4. Add beneficiary to beneficiaryToTrusts
        beneficiaryToTrusts[_beneficiary].push(trustAddress);
        beneficiariesCount++;

        // 5. Log the event of adding a new beneficiary
        emit BeneficiaryAdded(msg.sender, _beneficiary, trustAddress);
    }

    /**
     * @notice Removes a beneficiary and destroys it's Trust.
     * @dev Encapsulates removing the beneficiary and releasing the assets to
     * @dev Testator.
     * @param _beneficiary is the address that will be removed.
     */
    function removeBeneficiary(address _beneficiary) public payable isTestator {
        Testator storage testator = testators[msg.sender];
        // 1. Destroy trust
        address payable trustAddress = payable(
            testator.beneficiaryToTrust[_beneficiary]
        );
        Trust trust = Trust(trustAddress);
        trust.destroy();
        // 2. Remove beneficiary from testator
        uint index = _getElementIndex(testator.beneficiaries, _beneficiary);
        _removeElementByIndex(testator.beneficiaries, index);
        delete testator.beneficiaryToTrust[_beneficiary];
        // 3. Remove beneficiary from beneficiaryToTrusts
        index = _getElementIndex(
            beneficiaryToTrusts[_beneficiary],
            trustAddress
        );
        _removeElementByIndex(beneficiaryToTrusts[_beneficiary], index);
        if (beneficiaryToTrusts[_beneficiary].length == 0)
            delete beneficiaryToTrusts[_beneficiary];
        // 4. Decrement testatorsCount if no testator
        if (testators[msg.sender].beneficiaries.length == 0) testatorsCount--;
        beneficiariesCount--;

        // 5. Log the event of removing a beneficiary
        emit BeneficiaryRemoved(msg.sender, _beneficiary, trustAddress);
    }

    /**
     * @notice Replaces a beneficiary with another one.
     * @dev This requires to check if _newBeneficiary doesnt' have another Trust
     * @dev defined already and that _oldBeneficiary exists for Testator.
     * @param _oldBeneficiary is the address that will be replaced.
     * @param _newBeneficiary is the address that will received the trust assets.
     */
    function changeBeneficiary(address _oldBeneficiary, address _newBeneficiary)
        public
        payable
        isTestator
    {
        // TODO: prevent the change if the newBeneficiary already have a trust
        // from the same testator

        Testator storage testator = testators[msg.sender];
        // 1. Update testator
        address trustAddress = testator.beneficiaryToTrust[_oldBeneficiary];
        uint index = _getElementIndex(
            testator.beneficiaries,
            _oldBeneficiary
        );
        testator.beneficiaries[index] = _newBeneficiary;
        testator.beneficiaryToTrust[_newBeneficiary] = trustAddress;
        delete testator.beneficiaryToTrust[_oldBeneficiary];
        // 2. Update beneficiaryToTrusts
        beneficiaryToTrusts[_newBeneficiary].push(trustAddress);
        index = _getElementIndex(
            beneficiaryToTrusts[_oldBeneficiary],
            trustAddress
        );
        _removeElementByIndex(beneficiaryToTrusts[_oldBeneficiary], index);
        if (beneficiaryToTrusts[_oldBeneficiary].length == 0)
            delete beneficiaryToTrusts[_oldBeneficiary];

        emit BeneficiaryChanged(msg.sender, _oldBeneficiary, _newBeneficiary);
    }

    /**
     * @notice List all beneficiaries indexes for Testator
     * @dev This will reveal all indexes for Testator, but not the actual trust
     * @dev addresses. That will require accessing beneficiaryToTrusts on client.
     * @return beneficiariesInstances for beneficiaries array.
     */
    function getBeneficiaries()
        external
        view
        isTestator
        returns (address[] memory)
    {
        return testators[msg.sender].beneficiaries;
    }

    /**
     * @notice Retrieve trust related to beneficiary for Testator
     * @dev It will access the mapping that's inside the testator.
     * @return trustAddress for beneficiary.
     */
    function getBeneficiaryTrust(address _beneficiary)
        external
        view
        isTestator
        returns (address trustAddress)
    {
        return testators[msg.sender].beneficiaryToTrust[_beneficiary];
    }

    /**
     * @notice Retrieves last time testator checked-in.
     * @return lastCheckIn of the Testator.
     */
    function getLastCheckIn() external view isTestator returns (uint) {
        return testators[msg.sender].lastCheckIn;
    }

    /**
     * @notice Register a check-in to keep assets locked for beneficiaries.
     * @notice Failing to check-in enables all beneficiaries to claim assets.
     * @dev This is a stand alone function just to affect the check-in property
     * @dev of the Testator. Needs to be abstracted to a helper function to
     * @dev enable the possibility to be called from other functions as well.
     */
    function setLastCheckIn() external isTestator {
        _setLastCheckIn();
    }

    /**
     * @notice Retrieves how often a check-in must be done in days.
     * @dev Seconds needs to be converted to days.
     */
    function getCheckInFrequencyInDays()
        external
        view
        isTestator
        returns (uint)
    {
        return _secondsToDays(testators[msg.sender].checkInFrequencyInDays);
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
        _setLastCheckIn();
        _setCheckInFrequencyInDays(_days);
    }

    /**
     * @notice Send assets to beneficiary trust.
     * @dev Transfer value to Trust contract directly, never to beneficiary.
     * @dev The trust will act as a custodian for the assets.
     * @param _beneficiary is the address that will received the trust assets.
     */
    function deposit(address _beneficiary)
        external
        payable
        isTestator
        nonReentrant
    {
        address payable _trust = payable(
            testators[msg.sender].beneficiaryToTrust[_beneficiary]
        );
        (bool sent, ) = _trust.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        emit Deposited(msg.sender, msg.value, address(0));
    }

    /**
     * @notice Send NFT assets to beneficiary trust.
     * @dev Transfer value to Trust contract directly, never to beneficiary.
     * @dev Then beneficiary can claim once check-in time has expired.
     * @param _beneficiary is the address that will received the trust assets.
     * @param _nft token that will be transfered.
     */
    function depositNFT(address _beneficiary, uint _nft)
        external
        payable
        isTestator
    {}

    /** Beneficiary Functions
     */

    /**
     * @notice List all trusts that are related to the caller where caller
     * @notice is the beneficiary.
     * @dev This function is the reason why beneficiaryToTrusts storage exist.
     * @return trusts related to beneficiary.
     */
    function getTrusts()
        external
        view
        isBeneficiary
        returns (address[] memory trusts)
    {
        return beneficiaryToTrusts[msg.sender];
    }

    /**
     * @notice List all trusts that are related to the caller where caller
     * @notice is the beneficiary.
     * @dev This function is the reason why beneficiaryToTrusts storage exist.
     */
    function claim(address _trust)
        external
        isBeneficiaryOf(_trust)
    {
        // require(block.timestamp >= testator.lastCheckIn + testator.checkInFrequencyInDays, "Can not claim trust");
        Trust trust = Trust(payable(_trust));
        trust.release(payable(msg.sender));
    }
}
