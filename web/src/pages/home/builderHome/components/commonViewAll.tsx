import TradieBox from '../../../shared/tradieBox';
import noData from '../../../../assets/images/no-search-data.png';
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom';
import { getSavedTradies, getPopularTradies, getRecommendedTradies, getMostViewedTradies } from '../../../../redux/jobs/actions'

//@ts-ignore
import InfiniteScroll from "react-infinite-scroll-component";

const SavedJobs = (props: any) => {
    const [stateData, setStateData] = useState<any>([]);
    const [isLoad, setLoad] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasLoad, setHasLoad] = useState(true);


    const backButtonClicked = () => {
        props.history?.goBack();
    }

    const preFetch = async (page?: any) => {
        let response = await getSavedTradies({ page: page });
        if (response?.success) {
            if (page > 1) {
                let data = response?.data;
                console.log({ data, })
                setStateData((prev: any) => ([...prev, ...data]))
            } else {
                setStateData(response.data);
                setLoad(true);
            }
        }
    }

    const preFetchPopularTradie = async (page?: any) => {
        let positions = localStorage.getItem('position');
        if (positions) {
            positions = JSON.parse(positions).reverse();

            if (Array.isArray(positions)) {
                let response = await getPopularTradies({
                    lat: positions[1],
                    long: positions[0],
                    page: page
                });

                if (response?.success) {
                    if (page > 1) {
                        let data = response?.data?.data || [];
                        setStateData((prev: any) => ([...prev, ...data]))
                    } else {
                        setStateData(response?.data?.data || []);
                        setLoad(true);
                    }
                }
            }
        }
    }


    const preFetchRecommendedTradie = async (page?: any) => {
        let positions = localStorage.getItem('position');
        if (positions) {
            positions = JSON.parse(positions).reverse();

            if (Array.isArray(positions)) {
                let response = await getRecommendedTradies({
                    lat: positions[1],
                    long: positions[0],
                    page: page
                });

                if (response?.success) {
                    if (page > 1) {
                        let data = response?.data?.data || [];
                        setStateData((prev: any) => ([...prev, ...data]))
                    } else {
                        setStateData(response?.data?.data || []);
                        setLoad(true);
                    }
                }
            }
        }
    }

    const preFetchMostViewedTradie = async (page?: any) => {
        let positions = localStorage.getItem('position');
        if (positions) {
            positions = JSON.parse(positions).reverse();

            if (Array.isArray(positions)) {
                let response = await getMostViewedTradies({
                    lat: positions[1],
                    long: positions[0],
                    page: page
                });

                if (response?.success) {
                    if (page > 1) {
                        let data = response?.data?.data || [];
                        setStateData((prev: any) => ([...prev, ...data]))
                    } else {
                        setStateData(response?.data?.data || []);
                        setLoad(true);
                    }
                }
            }
        }
    }

    useEffect(() => {
        console.log({
            state: props?.location?.state,
            pathname: props.location.pathname,
            title: props?.location?.state?.title
        });
        setLoad(false);
        if (props?.location?.state?.title === "Saved tradespeople" || props.location.pathname === '/saved-tradespeople') {
            preFetch(1);
        } else if (props?.location?.state?.title === "Popular tradespeople" || props.location.pathname === '/popular-tradespeople') {
            preFetchPopularTradie(1);
        } else if (props?.location?.state?.title === "Recommended tradespeople" || props.location.pathname === '/recommended-tradespeople') {
            preFetchRecommendedTradie(1);
        } else if (props?.location?.state?.title === "Most Viewed tradespeople" || props.location.pathname === '/most-viewed-tradespeople') {
            preFetchMostViewedTradie(1);
        } else {
            setStateData(props?.location?.state?.data);
            setLoad(true);
        }
    }, []);

    if (!isLoad) {
        return null;
    }
    let dataItems = stateData?.length;
    return (
        <div className={'app_wrapper'} >
            {dataItems ? (
                <InfiniteScroll
                    dataLength={stateData?.length}
                    next={() => {
                        let cp: any = currentPage;
                        if (stateData?.length === (cp * 10)) {
                            setCurrentPage((prev: any) => prev + 1);
                            cp = cp + 1;

                            if (props?.location?.state?.title === "Saved tradespeople") {
                                preFetch(cp);
                            }

                            if (props?.location?.state?.title === "Popular tradespeople") {
                                preFetchPopularTradie(cp);
                            }

                            if (props?.location?.state?.title === "Recommended tradespeople") {
                                preFetchRecommendedTradie(cp);
                            }

                            if (props?.location?.state?.title === "Most Viewed tradespeople") {
                                preFetchMostViewedTradie(cp);
                            }
                        } else {
                            setHasLoad(false);
                        }
                    }}
                    hasMore={hasLoad}
                    loader={<></>}
                    style={{ overflowX: 'hidden' }}>

                    <div className="section_wrapper">
                        <div className="custom_container">
                            <div className="relate">
                                <button className="back" onClick={backButtonClicked}></button>
                                <span className="title">
                                    {props?.location?.state?.title || (props.location.pathname === '/saved-tradespeople' ? 'Saved tradespeople' : '')}
                                </span>
                            </div>

                            <div className="flex_row tradies_row">
                                {stateData?.length > 0 ?
                                    (stateData?.map((item: any, index: any) => (
                                        <TradieBox
                                            item={item}
                                            index={index}
                                        />
                                    ))) : null}
                            </div>
                        </div>
                    </div>
                </InfiniteScroll>
            ) : (
                <div className="pt-30">
                    <div className="custom_container">
                        <div className="relate">
                            <button className="back" onClick={backButtonClicked}></button>
                            <span className="title mb0">
                                {props?.location?.state?.title || (props.location.pathname === '/saved-tradespeople' ? 'Saved tradespeople' : '')}
                            </span>
                        </div>

                        
                            <div className="no_record">
                                <figure className="no_img">
                                    <img src={noData} alt="data not found" />
                                </figure>
                                <span>No Data Found</span>
                            </div>
                    </div>
                </div>
            )}
        </div>
    )


}

export default withRouter(SavedJobs);
