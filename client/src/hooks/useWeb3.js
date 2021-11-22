import Web3 from "web3";

import { useEventAccountsChanged, useEventChainChanged } from "./useMetamask";
import { DAPP_CONTRACT } from "../config";
import { useAppContext } from "../state/hooks";

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
  const { web3, setContract, setTestatorsCount, setBeneficiariesCount } =
    useAppContext();

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
    setTestatorsCount(await contract.methods.testatorsCount().call());
    setBeneficiariesCount(await contract.methods.beneficiariesCount().call());
  };

  return useContract;
}

// modified from https://ethereum.stackexchange.com/questions/89848/how-to-automatically-get-users-wallet-info-if-they-are-connected-but-not-show-t
export function useWeb3IsConnected() {
  const { fetchBalance } = useWeb3();
  const { web3, setIsConnected, setCurrentAccount, setBalance } =
    useAppContext();
  useEventAccountsChanged();
  useEventChainChanged();

  const checkIfConnected = async () => {
    if (!web3) throw Error(`Web3 is not available.`);

    try {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      // TODO: check accounts[0] against window.ethereum.selectedAddress
      // before setting anything
      if (accounts[0]) {
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
  const { setIsButtonDisabled, setIsConnected, setCurrentAccount } =
    useAppContext();

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
          console.log("Please connect to MetaMask.");
        } else {
          console.error(error);
        }
      }

      setIsButtonDisabled(false);
    } else {
      alert(`No wallet detected!`);
    }
  };

  return RequestConnect;
}

export function useWeb3() {
  const { web3, setContract } = useAppContext();

  const fetchBalance = async (address, callback) => {
    const balance = await web3.eth.getBalance(address);
    console.log("fetched balance:", balance);
    callback(web3.utils.fromWei(balance, "ether"));
  };

  const fetchContract = (abi, address) => {
    setContract(new web3.eth.Contract(abi, address));
  };

  return { fetchBalance, fetchContract };
}

// export function useApp() {
//   // app state
//   const {
//     isConnected,
//     setWeb3,
//     setIsConnected,
//     setContract,
//     setAccounts,
//     setCurrentAccount,
//     setBalance,
//   } = useAppContext();

//   // listen for metamask events
//   const accountsChanged = useEventAccountsChanged();
//   const chainId = useEventChainChanged();

//   useEffect(() => {
//     const handleSetUp = async () => {
//       try {
//         // get accounts
//         const accounts = await web3.eth.getAccounts();
//         setAccounts(accounts);
//         // extract current account address
//         setCurrentAccount(accounts[0]);

//         // get connection status to wallet
//         // modified from https://ethereum.stackexchange.com/questions/89848/how-to-automatically-get-users-wallet-info-if-they-are-connected-but-not-show-t
//         setIsConnected(accounts.length > 0);

//         // get current account balance
//         let balance = (await web3.eth.getBalance(accounts[0])) || 0;
//         setBalance(web3.utils.fromWei(balance, "ether"));
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     if (web3) handleSetUp();
//     setWeb3(web3);
//   }, [accountsChanged, chainId]);

//   return isConnected;
// }

// export function useWeb3Accounts() {
//   const web3 = useWeb3();
//   const [accounts, setAccounts] = useState([]);

//   const fetchAccounts = async () => {
//     if (web3) {
//       try {
//         // Use web3 to get the user's accounts.
//         setAccounts(await web3.eth.getAccounts());
//       } catch (err) {
//         alert(`Failed to load accounts. Check console for details.`);
//         console.error(err);
//       }
//     }
//   };

//   useEffect(() => fetchAccounts, [web3]);

//   return accounts;
// }

// export function useWeb3EthBalance(address) {
//   const web3 = useWeb3();
//   const [eth, setEth] = useState(0);

//   const fetchEthBalance = async (address) => {
//     try {
//       // Use web3 to get the user's accounts.
//       setEth(await web3.eth.getBalance(address));
//     } catch (err) {
//       alert(`Failed to load accounts. Check console for details.`);
//       console.error(err);
//     }
//   };

//   useEffect(() => fetchEthBalance(address), [web3]);

//   return { eth, fetchEthBalance };
// }
