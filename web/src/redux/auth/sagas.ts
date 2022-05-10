import {  put, takeLatest } from 'redux-saga/effects'
import * as actionTypes from './constants'
import NetworkOps, { FetchResponse } from '../../network/NetworkOps';
import Urls from '../../network/Urls';
// import * as commonActions from '../common/actions';

function* postSignup({ data }: any) {
  const response: FetchResponse = yield NetworkOps.postToJson(Urls.signup, data);
  if (response.status === 200) {
    //yield put({type: actionTypes.FIRST_API_SUCCESSED, user: user});
    return { success: true };
  }
  return { success: false };

}

function* callTradeList() {
  // commonActions.setLoading(true);
  const response: FetchResponse = yield NetworkOps.get(Urls.tradeList);
  // commonActions.setLoading(false);
  if (response.status_code === 200) {
    yield put({ type: actionTypes.CALL_TRADE_LIST_SUCCESSED, payload: response.result.trade });
  }
}


function* authWatcher() {
  yield takeLatest(actionTypes.POST_SIGNUP_API, postSignup);
  yield takeLatest(actionTypes.CALL_TRADE_LIST, callTradeList);
}

export default authWatcher;