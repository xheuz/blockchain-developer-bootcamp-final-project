// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Trust.sol";

contract Trustee is Ownable {
    event BeneficiaryAdded(address indexed testator, address indexed beneficiary);
    event BeneficiaryRemoved(address indexed testator, address indexed beneficiary);
    event BeneficiaryChanged(address indexed testator, address indexed beneficiary);
    event CheckInUpdated(address testator, uint time);
    event CheckInFrecuencyUpdated(address testator, uint time);
    event Deposited(address indexed testator, uint amount);
    event DepositedNFT(address indexed testator, address nft);
    event TrustDestroyed(address indexed testator, address indexed trustAddress);
    event TrustClaimed(address indexed testator, address indexed trustAddress);
    event TrustCreated(
        address indexed testator,
        address indexed beneficiary,
        address indexed trustAddress
    );

    Beneficiary[] public beneficiaries;
    uint public constant defaultCheckInFrecuencyInDays = 30 days;
    uint public testatorsCount = 0;
    mapping(address => Testator) private testators;
    mapping(address => address[]) private beneficiaryToTrusts;

    struct Testator {
        address payable account;
        uint lastCheckIn;
        uint checkInFrecuencyInDays;
        uint[] beneficiariesIndex;
    }

    struct Beneficiary {
        address payable account;
        address trust;
    }

    modifier isTestator() {
        Testator storage testator = testators[msg.sender];
        require(
            testator.beneficiariesIndex.length > 0,
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

    modifier hasCheckInExpired() {
        Testator memory testator = testators[msg.sender];
        uint _lastCheckIn = testator.lastCheckIn;
        uint _checkInFrecuencyInDays = testator.checkInFrecuencyInDays;
        uint timeSinceLastCheckIn = _checkInFrecuencyInDays > 0
            ? _checkInFrecuencyInDays
            : defaultCheckInFrecuencyInDays;

        timeSinceLastCheckIn += _lastCheckIn;
        require(block.timestamp > timeSinceLastCheckIn, "Time hasn't expired.");
        _;
    }

    /** Helper Functions
     */

    function _daysToSeconds(uint _days) internal pure returns (uint) {
        // 24 hours in a day * 60 minutes in an hour * 60 seconds in a minute
        return _days * (24 * 60 * 60);
    }

    /**
     * @notice Removes beneficiary from beneficiaries array
     * @dev Removes indexes from Testator and also from beneficiaries
     */
    function _removeBeneficiary(uint _index) internal {}

    /**
     * @dev Sets lastCheckIn property for Testator.
     */
    function _setLastCheckIn() internal {
        uint _now = block.timestamp;
        testators[msg.sender].lastCheckIn = _now;

        emit CheckInUpdated(msg.sender, _now);
    }

    /**
     * @dev Sets default check-in frecuency for Testator.
     */
    function _setDefaultCheckInFrecuencyInDays() internal {
        if (testators[msg.sender].checkInFrecuencyInDays == 0) {
            testators[msg.sender]
                .checkInFrecuencyInDays = defaultCheckInFrecuencyInDays;
        }

        emit CheckInFrecuencyUpdated(msg.sender, defaultCheckInFrecuencyInDays);
    }

    /**
     * @dev Creates a Trust that will received all beneficiary assets.
     * @param _beneficiary instance of Beneficiary
     * @return trustAddress which is the new Trust
     */
    function _createTrust(address payable _beneficiary)
        internal
        returns (address payable trustAddress)
    {
        trustAddress = payable(address(new Trust(_beneficiary)));
        emit TrustCreated(msg.sender, _beneficiary, trustAddress);
    }

    /** Testator Functions
     */

    /**
     * @notice Adds a beneficiary with it's Trust
     * @dev Turns the caller into a Testator by creating a Trust and relating
     * @dev the beneficiary with the Trust. Also asociates the Beneficiary with
     * @dev it's Testator. Updates lastCheckIn and initialize checkInFrecuencyInDays
     * @dev property of the Testator if nothing is configured.
     * @param _beneficiary is the address that will received the trust assets.
     */
    function addBeneficiary(address _beneficiary) public payable {
        // 1. Create the Trust (call helper function)
        // 2. Create Beneficiary
        // 3. Add Beneficiary to beneficiaries
        // 4. Add index to Testator.beneficiariesIndex
    }

    /**
     * @notice Removes a beneficiary and destroys it's Trust.
     * @dev Encapsulates removing the beneficiary and releasing the assets to
     * @dev Testator.
     * @param _beneficiary is the address that will be removed.
     */
    function removeBeneficiary(address _beneficiary)
        public
        payable
        isTestator
    {}

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
    {}

    /**
     * @notice List all beneficiaries indexes for Testator
     * @dev This will reveal all indexes for Testator, but not the actual trust
     * @dev addresses. That will require accessing beneficiaryToTrusts on client.
     * @return indexes for beneficiaries array.
     */
    function getBeneficiaries()
        external
        view
        isTestator
        returns (uint[] memory indexes)
    {
        Testator memory testator = testators[msg.sender];
        return testator.beneficiariesIndex;
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
     * @notice Amount of days to do a check-in. Failing to check-in enables
     * @notice beneficiaries to claim the assets. A minimum of 30 days is
     * @notice required which is also the default amount if not configured.
     * @dev Days needs to be converted to seconds in order to do calculations.
     * @param _days amount of days required to do a check-in.
     */
    function setCheckInFrecuencyInDays(uint _days) external isTestator {
        require(_days >= 30, "At least 30 days are require between check-ins.");
        uint daysToSeconds = _daysToSeconds(_days);
        testators[msg.sender].checkInFrecuencyInDays = daysToSeconds;
        _setLastCheckIn();

        emit CheckInFrecuencyUpdated(msg.sender, daysToSeconds);
    }

    /**
     * @notice Send assets to beneficiary trust.
     * @dev Transfer value to Trust contract directly, never to beneficiary.
     * @param _beneficiary is the address that will received the trust assets.
     * @param _amount how much will be transfered.
     */
    function deposit(address _beneficiary, uint _amount)
        external
        isTestator
    {}

    /**
     * @notice Send NFT assets to beneficiary trust.
     * @dev Transfer value to Trust contract directly, never to beneficiary.
     * @param _beneficiary is the address that will received the trust assets.
     * @param _nft token that will be transfered.
     */
    function depositNFT(address _beneficiary, address _nft)
        external
        isTestator
    {}

    /**
     * @notice Retrieves balance and NFT's from beneficiary trust.
     * @dev Transfer value to Trust contract directly, never to beneficiary.
     * @param _beneficiary is the address that will received the trust assets.
     * @return balance and nfts currently on beneficiary Trust.
     */
    function getBeneficiaryAssets(address _beneficiary)
        external
        view
        isTestator
        returns (uint balance, address[] memory ntfs)
    {}

    /** Beneficiary Functions
     */

    /**
     * @notice List all trusts that are related to the caller where caller
     * @notice is the beneficiary.
     * @dev This function is the reason why beneficiaryToTrusts storage exist.
     */
    function getBeneficiaryTrusts()
        external
        view
        isBeneficiary
        returns (address[] memory trusts)
    {}

    /**
     * @notice List all trusts that are related to the caller where caller
     * @notice is the beneficiary.
     * @dev This function is the reason why beneficiaryToTrusts storage exist.
     */
    function claimTrust(address _trust)
        external
        isBeneficiary
        isBeneficiaryOf(_trust)
    {}
}
