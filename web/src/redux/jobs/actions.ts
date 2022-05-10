import NetworkOps, { FetchResponse } from "../../network/NetworkOps";
import Urls from "../../network/Urls";
import * as actionTypes from './constants';
import { setShowToast, setLoading, setSkeletonLoading } from '../common/actions';
import storageService from '../../utils/storageService';

export const getClearJobs = () => ({ type: actionTypes.GET_CLEAR_JOBS });

//jobTypeList
export const callCategories = async () => {
  const response: FetchResponse = await NetworkOps.get(Urls.jobTypeList);

  if (response.status_code === 200) {
    return { success: true, categories: response.result.resultData };
  }

  return { success: false };
}


// profileTemplateList
export const profileTemplateList = async () => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(Urls.profileTemplateList);
  setLoading(false);

  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }

  setShowToast(true, response.message);
  return { success: false };
}

// milestones
export const callMilestones = async () => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(Urls.milestones);
  setLoading(false);

  if (response.status_code === 200) {
    return { success: true, milestones: response.result.resultData };
  }

  setShowToast(true, response.message);
  return { success: false };
}

// Update Edit-MileStone
export const updateMileStoneIndex = (index: any) => ({ type: actionTypes.EDIT_MILESTONE_ID, payload: index });
export const updateMileStoneTimings = (timings: any) => ({ type: actionTypes.EDIT_MILESTONE_TIMINGS, payload: timings });


// Save Template
export const addTemplate = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.createTemplate, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }

  setShowToast(true, response.message);
  return { success: false };
}

//Get milestone by template-id
export const getMileStoneByTempId = async (id: any) => {
  setLoading(true);
  let url = `${Urls.milestones}?tempId=${id}`;
  const response: FetchResponse = await NetworkOps.get(url);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }

  setShowToast(true, response.message);
  return { success: false };
}

// Detail Page {currentScreen:12, editItems: {}}
export const updateDetailScreen = (data: any) => ({ type: actionTypes.EDIT_DETAIL_SCREEN, payload: data });

// Job Post 
export const createPostJob = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.createJob, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }

  setShowToast(true, response.message);
  return { success: false };
}

export const setHomeBuilder = (data: any) => ({ type: actionTypes.FETCH_HOME_BUILDER, data });

export const getBuilderHomeData = async (item: any) => {
  let url = `${Urls.home}?lat=${item.lat}&long=${item.long}`
  const response: FetchResponse = await NetworkOps.get(url);
  console.log({ response }, '---------------!!!!!!!!')
  if (response.status_code === 200) {
    return { status: true, response: response.result };
  }
  return { status: false }
}

export const isHandleChanges = (data: any) => ({ type: actionTypes.GET_LOCAL_CHANGES, data });

export const getTradieQuestionList = async (data: any, showLoading?: boolean) => {
  if(showLoading) setLoading(true);
  const response: FetchResponse = await NetworkOps.get(Urls.tradieQuestionList + `?jobId=${data.jobId}&page=${data.page}`);
  if(showLoading) setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result?.list };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const getTradieReviewList = async (data: any) => {
  //applying condition to get review list of builder, when logged in either by tradie/builder
  const userType: any = storageService.getItem('userType');
  const reviewList: string = userType === 1 ? Urls.tradieReviewList : Urls.builderProfileReviewList;
  const response: FetchResponse = await NetworkOps.get(reviewList + `?${userType === 1 ? 'builderId' : 'tradieId'}=${data.builderId}&page=${data.page}`);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const postAskQuestion = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.askQuestion, data);
  setLoading(false);
  if (response.status_code === 200) {
    setShowToast(true, response.message);
    return { success: true, data: { questionData: response.result } };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const deleteQuestion = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.delete(Urls.deleteQuestion, data);
  setLoading(false);
  if (response.status_code === 200) {
    setShowToast(true, response.message);
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const updateQuestion = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(Urls.updateQuestion, data);
  setLoading(false);
  if (response.status_code === 200) {
    setShowToast(true, response.message);
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const reviewBuilder = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.reviewBuilder, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const updateReviewBuilder = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(Urls.updateReviewBuilder, data);
  setLoading(false);
  if (response.status_code === 200) {
    setShowToast(true, response.message);
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const deleteReviewBuilder = async (reviewId: string) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.delete(Urls.removeReviewBuilder + `?reviewId=${reviewId}`);
  setLoading(false);
  if (response.status_code === 200) {
    setShowToast(true, response.message);
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const getBuildersJob = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(Urls.getBuildersJob + `?builderId=${data.builderId}&page=${data.page}`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const tradieReviewReply = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.tradieReviewReply, data);
  setLoading(false);
  if (response.status_code === 200) {
    setShowToast(true, response.message);
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const tradieUpdateReviewReply = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(Urls.tradieUpdateReviewReply, data);
  setLoading(false);
  if (response.status_code === 200) {
    setShowToast(true, response.message);
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const tradieRemoveReviewReply = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.delete(Urls.tradieRemoveReviewReply + `?reviewId=${data.reviewId}&replyId=${data.replyId}`);
  setLoading(false);
  if (response.status_code === 200) {
    setShowToast(true, response.message);
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const getBuilderProfile = async (builderId: any) => {
  setSkeletonLoading(true);
  const response: FetchResponse = await NetworkOps.get(Urls.builderProfile + `?builderId=${builderId}`);
  setSkeletonLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result, status: response.status_code };
  }
  return { success: false, status: response.status_code };
}

export const getActiveJobList = (page: number) => ({
  type: actionTypes.GET_ACTIVE_JOBS_START,
  page,
});

export const getAppliedJobList = (page: number) => ({
  type: actionTypes.GET_APPLIED_JOBS_START,
  page,
});

export const getPastJobList = (page: number) => ({
  type: actionTypes.GET_PAST_JOBS_START,
  page,
});

export const resetActiveJobList = () => ({ type: actionTypes.RESET_ACTIVE_JOBS_START });
export const resetAppliedJobList = () => ({ type: actionTypes.RESET_APPLIED_JOBS_START });
export const resetPastJobList = () => ({ type: actionTypes.RESET_PAST_JOBS_START });
export const resetNewJobList = () => ({ type: actionTypes.RESET_NEW_JOBS_START });
export const resetApprovedMilestoneList = () => ({ type: actionTypes.RESET_APPROVED_MILESTONE_START });

export const getNewJobList = (page: number) => ({
  type: actionTypes.GET_NEW_JOBS_START,
  page,
});

export const getApprovedMilestoneList = (page: number) => ({
  type: actionTypes.GET_APPROVED_MILESTONE_START,
  page,
});

export const getActiveJobsBuilder = (page: number) => ({ type: actionTypes.GET_BUILDER_ACTIVE_JOBS, page });
export const getOpenJobsBuilder = (page: number) => ({ type: actionTypes.GET_BUILDER_OPEN_JOBS, page });
export const getPastJobsBuilder = (page: number) => ({ type: actionTypes.GET_BUILDER_PAST_JOBS, page });
export const getNewApplicantsBuilder = (page: number) => ({ type: actionTypes.GET_BUILDER_NEW_APPLICANTS, page });
export const getnewJobApplicationListBuilder = (item: any) => ({ type: actionTypes.GET_BUILDER_NEW_APPLICANTS_LIST, item });
export const getNewApprovalList = (page: any) => ({ type: actionTypes.GET_BUILDER_NEW_APPROVAL_LIST, page });

export const getMilestoneList = (jobId: string) => ({
  type: actionTypes.GET_MILESTONES_START,
  jobId,
});

export const markMilestoneComplete = (data: any, callback: (jobCompletedCount: number) => void) => ({
  type: actionTypes.MARK_MILESTONE_COMPLETE,
  data,
  callback,
});


// Tradie


export const getTradieReviewListOnBuilder = (data: any) => ({ type: actionTypes.GET_TRADIE_REVIEWS_LIST_ON_BUILDER, data })
export const getAcceptDeclineTradie = (data: any) => ({ type: actionTypes.GET_ACCEPT_DECLINE_TRADIE_REQUEST, data });

export const getQuestionsList = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(`${Urls.questionList}?jobId=${data?.jobId}&page=${data?.page}`)
  setLoading(false);

  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  return { success: false, data: response.result };
}


export const answerQuestion = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.answerQuestion, data)
  setLoading(false);
  setShowToast(true, response.message);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }

  return { success: false, data: response.result };
}

export const askNestedQuestion = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.askNestedQuestion, data)
  setLoading(false);
  setShowToast(true, response.message);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }

  return { success: false, data: response.result };
}

export const updateAnswer = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(Urls.updateAnswer, data)
  setLoading(false);

  setShowToast(true, response.message);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  return { success: false, data: response.result };
}

export const deleteAnswer = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.delete(`${Urls.deleteAnswer}?questionId=${data.questionId}&answerId=${data.answerId}`)
  setLoading(false);

  setShowToast(true, response.message);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  return { success: false, data: response.result };
}

export const reviewReply = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.reviewReply, data)
  setLoading(false);

  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  return { success: false, data: response.result };
}

export const updateReviewReply = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(Urls.updateReviewReply, data)
  setLoading(false);

  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  return { success: false, data: response.result };
}

export const removeReviewReply = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.delete(`${Urls.removeReviewReply}?reviewId=${data.reviewId}&replyId=${data.replyId}`)
  setLoading(false);

  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  return { success: false, data: response.result };
}

export const getTradeReviews = async (data: any) => {
  //applying condition to get review list of tradie, when logged in either by tradie/builder
  const userType: any = storageService.getItem('userType');
  const reviewList: string = userType === 1 ? Urls.tradieProfileReviewList : Urls.reviewList;
  const response: FetchResponse = await NetworkOps.get(reviewList + `?${userType === 1 ? 'builderId' : 'tradieId'}=${data.tradieId}&page=${data.page}`);
  if (response?.status_code === 200) {
    return { success: true, data: response.result };
  }
  return { success: false, data: response.result };
}

export const getTradeProfile = async (data: any) => {
  setSkeletonLoading(true);
  const response: FetchResponse = await NetworkOps.get(Urls.tradieProfile + `?tradieId=${data.tradieId}&jobId=${data.jobId}`);
  setSkeletonLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result, status: response.status_code };
  }
  return { success: false, status: response.status_code };
}


export const ratingTradieProfile = async (data: any) => {
  const response: FetchResponse = await NetworkOps.postToJson(Urls.reviewTradie, data);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false, data: response.result };
}


export const getJobDetails = async (jobId: string) => {
  setSkeletonLoading(true);
  const response: FetchResponse = await NetworkOps.get(Urls.jobDetailsTradie + `?jobId=${jobId}`);
  setSkeletonLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  return { success: false };
}


export const lodgeDispute = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(`${Urls.jobBuilder}lodgeDispute`, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const tradielodgeDispute = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.tradieLodgeDispute, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const CancelJob = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(`${Urls.jobBuilder}canceljob`, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message)
  return { success: false };
}

export const tradieCancelJob = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(Urls.tradieCancelJob, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const InviteForJob = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(`${Urls.jobBuilder}inviteForJob?tradieId=${data.tradieId}&jobId=${data.jobId}`, {});
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message)
  return { success: false };
}

export const CancelInviteForJob = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(`${Urls.jobBuilder}cancelInviteForJob?tradieId=${data.tradieId}&jobId=${data?.jobId}&invitationId=${data.invitationId}`, {});
  setLoading(false);
  if (response.status_code === 200) {
    setShowToast(true, response.message)
    return { success: true, data: response.result };
  }
  return { success: false };
}

export const changeRequest = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(`${Urls.jobBuilder}changeRequest`, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message)
  return { success: false };
}

export const replyCancellation = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.replyCancellation, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true };
  }
  return { success: false };
}

export const replyChangeRequest = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.replyChangeRequest, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true };
  }
  return { success: false };
}
export const acceptDeclineJobInvitation = async (data: any, isDisable?: boolean) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(Urls.acceptDeclineJobInvitation, data);
  setLoading(false);
  if (response.status_code === 200) {
    if (isDisable) return { success: true };
    return { success: true, msg: response.message };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const SaveTradie = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(`${Urls.jobBuilder}saveTradie?tradieId=${data.tradieId}&isSave=${data.isSave}`,);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  return { success: false };
}


export const HomeTradieProfile = async (data: any) => {
  setSkeletonLoading(true);
  const response: FetchResponse = await NetworkOps.get(`${Urls.jobHome}tradieProfile?tradieId=${data.tradieId}`,);
  setSkeletonLoading(false);
  if (response?.status_code === 200) {
    return { success: true, data: response.result, status: response?.status_code };
  }
  return { success: false, status: response?.status_code };
}

export const AddVoucher = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(`${Urls.jobBuilder}addVoucher`, data);
  setLoading(false);
  if (response.status_code === 200) {
    setShowToast(true, response.message)
    return { success: true, data: response.result };
  }
  return { success: false };
}

export const ChooseJob = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(`${Urls.jobBuilder}chooseJob?page=${data.page}`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  return { success: false };
}

export const getVouchers = async (data: any) => {
  if (data.page === 1) { setLoading(true) }
  const response: FetchResponse = await NetworkOps.get(storageService.getItem('userType') === 1 ? `${Urls.tradieProfileVoucher}?tradieId=${data.tradieId}&page=${data.page}` : `${Urls.jobBuilder}getVoucher?tradieId=${data.tradieId}&page=${data.page}`);
  if (data.page === 1) { setLoading(false) }
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  return { success: false };
}

export const republishJob = async (jobId: string) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(Urls.republishJob + `?jobId=${jobId}`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: {...response.result, isJobRepublish: true }};
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const getOpenJobDetails = async (jobId: string) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(`${Urls.job}/getOpenJobDetails?jobId=${jobId}`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result.resultData };
  }
  setShowToast(true, response.message);
  return { success: false };
}

// Republish job 
export const publishJobAgain = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.publishJobAgain, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }

  setShowToast(true, response.message);
  return { success: false };
}


export const publishOpenJobAgain = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(`${Urls.job}update`, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }

  setShowToast(true, response.message);
  return { success: false };
}


export const handleCancelReply = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(`${Urls.jobBuilder}replyCancellation`, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }

  setShowToast(true, response.message);
  return { success: false };
}


export const invitedJobIds = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(`${Urls.home}invitedJobIds?tradieId=${data?.tradieId}&page=${data?.page}`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const getSavedTradies = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(`${Urls.profile}/builder/getSavedTradies?page=${data?.page}`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}


// PAYMENT ACTIONS

export const getCardList = async () => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(`${Urls.payment}builder/cardList`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const addNewCard = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(`${Urls.payment}builder/addNewCard`, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const payPayment = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(`${Urls.payment}builder/pay`, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const updateCard = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(`${Urls.payment}builder/updateCard`, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const deleteCard = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.delete(`${Urls.payment}builder/deleteCard`, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const lastUsedCard = async () => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(`${Urls.payment}builder/lastUsedCard`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  return { success: false };
}

export const fetchVouchesJobs = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(`${Urls.job}builder/vouchesJob?page=${data.page}&tradieId=${data.tradieId}`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}


export const updateTemplate = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(`${Urls.job}editTemplate`, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}

// builder can update reviews on tradie profile
export const updateReviewTradie = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(`${Urls.job}builder/updateReviewTradie`, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}


// builder can delete review on tradie profile
export const deleteReviewTradie = async (data: any) => {
  setLoading(true)
  const response: FetchResponse = await NetworkOps.delete(`${Urls.job}builder/removeReviewTradie?reviewId=${data?.reviewId}`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}


// builder can delete an open job
export const deleteOpenJob = async (data: any) => {
  setLoading(true)
  const response: FetchResponse = await NetworkOps.delete(`${Urls.job}remove?jobId=${data.jobId}`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const getJobsBWTradieBuilder = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(`${Urls.getChatJobList}?userId=${data?.oppUserId}&page=${data.page}&perPage=${data.perPage}&user_type=${data.user_type}`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, result: response.result };
  }
  return { success: false };
}


export const getPopularTradies = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(`${Urls.home}getPopularTradie?long=${data?.long}&lat=${data?.lat}&page=${data?.page}&perPage=10`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  return { success: false };
}

export const getRecommendedTradies = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(`${Urls.home}recommendedTradie?long=${data?.long}&lat=${data?.lat}&page=${data?.page}&perPage=10`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  return { success: false };
}

export const getMostViewedTradies = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(`${Urls.home}mostViewedTradie?long=${data?.long}&lat=${data?.lat}&page=${data?.page}&perPage=10`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  return { success: false };
}

export const closeOpenedJob = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(`${Urls.job}cancelOpenJob`, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}

// https://ticktdevapi.appskeeper.in/v1/home/getPopularTradie?long=144.9631&lat=-37.8136&page=1&perPage=10
