import { useEffect } from "react";
import { useAppContext } from "../state/hooks";
import { useWeb3 } from "../hooks/useWeb3";

export function useBeneficiary() {
  const { contract, currentAccount, setTrusts } = useAppContext();

  const fetchTrusts = async () => {
    setTrusts(await contract.methods.claim().call({ from: currentAccount }));
  };

  const claimTrust = async (address) => {
    await contract.methods.claim(address).call({ from: currentAccount });
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
    setLastCheckIn,
    setCheckInFrequencyInDays,
    setBeneficiaries,
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

  const createBeneficiary = async (address) => {
    try {
      await contract.methods
        .addBeneficiary(address)
        .send({ from: currentAccount });
    } catch (error) {}
  };

  const fetchBeneficiaries = async () => {
    try {
      let beneficiaries = await contract.methods
        .getBeneficiaries()
        .call({ from: currentAccount });

      const options = {
        filter: {
          testator: currentAccount,
          beneficiary: beneficiaries,
        },
        fromBlock: 0,
        toBlock: "latest",
      };

      const eventsCallback = (error, events) => {
        if (error) console.error(error);

        setBeneficiaries(
          events.map((event) => {
            const { beneficiary: address, trustAddress } = event.returnValues;

            return {
              name: "John Doe",
              address,
              trustAddress,
            };
          })
        );
      };

      // get trust address per beneficiary
      contract.getPastEvents("BeneficiaryAdded", options, eventsCallback);
    } catch (err) {
      setBeneficiaries([]);
    }
  };

  const deleteBeneficiary = async (address) => {
    try {
      await contract.methods
        .removeBeneficiary(address)
        .send({ from: currentAccount });
    } catch (error) {
      console.error(error);
    }
  };

  const depositEth = async (address, amount) => {
    if (balance > amount && amount > 0) {
      console.log(balance, amount);
      await contract.methods.deposit(address).send({
        from: currentAccount,
        value: web3.utils.toWei(amount, "ether"),
      });
    } else {
      console.error("Not enough balance.");
    }
  };

  const fetchTrustBalance = async (address) =>
    await fetchBalance(address, setTrustBalance);

  return {
    fetchLastCheckIn,
    fetchCheckInFrequencyInDays,
    updateLastCheckIn,
    updateCheckInFrequencyInDays,
    createBeneficiary,
    fetchBeneficiaries,
    deleteBeneficiary,
    fetchTrustBalance,
    depositEth,
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
