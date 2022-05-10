import { useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import dummy from "../../../assets/images/u_placeholder.jpg";
import appliedJobs from "../../../assets/images/appliedJobs.png";
import noDataFound from "../../../assets/images/no-search-data.png";

interface Proptypes {
  loading: boolean;
  newJobsCount?: number;
  appliedJobList: any;
  getAppliedJobList: (page: number) => void;
  resetAppliedJobList: () => void;
}

const AppliedJobs = ({
  loading,
  getAppliedJobList,
  appliedJobList,
  newJobsCount,
  resetAppliedJobList,
}: Proptypes) => {
  const [jobList, setJobList] = useState<Array<any>>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [hasMoreItems, setHasMoreItems] = useState<boolean>(true);
  const [isLoad, setIsLoad] = useState(true);
  const history: any = useHistory();

  useEffect(() => {
    callJobList();

    return () => resetAppliedJobList();
  }, []);

  const callJobList = async () => {
    getAppliedJobList(pageNo);
  };

  useEffect(() => {
    if (appliedJobList?.length || Array.isArray(appliedJobList)) {
      const allJobs = [...jobList, ...appliedJobList];
      setJobList(allJobs);
      setIsLoad(false);
      setPageNo(pageNo + 1);
      if (appliedJobList.length < 10) {
        setHasMoreItems(false);
      }
      resetAppliedJobList();
    }
  }, [appliedJobList]);

  return (
    <div className="detail_col">
      <InfiniteScroll
        dataLength={jobList.length}
        next={callJobList}
        style={{ overflowX: "hidden" }}
        hasMore={hasMoreItems}
        loader={<></>}
      >
        <span className="sub_title">Applied Jobs</span>
        <div className="flex_row tradies_row">
          {!isLoad && !loading && jobList.length
            ? jobList.map(
                ({
                  jobId,
                  tradeId,
                  specializationId,
                  jobName,
                  time,
                  amount,
                  locationName,
                  durations,
                  milestoneNumber,
                  totalMilestones,
                  builderName,
                  builderImage,
                  quoteJob,
                }) => (
                  <div className="flex_col_sm_6">
                    <div
                      className="tradie_card"
                      data-aos="fade-in"
                      data-aos-delay="250"
                      data-aos-duration="1000"
                    >
                      <NavLink
                        to={`/job-details-page?jobId=${jobId}&redirect_from=jobs`}
                        className="more_detail circle"
                      ></NavLink>
                      <div className="user_wrap">
                        <figure className="u_img">
                          <img
                            src={builderImage || dummy}
                            alt=""
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
                          <span className="name">{jobName}</span>
                          <span className="prof">{builderName}</span>
                        </div>
                      </div>
                      <div className="job_info">
                        <ul>
                          <li className="icon clock">{time}</li>
                          <li className="icon dollar">{amount}</li>
                          <li className="icon location line-1">
                            {locationName}
                          </li>
                          <li className="icon calendar">{durations}</li>
                        </ul>
                      </div>
                      <div
                        className="job_progress_wrap"
                        id="scroll-progress-bar"
                      >
                        <div className="progress_wrapper">
                          <span className="completed-digit" id="digit-progress">
                            <b>Job Milestones {milestoneNumber}</b> of{" "}
                            {totalMilestones}
                          </span>
                          <span className="progress_bar">
                            <input
                              className="done_progress"
                              id="progress-bar"
                              type="range"
                              min="0"
                              value={milestoneNumber}
                              max={totalMilestones}
                            />
                          </span>
                        </div>
                      </div>
                      {quoteJob && (
                        <div
                          className="quote-text"
                          onClick={() => {
                            history.push({
                              pathname: `/quote-job`,
                              state: {
                                jobData: {
                                  jobId: jobId,
                                  tradeId: tradeId,
                                  specializationId: specializationId,
                                },
                                redirect_from: "appliedJobs",
                              },
                            });
                          }}
                        >
                          {"Quote sent"}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )
            : !isLoad &&
              !loading && (
                <div className="no_record  m-t-vh">
                  <figure className="no_img">
                    <img src={noDataFound} alt="data not found" />
                  </figure>
                  <span>{"No Data Found"}</span>
                </div>
                // <div className="no_record  m-t-vh">
                //   <figure>
                //     <figure className="no_img">
                //       <img src={appliedJobs} alt="data not found" />
                //     </figure>
                //   </figure>

                //   <span className="empty_screen_text">
                //     You didn't apply any job yet
                //   </span>
                //   <button
                //     className="empty_screen_button"
                //     onClick={() => history.push("/")}
                //   >
                //     View recommened jobs
                //   </button>
                // </div>
              )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default AppliedJobs;
