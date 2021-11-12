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
      await instance.addBeneficiary(beneficiaryAccount, {
        from: testatorAccount,
      });
      // a new testator was added
      const testatorsCount = await instance.testatorsCount();

      assert.equal(testatorsCount, 1, "no testator was found");
    });

    it("should log when a beneficiary is added", async () => {
      // adding a beneficiary logs
      const result = await instance.addBeneficiary(beneficiaryAccount, {
        from: testatorAccount,
      });

      // get the last event
      const lastEvent = result.logs.length - 1;
      const logTestatorAddress = result.logs[lastEvent].args.testator;
      const logBeneficiaryAddress = result.logs[lastEvent].args.beneficiary;

      // make sure accounts match the logs
      assert.equal(
        logTestatorAddress,
        testatorAccount,
        "testator does not match"
      );
      assert.equal(
        logBeneficiaryAddress,
        beneficiaryAccount,
        "beneficiary does not match"
      );
    });

    it("should be able to list beneficiaries", async () => {
      // adding a beneficiary promotes the caller to a Testator
      await instance.addBeneficiary(beneficiaryAccount, {
        from: testatorAccount,
      });
      await instance.addBeneficiary(newBeneficiaryAccount, {
        from: testatorAccount,
      });
      // retrieve the list of Beneficiaries related to the caller
      const beneficiariesInstances = await instance.getBeneficiaries({
        from: testatorAccount,
      });

      // one beneficiary was added
      assert.equal(beneficiariesInstances.length, 2);
    });

    it("should be able to remove a beneficiary when related", async () => {
      await instance.addBeneficiary(beneficiaryAccount, {
        from: testatorAccount,
      });
      await instance.removeBeneficiary(beneficiaryAccount, {
        from: testatorAccount,
      });
      const testatorsCount = await instance.testatorsCount.call();

      assert.equal(testatorsCount, 0, "testator found");
    });

    it("should log when a beneficiary is removed", async () => {
      await instance.addBeneficiary(beneficiaryAccount, {
        from: testatorAccount,
      });
      const result = await instance.removeBeneficiary(beneficiaryAccount, {
        from: testatorAccount,
      });

      // get the last event
      const lastEvent = result.logs.length - 1;
      const logTestatorAddress = result.logs[lastEvent].args.testator;
      const logBeneficiaryAddress = result.logs[lastEvent].args.beneficiary;

      // make sure accounts match the logs
      assert.equal(
        logTestatorAddress,
        testatorAccount,
        "testator does not match"
      );
      assert.equal(
        logBeneficiaryAddress,
        beneficiaryAccount,
        "beneficiary does not match"
      );
    });

    it("should allow to change beneficiary for trust when newBeneficiary does not have one already", async () => {
      // add original beneficiary
      await instance.addBeneficiary(beneficiaryAccount, {
        from: testatorAccount,
      });
      // capture beneficiaries before applying the change
      const beneficiariesBefore = await instance.getBeneficiaries({
        from: testatorAccount,
      });

      // do the change to a new beneficiary
      await instance.changeBeneficiary(
        beneficiaryAccount,
        newBeneficiaryAccount,
        { from: testatorAccount }
      );
      // get current beneficiaries
      const beneficiariesAfter = await instance.getBeneficiaries({
        from: testatorAccount,
      });

      // accounts before and after the change should be different
      assert.notEqual(
        beneficiariesBefore[0],
        beneficiariesAfter[0],
        "beneficiary match"
      );
    });

    it("should log when a beneficiary is changed", async () => {
      await instance.addBeneficiary(beneficiaryAccount, {
        from: testatorAccount,
      });
      const events = await instance.changeBeneficiary(
        beneficiaryAccount,
        newBeneficiaryAccount,
        { from: testatorAccount }
      );

      const logOldBeneficiaryAddress = events.logs[0].args.oldBeneficiary;
      const logNewBeneficiaryAddress = events.logs[0].args.newBeneficiary;

      assert.equal(
        beneficiaryAccount,
        logOldBeneficiaryAddress,
        "oldBeneficiary does not match"
      );
      assert.equal(
        newBeneficiaryAccount,
        logNewBeneficiaryAddress,
        "newBeneficiary does not match"
      );
    });

    it("should allow to do a check-in", async () => {
      await instance.addBeneficiary(beneficiaryAccount, {
        from: testatorAccount,
      });
      const events = await instance.setLastCheckIn({ from: testatorAccount });

      const newTime = events.logs[0].args.time;

      assert.isTrue(newTime, "no time found");
    });
  });

  describe("As Beneficiary", () => {
    it("should allow to list trusts", async () => {
      // retrieve the list of addresses representing all trusts
      // related to the caller
      const trustsAddresses = await instance.getTrusts({
        from: beneficiaryAccount,
      });

      // since nothing is been added it should be 0
      assert.equal(trustsAddresses.length, 0);
    });
  });
});
