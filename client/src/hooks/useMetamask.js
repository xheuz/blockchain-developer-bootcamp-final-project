import { useState, useEffect } from "react";
import { useAppContext } from "../state/hooks";
import { useWeb3 } from "../hooks/useWeb3";

export const useSelectedAccount = () => {
  const { currentAccount } = useAppContext();

  const hasAccountPermission = () => {
    return window.ethereum.selectedAddress === currentAccount;
  };

  return { hasAccountPermission };
};

// Events
// https://docs.metamask.io/guide/ethereum-provider.html#events
export const useEventAccountsChanged = () => {
  const { fetchBalance } = useWeb3();
  const { hasAccountPermission } = useSelectedAccount();
  const { setCurrentAccount, setIsConnected, setBalance } = useAppContext();

  const handleConnection = async (accounts) => {
    console.log("accountsChanged", accounts);
    if (!accounts[0]) return;

    setCurrentAccount(accounts);
    setIsConnected(true);
    await fetchBalance(accounts[0], setBalance);
  };

  useEffect(() => {
    if (window.ethereum) {
      const { ethereum } = window;

      ethereum.on("accountsChanged", handleConnection);
      return () => {
        ethereum.removeListener("accountsChanged", handleConnection);
      };
    }
  });
};

export const useEventChainChanged = () => {
  const { setChainId } = useAppContext();

  useEffect(() => {
    if (window.ethereum) {
      const { ethereum } = window;
      ethereum.on("chainChanged", setChainId);

      return () => {
        ethereum.removeListener("chainChanged", setChainId);
      };
    }
  });
};

export const useEventMessage = () => {
  const [message, setMessage] = useState({ type: "", data: null });

  useEffect(() => {
    function handleMessage(message) {
      setMessage(message);
    }

    if (window.ethereum) {
      const { ethereum } = window;
      ethereum.on("message", handleMessage);

      return () => {
        ethereum.removeListener("message", handleMessage);
      };
    }
  });

  return message;
};
