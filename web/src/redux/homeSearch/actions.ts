import NetworkOps, { FetchResponse } from '../../network/NetworkOps';
import Urls from '../../network/Urls';
import * as actionTypes from './constants';
import { setShowToast, setLoading, setSkeletonLoading } from '../common/actions';

export const getSearchJobList = (searchJob: string) => ({ type: actionTypes.GET_SEARCH_JOB_LIST, searchJob });

export const getRecentSearchList = () => ({ type: actionTypes.GET_RECENT_SEARCH_LIST });

export const getRecentLocationList = () => ({ type: actionTypes.GET_RECENT_LOCATION_LIST });

export const getJobTypeList = () => ({ type: actionTypes.GET_JOB_TYPE_LIST });

export const getViewNearByJob = (data: object) => ({ type: actionTypes.GET_VIEW_NEARBY_JOBS, data });

export const getJobWithJobTypeLatLong = (jobData: object) => ({ type: actionTypes.GET_JOB_WITH_JOB_TYPE_AND_LATLONG, jobData });

export const postHomeSearchData = (jobData: object) => ({ type: actionTypes.POST_HOME_SEARCH_DATA, jobData });

export const resetHomeSearchJobData = () => ({ type: actionTypes.RESET_HOME_SEARCH_DATA });

export const resetViewNearByJobData = () => ({ type: actionTypes.RESET_VIEW_NEARBY_JOBS });

export const getNotificationList = async (page: number, resetUnreadNotif: boolean) => {
    const response: FetchResponse = await NetworkOps.get(Urls.notification + `?page=${page}${resetUnreadNotif ? '&markRead=1' : ''}`);
    if (response.status_code === 200) {
        return { success: true, data: response };
    }
    return { success: false };
}

export const getHomeJobDetails = async (data: any) => {
    let response: FetchResponse;
    setSkeletonLoading(true);
    let url = '';
    if (data.jobId) {
        url+=`jobId=${data.jobId}`
    }
    if (data.tradeId) {
        url+=`&tradeId=${data.tradeId}`
    }

    if (data.specializationId) {
         url+=`&specializationId=${data.specializationId}`
    }
     response = await NetworkOps.get(Urls.homeJobDetails + `?${url}`);
    setSkeletonLoading(false);
    if (response.status_code === 200) {
        return { success: true, data: response.result };
    }
    return { success: false };
}

export const jobDetailsBuilder = async (data: any) => {
    setLoading(true);
    const response: FetchResponse = await NetworkOps.get(Urls.jobDetailsBuilder + `?jobId=${data.jobId}`);
    setLoading(false);
    if (response.status_code === 200) {
        return { success: true, data: response.result };
    }
    return { success: false };
}

export const getHomeSaveJob = async (data: any) => {
    setLoading(true);
    let url = '';
    if (data.jobId) {
        url += `jobId=${data.jobId}`
    }
    if (data.tradeId) {
        url += `&tradeId=${data.tradeId}`
    }

    if (data.specializationId) {
        url += `&specializationId=${data.specializationId}`
        
    }
    if (data.isSave) {
        url += `&isSave=${data.isSave}`
       
        // response = await NetworkOps.get(Urls.homeJobDetails + `?${url}`);
        const response: FetchResponse = await NetworkOps.get(Urls.homeSaveJob + `?${url}`);
        setLoading(false);
        if (response.status_code === 200) {
            setShowToast(true, response.message);
            return { success: true };
        }
        setShowToast(true, response.message);
        return { success: false };
    }
}
export const postHomeApplyJob = async (data: any) => {
    console.log(data,"data")
    setLoading(true);
    const response: FetchResponse = await NetworkOps.postToJson(Urls.homeApplyJob, data)
    setLoading(false);
    if (response.status_code === 200) {
        return { success: true, data: response };
    }
    setShowToast(true, response.message);
    return { success: false };
}

export const deleteRecentSearch = async (data: any) => {
    setLoading(true);
    const response: FetchResponse = await NetworkOps.putToJson(Urls.deleteRecentSearch, data)
    setLoading(false);
    if (response.status_code === 200) {
        setShowToast(true, response.message);
        return { success: true };
    }
    setShowToast(true, response.message);
    return { success: false };
}

export const getMilestoneList = async (jobId: any) => {
    setLoading(true);
    const response: FetchResponse = await NetworkOps.get(`${Urls.milestoneListBuilder}?jobId=${jobId}`)
    setLoading(false);
    if (response.status_code === 200) {
        return { success: true, data: response.result, status: response.status_code };
    }
    return { success: false, data: response.result, status: response.status_code };
}

export const getMilestoneDetails = async (data: any) => {
    setLoading(true);
    const response: FetchResponse = await NetworkOps.get(`${Urls.milestoneDetails}?jobId=${data.jobId}&milestoneId=${data.milestoneId}`)
    setLoading(false);
    if (response.status_code === 200) {
        return { success: true, data: response.result };
    }
    return { success: false, data: response.result };
}

export const milestoneAcceptOrDecline = async (data: any) => {
    setLoading(true);
    const response: FetchResponse = await NetworkOps.putToJson(Urls.milestoneApproveDecline, data)
    setLoading(false);
    if (response.status_code === 200) {
        return { success: true, data: response.result };
    }
    setShowToast(true, response.message);
    return { success: false, data: response.result };
}


export const searchTradies = async (data: any) => {

    const response: FetchResponse = await NetworkOps.postToJson(Urls.homeSearch, data)
    if (response.status_code === 200) {
        return { success: true, data: response.result };
    }
    return { success: false, data: response.result };
}

export const getPopularBuilder = async (data: any) => {
    setLoading(true);
    const response: FetchResponse = await NetworkOps.get(Urls.getPopularBuilder + `?long=${data.long}&lat=${data.lat}&page=${data.page}&perPage=${data.perPage}`);
    setLoading(false);
    if (response.status_code === 200) {
        return { success: true, result: response.result };
    }
    return { success: false };
}

export const getMostViewedJobs = async (data: any) => {
    setLoading(true);
    // const response: FetchResponse = await NetworkOps.get(Urls.getMostViewedJobs + `?long=${data.long}&lat=${data.lat}&page=${data.page}&perPage=${data.perPage}`);
    const response: FetchResponse = await NetworkOps.get(Urls.getMostViewedJobs + `?page=${data.page}&perPage=${data.perPage}`);
    setLoading(false);
    if (response.status_code === 200) {
        return { success: true, result: response.result };
    }
    return { success: false };
}

export const getRecommendedJobs = async (data: any) => {
    setLoading(true);
    const response: FetchResponse = await NetworkOps.get(Urls.getRecommendedJobs + `?page=${data.page}&perPage=${data.perPage}&long=${data.long}&lat=${data.lat}`);
    setLoading(false);
    if (response.status_code === 200) {
        return { success: true, result: response.result };
    }
    return { success: false };
}

export const getAdminNotificationData = async ({ admin_notification_id }: any) => {
    setLoading(true);
    const response: FetchResponse = await NetworkOps.get(Urls.getAdminNotificationData + `?admin_notification_id=${admin_notification_id}`);
    setLoading(false);
    if (response.status_code === 200) {
        return { success: true, result: response.result };
    }
    return { success: false };
}

export const recallHeaderNotification = (isRecall: boolean) => ({ type: actionTypes.RECALL_HEADER_NOTIFICATION, isRecall });