const Trust = artifacts.require("Trust");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Trust", function (accounts) {
  const [_, testatorAccount, beneficiaryAccount] = accounts;

  beforeEach(async () => {
    instance = await Trust.new(beneficiaryAccount, {from: testatorAccount});
  });

  it("is owned by testator", async () => {
    assert.equal(
      await instance.owner.call(),
      testatorAccount,
      "owner is not correct"
    );
  });

  it("can receive payments from testator", async () => {
    assert.isTrue(false);
  });

  it("can not be release by testator", async () => {
    assert.isTrue(false);
  });

  it("can not be release by beneficiary", async () => {
    assert.isTrue(false);
  });

  it("can be released by trustee", async () => {
    assert.isTrue(false);
  });

  it("can be destroyed by testator", async () => {
    await instance.destroy({ from : testatorAccount });
    const balance = await web3.eth.getBalance(instance.address);
    assert.equal(balance, 0, "balance does not match");

  });
});
