import React, { useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { renderTime } from "../../../utils/common";
//@ts-ignore
import InfiniteScroll from "react-infinite-scroll-component";

import dummy from "../../../assets/images/u_placeholder.jpg";
import approved from "../../../assets/images/approved.png";
import waiting from "../../../assets/images/exclamation.png";
import activeJobs from "../../../assets/images/activeJobs.png";
import noDataFound from "../../../assets/images/no-search-data.png";

interface Proptypes {
  loading: boolean;
  newJobsCount?: number;
  activeJobList: any;
  getActiveJobList: (page: number) => void;
  resetActiveJobList: () => void;
}

const ActiveJobs = ({
  loading,
  getActiveJobList,
  activeJobList,
  resetActiveJobList,
}: Proptypes) => {
  const [jobList, setJobList] = useState<Array<any>>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [hasMoreItems, setHasMoreItems] = useState<boolean>(true);
  const [isLoad, setIsLoad] = useState(true);
  const history: any = useHistory();


  useEffect(() => {
    callJobList();

    return () => resetActiveJobList();
  }, []);

  const callJobList = async () => {
    getActiveJobList(pageNo);
  };

  useEffect(() => {
    if (activeJobList?.length || Array.isArray(activeJobList)) {
      const allJobs = [...jobList, ...activeJobList];
      setJobList(allJobs);
      setIsLoad(false);
      setPageNo(pageNo + 1);
      if (activeJobList.length < 10) {
        setHasMoreItems(false);
      }
      resetActiveJobList();
    }
  }, [activeJobList]);

  return (
    <div className="detail_col">
      <InfiniteScroll
        dataLength={jobList.length}
        next={callJobList}
        style={{ overflowX: "hidden" }}
        hasMore={hasMoreItems}
        loader={<></>}
      >
        <span className="sub_title">Active Jobs</span>
        <div className="flex_row tradies_row">
          {!isLoad && !loading && jobList.length
            ? jobList.map(
                ({
                  jobId,
                  tradeId,
                  specializationId,
                  jobName,
                  fromDate,
                  toDate,
                  timeLeft,
                  amount,
                  locationName,
                  milestoneNumber,
                  totalMilestones,
                  status,
                  builderName,
                  builderImage,
                  quoteJob,
                }) => (
                  <div key={jobId} className="flex_col_sm_6">
                    <div
                      className="tradie_card"
                      data-aos="fade-in"
                      data-aos-delay="250"
                      data-aos-duration="1000"
                    >
                      <NavLink
                        to={`/mark-milestone?jobId=${jobId}&redirect_from=jobs`}
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
                          <li className="icon clock">
                            {renderTime(fromDate, toDate)}
                          </li>
                          <li className="icon dollar">{amount}</li>
                          <li className="icon location line-1">
                            {locationName}
                          </li>
                          <li className="icon calendar">{timeLeft}</li>
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
                          <span className="approval_info">
                            {status === "APPROVED" && (
                              <img src={approved} alt="icon" />
                            )}
                            {status === "NEEDS APPROVAL" && (
                              <img src={waiting} alt="icon" />
                            )}
                            {status}
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
                        <div className="text-center mt-sm">
                          <div
                            className="view_quote"
                            onClick={() => {
                              history.push({
                                pathname: `/active-quote-job`,
                                state: {
                                  jobData: {
                                    jobId: jobId,
                                    tradeId: tradeId,
                                    specializationId: specializationId,
                                  },
                                },
                              });
                            }}
                          >
                            {"View your quote"}
                          </div>
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
                //       <img src={activeJobs} alt="data not found" />
                //     </figure>
                //   </figure>

                //   <span className="empty_screen_text">
                //     You don't have any active job yet
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

export default ActiveJobs;
