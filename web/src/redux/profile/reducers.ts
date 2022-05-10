import * as actionTypes from './constants';

const initialState = {
  userType: null,
  tradieProfileData: '',
  tradieProfileViewData: '',
  tradieBasicDetailsData: '',
  builderProfileViewData: '',
  bankDetails: {},
  error: '',
  tradieInfo: [],
  builderProfile: {},
  savedJobs: [],
  settings: {},
  searching: false,
  paymentHistory: {},
  paymentDetails: {},
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.SET_TRADIE_PROFILE_DATA:
      return {
        ...state,
        tradieProfileData: action.payload,
        userType: action.payload.userType
      };
    case actionTypes.SET_TRADIE_PROFILE_VIEW:
      return {
        ...state,
        tradieProfileViewData: action.payload,
      };
    case actionTypes.SET_TRADIE_BASIC_DETAILS:
      return {
        ...state,
        tradieBasicDetailsData: action.payload,
      };
    case actionTypes.SET_BUILDER_PROFILE_VIEW:
      return {
        ...state,
        builderProfileViewData: action.payload,
      };

    case actionTypes.GET_BANK_DETAILS_END:
    case actionTypes.UPDATE_BANK_DETAILS_END:
    case actionTypes.ADD_BANK_DETAILS_END:
      return {
        ...state,
        bankDetails: action.payload,
      };

    case actionTypes.REMOVE_BANK_DETAILS_END:
      if (action.payload.success) {
        return {
          ...state,
          bankDetails: {
            userId: undefined,
            account_name: '',
            account_number: '',
            bsb_number: '',
            stripeAccountId: '',
            accountVerified: false,
          },
        }
      } else {
        return state;
      }

    case actionTypes.SET_TRADIE_PROFILE:
      return {
        ...state,
        tradieInfo: action.payload,
      };

    case actionTypes.SET_PROFILE_BUILDER:
      return {
        ...state,
        builderProfile: action.payload,
        userType: action.payload.userType
      }

    case actionTypes.SET_SAVED_JOBS:
      return {
        ...state,
        savedJobs: action.payload,
      };

    case actionTypes.SET_SETTINGS:
      return {
        ...state,
        settings: { pushNotificationCategory: action.payload },
      };

    case actionTypes.SET_SEARCHING:
      return {
        ...state,
        searching: action.payload,
      };

    case actionTypes.SET_PAYMENT_HISTORY:
      return {
        ...state,
        paymentHistory: action.payload,
      };

    case actionTypes.SET_PAYMENT_DETAILS:
      return {
        ...state,
        paymentDetails: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
