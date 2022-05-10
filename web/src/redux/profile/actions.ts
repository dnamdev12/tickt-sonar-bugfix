import NetworkOps, { FetchResponse } from '../../network/NetworkOps';
import Urls from '../../network/Urls';
import * as actionTypes from './constants';
import { setShowToast, setLoading } from '../common/actions';
import storageService from '../../utils/storageService';


export const callTradieProfileData = () => ({ type: actionTypes.GET_TRADIE_PROFILE_DATA });

export const getTradieProfileView = () => ({ type: actionTypes.GET_TRADIE_PROFILE_VIEW });

export const getBuilderProfileView = () => ({ type: actionTypes.GET_BUILDER_PROFILE_VIEW });

export const getTradieBasicDetails = () => ({ type: actionTypes.GET_TRADIE_BASIC_DETAILS });

export const cleanTradieBasicDetails = () => ({ type: actionTypes.CLEAN_TRADIE_BASIC_DETAILS });

export const cleanTradieProfileViewData = () => ({ type: actionTypes.CLEAN_TRADIE_PROFILE_VIEW_DATA });

export const tradieUpdateProfileDetails = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(storageService.getItem('userType') === 1 ? Urls.tradieUpdateProfileDetails : Urls.builderUpdateProfileDetails, data);
  setLoading(false);
  if (response.status_code === 200) {
    setShowToast(true, response.message);
    return { success: true };
  }
  return { success: false };
}

export const tradieUpdateBasicDetails = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(storageService.getItem('userType') === 1 ? Urls.tradieEditBasicDetails : Urls.builderEditBasicDetails, data);
  setLoading(false);
  if (response.status_code === 200) {
    setShowToast(true, response.message);
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const tradieAddPortfolioJob = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(storageService.getItem('userType') === 1 ? Urls.tradieAddPortfolioJob : Urls.builderAddPortfolioJob, data);
  setLoading(false);
  if (response.status_code === 200) {
    setShowToast(true, response.message);
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const tradieUpdatePortfolioJob = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(storageService.getItem('userType') === 1 ? Urls.tradieUpdatePortfolioJob : Urls.builderUpdatePortfolioJob, data);
  setLoading(false);
  if (response.status_code === 200) {
    setShowToast(true, response.message);
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const tradieChangeEmail = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(storageService.getItem('userType') === 1 ? Urls.tradieChangeEmail : Urls.builderChangeEmail, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const verifyEmailOtp = async (data: object) => {
  const response: FetchResponse = await NetworkOps.putToJson(Urls.verifyEmailOtp, data);
  if (response.status_code === 200) {
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false }
};

export const tradieDeletePortfolioJob = async (portfolioId: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.delete((storageService.getItem('userType') === 1 ? Urls.tradieDeletePortfolioJob : Urls.builderDeletePortfolioJob) + `?portfolioId=${portfolioId}`);
  setLoading(false);
  if (response.status_code === 200) {
    setShowToast(true, response.message);
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const getBankDetails = () => ({
  type: actionTypes.GET_BANK_DETAILS_START,
});

export const addBankDetails = (data: any) => ({
  type: actionTypes.ADD_BANK_DETAILS_START,
  data,
});

export const updateBankDetails = (data: any) => ({
  type: actionTypes.UPDATE_BANK_DETAILS_START,
  data,
});

export const removeBankDetails = () => ({
  type: actionTypes.REMOVE_BANK_DETAILS_START,
});

export const getSettings = () => ({
  type: actionTypes.GET_SETTINGS,
});

export const updateSettings = (settings: any) => ({
  type: actionTypes.UPDATE_SETTINGS,
  settings,
});

export const getTradieProfile = (data: any) => ({ type: actionTypes.GET_TRADIE_PROFILE, data });
export const getProfileBuilder = () => ({ type: actionTypes.GET_PROFILE_BUILDER });

export const getPaymentHistory = (page: number, search: string, init: boolean) => ({ type: actionTypes.GET_PAYMENT_HISTORY, page, search, init });
export const getPaymentDetails = (jobId: string) => ({ type: actionTypes.GET_PAYMENT_DETAILS, jobId });

export const tradieUpdatePassword = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(storageService.getItem('userType') === 1 ? Urls.tradieChangePassword : Urls.builderChangePassword, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const getAllPostedJob = async (page: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(Urls.getAllPostedJobs + `?&page=${page}`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
}

export const getSavedJobList = (page: number) => ({
  type: actionTypes.GET_SAVED_JOBS,
  page,
});

export const clearSavedJobList = () => ({
  type: actionTypes.SET_SAVED_JOBS,
  payload: [],
});

export const getPrivacyPolicy = async () => {
  const userType = storageService.getItem('userType');

  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(`${Urls.profile}${userType === 1 ? 'tradie/' : 'builder/'}privacyPolicy?type=web`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false, data: '' };
}

export const getTnc = async () => {
  const userType = storageService.getItem('userType');

  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(`${Urls.profile}${userType === 1 ? 'tradie/' : 'builder/'}tnc?type=web`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false, data: '' };
}

export const uploadStripeDocument = async (data: any) => {
  setLoading(true);
  const options = {
    headerOverrides: {
      'Content-Type': 'multipart/form-data'
    }
  }
  const response: FetchResponse = await NetworkOps.putRaw(`${Urls.payment}/uploadStripeDocument`, data, options);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, msg: response.message };
  }
  setShowToast(true, response.message);
  return { success: false, data: '' };
}
