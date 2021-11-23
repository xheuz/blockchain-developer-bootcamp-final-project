const reducer = (state, { type, payload }) => {
  switch (type) {
    /** App */
    case "SET_IS_LOADING":
      return { ...state, isLoading: payload };
    case "SET_CHAIN_ID":
      return { ...state, chainId: payload };
    case "SET_CONTRACT":
      return { ...state, contract: payload };
    case "SET_TOTAL_TESTATORS":
      return { ...state, totalTestators: payload };
    case "SET_TOTAL_BENEFICIARIES":
      return { ...state, totalBeneficiaries: payload };
    case "SET_TOTAL_BALANCE_TRUSTED":
      return { ...state, totalBalanceTrusted: payload };

    /** UI */
    case "SET_SHOW_PAGE":
      return { ...state, showPage: payload };
    case "SET_SHOW_ADD_BENEFICIARY_DIALOG":
      return { ...state, showAddBeneficiaryDialog: payload };
    case "SET_SHOW_VIEW_BENEFICIARY_DIALOG":
      return { ...state, showViewBeneficiaryDialog: payload };
    case "SET_IS_BUTTON_DISABLED":
      return { ...state, isButtonDisabled: payload };

    /** Auth */
    case "SET_IS_CONNECTED":
      return { ...state, isConnected: payload };
    case "SET_CURRENT_ACCOUNT":
      return { ...state, currentAccount: payload };
    case "SET_BALANCE":
      return { ...state, balance: payload };

    /** Testator */
    case "SET_LAST_CHECK_IN":
      return { ...state, lastCheckIn: payload };
    case "SET_CHECK_IN_FREQUENCY_IN_DAYS":
      return { ...state, checkInFrequencyInDays: payload };
    case "SET_BALANCE_IN_TRUSTS":
      return { ...state, setBalanceInTrusts: payload };
    case "SET_TRUSTS":
      return { ...state, setTrusts: payload };
    case "SET_SELECTED_TRUST":
      return { ...state, setSelectedTrust: payload };

    /** Beneficiary */
    case "SET_BENEFICIARY_TRUSTS":
      return { ...state, setBeneficiaryTrusts: payload };
    case "SET_SELECTED_BENEFICIARY_TRUST":
      return { ...state, setBeneficiaryTrusts: payload };

    /** Dependencies */
    case "SET_WEB3":
      return { ...state, web3: payload };
    
      default:
      return state;
  }
};

export default reducer;
