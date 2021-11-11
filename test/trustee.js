// const { catchRevert } = require("./exceptionsHelpers.js");
const Trustee = artifacts.require("Trustee");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Trustee", function (accounts) {
  const [creatorAccount, testatorAccount, beneficiaryAccount] = accounts;

  beforeEach(async () => {
    instance = await Trustee.new();
  });

  it("should assert true", async function () {
    await Trustee.deployed();
    return assert.isTrue(true);
  });

  it("should allow testator to create a trust", async () => {
    trust = await instance.createTrust(testatorAccount);
    return assert.isTrue(trust);
  });
});
