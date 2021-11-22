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
  testatorsCount: 0,
  setTestatorsCount: () => {},
  beneficiariesCount: 0,
  setBeneficiariesCount: () => {},

  // ui
  showPage: "fab",
  setShowPage: () => {},
  showAddBeneficiaryDialog: false,
  setShowAddBeneficiaryDialog: () => {},
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
  lastCheckIn: null,
  setLastCheckIn: () => {},
  checkInFrequencyInDays: null,
  setCheckInFrequencyInDays: () => {},
  beneficiaries: [],
  setBeneficiaries: () => {},
  addBeneficiary: () => {},
  removeBeneficiary: () => {},
  selectedBeneficiary: null,
  setSelectedBeneficiary: () => {},
  trustBalance: 0,
  setTrustBalance: () => {},

  // beneficiary
  trusts: [],
  setTrusts: () => {},

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
    setTestatorsCount: (count) => {
      dispatch({ type: "SET_TESTATORS_COUNT", payload: count });
    },
    setBeneficiariesCount: (count) => {
      dispatch({ type: "SET_BENEFICIARIES_COUNT", payload: count });
    },

    // ui
    setShowPage: (integer) => {
      dispatch({ type: "SET_SHOW_PAGE", payload: integer });
    },
    setShowAddBeneficiaryDialog: (boolean) => {
      dispatch({ type: "SET_SHOW_ADD_BENEFICIARY_DIALOG", payload: boolean });
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

    // features
    setLastCheckIn: (timestamp) => {
      dispatch({ type: "SET_LAST_CHECK_IN", payload: timestamp });
    },
    setCheckInFrequencyInDays: (days) => {
      dispatch({ type: "SET_CHECK_IN_FREQUENCY_IN_DAYS", payload: days });
    },

    // beneficiaries
    setBeneficiaries: (beneficiaries) => {
      dispatch({ type: "SET_BENEFICIARIES", payload: [...beneficiaries] });
    },
    addBeneficiary: (beneficiary) => {
      dispatch({ type: "ADD_BENEFICIARY", payload: beneficiary });
    },
    removeBeneficiary: (beneficiary) => {
      dispatch({ type: "REMOVE_BENEFICIARY", payload: beneficiary });
    },
    setSelectedBeneficiary: (beneficiary) => {
      dispatch({ type: "SET_SELECTED_BENEFICIARY", payload: beneficiary });
    },
    setTrustBalance: (count) => {
      dispatch({ type: "SET_TRUST_BALANCE", payload: count });
    },

    // dependencies
    setWeb3: (web3) => {
      dispatch({ type: "SET_WEB3", payload: web3 });
    },
  };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}
