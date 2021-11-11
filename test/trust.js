const Trust = artifacts.require("Trust");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Trust", function (accounts) {
  const [_, testatorAccount, beneficiaryAccount] = accounts;

  beforeEach(async () => {
    instance = await Trust.new({from: testatorAccount});
  });

  it("should assert true", async function () {
    await Trust.deployed();
    return assert.isTrue(true);
  });

  it("should be able to be created", async function () {
    console.log(await web3.eth.getBalance(beneficiaryAccount))
  });
});
