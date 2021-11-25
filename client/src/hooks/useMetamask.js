import { useEffect } from "react";

import { useAppContext } from "../state/hooks";
import { useWeb3 } from "../hooks/useWeb3";

// Events
// https://docs.metamask.io/guide/ethereum-provider.html#events
export const useEventAccountsChanged = () => {
  const { fetchBalance } = useWeb3();
  const { setCurrentAccount, setIsConnected, setBalance } = useAppContext();

  const handleAccountChange = async (accounts) => {
    if (!accounts.length) {
      setIsConnected(false);
      return;
    }

    setCurrentAccount(accounts);
    setIsConnected(true);
    await fetchBalance(accounts[0], setBalance);
  };

  useEffect(() => {
    if (window.ethereum) {
      const { ethereum } = window;

      ethereum.on("accountsChanged", handleAccountChange);
      return () => {
        ethereum.removeListener("accountsChanged", handleAccountChange);
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
