import { put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from './constants';
import NetworkOps, { FetchResponse } from '../../network/NetworkOps';
import Urls from '../../network/Urls';
import { setLoading, setShowToast, setSkeletonLoading } from '../common/actions';
import storageService from '../../utils/storageService';

function* callTradieProfileData() {
  const response: FetchResponse = yield NetworkOps.get(Urls.profileTradie);
  if (response.status_code === 200) {
    yield put({
      type: actionTypes.SET_TRADIE_PROFILE_DATA,
      payload: response.result,
    });
  } else {
    yield put({ type: actionTypes.SET_TRADIE_PROFILE_DATA, payload: '' });
  }
}

function* getTradieProfileView() {
  yield put({ type: actionTypes.SET_TRADIE_PROFILE_VIEW, payload: '' });
  setSkeletonLoading(true);
  const response: FetchResponse = yield NetworkOps.get(storageService.getItem('userType') === 1 ? Urls.tradieProfileView : Urls.builderProfileView);
  setSkeletonLoading(false);
  if (response.status_code === 200) {
    yield put({
      type: actionTypes.SET_TRADIE_PROFILE_VIEW,
      payload: response.result,
    });
  } else {
    yield put({ type: actionTypes.SET_TRADIE_PROFILE_VIEW, payload: '' });
  }
}

function* cleanTradieProfileViewData() {
  yield put({ type: actionTypes.SET_TRADIE_PROFILE_VIEW, payload: '' });
}

function* getBuilderProfileView() {
  yield put({ type: actionTypes.SET_BUILDER_PROFILE_VIEW, payload: '' });
  setSkeletonLoading(true);
  const response: FetchResponse = yield NetworkOps.get(Urls.builderProfileView);
  setSkeletonLoading(false);
  if (response.status_code === 200) {
    yield put({
      type: actionTypes.SET_BUILDER_PROFILE_VIEW,
      payload: response.result,
    });
  } else {
    yield put({ type: actionTypes.SET_BUILDER_PROFILE_VIEW, payload: '' });
  }
}

function* getTradieBasicDetails() {
  const response: FetchResponse = yield NetworkOps.get(storageService.getItem('userType') === 1 ? Urls.getTradieBasicDetails : Urls.getBuilderBasicDetails);
  if (response.status_code === 200) {
    yield put({
      type: actionTypes.SET_TRADIE_BASIC_DETAILS,
      payload: response.result,
    });
  } else {
    yield put({ type: actionTypes.SET_TRADIE_BASIC_DETAILS, payload: '' });
  }
}

function* cleanTradieBasicDetails() {
  yield put({ type: actionTypes.SET_TRADIE_BASIC_DETAILS, payload: '' });
}

function* addBankDetails({ data }: any) {
  setLoading(true);
  const response: FetchResponse = yield NetworkOps.postToJson(
    Urls.addBankDetails,
    data
  );
  setLoading(false);

  setShowToast(true, response.message);
  if (response.status_code === 200) {
    yield put({
      type: actionTypes.ADD_BANK_DETAILS_END,
      payload: response.result
    });

    return;
  }

  setShowToast(true, response.message);
  yield put({ type: actionTypes.ADD_BANK_DETAILS_END, payload: data });
}

function* updateBankDetails({ data }: any) {
  setLoading(true);
  const response: FetchResponse = yield NetworkOps.putToJson(
    Urls.updateBankDetails,
    data
  );
  setLoading(false);

  setShowToast(true, response.message);
  if (response.status_code === 200) {
    yield put({
      type: actionTypes.UPDATE_BANK_DETAILS_END,
      payload: response.result
    });

    return;
  }

  setShowToast(true, response.message);
  yield put({ type: actionTypes.UPDATE_BANK_DETAILS_END, payload: data });
}

function* removeBankDetails() {
  setLoading(true);
  const response: FetchResponse = yield NetworkOps.delete(
    Urls.removeBankDetails,
  );
  setLoading(false);

  setShowToast(true, response.message);
  if (response.status_code === 200) {
    yield put({
      type: actionTypes.REMOVE_BANK_DETAILS_END,
      payload: { success: true }
    });

    return;
  }

  setShowToast(true, response.message);
  yield put({ type: actionTypes.REMOVE_BANK_DETAILS_END, payload: { success: false } });
}

function* getBankDetails() {
  setLoading(true);
  yield put({
    type: actionTypes.GET_BANK_DETAILS_END,
    payload: {},
  });
  const response: FetchResponse = yield NetworkOps.get(Urls.getBankDetails);
  setLoading(false);

  if (response.status_code === 200) {
    yield put({
      type: actionTypes.GET_BANK_DETAILS_END,
      payload: response.result
    });

    return;
  }

  setShowToast(true, response.message);
  yield put({ type: actionTypes.UPDATE_BANK_DETAILS_END, payload: {} });
}

function* getTradieProfile({ data }: any) {
  const response: FetchResponse = yield NetworkOps.get(Urls.tradieProfile + `?tradieId=${data.tradieId}&jobId=${data.jobId}`);

  if (response.status_code === 200) {
    yield put({ type: actionTypes.SET_TRADIE_PROFILE, payload: response.result });
  } else {
    yield put({ type: actionTypes.SET_TRADIE_PROFILE, payload: [] });
  }
}

function* getProfileBuilder() {
  const response: FetchResponse = yield NetworkOps.get(Urls.builder)
  if (response.status_code === 200) {
    yield put({ type: actionTypes.SET_PROFILE_BUILDER, payload: response.result });
  } else {
    yield put({ type: actionTypes.SET_PROFILE_BUILDER, payload: [] });
  }
}

function* getSavedJobList({ page }: any) {
  setLoading(true);
  const response: FetchResponse = yield NetworkOps.get(`${Urls.tradieSavedJobs}?page=${page}`);
  setLoading(false);
  if (response.status_code === 200) {
    yield put({ type: actionTypes.SET_SAVED_JOBS, payload: response.result });
  } else {
    yield put({ type: actionTypes.SET_SAVED_JOBS, payload: [] });
  }
}

function* getSettings() {
  const userType = storageService.getItem('userType');

  setLoading(true);
  const response: FetchResponse = yield NetworkOps.get(userType === 1 ? Urls.tradieSettings : Urls.builderSettings);
  setLoading(false);
  if (response.status_code === 200) {
    yield put({ type: actionTypes.SET_SETTINGS, payload: response.result?.pushNotificationCategory });
  } else {
    yield put({ type: actionTypes.SET_SETTINGS, payload: {} });
  }
}

function* updateSettings({ settings }: any) {
  const userType = storageService.getItem('userType');
  setLoading(true);
  const response: FetchResponse = yield NetworkOps.putToJson(userType === 1 ? Urls.tradieUpdateSettings : Urls.builderUpdateSettings, settings);
  setLoading(false);
  setShowToast(true, response.message);
  if (response.status_code === 200) {
    yield put({ type: actionTypes.SET_SETTINGS, payload: settings?.pushNotificationCategory });
  } else {
    yield put({ type: actionTypes.SET_SETTINGS, payload: {} });
  }
}

function* getPaymentHistory({ page, search, init }: any) {
  const userType = storageService.getItem('userType');

  if (init) {
    page === 1 && setLoading(true);
  } else {
    yield put({ type: actionTypes.SET_SEARCHING, payload: true });
  }
  const response: FetchResponse = yield NetworkOps.get(`${Urls.profile}${userType === 1 ? 'tradie' : 'builder'}/myRevenue?page=${page}${search ? `&search=${search}` : ''}`);
  if (init) {
    page === 1 && setLoading(false);
  } else {
    yield put({ type: actionTypes.SET_SEARCHING, payload: false });
  }

  if (response.status_code === 200) {
    yield put({ type: actionTypes.SET_PAYMENT_HISTORY, payload: response.result?.[0] || {} });
  } else {
    setShowToast(true, response.message);
    yield put({ type: actionTypes.SET_PAYMENT_HISTORY, payload: {} });
  }
}

function* getPaymentDetails({ jobId }: any) {
  const userType = storageService.getItem('userType');

  setLoading(true);
  const response: FetchResponse = yield NetworkOps.get(`${Urls.profile}${userType === 1 ? 'tradie' : 'builder'}/revenueDetail?jobId=${jobId}`);
  setLoading(false);

  if (response.status_code === 200) {
    yield put({ type: actionTypes.SET_PAYMENT_DETAILS, payload: response.result });
  } else {
    setShowToast(true, response.message);
    yield put({ type: actionTypes.SET_PAYMENT_DETAILS, payload: {} });
  }
}

function* authWatcher() {
  yield takeLatest(actionTypes.GET_TRADIE_PROFILE_DATA, callTradieProfileData);
  yield takeLatest(actionTypes.ADD_BANK_DETAILS_START, addBankDetails);
  yield takeLatest(actionTypes.UPDATE_BANK_DETAILS_START, updateBankDetails);
  yield takeLatest(actionTypes.REMOVE_BANK_DETAILS_START, removeBankDetails);
  yield takeLatest(actionTypes.GET_BANK_DETAILS_START, getBankDetails);
  yield takeLatest(actionTypes.GET_TRADIE_PROFILE, getTradieProfile);
  yield takeLatest(actionTypes.GET_PROFILE_BUILDER, getProfileBuilder);
  yield takeLatest(actionTypes.GET_TRADIE_PROFILE_VIEW, getTradieProfileView);
  yield takeLatest(actionTypes.GET_BUILDER_PROFILE_VIEW, getBuilderProfileView);
  yield takeLatest(actionTypes.GET_TRADIE_BASIC_DETAILS, getTradieBasicDetails);
  yield takeLatest(actionTypes.CLEAN_TRADIE_BASIC_DETAILS, cleanTradieBasicDetails);
  yield takeLatest(actionTypes.CLEAN_TRADIE_PROFILE_VIEW_DATA, cleanTradieProfileViewData);
  yield takeLatest(actionTypes.GET_SAVED_JOBS, getSavedJobList);
  yield takeLatest(actionTypes.GET_SETTINGS, getSettings);
  yield takeLatest(actionTypes.UPDATE_SETTINGS, updateSettings);
  yield takeLatest(actionTypes.GET_PAYMENT_HISTORY, getPaymentHistory);
  yield takeLatest(actionTypes.GET_PAYMENT_DETAILS, getPaymentDetails);
}

export default authWatcher;
