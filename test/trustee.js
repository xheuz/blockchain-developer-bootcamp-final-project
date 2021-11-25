const { catchRevert } = require("./exceptionsHelpers");
const Trustee = artifacts.require("Trustee");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Trustee", function (accounts) {
  const [owner, testator1, testator2, beneficiary1, beneficiary2] = accounts;
  const addressZero = "0x0000000000000000000000000000000000000000";
  const amount = web3.utils.toWei("0.01", "ether");

  beforeEach(async () => {
    instance = await Trustee.new();
  });

  it("is deployed.", async function () {
    await Trustee.deployed();
    return assert.isTrue(true);
  });

  it("is owned by owner.", async () => {
    assert.equal(await instance.owner.call(), owner, "owner is not correct");
  });

  it("should allow to create a trust with balance.", async () => {
    // create a trust and deposit amount
    await instance.createTrust(beneficiary1, amount, {
      from: testator1,
      value: amount,
      data: "",
    });

    // a new testator was added
    const trusts = await instance.testatorTrusts({ from: testator1 });
    // contract balance must match amount
    const contractBalance = await web3.eth.getBalance(instance.address);

    assert.equal(trusts.length, 1, "testator was not found.");
    assert.equal(trusts[0].id, 0, "trust id does not match.");
    assert.equal(trusts[0].balance, amount, "trust balance does not match.");
    assert.equal(contractBalance, amount, "contract balance does no match.");
  });

  it("should revert transaction when not enough balance to create trust.", async () => {
    const value = web3.utils.toWei("0.001", "ether");
    // should revert
    await catchRevert(
      instance.createTrust(beneficiary1, amount, {
        from: testator1,
        value,
        data: "",
      })
    );
  });

  it("should log when a trust was created.", async () => {
    const anotherAmount = web3.utils.toWei("2", "ether");
    // create a trust and deposit amount
    const tx = await instance.createTrust(beneficiary1, amount, {
      from: testator1,
      value: amount,
      data: "",
    });

    // get the last event
    const lastEvent = tx.logs.length - 1;
    const logTestatorAddress = tx.logs[lastEvent].args.testator;
    const logBeneficiaryAddress = tx.logs[lastEvent].args.beneficiary;

    // make sure accounts match the logs
    assert.equal(logTestatorAddress, testator1, "testator does not match");
    assert.equal(
      logBeneficiaryAddress,
      beneficiary1,
      "beneficiary does not match"
    );
  });

  it("should increase global counters when a trust is created.", async () => {
    // create first trust
    await instance.createTrust(beneficiary1, amount, {
      from: testator1,
      value: amount,
      data: "",
    });

    // create second trust same testator different beneficiary
    await instance.createTrust(beneficiary2, amount, {
      from: testator1,
      value: amount,
      data: "",
    });

    // create third trust different testator already existing beneficiary
    await instance.createTrust(beneficiary1, amount, {
      from: testator2,
      value: amount,
      data: "",
    });

    const totalTestators = await instance.totalTestators();
    const totalBeneficiaries = await instance.totalBeneficiaries();
    const totalBalanceTrusted = await instance.totalBalanceTrusted();

    assert.equal(totalTestators, 2, "totalTestators does not match");
    assert.equal(totalBeneficiaries, 2, "totalBeneficiaries does not match");
    assert.equal(
      totalBalanceTrusted,
      amount * 3,
      "totalBalanceTrusted does not match"
    );
  });

  describe("As Owner", () => {
    it("should set a custody fee.", async () => {
      // get default fee
      const defaultFee = await instance.custodyFee();

      // set new fee to 20
      await instance.setCustodyFee(20, { from: owner });
      const currentFee = await instance.custodyFee();

      assert.equal(defaultFee, 3, "defaultFee is not 3.");
      assert.equal(currentFee, 20, "currentFee is not 20.");
    });
  });

  describe("As Testator", () => {
    it("should revert when add new trust to existing an beneficiary.", async () => {
      const anotherAmount = web3.utils.toWei("2", "ether");
      // create a trust and deposit amount
      await instance.createTrust(beneficiary1, amount, {
        from: testator1,
        value: amount,
        data: "",
      });

      // second call to add a new trust but with the same beneficiary for
      // the same testator
      await catchRevert(
        instance.createTrust(beneficiary1, anotherAmount, {
          from: testator1,
          value: anotherAmount,
          data: "",
        })
      );
    });

    it("should be able to cancel a trust and get the balance back.", async () => {
      const amount = web3.utils.toWei("10", "ether");
      // create a trust
      await instance.createTrust(beneficiary1, amount, {
        from: testator1,
        value: amount,
        data: "",
      });

      // get all trusts from testator1
      let trusts = await instance.testatorTrusts({ from: testator1 });
      // check global counter
      let totalBalanceTrusted = await instance.totalBalanceTrusted();
      // check for trust state
      assert.equal(trusts[0].id, 0, "trust id does not match.");
      // 0 = PENDING, 1 = CLAIMED, 2 = CANCELED
      assert.equal(trusts[0].state, 0, "trust state does not match.");
      assert.equal(trusts[0].balance, amount, "trust balance does not match.");
      assert.equal(
        totalBalanceTrusted,
        trusts[0].balance,
        "totalBalanceTrusted does not match."
      );

      const originalBalance = web3.utils.fromWei(
        await web3.eth.getBalance(testator1),
        "ether"
      );
      // cancel a trust
      await instance.cancelTrust(trusts[0].id, { from: testator1 });
      const finalBalance = web3.utils.fromWei(
        await web3.eth.getBalance(testator1),
        "ether"
      );
      // get all trusts from testator1
      trusts = await instance.testatorTrusts({ from: testator1 });
      // global counter balance should have been decreased
      totalBalanceTrusted = await instance.totalBalanceTrusted();

      // check for trust state
      assert.equal(trusts[0].state, 2, "trust state does not match.");
      // 0 = PENDING, 1 = CLAIMED, 2 = CANCELED
      assert.equal(trusts[0].balance, 0, "trust balance does not match.");
      assert.equal(trusts[0].id, 0, "trust id does not match.");
      assert.equal(
        trusts[0].testator,
        testator1,
        "trust testator does not match."
      );
      // beneficiary should be `addressZero` since a testator can only have
      // a beneficiary once.
      assert.equal(
        trusts[0].beneficiary,
        addressZero,
        "trust beneficiary does not match."
      );
      assert.equal(
        totalBalanceTrusted,
        0,
        "totalBalanceTrusted does not match."
      );
      assert.isTrue(
        finalBalance > originalBalance,
        "finalBalance is not greater than original."
      );
    });

    it("should revert when is not owner of a trust and tries to cancel it.", async () => {
      const amount = web3.utils.toWei("10", "ether");
      // create a trust
      await instance.createTrust(beneficiary1, amount, {
        from: testator1,
        value: amount,
        data: "",
      });
      // create a trust with testator2
      await instance.createTrust(beneficiary2, amount, {
        from: testator2,
        value: amount,
        data: "",
      });

      let trusts = await instance.testatorTrusts({ from: testator1 });

      // cancel a trust when testator2
      await catchRevert(
        instance.cancelTrust(trusts[0].id, { from: testator2 })
      );
    });

    it("should only allow to cancel a trust that is pending.", async () => {
      const amount = web3.utils.toWei("10", "ether");
      // create a trust
      await instance.createTrust(beneficiary1, amount, {
        from: testator1,
        value: amount,
        data: "",
      });

      let trusts = await instance.testatorTrusts({ from: testator1 });
      // cancel the trust, it is now CANCELED
      await instance.cancelTrust(trusts[0].id, { from: testator1 });

      // lets try to cancel it again
      await catchRevert(
        instance.cancelTrust(trusts[0].id, { from: testator1 })
      );
    });

    it("should log when a trust is canceled.", async () => {
      const amount = web3.utils.toWei("10", "ether");
      // create a trust
      await instance.createTrust(beneficiary1, amount, {
        from: testator1,
        value: amount,
        data: "",
      });

      let trusts = await instance.testatorTrusts({ from: testator1 });
      // cancel the trust
      const tx = await instance.cancelTrust(trusts[0].id, {
        from: testator1,
      });

      // get the last event
      const lastEvent = tx.logs.length - 1;
      const logTestatorAddress = tx.logs[lastEvent].args.testator;
      const logTrustIndex = tx.logs[lastEvent].args.index;

      // make sure the logs match
      assert.equal(logTestatorAddress, testator1, "testator does not match");
      assert.equal(logTrustIndex, trusts[0].id, "trust index does not match");
    });

    it("should allow to get an array of owned trusts.", async () => {
      const amount = web3.utils.toWei("10", "ether");
      // create a trust
      await instance.createTrust(beneficiary1, amount, {
        from: testator1,
        value: amount,
        data: "",
      });
      // create a trust testator2
      await instance.createTrust(beneficiary1, amount, {
        from: testator2,
        value: amount,
        data: "",
      });
      // create a trust
      await instance.createTrust(beneficiary2, amount, {
        from: testator1,
        value: amount,
        data: "",
      });

      let trusts = await instance.testatorTrusts({ from: testator1 });
      let trusts2 = await instance.testatorTrusts({ from: testator2 });

      assert.equal(trusts.length, 2, "trust amount does not match.");
      assert.equal(trusts2.length, 1, "trust amount does not match.");
      assert.equal(
        trusts[0].testator,
        testator1,
        "trust testator does not match."
      );
      assert.equal(
        trusts[1].testator,
        testator1,
        "trust testator does not match."
      );
      assert.equal(
        trusts2[0].testator,
        testator2,
        "trust testator does not match."
      );
    });

    it("should retrieve detailed info of caller.", async () => {
      const amount = web3.utils.toWei("10", "ether");
      // create a trust
      await instance.createTrust(beneficiary1, amount, {
        from: testator1,
        value: amount,
        data: "",
      });
      // create a trust
      await instance.createTrust(beneficiary2, amount, {
        from: testator1,
        value: amount,
        data: "",
      });

      // get details
      const testator = await instance.testatorDetails({ from: testator1 });

      // calculate days from dates
      const _difference =
        new Date(+testator.checkInDeadline[0] * 1000).getTime() -
        new Date().getTime();
      const checkInBeforeDays = Math.round(_difference / 1000 / 60 / 60 / 24);

      assert.equal(
        testator.balanceInTrusts,
        amount * 2,
        "balanceInTrusts does not match"
      );
      assert.equal(
        testator.checkInFrequencyInDays,
        //30 days * 24 hours in a day * 60 minutes in an hour * 60 seconds in a minute
        30 * 24 * 60 * 60,
        "checkInFrequencyInDays does not match"
      );
      assert.equal(
        checkInBeforeDays,
        30,
        "checkInDeadline is not greater han today."
      );
    });

    it("should able to do a check-in.", async () => {
      const amount = web3.utils.toWei("10", "ether");
      // create a trust
      await instance.createTrust(beneficiary1, amount, {
        from: testator1,
        value: amount,
        data: "",
      });

      const testator = await instance.testatorDetails({ from: testator1 });
      const tx = await instance.setCheckInDeadline({ from: testator1 });

      assert.equal(
        tx.logs[0].args.timestamp.toNumber(),
        Number(testator.checkInDeadline[0]),
        "last check-in does not match"
      );
    });

    it("should update check-in frequency.", async () => {
      const amount = web3.utils.toWei("10", "ether");
      // create a trust
      await instance.createTrust(beneficiary1, amount, {
        from: testator1,
        value: amount,
        data: "",
      });

      let testator = await instance.testatorDetails({ from: testator1 });
      const originalFrequency = testator.checkInFrequencyInDays;

      await instance.setCheckInFrequencyInDays(60, { from: testator1 });

      testator = await instance.testatorDetails({ from: testator1 });
      const lastFrequency = testator.checkInFrequencyInDays;

      //30 days * 24 hours in a day * 60 minutes in an hour * 60 seconds in a minute
      assert.equal(
        originalFrequency,
        30 * (24 * 60 * 60),
        "original frequency does not match"
      );
      //60 days * 24 hours in a day * 60 minutes in an hour * 60 seconds in a minute
      assert.equal(
        lastFrequency,
        60 * (24 * 60 * 60),
        "lsat frequency does not match"
      );
      assert.isTrue(
        lastFrequency > originalFrequency,
        "frequency did not update"
      );
    });
  });

  describe("As Beneficiary", () => {
    it("should list trusts of addresses.", async () => {
      const amount = web3.utils.toWei("10", "ether");
      // create a trust
      await instance.createTrust(beneficiary1, amount, {
        from: testator1,
        value: amount,
        data: "",
      });

      // retrieve the list of addresses representing all trusts
      // related to the caller
      const trusts = await instance.beneficiaryTrusts({
        from: beneficiary1,
      });

      // since nothing is been added it should be 0
      assert.equal(trusts.length, 1, "trusts does not match");
      assert.equal(trusts[0].id, 0, "trust id does not match");
      assert.equal(trusts[0].balance, amount, "trust id does not match");
    });

    it("should revert claiming assets when deadline time has not expired.", async () => {
      const amount = web3.utils.toWei("10", "ether");
      // create a trust
      await instance.createTrust(beneficiary1, amount, {
        from: testator1,
        value: amount,
        data: "",
      });

      // retrieve the list of addresses representing all trusts
      // related to the caller
      const trusts = await instance.beneficiaryTrusts({
        from: beneficiary1,
      });

      // revert since the expired time has not passed yet.
      await catchRevert(
        instance.claimTrust(trusts[0].id, { from: beneficiary1 })
      );
    });
  });
});
