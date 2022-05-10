import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getPopularBuilder } from '../../redux/homeSearch/actions';

import dummy from '../../assets/images/u_placeholder.jpg';

import noData from '../../assets/images/no-search-data.png';

const PopularBuilders = (props: any) => {
    const [buildersList, setBuildersList] = useState<Array<any>>([]);
    const [totalCount, setTotalCount] = useState<number>(1);
    const [pageNo, setPageNo] = useState<number>(1);
    const [hasMoreItems, setHasMoreItems] = useState<boolean>(true);
    const lat: string = props.history?.location?.state?.coordinates[1] ? props.history?.location?.state?.coordinates[1] : -37.8136;
    const long: string = props.history?.location?.state?.coordinates[0] ? props.history?.location?.state?.coordinates[0] : 144.9631;

    useEffect(() => {
        callJobList();
    }, []);

    const callJobList = async () => {
        if (buildersList.length >= totalCount) {
            setHasMoreItems(false);
            return;
        }
        const data = {
            long: long,
            lat: lat,
            page: pageNo,
            perPage: 10
        }
        const res = await getPopularBuilder(data);
        if (res.success) {
            const allBuilders = [...buildersList, ...res.result?.data];
            if (res.result?.data?.length < 10) {
                setHasMoreItems(false);
            }
            setBuildersList(allBuilders);
            setPageNo(pageNo + 1);
            if (res.result?.totalCount !== totalCount) {
                setTotalCount(res.result?.totalCount);
            }
        }
    }
    const backButtonClicked = () => {
        props.history?.goBack();
    }

    console.log('props: ', props, buildersList.length, "zzz", totalCount);

    return (
        <InfiniteScroll
            dataLength={buildersList.length}
            next={callJobList}
            style={{ overflowX: 'hidden' }}
            hasMore={hasMoreItems}
            loader={<></>}
        >
            <div className="app_wrapper">
                <div className="section_wrapper bg_gray">
                    <div className="custom_container">
                        <div className="relate">
                            <button className="back" onClick={backButtonClicked}></button>
                            <span className="title">Popular builders</span>
                        </div>
                        <div className="flex_row tradies_row">
                            {(buildersList?.length > 0 || props.isLoading) ? buildersList.map((item: any) => {
                                return (
                                    <div className="flex_col_sm_4">
                                        <div className="tradie_card">
                                            <div className="f_spacebw tag_review">
                                                <span className="form_label">{(item?.trade?.[0]?.trade_name)}</span>
                                                <span className="rating">
                                                    {`${item.reviewCount ? `${item.rating % 1 === 0 ? item.rating : item.rating?.toFixed(2)} | ${item.review} reviews` : `0 | 0 reviews`}`}</span>
                                            </div>
                                            <span className="more_detail new_top circle"
                                                onClick={(e: any) => {
                                                    props.history.push(`/builder-info?builderId=${item._id}`)
                                                }}></span>
                                            <div className="user_wrap">
                                                <figure className="u_img">
                                                    <img
                                                        src={item.user_image || dummy}
                                                        onError={(e: any) => {
                                                            let e_: any = e;
                                                            e_.target.src = dummy;
                                                        }}
                                                        alt="img" />
                                                </figure>
                                                <div className="details">
                                                    <span className="name">{item.firstName}</span>
                                                    <span className="job">{item?.company_name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)
                            }) : <div className="no_record">
                                <figure className="no_img">
                                    <img src={noData} alt="data not found" />
                                </figure>
                                <span>No Data Found</span>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </InfiniteScroll>
    )
}

const mapStateToProps = (state: any) => {
    return {
        isLoading: state.common.isLoading,
    }
}

export default connect(mapStateToProps, null)(PopularBuilders);
