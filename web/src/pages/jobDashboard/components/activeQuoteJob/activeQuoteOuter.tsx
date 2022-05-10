import { useEffect, useState } from 'react';
import ActiveQuoteMark from '../activeQuoteJob/activeQuoteMark';
import { getHomeJobDetails } from '../../../../redux/homeSearch/actions';
import storageService from '../../../../utils/storageService';

import dummy from '../../../../assets/images/u_placeholder.jpg';
import more from '../../../../assets/images/icon-direction-right.png';
import noDataFound from "../../../../assets/images/no-search-data.png";

const ActiveQuoteOuter = (props: any) => {
    const [dataItems, setDataItems] = useState<any>({});
    const [isDataFetched, setIsDataFetched] = useState<boolean>(false);
    const [isLoad, setIsLoad] = useState(true);

    useEffect(() => {
        preFetch();
    }, []);

    let jobId = props.location?.state?.jobData?.jobId;
    let tradeId = props.location?.state?.jobData?.tradeId;
    let specializationId = props.location?.state?.jobData?.specializationId;

    const preFetch = async () => {
        let data: any = {};
        data.jobId = jobId;
        data.tradeId = tradeId;
        data.specializationId = specializationId;
        let result: any = await getHomeJobDetails(data);
        if (result.success) {
            setDataItems(result?.data);
        }
    }

    const dataFetched = (val: boolean) => {
        setIsDataFetched(val);
        setIsLoad(false);
    }

    const postedBy: any = dataItems?.postedBy || {};
    const {
        builderId,
        builderImage,
        builderName,
        jobName,
        ratings,
        reviews
    } = postedBy;

    return (
        <div className="detail_col">
            <div className="flex_row">
                <ActiveQuoteMark
                    {...props}
                    jobId={jobId}
                    dataFetched={dataFetched}
                />
                {isDataFetched ? (<div className="flex_col_sm_6 col_ruler">
                    <span className="sub_title">Posted by</span>
                    <div className="tradie_card posted_by ">
                        <a href="javascript:void(0)" className="chat circle"
                            onClick={(e) => {
                                e.preventDefault();
                                props.history.push({
                                    pathname: `/chat`,
                                    state: {
                                        tradieId: storageService.getItem('userInfo')?._id,
                                        builderId: builderId,
                                        jobId: jobId,
                                        jobName: jobName
                                    }
                                })
                            }} />
                        <div className="user_wrap"
                            onClick={() => {
                                props.history.push(`/builder-info?builderId=${builderId}`)
                            }}>
                            <figure className="u_img">
                                <img
                                    src={builderImage || dummy}
                                    alt="traide-img"
                                    onError={(e: any) => {
                                        if (e?.target?.onerror) {
                                            e.target.onerror = null;
                                        }
                                        if (e?.target?.src) {
                                            e.target.src = dummy;
                                        }
                                    }}
                                />
                            </figure>
                            <div className="details">
                                <span className="name">{builderName}</span>
                                <span className="rating">{ratings} | {reviews} reviews</span>
                            </div>
                        </div>
                    </div>
                    <div className="relate">
                        <span className="sub_title">
                            {'Job details'}
                        </span>
                        <span
                            className="edit_icon"
                            title="More"
                            onClick={() =>
                                props.history.push(`/job-details-page?jobId=${jobId}&redirect_from=jobs`)}>
                            <img src={more} alt="more" />
                        </span>
                    </div>
                </div>) : !props.loading && !isLoad && (
                    <div className="no_record  m-t-vh">
                        <figure className="no_img">
                            <img src={noDataFound} alt="data not found" />
                        </figure>
                        <span>No Data Found</span>
                    </div>
                )}
            </div>
        </div>
    )
};

export default ActiveQuoteOuter;
