const reducer = (state, { type, payload }) => {
  switch (type) {
    /** App */
    case "SET_IS_LOADING":
      return { ...state, isLoading: payload };
    case "SET_CHAIN_ID":
      return { ...state, chainId: payload };
    case "SET_CONTRACT":
      return { ...state, contract: payload };
    case "SET_TESTATORS_COUNT":
      return { ...state, testatorsCount: payload };
    case "SET_BENEFICIARIES_COUNT":
      return { ...state, beneficiariesCount: payload };

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

    /** Features */
    case "SET_LAST_CHECK_IN":
      return { ...state, lastCheckIn: payload };
    case "SET_CHECK_IN_FREQUENCY_IN_DAYS":
      return {...state, checkInFrequencyInDays: payload};

    // "BeneficiaryAdded"
    // "BeneficiaryRemoved"
    // "BeneficiaryChanged"
    // "LastCheckInUpdated"
    // "CheckInFrequencyUpdated"
    // "Deposited"
    // "TrustClaimed"

    /** Beneficiary */
    case "ADD_BENEFICIARY":
      // check if the address already exist, only update if it does not exist.
      let beneficiaries = state.beneficiaries.find(
        (b) => b.address === payload.address
      )
        ? state.beneficiaries
        : [...state.beneficiaries, payload];
      return { ...state, beneficiaries };
    case "REMOVE_BENEFICIARY":
      return {
        ...state,
        beneficiaries: state.beneficiaries.filter(
          (b) => b.address !== payload.address
        ),
      };
    case "SET_BENEFICIARIES":
      return { ...state, beneficiaries: [...payload] };
    case "SET_SELECTED_BENEFICIARY":
      return { ...state, selectedBeneficiary: payload };
    case "SET_TRUST_BALANCE":
      return { ...state, trustBalance: payload };

    /** Dependencies */
    case "SET_WEB3":
      return { ...state, web3: payload };
    default:
      return state;
  }
};

export default reducer;
