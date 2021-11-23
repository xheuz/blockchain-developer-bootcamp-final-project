import { useEffect } from "react";

import { useAppContext } from "../state/hooks";
import { useWeb3 } from "../hooks/useWeb3";

export function useContractGlobals() {
  const { contract } = useWeb3();
  const { setTotalTestators, setTotalBeneficiaries, setTotalBalanceTrusted } =
    useAppContext();

  const fetchContractGlobals = async () => {
    try {
      setTotalTestators(await contract.methods.totalTestators());
      setTotalBeneficiaries(await contract.methods.totalBeneficiaries());
      setTotalBalanceTrusted(await contract.methods.totalBalanceTrusted());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (contract) fetchContractGlobals();
  }, [contract]);
}

export function useBeneficiary() {
  const { fetchBalance } = useWeb3();
  const { contract, currentAccount, setBalance, setBeneficiaries } =
    useAppContext();

  const fetchTrusts = async () => {
    setBeneficiaries(
      await contract.methods.beneficiaryTrusts().call({ from: currentAccount })
    );
  };

  const claimTrust = async (trustId) => {
    await contract.methods.claimTrust(trustId).call({ from: currentAccount });
    await fetchBalance(currentAccount, setBalance);
  };

  return {
    fetchTrusts,
    claimTrust,
  };
}

export function useTestator() {
  const { fetchBalance } = useWeb3();
  const {
    web3,
    balance,
    contract,
    currentAccount,
    setBalance,
    setLastCheckIn,
    setCheckInFrequencyInDays,
    setTrusts,
    setTrustBalance,
  } = useAppContext();

  const fetchLastCheckIn = async () => {
    setLastCheckIn(
      new Date(
        await contract.methods.getLastCheckIn().call({ from: currentAccount })
      ).toDateString()
    );
  };

  const fetchCheckInFrequencyInDays = async () => {
    setCheckInFrequencyInDays(
      await contract.methods
        .getCheckInFrequencyInDays()
        .call({ from: currentAccount })
    );
  };

  const updateLastCheckIn = async () => {
    await contract.methods.setLastCheckIn().call({ from: currentAccount });
  };

  const updateCheckInFrequencyInDays = async (days) => {
    await contract.methods
      .setCheckInFrequencyInDays(days)
      .call({ from: currentAccount });
  };

  const createTrust = async (address, amount) => {
    if (balance > amount && amount > 0) {
      try {
        // create a trust
        await contract.methods.createTrust(address, amount).send({
          from: currentAccount,
          value: web3.utils.toWei(amount, "ether"),
        });
        // fetch balance
        await fetchBalance(currentAccount, setBalance);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Not enough balance.");
    }
  };

  const cancelTrust = async (_id) => {
    try {
      await contract.methods.cancelTrust(_id).send({ from: currentAccount });
      await fetchBalance(currentAccount, setBalance);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTrusts = async () => {
    try {
      setTrusts(
        await contract.methods.testatorTrusts().call({ from: currentAccount })
      );
    } catch (err) {
      setTrusts([]);
    }
  };

  const fetchProfile = async () => {
    try {
      setProfile(
        await contract.methods.testatorDetails().call({ from: currentAccount })
      );
    } catch (err) {
      setProfile({});
    }
  };

  const fetchTrustBalance = async (address) =>
    await fetchBalance(address, setTrustBalance);

  return {
    updateLastCheckIn,
    updateCheckInFrequencyInDays,
    createTrust,
    cancelTrust,
    fetchTrusts,
    fetchTrustBalance,
    fetchProfile,
  };
}

/**
 * Events
 */

export async function useAllEvents() {
  const { contract, currentAccount } = useAppContext();
  //   const { removeBeneficiary, setBeneficiaries } =
  //     useBeneficiaryContext();

  useEffect(() => {
    const handleEvents = (error, events) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(events.event);

      switch (events.event) {
        case "BeneficiaryAdded":
          return;
        case "BeneficiaryRemoved":
          return;
        case "BeneficiaryChanged":
          return;
        case "LastCheckInUpdated":
          return;
        case "CheckInFrequencyUpdated":
          return;
        case "Deposited":
          return;
        case "TrustClaimed":
          return;
        default:
      }
    };

    if (contract) {
      contract.events.allEvents(
        {
          filter: { testator: currentAccount },
        },
        handleEvents
      );
    }
  }, [contract]);
}
