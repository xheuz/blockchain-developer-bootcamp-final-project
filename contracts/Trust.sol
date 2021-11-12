// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Trust is Ownable, Pausable {
    address payable private beneficiary;

    constructor(address payable _beneficiary) {
      beneficiary = _beneficiary;
    }

    function destroy() external onlyOwner {}
}
