require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const path = require("path");

module.exports = {
  compilers: { solc: { version: "0.8.10" } },
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: process.env.MNEMONIC,
          providerOrUrl: process.env.INFURA_ROPSTEN,
        }),
      network_id: 3,
    },
  },
};
