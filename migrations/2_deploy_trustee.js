var Trustee = artifacts.require("./Trustee.sol");

module.exports = function(deployer) {
  deployer.deploy(Trustee);
};
