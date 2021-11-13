const Trustee = artifacts.require("Trustee");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Trustee", function (accounts) {
  const [owner, testator1, beneficiary1, beneficiary2] = accounts;

  beforeEach(async () => {
    instance = await Trustee.new();
  });

  it("is deployed", async function () {
    await Trustee.deployed();
    return assert.isTrue(true);
  });

  it("is owned by owner", async () => {
    assert.equal(await instance.owner.call(), owner, "owner is not correct");
  });

  describe("As Testator", () => {
    it("should allow adding a beneficiary", async () => {
      // adding a beneficiary promotes the caller to a Testator
      await instance.addBeneficiary(beneficiary1, { from: testator1 });
      // a new testator was added
      const testatorsCount = await instance.testatorsCount();

      assert.equal(testatorsCount, 1, "no testator was found");
    });

    it("should log when a beneficiary is added", async () => {
      // adding a beneficiary logs
      const result = await instance.addBeneficiary(beneficiary1, {
        from: testator1,
      });

      // get the last event
      const lastEvent = result.logs.length - 1;
      const logTestatorAddress = result.logs[lastEvent].args.testator;
      const logBeneficiaryAddress = result.logs[lastEvent].args.beneficiary;

      // make sure accounts match the logs
      assert.equal(logTestatorAddress, testator1, "testator does not match");
      assert.equal(
        logBeneficiaryAddress,
        beneficiary1,
        "beneficiary does not match"
      );
    });

    it("should be able to list beneficiaries", async () => {
      // adding a beneficiary promotes the caller to a Testator
      await instance.addBeneficiary(beneficiary1, {
        from: testator1,
      });
      await instance.addBeneficiary(beneficiary2, {
        from: testator1,
      });
      // retrieve the list of Beneficiaries related to the caller
      const beneficiariesInstances = await instance.getBeneficiaries({
        from: testator1,
      });

      // one beneficiary was added
      assert.equal(beneficiariesInstances.length, 2);
    });

    it("should be able to remove a beneficiary when related", async () => {
      await instance.addBeneficiary(beneficiary1, {
        from: testator1,
      });
      await instance.removeBeneficiary(beneficiary1, {
        from: testator1,
      });
      const testatorsCount = await instance.testatorsCount.call();

      assert.equal(testatorsCount, 0, "testator found");
    });

    it("should log when a beneficiary is removed", async () => {
      await instance.addBeneficiary(beneficiary1, {
        from: testator1,
      });
      const result = await instance.removeBeneficiary(beneficiary1, {
        from: testator1,
      });

      // get the last event
      const lastEvent = result.logs.length - 1;
      const logTestatorAddress = result.logs[lastEvent].args.testator;
      const logBeneficiaryAddress = result.logs[lastEvent].args.beneficiary;

      // make sure accounts match the logs
      assert.equal(logTestatorAddress, testator1, "testator does not match");
      assert.equal(
        logBeneficiaryAddress,
        beneficiary1,
        "beneficiary does not match"
      );
    });

    it("should allow to change beneficiary for trust when newBeneficiary does not have one already", async () => {
      // add original beneficiary
      await instance.addBeneficiary(beneficiary1, {
        from: testator1,
      });
      // capture beneficiaries before applying the change
      const beneficiariesBefore = await instance.getBeneficiaries({
        from: testator1,
      });

      // do the change to a new beneficiary
      await instance.changeBeneficiary(beneficiary1, beneficiary2, {
        from: testator1,
      });
      // get current beneficiaries
      const beneficiariesAfter = await instance.getBeneficiaries({
        from: testator1,
      });

      // accounts before and after the change should be different
      assert.notEqual(
        beneficiariesBefore[0],
        beneficiariesAfter[0],
        "beneficiary match"
      );
    });

    it("should log when a beneficiary is changed", async () => {
      await instance.addBeneficiary(beneficiary1, {
        from: testator1,
      });
      const events = await instance.changeBeneficiary(
        beneficiary1,
        beneficiary2,
        { from: testator1 }
      );

      const logOldBeneficiaryAddress = events.logs[0].args.oldBeneficiary;
      const logNewBeneficiaryAddress = events.logs[0].args.newBeneficiary;

      assert.equal(
        beneficiary1,
        logOldBeneficiaryAddress,
        "oldBeneficiary does not match"
      );
      assert.equal(
        beneficiary2,
        logNewBeneficiaryAddress,
        "newBeneficiary does not match"
      );
    });

    it("should register a check-in", async () => {
      await instance.addBeneficiary(beneficiary1, {
        from: testator1,
      });

      const result = await instance.setLastCheckIn({ from: testator1 });
      const lastCheckIn = await instance.getLastCheckIn({
        from: testator1,
      });

      assert.equal(
        result.logs[0].args.time.toNumber(),
        lastCheckIn.toNumber(),
        "last check-in does not match"
      );
    });

    it("should update check-in frequency", async () => {
      await instance.addBeneficiary(beneficiary1, {
        from: testator1,
      });

      const originalFrequency = await instance.getCheckInFrequencyInDays({
        from: testator1,
      });
      await instance.setCheckInFrequencyInDays(60, { from: testator1 });
      const lastFrequency = await instance.getCheckInFrequencyInDays({
        from: testator1,
      });

      assert.equal(originalFrequency, 30, "original frequency does not match");
      assert.equal(lastFrequency, 60, "lsat frequency does not match");
      assert.isTrue(
        lastFrequency > originalFrequency,
        "frequency did not update"
      );
    });

    it("should be able to deposit balance into trust", async () => {
      await instance.addBeneficiary(beneficiary1, {
        from: testator1,
      });
      const trustAddress = await instance.getBeneficiaryTrust(beneficiary1, {
        from: testator1,
      });

      const TRANSFER_AMOUNT = 10000;
      await instance.deposit(beneficiary1, {
        from: testator1,
        value: TRANSFER_AMOUNT,
        data: "",
      });

      const trustBalance = await web3.eth.getBalance(trustAddress);

      assert.equal(
        trustBalance,
        TRANSFER_AMOUNT,
        "trust balance does not match"
      );
    });
  });

  describe("As Beneficiary", () => {
    it("should list trusts of addresses", async () => {
      await instance.addBeneficiary(beneficiary1, {
        from: testator1,
      });

      // retrieve the list of addresses representing all trusts
      // related to the caller
      const trustsAddresses = await instance.getTrusts({
        from: beneficiary1,
      });

      // since nothing is been added it should be 0
      assert.equal(trustsAddresses.length, 1);
    });

    it("should claim trust when check-in has expired", async () => {
      const balance = web3.utils.fromWei(
        await web3.eth.getBalance(beneficiary1),
        "ether"
      );
      const depositValue = web3.utils.toWei("1", "ether");

      // add beneficiary
      await instance.addBeneficiary(beneficiary1, {
        from: testator1,
      });

      // get address trust related
      const trustAddress = await instance.getBeneficiaryTrust(beneficiary1, {
        from: testator1,
      });

      // deposit funds to trust
      await instance.deposit(beneficiary1, {
        from: testator1,
        value: depositValue,
        data: "",
      });

      // trust balance
      const trustBalance = web3.utils.fromWei(
        await web3.eth.getBalance(trustAddress),
        "ether"
      );

      assert.equal(
        trustBalance,
        web3.utils.fromWei(depositValue, "ether"),
        "trust have balance"
      );

      // release funds to beneficiary account
      await instance.claim(trustAddress, { from: beneficiary1 });

      // trust balance
      const finalTrustBalance = web3.utils.fromWei(
        await web3.eth.getBalance(trustAddress),
        "ether"
      );

      assert.equal(
        finalTrustBalance,
        web3.utils.fromWei("0", "ether"),
        "trust have balance"
      );

      const finalBalance = web3.utils.fromWei(
        await web3.eth.getBalance(beneficiary1),
        "ether"
      );

      assert.isTrue(
        Number(finalBalance) > Number(balance),
        "beneficiary did not received the balance"
      );
    });
  });
});
