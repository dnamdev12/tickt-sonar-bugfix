import { call, put, takeLatest, select } from 'redux-saga/effects';
import NetworkOps, { FetchResponse } from "../../network/NetworkOps";
import Urls from "../../network/Urls";
import * as actionTypes from './constants';
import { setShowToast, setLoading } from '../common/actions';
import * as selectors from './selectors';

function* setHomeBuilder(action: any) {
  const { data } = action;
  let url = `${Urls.home}?lat=${data.lat}&long=${data.long}`
  const response: FetchResponse = yield NetworkOps.get(url);
  console.log({ response }, '---------------!!!!!!!!')
  if (response.status_code === 200) {
    yield put({ type: actionTypes.SET_FETCH_HOME_BUILDER, payload: response.result });
  } else {
    yield put({ type: actionTypes.SET_FETCH_HOME_BUILDER, payload: null });
  }
}

function* setLocalChanges(action: any) {
  yield put({ type: actionTypes.SET_LOCAL_CHANGES, payload: action });
}

function* getActiveJobList({ page }: any) {
  if (page === 1) { setLoading(true); }
  const response: FetchResponse = yield NetworkOps.get(
    `${Urls.activeJobList}?page=${page}`
  );
  if (page === 1) { setLoading(false); }
  if (response.status_code === 200) {
    yield put({ type: actionTypes.GET_ACTIVE_JOBS_END, payload: response.result });
  } else {
    yield put({ type: actionTypes.GET_ACTIVE_JOBS_END, payload: { active: [] } });
  }
}

function* getAppliedJobList({ page }: any) {
  if (page === 1) { setLoading(true); }
  const response: FetchResponse = yield NetworkOps.get(
    `${Urls.appliedJobList}?page=${page}`
  );
  if (page === 1) { setLoading(false); }
  if (response.status_code === 200) {
    yield put({ type: actionTypes.GET_APPLIED_JOBS_END, payload: response.result });
  } else {
    yield put({ type: actionTypes.GET_APPLIED_JOBS_END, payload: { applied: [] } });
  }
}

function* getPastJobList({ page }: any) {
  if (page === 1) { setLoading(true); }
  const response: FetchResponse = yield NetworkOps.get(
    `${Urls.pastJobList}?page=${page}`
  );
  if (page === 1) { setLoading(false); }
  if (response.status_code === 200) {
    yield put({ type: actionTypes.GET_PAST_JOBS_END, payload: response.result });
  } else {
    yield put({ type: actionTypes.GET_PAST_JOBS_END, payload: { completed: [] } });
  }
}


function* resetActiveJobList() {
  const milestonesCount: selectors.FetchResponse = yield select(selectors.milestonesCount);
  const newJobsCount: selectors.FetchResponse = yield select(selectors.newJobsCount);
  yield put({ type: actionTypes.GET_ACTIVE_JOBS_END, payload: { active: null, milestonesCount: milestonesCount, newJobsCount: newJobsCount } });
}

function* resetAppliedJobList() {
  const milestonesCount: selectors.FetchResponse = yield select(selectors.milestonesCount);
  const newJobsCount: selectors.FetchResponse = yield select(selectors.newJobsCount);
  yield put({ type: actionTypes.GET_APPLIED_JOBS_END, payload: { applied: null, milestonesCount: milestonesCount, newJobsCount: newJobsCount } });
}

function* resetPastJobList() {
  const milestonesCount: selectors.FetchResponse = yield select(selectors.milestonesCount);
  const newJobsCount: selectors.FetchResponse = yield select(selectors.newJobsCount);
  yield put({ type: actionTypes.GET_PAST_JOBS_END, payload: { completed: null, milestonesCount: milestonesCount, newJobsCount: newJobsCount } });
}

function* resetNewJobList() {
  yield put({ type: actionTypes.GET_NEW_JOBS_END, payload: null });
}

function* resetApprovedMilestoneList() {
  yield put({ type: actionTypes.GET_APPROVED_MILESTONE_END, payload: null });
}

function* getNewJobList({ page }: any) {
  if (page === 1) { setLoading(true); }
  const response: FetchResponse = yield NetworkOps.get(
    `${Urls.newJobList}?page=${page}`
  );
  if (page === 1) { setLoading(false); }
  if (response.status_code === 200) {
    yield put({ type: actionTypes.GET_NEW_JOBS_END, payload: response.result });
  } else {
    yield put({ type: actionTypes.GET_NEW_JOBS_END, payload: [] });
  }
}

function* getApprovedMilestoneList({ page }: any) {
  if (page === 1) { setLoading(true); }
  const response: FetchResponse = yield NetworkOps.get(
    `${Urls.approvedMilestoneList}?page=${page}`
  );
  if (page === 1) { setLoading(false); }
  if (response.status_code === 200) {
    yield put({ type: actionTypes.GET_APPROVED_MILESTONE_END, payload: response.result });
  } else {
    yield put({ type: actionTypes.GET_APPROVED_MILESTONE_END, payload: [] });
  }
}

// milestoneList
function* getMilestoneList({ jobId }: any) {
  yield put({ type: actionTypes.GET_MILESTONES_END, payload: {} });
  setLoading(true);
  const response: FetchResponse = yield NetworkOps.get(`${Urls.milestoneList}?jobId=${jobId}`);
  setLoading(false);
  console.log({ response })
  if (response.status_code === 200) {
    yield put({
      type: actionTypes.GET_MILESTONES_END,
      payload: response.result,
    });
  } else {
    yield put({
      type: actionTypes.GET_MILESTONES_END,
      payload: [{ sucess: false, status: response.status_code }],
    });
  }
}

// milestoneList
function* markMilestoneComplete({ data, callback }: any) {
  setLoading(true);
  const response: FetchResponse = yield NetworkOps.postToJson(Urls.markComplete, data);
  setLoading(false);

  if (response.status_code === 200) {
    if (callback) {
      yield call(callback, response.result?.jobCompletedCount);
    }

    return;
  }

  setShowToast(true, response.message);
}

function* getActiveJobsBuilder({ page }: any) {
  if (page === 1) { setLoading(true); }
  const response: FetchResponse = yield NetworkOps.get(`${Urls.activeJobListBuilder}?page=${page}`);
  if (response.status_code === 200) {
    if (response?.result?.active && Array.isArray(response?.result?.active) && response?.result?.active?.length) {
      response.result.active[0]['page'] = page;
      response.result.active[0]['mathrandom'] = Math.random();
    }
    if (page === 1) { setLoading(false); }
    yield put({
      type: actionTypes.SET_BUILDER_ACTIVE_JOBS,
      payload: response.result,
    });

    return;
  }
  if (page === 1) { setLoading(false); }
}

function* getPastJobsBuilder({ page }: any) {
  if (page === 1) { setLoading(true); }
  const response: FetchResponse = yield NetworkOps.get(`${Urls.pastJobListBuilder}?page=${page}`);
  if (response.status_code === 200) {
    if (response?.result?.past && Array.isArray(response?.result?.past) && response?.result?.past?.length) {
      response.result.past[0]['page'] = page;
    }
    if (page === 1) { setLoading(false); }
    yield put({
      type: actionTypes.SET_BUILDER_PAST_JOBS,
      payload: response.result,
    });

    return;
  }
  if (page === 1) { setLoading(false); }

}

function* getOpenJobsBuilder({ page }: any) {
  if (page === 1) { setLoading(true); }
  const response: FetchResponse = yield NetworkOps.get(`${Urls.OpenJobLisBuilder}?page=${page}`);

  if (response.status_code === 200) {
    if (response?.result?.open && Array.isArray(response?.result?.open) && response?.result?.open?.length) {
      response.result.open[0]['page'] = page;
      response.result.open[0]['mathrandom'] = Math.random();
    }
    if (page === 1) { setLoading(false); }
    yield put({
      type: actionTypes.SET_BUILDER_OPEN_JOBS,
      payload: response.result,
    });
    return;
  }
  if (page === 1) { setLoading(false); }
}

function* getBuilderNewApplicants({ page }: any) {
  if (page === 1) { setLoading(true); }
  const response: FetchResponse = yield NetworkOps.get(`${Urls.newApplicantsBuilder}?page=${page}`);

  if (response.status_code === 200) {
    if (response?.result && Array.isArray(response?.result) && response?.result?.length) {
      response.result[0]['page'] = page;
    }
    if (page === 1) { setLoading(false); }
    yield put({
      type: actionTypes.SET_BUILDER_NEW_APPLICANTS,
      payload: response.result,
    });
    return;
  }
  if (page === 1) { setLoading(false); }
}

function* getnewJobApplicationListBuilder({ item }: any) {
  setLoading(true);
  const response: FetchResponse = yield NetworkOps.postToJson(Urls.newJobApplicationListBuilder, item);
  if (response.status_code === 200) {
    setLoading(false);
    yield put({
      type: actionTypes.SET_BUILDER_NEW_APPLICANTS_LIST,
      payload: response.result,
    });
    return;
  }
  setLoading(false);
}


function* getTradieReviewListOnBuilder({ data }: any) {
  const response: FetchResponse = yield NetworkOps.get(Urls.reviewList + `?tradieId=${data.tradieId}&page=${data.page}`);
  if (response.status_code === 200) {
    yield put({ type: actionTypes.SET_TRADIE_REVIEWS_LIST_ON_BUILDER, payload: response.result });
  } else {
    yield put({ type: actionTypes.SET_TRADIE_REVIEWS_LIST_ON_BUILDER, payload: [] });
  }
}

function* getAcceptDeclineTradie({ data }: any) {
  const response: FetchResponse = yield NetworkOps.putToJson(Urls.acceptDeclineRequest, data);
  setShowToast(true, response.message);
  if (response.status_code === 200) {
    yield put({ type: actionTypes.SET_ACCEPT_DECLINE_TRADIE_REQUEST, payload: true });
  } else {
    yield put({ type: actionTypes.SET_ACCEPT_DECLINE_TRADIE_REQUEST, payload: false });
  }
}

function* getNewApprovalList({ page }: any) {
  if (page === 1) { setLoading(true); }
  const response: FetchResponse = yield NetworkOps.get(`${Urls.needApproval}?page=${page}`);

  if (response.status_code === 200) {
    if (response?.result && Array.isArray(response?.result) && response?.result?.length) {
      response.result[0]['page'] = page;
    }
    if (page === 1) { setLoading(false); }
    yield put({ type: actionTypes.SET_BUILDER_NEW_APPROVAL_LIST, payload: response.result });
  } else {
    if (page === 1) { setLoading(false); }
    yield put({ type: actionTypes.SET_BUILDER_NEW_APPROVAL_LIST, payload: false });
  }
}

function* getClearJobs() {
  yield put({ type: actionTypes.SET_CLEAR_JOBS, payload: true });
}

function* postJobWatcher() {
  try {
    yield takeLatest(actionTypes.FETCH_HOME_BUILDER, setHomeBuilder);
    yield takeLatest(actionTypes.GET_LOCAL_CHANGES, setLocalChanges);
    yield takeLatest(actionTypes.GET_ACTIVE_JOBS_START, getActiveJobList);
    yield takeLatest(actionTypes.GET_APPLIED_JOBS_START, getAppliedJobList);
    yield takeLatest(actionTypes.GET_PAST_JOBS_START, getPastJobList);
    yield takeLatest(actionTypes.GET_NEW_JOBS_START, getNewJobList);
    yield takeLatest(actionTypes.GET_APPROVED_MILESTONE_START, getApprovedMilestoneList);
    yield takeLatest(actionTypes.GET_MILESTONES_START, getMilestoneList);
    yield takeLatest(actionTypes.MARK_MILESTONE_COMPLETE, markMilestoneComplete);

    yield takeLatest(actionTypes.RESET_PAST_JOBS_START, resetPastJobList);
    yield takeLatest(actionTypes.RESET_ACTIVE_JOBS_START, resetActiveJobList);
    yield takeLatest(actionTypes.RESET_APPLIED_JOBS_START, resetAppliedJobList);
    yield takeLatest(actionTypes.RESET_NEW_JOBS_START, resetNewJobList);
    yield takeLatest(actionTypes.RESET_APPROVED_MILESTONE_START, resetApprovedMilestoneList);

    yield takeLatest(actionTypes.GET_BUILDER_ACTIVE_JOBS, getActiveJobsBuilder);
    yield takeLatest(actionTypes.GET_BUILDER_PAST_JOBS, getPastJobsBuilder);
    yield takeLatest(actionTypes.GET_BUILDER_OPEN_JOBS, getOpenJobsBuilder);
    yield takeLatest(actionTypes.GET_BUILDER_NEW_APPLICANTS, getBuilderNewApplicants);
    yield takeLatest(actionTypes.GET_BUILDER_NEW_APPLICANTS_LIST, getnewJobApplicationListBuilder);

    yield takeLatest(actionTypes.GET_TRADIE_REVIEWS_LIST_ON_BUILDER, getTradieReviewListOnBuilder);
    yield takeLatest(actionTypes.GET_ACCEPT_DECLINE_TRADIE_REQUEST, getAcceptDeclineTradie)

    yield takeLatest(actionTypes.GET_BUILDER_NEW_APPROVAL_LIST, getNewApprovalList);
    yield takeLatest(actionTypes.GET_CLEAR_JOBS, getClearJobs);

  } catch (e) {
    console.log(e);
  }
}

export default postJobWatcher;