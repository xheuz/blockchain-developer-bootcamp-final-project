import { createContext, useReducer } from "react";

import reducer from "./reducer";

export const initialState = {
  // app
  isLoading: true,
  setIsLoading: () => {},
  chainId: "0x3",
  setChainId: () => {},
  contract: null,
  setContract: () => {},
  totalTestators: 0,
  setTotalTestators: () => {},
  totalBeneficiaries: 0,
  setTotalBeneficiaries: () => {},
  totalBalanceTrusted: 0,
  setTotalBalanceTrusted: () => {},

  // ui
  notification: {
    open: false,
    vertical: "top",
    horizontal: "center",
    severity: null,
    message: null,
    autoHideDuration: 4000,
  },
  setNotification: () => {},
  showAddTrustForm: false,
  setShowAddTrustForm: () => {},
  showViewBeneficiaryDialog: false,
  setShowViewBeneficiaryDialog: () => {},
  isButtonDisabled: false,
  setIsButtonDisabled: () => {},

  // auth
  isConnected: false,
  setIsConnected: () => {},
  currentAccount: null,
  setCurrentAccount: () => {},
  balance: 0,
  setBalance: () => {},

  // testator
  checkInDeadline: null,
  setCheckInDeadline: () => {},
  checkInFrequencyInDays: null,
  setCheckInFrequencyInDays: () => {},
  balanceInTrusts: 0,
  setBalanceInTrusts: () => {},
  trusts: [],
  setTrusts: () => {},
  selectedTrust: {},
  setSelectedTrust: () => {},

  // beneficiary
  beneficiaryTrusts: [],
  setBeneficiaryTrusts: () => {},
  selectedBeneficiaryTrust: [],
  setSelectedBeneficiaryTrust: () => {},

  // dependencies
  web3: null,
  setWeb3: () => {},
};

export const AppContext = createContext(initialState);

export default function AppContextProvider({ children }) {
  const [store, dispatch] = useReducer(reducer, initialState);

  const context = {
    ...store,
    // app
    setIsLoading: (boolean) => {
      dispatch({ type: "SET_IS_LOADING", payload: boolean });
    },
    setChainId: (integer) => {
      dispatch({ type: "SET_CHAIN_ID", payload: integer });
    },
    setContract: (instance) => {
      dispatch({ type: "SET_CONTRACT", payload: instance });
    },
    setTotalTestators: (count) => {
      dispatch({ type: "SET_TOTAL_TESTATORS", payload: count });
    },
    setTotalBeneficiaries: (count) => {
      dispatch({ type: "SET_TOTAL_BENEFICIARIES", payload: count });
    },
    setTotalBalanceTrusted: (count) => {
      dispatch({ type: "SET_TOTAL_BALANCE_TRUSTED", payload: count });
    },

    // ui
    setNotification: (notification) => {
      dispatch({ type: "SET_NOTIFICATION", payload: notification });
    },
    setShowAddTrustForm: (boolean) => {
      dispatch({ type: "SET_SHOW_ADD_TRUST_FORM", payload: boolean });
    },
    setShowViewBeneficiaryDialog: (boolean) => {
      dispatch({ type: "SET_SHOW_VIEW_BENEFICIARY_DIALOG", payload: boolean });
    },
    setIsButtonDisabled: (boolean) => {
      dispatch({ type: "SET_IS_BUTTON_DISABLED", payload: boolean });
    },

    // auth
    setIsConnected: (connected) => {
      dispatch({ type: "SET_IS_CONNECTED", payload: connected });
    },
    setCurrentAccount: (accounts) => {
      dispatch({ type: "SET_CURRENT_ACCOUNT", payload: accounts[0] });
    },
    setBalance: (balance) => {
      dispatch({ type: "SET_BALANCE", payload: balance });
    },

    // testator
    setCheckInDeadline: (timestamp) => {
      dispatch({ type: "SET_CHECK_IN_DEADLINE", payload: timestamp });
    },
    setCheckInFrequencyInDays: (days) => {
      dispatch({ type: "SET_CHECK_IN_FREQUENCY_IN_DAYS", payload: days });
    },
    setBalanceInTrusts: (amount) => {
      dispatch({ type: "SET_BALANCE_IN_TRUSTS", payload: amount });
    },
    setTrusts: (trusts) => {
      dispatch({ type: "SET_TRUSTS", payload: [...trusts] });
    },
    setSelectedTrust: (trust) => {
      dispatch({ type: "SET_SELECTED_TRUST", payload: { ...trust } });
    },

    // beneficiary
    setBeneficiaryTrusts: (trusts) => {
      dispatch({ type: "SET_BENEFICIARY_TRUSTS", payload: [...trusts] });
    },
    setSelectedBeneficiaryTrust: (trust) => {
      dispatch({
        type: "SET_SELECTED_BENEFICIARY_TRUST",
        payload: { ...trust },
      });
    },

    // dependencies
    setWeb3: (web3) => {
      dispatch({ type: "SET_WEB3", payload: web3 });
    },
  };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}
