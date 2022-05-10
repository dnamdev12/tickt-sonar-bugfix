import { get } from 'lodash';
import { setShowToast } from '../redux/common/actions';
import storageService from '../utils/storageService';
import { urlFor } from './Urls';
import Constants from '../utils/constants';
import * as moment from 'moment';
import 'moment-timezone';

export interface FetchResponse {
    status?: number | boolean,
    status_code?: number
    message: string,
    result: any,
    data: any
}

class NetworkOps {

    async getRequest(type: string, options?: object): Promise<any> {
        const headerOverrides = get(options, 'headerOverrides', {});
        const request = {
            method: type,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${Constants.BasicAuthorizationToken}`,
                'timezone': moment.tz.guess(),
                ...headerOverrides
            },
        };

        //if giving multipart/form-data in Content-Type: giving boundary error
        //if also adding boundary: loader continues from server end 
        const token = storageService.getItem('jwtToken');
        if (headerOverrides['Content-Type'] === 'multipart/form-data') {
            delete request.headers['Content-Type'];
        }
        if (token) {
            request.headers = {
                ...request.headers,
                Authorization: token,
                'timezone': moment.tz.guess(),
            }
        }
        return request;
    }

    async wrapperWithOptions(url: string, request: any) {
        try {
            const response: any = await fetch(url, request);
            if (!response.ok) {
                if (response.status === 401) {
                    if (storageService.getItem('jwtToken')) {
                        storageService.clearAll();
                        const res1 = await response.text();
                        const res2 = JSON.parse(res1);
                        setShowToast(true, res2.message || 'You\'ve been logged out');
                        setTimeout(() => {
                            window.location.pathname = '/login';
                        }, 1000);
                        return;
                    }
                }
                else if (response.status === 500 || response.status === 400) {
                    console.log('Got 401, now calling logout', response);
                }
                const err = await response.json();
                console.log('Error -> ', err)
                throw err;
            }
            else {
                const res = await response.text();
                try {
                    return JSON.parse(res);
                }
                catch {
                    return res;
                }
            }
        }
        catch (error) {
            console.log('Error', error);
            return error;
        }
    }

    postToJson = async (service: string, data: any): Promise<FetchResponse> => {
        try {
            const JSONData = JSON.stringify(data);
            return this.postRaw(service, JSONData)
        }
        catch (err) {
            throw err;
        }
    }

    postRaw = async (service: string, data: any, options?: any): Promise<FetchResponse> => {
        try {
            const request = await this.getRequest('POST', options);
            request.body = data;
            return this.wrapperWithOptions(urlFor(service), request)
        }
        catch (err) {
            throw err;
        }
    }

    putToJson = async (service: string, data: any): Promise<FetchResponse> => {
        try {
            const request = await this.getRequest('PUT');
            request.body = JSON.stringify(data);
            return this.wrapperWithOptions(urlFor(service), request)
        }
        catch (err) {
            throw err;
        }
    }

    putRaw = async (service: string, data: any, options?: any): Promise<FetchResponse> => {
        try {
            const request = await this.getRequest('PUT', options);
            request.body = data
            return this.wrapperWithOptions(urlFor(service), request)
        }
        catch (err) {
            throw err;
        }
    }

    get = async (service: any): Promise<FetchResponse> => {
        try {
            const request = await this.getRequest('GET');
            return await this.wrapperWithOptions(urlFor(service), request);
        }
        catch (err) {
            throw err;
        }
    }

    delete = async (service: string, data?: any): Promise<FetchResponse> => {
        try {
            const request = await this.getRequest('DELETE');
            request.body = JSON.stringify(data);
            return this.wrapperWithOptions(urlFor(service), request)
        }
        catch (err) {
            throw err;
        }
    }

    getRaw = async (service: string): Promise<any> => {
        try {
            const request = await this.getRequest('GET');
            return this.wrapperWithOptions(service, request)
        }
        catch (err) {
            throw err;
        }
    }
}

export default new NetworkOps();