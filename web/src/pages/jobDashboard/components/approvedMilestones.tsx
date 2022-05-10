import { useState, useEffect } from "react";
import { renderTime } from "../../../utils/common";
import InfiniteScroll from "react-infinite-scroll-component";

import dummy from "../../../assets/images/u_placeholder.jpg";
import approved from "../../../assets/images/approved.png";
import newApprovals from "../../../assets/images/newApprovals.png";
import { useHistory } from "react-router-dom";
import { moengage, mixPanel } from "../../../services/analyticsTools";
import { MoEConstants } from "../../../utils/constants";
import noDataFound from "../../../assets/images/no-search-data.png";

interface Proptypes {
  loading: boolean;
  newJobsCount?: number;
  approvedMilestoneList: any;
  getApprovedMilestoneList: (page: number) => void;
  resetApprovedMilestoneList: () => void;
}

const ApprovedMilestones = ({
  loading,
  getApprovedMilestoneList,
  approvedMilestoneList,
  resetApprovedMilestoneList,
}: Proptypes) => {
  const [jobList, setJobList] = useState<Array<any>>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [hasMoreItems, setHasMoreItems] = useState<boolean>(true);
  const [isLoad, setIsLoad] = useState(true);
  const history = useHistory();

  useEffect(() => {
    callJobList();

    return () => resetApprovedMilestoneList();
  }, []);

  const callJobList = async () => {
    getApprovedMilestoneList(pageNo);
  };

  useEffect(() => {
    if (approvedMilestoneList?.length || Array.isArray(approvedMilestoneList)) {
      const allJobs = [...jobList, ...approvedMilestoneList];
      setJobList(allJobs);
      setIsLoad(false);
      setPageNo(pageNo + 1);
      if (approvedMilestoneList.length < 10) {
        setHasMoreItems(false);
      }
      resetApprovedMilestoneList();
    }
  }, [approvedMilestoneList]);

  return (
    <div className="detail_col">
      <InfiniteScroll
        dataLength={jobList.length}
        next={callJobList}
        style={{ overflowX: "hidden" }}
        hasMore={hasMoreItems}
        loader={<></>}
      >
        <span className="sub_title">Approved Milestones</span>
        <div className="flex_row tradies_row">
          {!isLoad && !loading && jobList.length
            ? jobList.map(
                ({
                  jobId,
                  jobName,
                  tradeName,
                  fromDate,
                  toDate,
                  timeLeft,
                  amount,
                  locationName,
                  milestoneNumber,
                  totalMilestones,
                  builderName,
                  builderImage,
                }) => (
                  <div key={jobId} className="flex_col_sm_6">
                    <div
                      className="tradie_card"
                      data-aos="fade-in"
                      data-aos-delay="250"
                      data-aos-duration="1000"
                    >
                      <span
                        className="more_detail circle"
                        onClick={() => {
                          const mData = {
                            timeStamp: moengage.getCurrentTimeStamp(),
                            category: tradeName,
                            "Milestone number": milestoneNumber,
                          };
                          moengage.moE_SendEvent(
                            MoEConstants.VIEWED_APPROVED_MILESTONE,
                            mData
                          );
                          mixPanel.mixP_SendEvent(
                            MoEConstants.VIEWED_APPROVED_MILESTONE,
                            mData
                          );
                          history.push(
                            `/job-details-page?jobId=${jobId}&redirect_from=jobs`
                          );
                        }}
                      ></span>
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
                            <img src={approved} alt="icon" />
                            APPROVED
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
                //   <figure className="no_img">
                //     <img src={newApprovals} alt="data not found" />
                //   </figure>
                //   <span className="empty_screen_text">
                //     You don't have any milestones approved yet
                //   </span>
                //   <span className="empty_screen_subtext">
                //     As soon as the completation your builder will approve a
                //     milestone you will be notified
                //   </span>
                // </div>
              )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ApprovedMilestones;
