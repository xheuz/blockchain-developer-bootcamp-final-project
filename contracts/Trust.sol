// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Trust is Ownable, Pausable {
    address private trustee;

    constructor(address _trustee) {
      trustee = _trustee;
    }

    receive() external payable onlyOwner {}

    fallback() external payable onlyOwner {}

    function destroy() external onlyOwner {
      selfdestruct(payable(owner()));
    }

    function release(address payable _to) external payable {
      require(msg.sender == trustee, "Can't release the assets");
      (bool sent, ) = _to.call{value: address(this).balance}("");
      require(sent, "Transfer Failed");
    }
}
