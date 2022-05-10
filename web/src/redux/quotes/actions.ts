import NetworkOps, { FetchResponse } from '../../network/NetworkOps';
import Urls from '../../network/Urls';
import { setShowToast, setLoading } from '../common/actions';
import storageService from '../../utils/storageService';


export const quoteByJobId = async (data: any) => {
    setLoading(true);
    let url = '';
    let isUserType = storageService.getItem('userType') === 1 ? true : false;
    console.log({data, isUserType})
    if (isUserType) {
        url = `${Urls.quote}quoteByJobId?jobId=${data.jobId}&tradieId=${data.tradieId}`;
    } else {
        
        if (data.tradieId?.length) {
            url = `${Urls.quote}quoteByJobId?jobId=${data.jobId}&tradieId=${data.tradieId}`;
        } else {
            url = `${Urls.quote}quoteByJobId?jobId=${data.jobId}&sort=${data.sortBy}`
        }
    }
    const response: FetchResponse = await NetworkOps.get(url);
    setLoading(false);
    if (response.status_code === 200) {
        return { success: true, data: response?.result };
    }
    setShowToast(true, response.message);
    return { success: false };
}

export const addQuote = async (data: any) => {
    setLoading(true);
    const response: FetchResponse = await NetworkOps.postToJson(`${Urls.quote}addQuote`, data);
    setLoading(false);
    if (response.status_code === 200) {
        return { success: true };
    }
    setShowToast(true, response.message);
    return { success: false };
}

export const addItem = async (data: any) => {
    setLoading(true);
    const response: FetchResponse = await NetworkOps.postToJson(`${Urls.quote}addItem`, data);
    setLoading(false);
    if (response.status_code === 200) {
        setShowToast(true, response.message);
        return { success: true, data: response?.result };
    }
    setShowToast(true, response.message);
    return { success: false };
}

export const deleteItem = async (data: any) => {
    setLoading(true);
    const response: FetchResponse = await NetworkOps.putToJson(`${Urls.quote}deleteItem`, data);
    setLoading(false);
    if (response.status_code === 200) {
        setShowToast(true, response.message);
        return { success: true, data: response?.result };
    }
    setShowToast(true, response.message);
    return { success: false };
}

export const updateItem = async (data: any) => {
    setLoading(true);
    const response: FetchResponse = await NetworkOps.putToJson(`${Urls.quote}updateItem`, data);
    setLoading(false);
    if (response.status_code === 200) {
        setShowToast(true, response.message);
        return { success: true };
    }
    setShowToast(true, response.message);
    return { success: false };
}

export const getAcceptDeclineTradie = async (data: any) => {
    const response: FetchResponse = await NetworkOps.putToJson(Urls.acceptDeclineRequest, data);
    if (response.status_code === 200) {
        return { success: true, data: response?.result, msg: response.message };
    }
    setShowToast(true, response.message);
    return { success: false };
}


export const closeQuoteJob = async (data: any) => {
    const response: FetchResponse = await NetworkOps.putToJson(`${Urls.job}closeQuoteJob`, data);
    if (response.status_code === 200) {
        setShowToast(true, response.message);
        return { success: true, data: response?.result };
    }
    setShowToast(true, response.message);
    return { success: false };
}


//PUT /job/closeQuoteJob