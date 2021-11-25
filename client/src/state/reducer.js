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
    case "SET_CUSTODY_FEE":
      return { ...state, custodyFee: payload / 1000 };

    /** UI */
    case "SET_NOTIFICATION":
      return { ...state, notification: payload };
    case "SET_SHOW_ADD_TRUST_FORM":
      return { ...state, showAddTrustForm: payload };
    case "SET_SHOW_UPDATE_TRUST_FROM":
      return { ...state, showUpdateTrustForm: payload };
    case "SET_IS_BUTTON_DISABLED":
      return { ...state, isButtonDisabled: payload };
    case "SET_SHOW_TAB":
      return { ...state, showTab: payload };

    /** Auth */
    case "SET_IS_CONNECTED":
      return { ...state, isConnected: payload };
    case "SET_CURRENT_ACCOUNT":
      return { ...state, currentAccount: payload };
    case "SET_BALANCE":
      return { ...state, balance: payload };

    /** Testator */
    case "SET_CHECK_IN_DEADLINE":
      return { ...state, checkInDeadline: payload };
    case "SET_CHECK_IN_FREQUENCY_IN_DAYS":
      return { ...state, checkInFrequencyInDays: payload };
    case "SET_BALANCE_IN_TRUSTS":
      return { ...state, balanceInTrusts: payload };
    case "SET_TRUSTS":
      return { ...state, trusts: payload };
    case "SET_SELECTED_TRUST":
      return { ...state, selectedTrust: payload };

    /** Beneficiary */
    case "SET_BENEFICIARY_TRUSTS":
      return { ...state, beneficiaryTrusts: payload };
    case "SET_SELECTED_BENEFICIARY_TRUST":
      return { ...state, selectedBeneficiaryTrusts: payload };

    /** Dependencies */
    case "SET_WEB3":
      return { ...state, web3: payload };

    default:
      return state;
  }
};

export default reducer;
