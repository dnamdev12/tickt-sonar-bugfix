import { put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from './constants';
import NetworkOps, { FetchResponse } from '../../network/NetworkOps';
import Urls from '../../network/Urls';
import { setLoading } from '../common/actions';


function* getSearchJobList(action: any) {
    const response: FetchResponse = yield NetworkOps.get(Urls.getSearchData + `?search_text=${action.searchJob}`);
    if (response.status_code === 200) {
        yield put({ type: actionTypes.SET_SEARCH_JOB_LIST, payload: response.result });
    } else {
        yield put({ type: actionTypes.SET_SEARCH_JOB_LIST, payload: [] });
    }
}

function* getRecentSearchList() {
    const response: FetchResponse = yield NetworkOps.get(Urls.getRecentSearch);
    if (response.status_code === 200) {
        yield put({ type: actionTypes.SET_RECENT_SEARCH_LIST, payload: response.result.resultData });
    } else {
        yield put({ type: actionTypes.SET_RECENT_SEARCH_LIST, payload: [] });
    }
}

function* getRecentLocationList() {
    const response: FetchResponse = yield NetworkOps.get(Urls.getRecentLocation);
    if (response.status_code === 200) {
        yield put({ type: actionTypes.SET_RECENT_LOCATION_LIST, payload: response.data.resultData });
    } else {
        yield put({ type: actionTypes.SET_RECENT_LOCATION_LIST, payload: [] });
    }
}


function* getJobTypeList() {
    const response: FetchResponse = yield NetworkOps.get(Urls.jobTypeList);
    if (response.status_code === 200) {
        yield put({ type: actionTypes.SET_JOB_TYPE_LIST, payload: response.result.resultData });
    } else {
        yield put({ type: actionTypes.SET_JOB_TYPE_LIST, payload: [] });
    }
}

function* getViewNearByJob(action: any) {
    const { data } = action;
    setLoading(true);
    const response: FetchResponse = yield NetworkOps.get(Urls.viewNearByJob + `?lat=${data.lat}&long=${data.long}&page=${data.page}`);
    setLoading(false);
    if (response.status_code === 200) {
        yield put({ type: actionTypes.SET_VIEW_NEARBY_JOBS, payload: response.result });
    } else {
        yield put({ type: actionTypes.SET_VIEW_NEARBY_JOBS, payload: [] });
    }
}
function* resetViewNearByJobData() {
    yield put({ type: actionTypes.SET_VIEW_NEARBY_JOBS, payload: [] });
}

function* getJobWithJobTypeLatLong(action: any) {
    var url = '';
    const { jobData } = action;
    if (jobData.jobType) {
        url = Urls.home + `?jobType=${jobData.jobType}` + `&lat=${jobData.lat}` + `&long=${jobData.long}`
    } else {
        url = Urls.home + `?lat=${jobData.lat}` + `&long=${jobData.long}`
    }
    const response: FetchResponse = yield NetworkOps.get(url)
    if (response.status_code === 200) {
        yield put({ type: actionTypes.SET_JOB_WITH_JOB_TYPE_AND_LATLONG, payload: response.result });
    } else {
        yield put({ type: actionTypes.SET_JOB_WITH_JOB_TYPE_AND_LATLONG, payload: {} });
    }
}

function* postHomeSearchData(action: any) {
    setLoading(true);
    const response: FetchResponse = yield NetworkOps.postToJson(Urls.homeSearch, action.jobData)
    setLoading(false);
    let dataValues = response?.result?.data || response?.result;
    if (response.status_code === 200) {
        let page = action?.jobData?.page;
        if (Array.isArray(dataValues) && dataValues?.length) {
            dataValues[0]['page'] = page;
        }
        yield put({ type: actionTypes.SET_HOME_SEARCH_DATA, payload: dataValues });
    } else {
        yield put({ type: actionTypes.SET_HOME_SEARCH_DATA, payload: [] });
    }
}

function* resetHomeSearchJobData() {
    yield put({ type: actionTypes.SET_HOME_SEARCH_DATA, payload: [] });
}

function* recallHeaderNotification(action: any) {
    console.log('action: ', action, 'z', action.isRecall);
    yield put({ type: actionTypes.SET_RECALL_HEADER_NOTIFICATION, payload: action.isRecall });
}

function* authWatcher() {
    yield takeLatest(actionTypes.GET_SEARCH_JOB_LIST, getSearchJobList);
    yield takeLatest(actionTypes.GET_RECENT_SEARCH_LIST, getRecentSearchList);
    yield takeLatest(actionTypes.GET_RECENT_LOCATION_LIST, getRecentLocationList);
    yield takeLatest(actionTypes.GET_JOB_TYPE_LIST, getJobTypeList);
    yield takeLatest(actionTypes.GET_VIEW_NEARBY_JOBS, getViewNearByJob);
    yield takeLatest(actionTypes.GET_JOB_WITH_JOB_TYPE_AND_LATLONG, getJobWithJobTypeLatLong);
    yield takeLatest(actionTypes.POST_HOME_SEARCH_DATA, postHomeSearchData);
    yield takeLatest(actionTypes.RESET_HOME_SEARCH_DATA, resetHomeSearchJobData);
    yield takeLatest(actionTypes.RESET_VIEW_NEARBY_JOBS, resetViewNearByJobData);
    yield takeLatest(actionTypes.RECALL_HEADER_NOTIFICATION, recallHeaderNotification);
}

export default authWatcher;