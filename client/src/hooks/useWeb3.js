import Web3 from "web3";

import { DAPP_CONTRACT } from "../config";
import { useAppContext } from "../state/hooks";
import {numberToFixed} from "../utils/format";

export function useWeb3Setup() {
  const { setWeb3 } = useAppContext();

  const useWeb3 = () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      setWeb3(new Web3(window.ethereum));
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      // Use Mist/MetaMask's provider.
      console.log("Injected web3 detected.");
      setWeb3(window.web3);
    }
    // Fallback to localhost; use dev console port by default...
    else {
      const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
      console.log("No web3 instance injected, using Local web3.");
      setWeb3(new Web3(provider));
    }
  };

  return useWeb3;
}

export function useWeb3SetupContract() {
  const {
    web3,
    setContract,
    setTotalTestators,
    setTotalBeneficiaries,
    setTotalBalanceTrusted,
    setCustodyFee
  } = useAppContext();

  const useContract = async () => {
    if (!web3) throw Error(`Web3 is not available.`);

    // get the contract instance.
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = DAPP_CONTRACT.networks[networkId];

    if (!deployedNetwork) {
      alert("Select correct network!");
      return;
    }

    const contract = new web3.eth.Contract(
      DAPP_CONTRACT.abi,
      deployedNetwork && deployedNetwork.address
    );
    setContract(contract);

    setCustodyFee(await contract.methods.totalTestators().call());
    // set global counters from the contract
    setTotalTestators(await contract.methods.totalTestators().call());
    setTotalBeneficiaries(await contract.methods.totalBeneficiaries().call());
    setTotalBalanceTrusted(await contract.methods.totalBalanceTrusted().call());
  };

  return useContract;
}

// modified from https://ethereum.stackexchange.com/questions/89848/how-to-automatically-get-users-wallet-info-if-they-are-connected-but-not-show-t
export function useWeb3IsConnected() {
  const { fetchBalance } = useWeb3();
  const { web3, setIsConnected, setCurrentAccount, setBalance } =
    useAppContext();

  const checkIfConnected = async () => {
    if (!web3) throw Error(`Web3 is not available.`);

    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 1) {
        setIsConnected(true);
        setCurrentAccount(accounts);
        fetchBalance(accounts[0], setBalance);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return checkIfConnected;
}

export function useMetamaskConnect() {
  const {
    notification,
    setNotification,
    setIsButtonDisabled,
    setIsConnected,
    setCurrentAccount,
  } = useAppContext();

  const RequestConnect = async () => {
    if (window.ethereum) {
      const { ethereum } = window;
      setIsButtonDisabled(true);

      try {
        // Request account access if needed
        await ethereum.request({ method: "eth_requestAccounts" });
        setIsConnected(true);
        setCurrentAccount([ethereum.selectedAddress]);
      } catch (error) {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          setNotification({
            ...notification,
            open: true,
            message: "Please connect to MetaMask.",
            severity: "info",
          });
        } else {
          console.error(error);
        }
      }

      setIsButtonDisabled(false);
    } else {
      setNotification({
        ...notification,
        open: true,
        message: "No wallet detected!",
        severity: "warning",
      });
    }
  };

  return RequestConnect;
}

export function useWeb3() {
  const { web3, setContract } = useAppContext();

  const fetchBalance = async (address, callback) => {
    try {
      const balance = web3.utils.fromWei(
        await web3.eth.getBalance(address),
        "ether"
      );
      callback(numberToFixed(balance));
    } catch (error) {}
  };

  const fetchContract = (abi, address) => {
    setContract(new web3.eth.Contract(abi, address));
  };

  return { fetchBalance, fetchContract };
}
