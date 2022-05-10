import React, { useState, useEffect } from 'react';
import Banner from './components/banner';
import Constants from '../../../utils/constants';
import Geocode from "react-geocode";
import { withRouter } from 'react-router'
import { setShowToast } from '../../../redux/common/actions';
import TradieHome from '../../shared/tradieHome';
import JobTypes from './components/jobTypes';
import axios from 'axios';
import dummy from '../../../assets/images/u_placeholder.jpg';
import * as moment from 'moment';
import 'moment-timezone';

Geocode.setApiKey(Constants.SocialAuth.GOOGLE_GEOCODE_KEY);

const setKey = () => {
    localStorage.setItem('toastLocation', 'true');
}

const getKey = () => {
    return localStorage.getItem('toastLocation');
}
var responseElement: any = {};
const BuilderHome = (props: any) => {
    let { callTradeList, getRecentSearchList, getClearJobs } = props;
    const [addressItem, setAddressItem] = useState();
    const [position, setPosition] = useState<any>({});

    const fetchItems = async (latitude: any, longitude: any) => {
        // Get address from latitude & longitude.
        try {
            let response = await Geocode.fromLatLng(latitude.toString(), longitude.toString())
            if (response) {
                const address = response.results[0].formatted_address;
                setAddressItem(address)
            }
        } catch (err) {
            console.log({ err });
        }
    }

    const checkPermission = async () => {
        const showPosition = async (position: any) => {
            let { latitude, longitude } = position.coords;
            localStorage.setItem('position', `[${longitude},${latitude}]`);
            setPosition({ lat: latitude, long: longitude });
            console.log('fetch In If condition')
            await fetchByLatLong({ lat: latitude, long: longitude });

            // Get address from latitude & longitude.
            await fetchItems(latitude.toString(), longitude.toString());
        }

        const postionError = async () => {
            console.log('fetch In Else condition')
            await fetchByLatLong({ lat: '-37.8136', long: '144.9631' });
            setPosition({ lat: '-37.8136', long: '144.9631' });
            localStorage.setItem('position', '[-37.8136, 144.9631]');
        }

        let permission: any = await navigator?.permissions?.query({ name: 'geolocation' });
        if (permission?.state === 'denied') {
            if (getKey() !== "true") {
                setShowToast(true, 'Please enable the location permission from the browser settings so that Tickt App can access your location');
                setKey();
            }
        }
        navigator.geolocation.getCurrentPosition(showPosition, postionError)
    }

    useEffect(() => {
        getRecentSearchList();
        callTradeList();
        checkPermission();
        getClearJobs();
    }, []);
    const fetchByLatLong = async (data: any) => {

        let url: string = `${process.env.REACT_APP_BASE_URL}/v1/home?lat=${data.lat}&long=${data.long}`
        let item: any = localStorage.getItem('jwtToken')
        try {
            let response = await axios({
                url,
                method: 'get',
                headers: {
                    Authorization: JSON.parse(item),
                    timezone: moment.tz.guess(),
                }
            });

            if (response?.status === 200) {
                let data: any = response?.data;
                responseElement = data?.result;
            }
        } catch (err) {
            console.log({ err });
        }
    }

    let home_data: any = responseElement;

    return (
        <div className="app_wrapper" >

            <Banner
                {...props}
                current_address={addressItem}
                position={position}
            />

            <JobTypes
                {...props}
            />

            <TradieHome
                data={home_data?.saved_tradespeople}
                title={"Saved tradespeople"}
                length={3}
                redirectPath={"/saved-tradespeople"}
                history={props?.history}
            />

            {home_data?.popular_tradespeople?.length > 0 &&
                <div className="section_wrapper bg_gray">
                    <div className="custom_container">
                        <span className="title">
                            {'Popular tradespeople'}
                        </span>
                        <ul className="popular_tradies">
                            {home_data?.popular_tradespeople?.map((item: any, index: number) => {
                                return (
                                    <li
                                        key={`${item.firstName}item${index}`}
                                        data-aos="flip-right"
                                        data-aos-delay="200"
                                        onClick={() => {
                                            if (props?.history && item?._id) {
                                                props?.history?.push(`tradie-info?tradeId=${item?._id}&hideInvite=${false}`);
                                            }
                                        }}
                                        data-aos-duration="1000">
                                        <figure className="tradies_img">
                                            <img
                                                src={item.user_image || dummy}
                                                alt="tradies-img"
                                                onError={(e: any) => {
                                                    let e_: any = e;
                                                    e_.target.src = dummy;
                                                }}
                                            />
                                        </figure>
                                        <span className="name">{item?.firstName}</span>
                                        <span className="post">
                                            {item?.trade && Array.isArray(item?.trade) && item?.trade[0] && item?.trade[0]?.trade_name ? item?.trade[0]?.trade_name : ''}
                                        </span>
                                    </li>)
                            })}
                        </ul>
                        <button
                            className="fill_grey_btn full_btn m-tb40 view_more"
                            onClick={() => {
                                if (props?.history && props?.history?.push) {
                                    props?.history.push({
                                        pathname: '/popular-tradespeople',
                                        state: {
                                            data: home_data?.popular_tradespeople,
                                            title: 'Popular tradespeople',
                                            popular: true,
                                            history: null, //props?.history
                                        }
                                    })
                                }
                            }}>
                            {'View all'}
                        </button>
                    </div>
                </div>
            }

            <TradieHome
                data={home_data?.recomended_tradespeople}
                title={"Recommended tradespeople"}
                redirectPath={'/recommended-tradespeople'}
                length={9}
                history={props?.history}
            />

            <TradieHome
                data={home_data?.mostViewed_tradespeople}
                title={"Most Viewed tradespeople"}
                redirectPath={'/most-viewed-tradespeople'}
                length={9}
                history={props?.history}
            />
        </div>
    )
}

export default withRouter(BuilderHome);
