import * as actionTypes from './constants'

const initialState = {
    searchJobListData: [],
    recentSearchJobData: [],
    recentLocationData: [],
    jobTypeListData: [],
    jobTypeList: [],
    jobDataWithJobTypeLatLong: {},
    homeSearchJobData: [],
    viewNearByJobData: [],
    homeJobDetailsData: '',
    homeApplyJobData: '',
    error: '',
    builderProfile: {},
    recallHeaderNotif: false,
}

const reducer = (state = initialState, action: any) => {
    // console.log(action)
    switch (action.type) {
        case actionTypes.FETCH_FAILED:
            return {
                ...state,
                error: action.message
            }
        case actionTypes.SET_SEARCH_JOB_LIST:
            return {
                ...state,
                searchJobListData: action.payload
            }
        case actionTypes.SET_RECENT_SEARCH_LIST:
            return {
                ...state,
                recentSearchJobData: action.payload
            }
        case actionTypes.SET_RECENT_LOCATION_LIST:
            return {
                ...state,
                recentLocationData: action.payload
            }
        case actionTypes.SET_JOB_TYPE_LIST:
            return {
                ...state,
                jobTypeListData: action.payload
            }
        case actionTypes.SET_JOB_TYPE:
            return {
                ...state,
                jobTypeData: action.payload
            }
        case actionTypes.SET_JOB_WITH_JOB_TYPE_AND_LATLONG:
            return {
                ...state,
                jobDataWithJobTypeLatLong: action.payload
            }
        case actionTypes.SET_HOME_SEARCH_DATA:
            return {
                ...state,
                homeSearchJobData: action.payload
            }
        case actionTypes.SET_VIEW_NEARBY_JOBS:
            return {
                ...state,
                viewNearByJobData: action.payload
            }
        case actionTypes.SET_HOME_JOB_DETAILS:
            return {
                ...state,
                homeJobDetailsData: action.payload
            }
        case actionTypes.SET_HOME_APPLY_JOB:
            return {
                ...state,
                homeApplyJobData: action.payload
            }
        case actionTypes.SET_RECALL_HEADER_NOTIFICATION:
            return {
                ...state,
                recallHeaderNotif: action.payload,
            }
        default: return state
    }
}

export default reducer