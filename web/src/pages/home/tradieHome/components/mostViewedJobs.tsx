import TradieJobInfoBox from '../../../../common/tradieJobInfoBox';
import noData from '../../../../assets/images/no-search-data.png';

const MostViewedJobs = (props: any) => {

    const viewAllJobs = () => {
        props.history.push('/most-viewed-jobs')
    }

    const mostViewedJobsData = props.jobDataWithJobTypeLatLong?.most_viewed_jobs?.slice(0, 6);

    return (
        <>
            {mostViewedJobsData?.length > 0 && <div className="section_wrapper bg_gray">
                <div className="custom_container">
                    <span className="title">Most viewed jobs</span>
                    <div className="flex_row tradies_row">
                        {mostViewedJobsData?.length > 0 ?
                            (mostViewedJobsData?.map((jobData: any) => {
                                return <TradieJobInfoBox item={jobData} {...props} key={jobData.jobId}/>
                            })) :   <div className="no_record">
                            <figure className="no_img">
                                <img src={noData} alt="data not found" />
                            </figure>
                            <span>Data not found</span>
                        </div>}
                    </div>
                    <button className="fill_grey_btn full_btn m-tb40 view_more" onClick={viewAllJobs}>View all</button>
                </div>
            </div>}
        </>
    )
}

export default MostViewedJobs;