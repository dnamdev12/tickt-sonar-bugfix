import TradieJobInfoBox from '../../../../common/tradieJobInfoBox';

const SavedJobs = (props: any) => {

    const viewAllJobs = () => {
        props.history.push('/saved-jobs')
    }

    const savedJobsData = props.jobDataWithJobTypeLatLong?.saved_jobs?.slice(0, 2);
    console.log({ savedJobsData })
    return (
        <>
            {savedJobsData?.length > 0 && (<div className="section_wrapper bg_gray">
                <div className="custom_container">
                    <span className="title">Saved jobs</span>
                    <div className="flex_row tradies_row">
                        {savedJobsData?.map((jobData: any) => {
                            return <TradieJobInfoBox item={jobData} {...props} key={jobData.jobId} />
                        })}
                    </div>
                    <button className="fill_grey_btn full_btn m-tb40 view_more" onClick={viewAllJobs}>View all</button>
                </div>
            </div>)}
        </>
    )
}

export default SavedJobs;