import * as actionTypes from './constants';

const initialState = {
    isLoading: false,
    isSkeletonLoading: false,
    showToast: false,
    toastType: undefined,
    toastMessage: undefined,
    showNotification: false,
    notificationData: null,
    unreadMessageCount:0,
}

const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            }
        case actionTypes.SET_SKELETON_LOADING:
            return {
                ...state,
                isSkeletonLoading: action.payload,
            }
        case actionTypes.SHOW_HIDE_TOAST:
            return {
                ...state,
                showToast: action.showToast,
                toastType: action.toastType,
                toastMessage: action.toastMessage,
            }
        case actionTypes.SHOW_HIDE_NOTIFICATION:
            return {
                ...state,
                showNotification: action.showNotification,
                notificationData: action.data,
            }
        default: return state
    }
}

export default reducer;