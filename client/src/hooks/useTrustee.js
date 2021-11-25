import { useAppContext } from "../state/hooks";
import { useWeb3 } from "../hooks/useWeb3";
import { secondsToDays, timestampToDate } from "../utils/format";

export function useBeneficiary() {
  const { fetchBalance } = useWeb3();
  const {
    contract,
    currentAccount,
    notification,
    setBalance,
    setBeneficiaryTrusts,
    setNotification,
  } = useAppContext();

  const fetchBeneficiaryTrusts = async () => {
    try {
      const trusts = await contract.methods
        .beneficiaryTrusts()
        .call({ from: currentAccount });
      setBeneficiaryTrusts(trusts);
    } catch (error) {
      setBeneficiaryTrusts([]);
    }
  };

  const claimTrust = async (trustId) => {
    try {
      await contract.methods.claimTrust(trustId).call({ from: currentAccount });
      await fetchBalance(currentAccount, setBalance);
      setNotification({
        ...notification,
        open: true,
        message: "Trust claimed!",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        ...notification,
        open: true,
        message: "Trust can not be claimed yet.",
        severity: "info",
      });
    }
  };

  return {
    fetchBeneficiaryTrusts,
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
    notification,
    checkInFrequencyInDays,
    setNotification,
    setBalance,
    setCheckInDeadline,
    setCheckInFrequencyInDays,
    setBalanceInTrusts,
    setTrusts,
  } = useAppContext();

  const updateCheckInDeadline = async () => {
    try {
      await contract.methods
        .setCheckInDeadline()
        .send({ from: currentAccount });

      setNotification({
        ...notification,
        open: true,
        message: `Deadline updated ${checkInFrequencyInDays} days more.`,
        severity: "success",
      });
    } catch (error) {
      setNotification({
        ...notification,
        open: true,
        message: "Unable to update deadline.",
        severity: "error",
      });
    }
  };

  const updateCheckInFrequencyInDays = async (days) => {
    try {
      await contract.methods
        .setCheckInFrequencyInDays(days)
        .send({ from: currentAccount });

      setNotification({
        ...notification,
        open: true,
        message: `Check-In frequency updated.`,
        severity: "success",
      });
    } catch (error) {
      setNotification({
        ...notification,
        open: true,
        message: "Unable to update check-in frequency.",
        severity: "error",
      });
    }
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

        setNotification({
          ...notification,
          open: true,
          message: `Trust created successfully.`,
          severity: "success",
        });
      } catch (error) {
        setNotification({
          ...notification,
          open: true,
          message: "Unable to create a trust.",
          severity: "error",
        });
      }
    } else {
      setNotification({
        ...notification,
        open: true,
        message: "Please check your balance and try again.",
        severity: "error",
      });
    }
  };

  const cancelTrust = async (_id) => {
    try {
      await contract.methods.cancelTrust(_id).send({ from: currentAccount });
      await fetchBalance(currentAccount, setBalance);

      setNotification({
        ...notification,
        open: true,
        message: "Trust was canceled.",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        ...notification,
        open: true,
        message: "Unable to cancel trust.",
        severity: "error",
      });
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
      const profile = await contract.methods
        .testatorDetails()
        .call({ from: currentAccount });

      const { checkInDeadline, checkInFrequencyInDays, balanceInTrusts } =
        profile;

      setCheckInDeadline(timestampToDate(checkInDeadline[0]));
      setCheckInFrequencyInDays(secondsToDays(checkInFrequencyInDays));
      setBalanceInTrusts(web3.utils.fromWei(balanceInTrusts, "ether"));
    } catch (error) {
      setNotification({
        ...notification,
        open: true,
        message: "Network issue was detected, please refresh your browser.",
        severity: "error",
      });
    }
  };

  return {
    updateCheckInDeadline,
    updateCheckInFrequencyInDays,
    createTrust,
    cancelTrust,
    fetchTrusts,
    fetchProfile,
  };
}
