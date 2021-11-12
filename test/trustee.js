const { catchRevert } = require("./exceptionsHelpers.js");
const Trustee = artifacts.require("Trustee");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Trustee", function (accounts) {
  const [
    contractOwner,
    testatorAccount,
    beneficiaryAccount,
    newBeneficiaryAccount,
  ] = accounts;

  beforeEach(async () => {
    instance = await Trustee.new();
  });

  it("is deployed", async function () {
    await Trustee.deployed();
    return assert.isTrue(true);
  });

  it("is owned by owner", async () => {
    assert.equal(
      await instance.owner.call(),
      contractOwner,
      "owner is not correct"
    );
  });
  
  describe("As Testator", () => {
    it("should allow adding a beneficiary", async () => {
      // adding a beneficiary promotes the caller to a Testator
      await instance.addBeneficiary(beneficiaryAccount, {from: testatorAccount});
      // retrieve added beneficiary
      const beneficiary = await instance.beneficiaries(0);
      
      // beneficiary array should have the beneficiary added
      assert.equal(beneficiary.account, beneficiaryAccount, "beneficiary account does not match.");
    });

    it("should log when a beneficiary is added", async () => {
      // adding a beneficiary logs
      const result = await instance.addBeneficiary(beneficiaryAccount, {from: testatorAccount});
      
      // get the last event
      const lastEvent = result.logs.length - 1;
      const logTestatorAddress = result.logs[lastEvent].args.testator;
      const logBeneficiaryAddress = result.logs[lastEvent].args.beneficiary;

      // make sure accounts match the logs
      assert.equal(logTestatorAddress, testatorAccount, "testator does not match");
      assert.equal(logBeneficiaryAddress, beneficiaryAccount, "beneficiary does not match");
    });

    it("should be able to list beneficiaries", async () => {
      // adding a beneficiary promotes the caller to a Testator
      await instance.addBeneficiary(beneficiaryAccount, {from: testatorAccount});
      await instance.addBeneficiary(newBeneficiaryAccount, {from: testatorAccount});
      // retrieve the list of Beneficiaries related to the caller
      const beneficiariesInstances = await instance.getBeneficiaries({
        from: testatorAccount
      });

      // one beneficiary was added
      assert.equal(beneficiariesInstances.length, 2);
    });


    it("should be able to remove a beneficiary when related", async () => {
      await instance.addBeneficiary(beneficiaryAccount, {from: testatorAccount});
      await instance.removeBeneficiary(beneficiaryAccount, {from: testatorAccount});
      const beneficiariesIndex = await instance.getBeneficiaries({from: testatorAccount});

      assert.equal(beneficiariesIndex.length, 0, "beneficiary found");
    });

    it("should log when a beneficiary is removed", async () => {
      const events = await instance.removeBeneficiary(beneficiaryAccount, {from: testatorAccount});
      
      const logBeneficiaryAddress = events.logs[0].args.beneficiary;

      assert.equal(beneficiaryAccount, logBeneficiaryAddress, "beneficiary does not match");
    });

    it("should allow to change beneficiary for trust when newBeneficiary does not have one already", async () => {
      await instance.addBeneficiary(beneficiaryAccount, {from: testatorAccount});
      await instance.changeBeneficiary(
        beneficiaryAccount,
        newBeneficiaryAccount,
        { from: testatorAccount }
      );
      const beneficiariesIndex = await instance.getBeneficiaries({from: testatorAccount});

      assert.isTrue(beneficiariesIndex.length > 0, "no beneficiary found");
    });

    it("should log when a beneficiary is changed", async () => {
      await instance.addBeneficiary(beneficiaryAccount, {from: testatorAccount});
      const events = await instance.changeBeneficiary(
        beneficiaryAccount,
        newBeneficiaryAccount,
        { from: testatorAccount }
      );
      
      const logOldBeneficiaryAddress = events.logs[0].args.oldBeneficiary;
      const logNewBeneficiaryAddress = events.logs[0].args.oldBeneficiary;

      assert.equal(beneficiaryAccount, logOldBeneficiaryAddress, "oldBeneficiary does not match");
      assert.equal(newBeneficiaryAccount, logNewBeneficiaryAddress, "newBeneficiary does not match");
    });

    it("should allow to do a check-in", async () => {
      await instance.addBeneficiary(beneficiaryAccount, {from: testatorAccount});
      const events = await instance.setLastCheckIn({from: testatorAccount});

      const newTime = events.logs[0].args.time;

      assert.isTrue(newTime, "no time found");
    });
  });

  describe("As Beneficiary", () => {
    it("should allow to list trusts", async () => {
      // retrieve the list of addresses representing all trusts
      // related to the caller
      const trustsAddresses = await instance.getTrusts({ from: beneficiaryAccount });
      
      // since nothing is been added it should be 0
      assert.equal(trustsAddresses.length, 0);
    });
  });
});
