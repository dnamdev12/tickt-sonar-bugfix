import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getRecommendedJobs } from '../../redux/homeSearch/actions';
import TradieJobInfoBox from '../../common/tradieJobInfoBox';

import noData from '../../assets/images/no-search-data.png';

const RecommendedJobs = (props: any) => {
    const [jobList, setJobList] = useState<Array<any>>([]);
    const [totalCount, setTotalCount] = useState<number>(1);
    const [pageNo, setPageNo] = useState<number>(1);
    const [hasMoreItems, setHasMoreItems] = useState<boolean>(true);
    const lat: string = props.history?.location?.state?.coordinates[1] ? props.history?.location?.state?.coordinates[1] : -37.8136;
    const long: string = props.history?.location?.state?.coordinates[0] ? props.history?.location?.state?.coordinates[0] : 144.9631;

    useEffect(() => {
        callJobList();
    }, []);

    const callJobList = async () => {
        if (jobList.length >= totalCount) {
            setHasMoreItems(false);
            return;
        }
        const data = {
            long: long,
            lat: lat,
            page: pageNo,
            perPage: 10
        }
        const res = await getRecommendedJobs(data);
        if (res.success) {
            const allJobs = [...jobList, ...res.result?.data];
            if (res.result?.data?.length < 10) {
                setHasMoreItems(false);
            }
            setJobList(allJobs);
            setPageNo(pageNo + 1);
            if (res.result?.totalCount !== totalCount) {
                setTotalCount(res.result?.totalCount);
            }
        }
    }
    const backButtonClicked = () => {
        props.history?.goBack();
    }

    return (
        <InfiniteScroll
            dataLength={jobList.length}
            next={callJobList}
            style={{ overflowX: 'hidden' }}
            hasMore={hasMoreItems}
            loader={<></>}
        >
            <div className={'app_wrapper'} >
                <div className="section_wrapper">
                    <div className="custom_container">
                        <div className="relate">
                            <button className="back" onClick={backButtonClicked}></button>
                            <span className="title">Recommended jobs</span>
                        </div>
                        <div className="flex_row tradies_row">
                            {(jobList?.length > 0 || props.isLoading) ?
                                (jobList?.map((jobData: any) => {
                                    return <TradieJobInfoBox item={jobData} {...props} key={jobData.jobId} />
                                })) : <div className="no_record">
                                    <figure className="no_img">
                                        <img src={noData} alt="data not found" />
                                    </figure>
                                    <span>Data not found</span>
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

export default connect(mapStateToProps, null)(RecommendedJobs);
