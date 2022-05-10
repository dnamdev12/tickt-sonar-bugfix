import * as actionTypes from './constants';
import {store} from '../../App';

export const setLoading = (isLoading: boolean) => {
    store.dispatch({type: actionTypes.SET_LOADING, payload: isLoading})
};

export const setSkeletonLoading = (isSkeletonLoading: boolean) => {
    store.dispatch({type: actionTypes.SET_SKELETON_LOADING, payload: isSkeletonLoading})
};

// showToast - argument remove if not needed
export const setShowToast = (showToast: boolean, toastMessage: string | undefined = undefined, toastType: string | undefined = undefined) => {
    store.dispatch({type: actionTypes.SHOW_HIDE_TOAST, showToast, toastType, toastMessage})
};

export const setShowNotification = (showNotification: boolean, data: any = undefined) => {
    store.dispatch({type: actionTypes.SHOW_HIDE_NOTIFICATION, showNotification, data})
};
