import NetworkOps, { FetchResponse } from '../../network/NetworkOps';
import Urls from '../../network/Urls';
import * as actionTypes from './constants';
import { setShowToast, setLoading } from './../common/actions';
import storageService from '../../utils/storageService';

import {
  callTradieProfileData as getProfileTradie,
  getProfileBuilder
} from '../profile/actions';
import { store } from '../../App';

export const callTradeList = () => ({ type: actionTypes.CALL_TRADE_LIST })

export const postSignup = async (data: any) => {
  console.log(data);
  var today = new Date();
  var uniqueToken = today.getFullYear() + ":" + today.getMonth() + ":" + today.getDate() + ":" + today.getMinutes() + ":" + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
  data.deviceToken = uniqueToken;
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.signup, data);
  setLoading(false);
  if (response.status_code === 200) {
    storageService.setItem("jwtToken", response.result.token);
    storageService.setItem("userType", response.result.user_type);
    storageService.setItem("userInfo", {
      "email": response.result?.email,
      "user_image": response.result?.user_image,
      "user_type": response.result?.user_type,
      "userName": response.result?.firstName,
      "_id": response.result?._id,
      "accountType": response.result?.accountType,
      "deviceId": uniqueToken
    });
    return { success: true, result: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
};

export const checkEmailId = async (email: string, hideToast?: boolean) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(Urls.checkEmailId + `?email=${email}`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, isProfileCompleted: response.result.isProfileCompleted, message: response.message };
  }
  if (!hideToast) {
    setShowToast(true, response.message);
  }
  return { success: false };
};

export const checkMobileNumber = async (mobile: string | number) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(Urls.checkMobileNumber + `?mobileNumber=${mobile}`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, isProfileCompleted: response.result.isProfileCompleted, message: response.message };
  }
  setShowToast(true, response.message);
  return { success: false };
};

export const verifyOtp = async (data: object) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.verifyOTP, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, message: response.message };
  }
  setShowToast(true, response.message);
  return { success: false }
};


export const verifyMobileOtp = async (data: object) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.verifyMobileOTP, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, message: response.message };
  }
  setShowToast(true, response.message);
  return { success: false }
};


export const createPassword = async (passwordInfo: object) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(Urls.createPassword, passwordInfo);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, message: response.message };
  }
  setShowToast(true, response.message);
  return { success: false, message: response.message };
};


export const callLogin = async (data: any) => {
  var today = new Date();
  var uniqueToken = today.getFullYear() + ":" + today.getMonth() + ":" + today.getDate() + ":" + today.getMinutes() + ":" + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
  data.deviceToken = uniqueToken;
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.login, data);
  setLoading(false);
  if (response.status_code === 200) {
    const firstLogin = storageService.getItem('firstLogin');

    if (!firstLogin) {
      storageService.setItem('firstLogin', 'true');
    } else if (firstLogin === 'true') {
      storageService.setItem('firstLogin', 'false');
    }

    storageService.setItem("jwtToken", response.result.token);
    storageService.setItem("userType", response.result.user_type);
    storageService.setItem("userInfo", {
      "email": response.result?.email,
      "user_image": response.result?.user_image,
      "user_type": response.result?.user_type,
      "userName": response.result?.userName,
      "_id": response.result?._id,
      "accountType": response.result?.accountType,
      "deviceId": uniqueToken
    });

    if (response.result.user_type === 1) {
      store.dispatch(getProfileTradie());
    }

    if (response.result.user_type === 2) {
      store.dispatch(getProfileBuilder());
    }
    return { success: true, data: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
};

export const callForgotPassword = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.putToJson(Urls.forgotPassword, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false };
};

export const checkSocialId = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(Urls.checkSocialId + `?socialId=${data.socialId}` + `&email=${data.email}`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, isProfileCompleted: response.result.isProfileCompleted };
  }
  setShowToast(true, response.message);
  return { success: false };
};

export const socialSignupLogin = async (data: any) => {
  console.log(data);
  var today = new Date();
  var uniqueToken = today.getFullYear() + ":" + today.getMonth() + ":" + today.getDate() + ":" + today.getMinutes() + ":" + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
  data.deviceToken = uniqueToken;
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.SocialAuth, data);
  setLoading(false);
  if (response.status_code === 200) {
    storageService.setItem("jwtToken", response.result.token);
    storageService.setItem("userType", response.result.user_type);
    storageService.setItem("userInfo", {
      "email": response.result?.email,
      "user_image": response.result?.user_image,
      "user_type": response.result?.user_type,
      "userName": response.result?.firstName || 'name',
      "_id": response.result?._id,
      "deviceId": uniqueToken
    });
    return { success: true, successToken: response.result.token, result: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
};

export const getLinkedinProfile = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.get(Urls.linkedInAuth + `?code=${data.code}&redirect_uri=${data.redirect_uri}`);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, result: response.result };
  }
  setShowToast(true, response.message);
  return { success: false };
};

export const onFileUpload = async (data: any) => {
  setLoading(true);
  const options = {
    headerOverrides: {
      'Content-Type': 'multipart/form-data'
    }
  }
  const response: FetchResponse = await NetworkOps.postRaw(Urls.upload, data, options);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true, imgUrl: response.result.url[0] };
  }
  setShowToast(true, response.message);
  return { success: false };
};

export const addFCMNotifToken = async (data: object) => {
  const response: FetchResponse = await NetworkOps.putToJson(Urls.addFCMNotifToken, data);
  if (response.status_code === 200) {
    return { success: true };
  }
  return { success: false };
};

export const markNotifAsRead = async (data: any) => {
  const response: FetchResponse = await NetworkOps.putToJson(Urls.unReadNotification, data);
  if (response.status_code === 200) {
    return { success: true };
  }
  return { success: false };
};

export const resendOtp = async (data: any) => {
  const response: FetchResponse = await NetworkOps.postToJson(Urls.resendOtp, data);
  if (response.status_code === 200) {
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false };
};

export const resendMobileOtp = async (data: any) => {
  const response: FetchResponse = await NetworkOps.postToJson(Urls.resendMobileOtp, data);
  if (response.status_code === 200) {
    return { success: true };
  }
  setShowToast(true, response.message);
  return { success: false };
};

export const getStripeClientSecretkey = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.getStripeClientSecretKey, data);
  if (response.status_code === 200) {
    return { success: true, stripeClientSecretkey: response.result?.clientSecret };
  }
  setLoading(false);
  setShowToast(true, 'Something went wrong');
  return { success: false };
};

export const saveStripeTransaction = async (data: any) => {
  setLoading(true);
  const response: FetchResponse = await NetworkOps.postToJson(Urls.saveStripeTransaction, data);
  setLoading(false);
  if (response.status_code === 200) {
    return { success: true };
  }
  setShowToast(true, 'Something went wrong');
  return { success: false };
};
