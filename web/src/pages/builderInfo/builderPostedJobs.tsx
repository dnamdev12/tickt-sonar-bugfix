import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import TradieJobInfoBox from '../../common/tradieJobInfoBox';
import { getBuildersJob } from '../../redux/jobs/actions';
import InfiniteScroll from 'react-infinite-scroll-component';
import noData from '../../assets/images/no-search-data.png';
import storageService from '../../utils/storageService';
import { getAllPostedJob } from '../../redux/profile/actions';

interface PropsType {
    location: any,
    history: any,
    isLoading: boolean,
}

const BuilderPostedJobs = (props: PropsType) => {
    const params = new URLSearchParams(props.location?.search);
    const builderId: any = params.get('bId');
    const totalJobsCount: any = Number(params.get('jobCount'));
    const userType = storageService.getItem('userType');

    const [buildersJob, setBuildersJob] = useState<Array<any>>([]);
    const [buildersJobPageNo, setBuildersJobPageNo] = useState<number>(1);
    const [hasMoreItems, setHasMoreItems] = useState<boolean>(true);

    useEffect(() => {
        callJobList();
    }, []);

    const callJobList = async () => {
        if (buildersJob.length >= totalJobsCount) {
            setHasMoreItems(false);
            return;
        }
        const data = {
            builderId: builderId,
            page: buildersJobPageNo
        }
        const res1 = userType === 1 ? await getBuildersJob(data) : await getAllPostedJob(data.page);
        if (res1.success) {
            const allJobs = [...buildersJob, ...res1.data];
            if (res1.data?.length < 10) {
                setHasMoreItems(false);
            }
            setBuildersJob(allJobs);
            setBuildersJobPageNo(buildersJobPageNo + 1);
        }
    }

    const backButtonClicked = () => {
        props.history?.goBack();
    }
    console.log(totalJobsCount, "totalJobsCount", buildersJob, "buildersJob", buildersJobPageNo, "buildersJobPageNo", hasMoreItems, "hasMoreItems")

    return (
        <InfiniteScroll
            dataLength={buildersJob.length}
            next={callJobList}
            hasMore={hasMoreItems}
            loader={<h4></h4>}
        >
            <div className={'app_wrapper'}>
                <div className="section_wrapper">
                    <div className="custom_container">
                        <div className="relate">
                            <button className="back" onClick={backButtonClicked}></button>
                            <span className="title">{`${totalJobsCount || 0} jobs`}</span>
                        </div>
                        <div className="flex_row tradies_row">
                            {(buildersJob?.length > 0 || props.isLoading) ?
                                buildersJob?.map((jobData: any) => {
                                    return <TradieJobInfoBox item={jobData} {...props} key={jobData.jobId} userType={storageService.getItem('userType')} />
                                })
                                :
                                <div className="no_record">
                                    <figure className="no_img">
                                        <img src={noData} alt="data not found" />
                                    </figure>
                                    <span>No Data Found</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </InfiniteScroll>
    )
}

const mapState = (state: any) => ({
    isLoading: state.common.isLoading
});

export default connect(mapState, null)(BuilderPostedJobs);
