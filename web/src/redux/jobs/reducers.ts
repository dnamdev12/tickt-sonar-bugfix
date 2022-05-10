import { getTradieReviewList } from './actions';
import * as actionTypes from './constants'

const initialState = {
  editMilestoneId: null,
  editMilestoneTiming: null,
  editDetailPage: null,
  builderHome: null,
  testBuilderHome: null,
  localChanges: false,
  activeJobList: null,
  appliedJobList: null,
  pastJobList: null,
  newJobList: null,
  approvedMilestoneList: null,
  milestoneList: [],
  milestonesCount: 0,
  newJobsCount: 0,
  builderActionJobs: [],
  builderOpenJobs: [],
  builderPastJobs: [],
  builderNewApplicants: [],
  builderNewApplicantsList: [],
  newApprovalList: [],
  tradieReviewList: [],
  tradieReviews: [],
  tradieRequestStatus: false
}

const reducer = (state = initialState, action: any) => {
  console.log(action)
  switch (action.type) {

    case actionTypes.EDIT_MILESTONE_ID:
      state.editMilestoneId = action.payload;
      return { ...state }

    case actionTypes.EDIT_MILESTONE_TIMINGS:
      state.editMilestoneTiming = action.payload;
      return { ...state }

    case actionTypes.EDIT_DETAIL_SCREEN:
      state.editDetailPage = action.payload;
      return { ...state }

    case actionTypes.FETCH_HOME_BUILDER:
      state.builderHome = action.payload;
      return { ...state }

    case actionTypes.SET_FETCH_HOME_BUILDER:
      return {
        ...state,
        testBuilderHome: action.payload
      }

    case actionTypes.SET_LOCAL_CHANGES:
      return {
        ...state,
        localChanges: action.payload.data
      }

    case actionTypes.GET_ACTIVE_JOBS_END:
      return {
        ...state,
        activeJobList: action.payload?.active,
        milestonesCount: action.payload?.milestonesCount,
        newJobsCount: action.payload?.newJobsCount,
      };

    case actionTypes.GET_APPLIED_JOBS_END:
      return {
        ...state,
        appliedJobList: action.payload.applied,
        milestonesCount: action.payload.milestonesCount,
        newJobsCount: action.payload.newJobsCount,
      };

    case actionTypes.GET_PAST_JOBS_END:
      return {
        ...state,
        pastJobList: action.payload.completed,
        milestonesCount: action.payload.milestonesCount,
        newJobsCount: action.payload.newJobsCount,
      };

    case actionTypes.GET_NEW_JOBS_END:
      return {
        ...state,
        newJobList: action.payload,
      };

    case actionTypes.GET_APPROVED_MILESTONE_END:
      return {
        ...state,
        approvedMilestoneList: action.payload,
      };

    case actionTypes.GET_MILESTONES_END:
      return {
        ...state,
        milestoneList: action.payload,
      };

    case actionTypes.SET_BUILDER_ACTIVE_JOBS:
      return {
        ...state,
        builderActionJobs: action.payload,
        builderOpenJobs: null,
        builderPastJobs: null,
        builderNewApplicants: null,
        builderNewApplicantsList: null,
        newApprovalList: null,
        tradieRequestStatus: false,
      };

    case actionTypes.SET_BUILDER_OPEN_JOBS:
      return {
        ...state,
        builderOpenJobs: action.payload,
        builderActionJobs: null,
        builderPastJobs: null,
        builderNewApplicants: null,
        builderNewApplicantsList: null,
        newApprovalList: null,
        tradieRequestStatus: false,
      };

    case actionTypes.SET_BUILDER_PAST_JOBS:
      return {
        ...state,
        builderPastJobs: action.payload,
        builderActionJobs: null,
        builderOpenJobs: null,
        builderNewApplicants: null,
        builderNewApplicantsList: null,
        newApprovalList: null,
        tradieRequestStatus: false,
      };

    case actionTypes.SET_BUILDER_NEW_APPLICANTS:
      console.log('Here!!')
      return {
        ...state,
        builderNewApplicants: action.payload,
        builderActionJobs: null,
        builderOpenJobs: null,
        builderPastJobs: null,
        builderNewApplicantsList: null,
        newApprovalList: null,
        tradieRequestStatus: false,
      };

    case actionTypes.SET_BUILDER_NEW_APPLICANTS_LIST:
      console.log('Here!! --1 ')
      return {
        ...state,
        tradieRequestStatus: false,
        builderNewApplicantsList: action.payload,
        builderActionJobs: null,
        builderOpenJobs: null,
        builderPastJobs: null,
        builderNewApplicants: null,
        newApprovalList: null,
      };

    // case actionTypes.SET_TRADIE_REVIEW_LIST:
    //   return {
    //     ...state,
    //     tradieReviewList: action.payload,
    //   };



    case actionTypes.SET_TRADIE_REVIEWS_LIST_ON_BUILDER:
      return {
        ...state,
        tradieReviews: action.payload,
      };

    case actionTypes.SET_ACCEPT_DECLINE_TRADIE_REQUEST:
      return {
        ...state,
        tradieRequestStatus: action.payload,
      };

    case actionTypes.SET_BUILDER_NEW_APPROVAL_LIST:
      return {
        ...state,
        newApprovalList: action.payload,
        builderActionJobs: null,
        builderOpenJobs: null,
        builderPastJobs: null,
        builderNewApplicants: null,
        builderNewApplicantsList: null,
      };


    case actionTypes.SET_CLEAR_JOBS:
      return {
        ...state,
        builderActionJobs: [],
        builderOpenJobs: [],
        builderPastJobs: [],
        builderNewApplicants: [],
        builderNewApplicantsList: [],
        newApprovalList: [],
        tradieReviewList: [],
        tradieReviews: [],
      }


    default: return state;
  }
}

export default reducer