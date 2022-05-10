import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { renderTime } from "../../../utils/common";
import InfiniteScroll from "react-infinite-scroll-component";

import dummy from "../../../assets/images/u_placeholder.jpg";
import rateStar from "../../../assets/images/ic-star-fill.png";
import pastJobs from "../../../assets/images/pastJobs.png";
import noDataFound from "../../../assets/images/no-search-data.png";

interface Proptypes {
  history: any;
  loading: boolean;
  pastJobList: any;
  getPastJobList: (page: number) => void;
  resetPastJobList: () => void;
}

const PastJobs = (props: Proptypes) => {
  const [jobList, setJobList] = useState<Array<any>>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [hasMoreItems, setHasMoreItems] = useState<boolean>(true);
  const [isLoad, setIsLoad] = useState(true);

  useEffect(() => {
    callJobList();

    return () => props.resetPastJobList();
  }, []);

  const callJobList = async () => {
    props.getPastJobList(pageNo);
  };

  useEffect(() => {
    if (props.pastJobList?.length || Array.isArray(props.pastJobList)) {
      const allJobs = [...jobList, ...props.pastJobList];
      console.log(
        jobList,
        "jobList",
        props.pastJobList,
        "props.pastJobList",
        allJobs,
        "allJobs"
      );
      setJobList(allJobs);
      setIsLoad(false);
      setPageNo(pageNo + 1);
      if (props.pastJobList.length < 10) {
        setHasMoreItems(false);
      }
      props.resetPastJobList();
    }
  }, [props.pastJobList]);

  return (
    <div className="detail_col">
      <InfiniteScroll
        dataLength={jobList.length}
        next={callJobList}
        style={{ overflowX: "hidden" }}
        hasMore={hasMoreItems}
        loader={<></>}
      >
        <span className="sub_title">Past Jobs</span>
        <div className="flex_row tradies_row">
          {!isLoad && !props.loading && jobList.length
            ? jobList.map((item: any) => (
                <div className="flex_col_sm_6" key={item.jobId}>
                  <div
                    className="tradie_card"
                    data-aos="fade-in"
                    data-aos-delay="250"
                    data-aos-duration="1000"
                  >
                    <NavLink
                      to={`/job-details-page?jobId=${item.jobId}&redirect_from=jobs`}
                      className="more_detail circle"
                    ></NavLink>
                    <div className="user_wrap">
                      <figure className="u_img">
                        <img
                          src={item.builderImage || dummy}
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
                        <span className="name">{item.jobName}</span>
                        <span className="prof">{item.builderName}</span>
                      </div>
                    </div>
                    <div className="job_info">
                      <ul>
                        <li className="icon calendar">
                          {renderTime(item.fromDate, item.toDate)}
                        </li>
                        <li className="icon dollar">{item.amount}</li>
                        <li className="icon location line-1">
                          {item.locationName}
                        </li>
                        {item.durations ? (
                          <li className="icon calendar">{item.durations}</li>
                        ) : (
                          <li>
                            <span className="job_status">{item.status}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                    {/* <p className="commn_para line-3">
                {builderData.jobDescription}
              </p> */}
                    <div className="job_progress_wrap" id="scroll-progress-bar">
                      <div className="progress_wrapper">
                        <span className="completed-digit" id="digit-progress">
                          <b>Job Milestones {item.milestoneNumber}</b> of{" "}
                          {item.totalMilestones}
                        </span>
                        <span className="progress_bar">
                          <input
                            className="done_progress"
                            id="progress-bar"
                            type="range"
                            min="0"
                            value={
                              (item.milestoneNumber / item.totalMilestones) *
                              100
                            }
                          />
                        </span>
                      </div>
                    </div>
                    {!item?.isRated && ["COMPLETED"].includes(item?.status) && (
                      <NavLink
                        to={{
                          pathname: "/review-builder",
                          state: { item: item },
                        }}
                      >
                        <button className="fill_grey_btn full_btn">
                          <img src={rateStar} alt="rating-star" /> Rate this
                          builder
                        </button>
                      </NavLink>
                    )}
                  </div>
                </div>
              ))
            : !isLoad &&
              !props.loading && (
                <div className="no_record  m-t-vh">
                  <figure className="no_img">
                    <img src={noDataFound} alt="data not found" />
                  </figure>
                  <span>{"No Data Found"}</span>
                </div>
                // <div className="no_record  m-t-vh">
                //   <figure>
                //     <figure className="no_img">
                //       <img src={pastJobs} alt="data not found" />
                //     </figure>
                //   </figure>

                //   <span className="empty_screen_text">
                //     You didn't complete any job yet
                //   </span>
                //   <span className="empty_screen_subtext">
                //     As soon as the completation of your work will get approved
                //     you will be notified
                //   </span>
                // </div>
              )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default PastJobs;
