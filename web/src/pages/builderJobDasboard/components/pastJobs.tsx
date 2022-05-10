import React, {  useState, useEffect } from "react";
import rateStar from "../../../assets/images/ic-star-fill.png";
import pastJobs from "../../../assets/images/pastJobs.png";
import jobTypePlaceholder from "../../../assets/images/job-type-placeholder.png";
import noDataFound from "../../../assets/images/no-search-data.png";
import RateThisJob from "./ratethisJob/index";

import { useLocation } from "react-router-dom";

import { renderTime } from "../../../utils/common";
interface Post {
  amount: any;
  fromDate: any;
  jobData: any;
  jobId: any;
  isRated: any;
  jobName: any;
  locationName: any;
  milestoneNumber: any;
  specializationId: any;
  specializationName: any;
  status: any;
  toDate: any;
  totalMilestones: any;
  isPublishedAgain: boolean;
  tradeId: any;
  tradieId: any;
  tradeName: any;
  tradeSelectedUrl: any;
  isLoading: any;
  tradieData: any;
}

const PastJobs = (props: any) => {
  const { dataItems, jobType, isLoading } = props;
  let listData: any = dataItems;
  const [enableRateJob, setRateJob] = useState({ data: {}, isTrue: false }); // toggle-rate-job
  let [isEnable, setEnable] = useState<any>(false);

  const location = useLocation();

  const redirectToInfo = ({ jobId, status }: any) => {
    if (jobId?.length && status?.length) {
      let urlEncode: any = `?jobId=${jobId}&status=${status}&job=past&activeType=${props?.activeType}`;
      props.history.push(`/job-detail?${urlEncode}`);
    }
  };

  const backToScreen = () => {
    props.history.replace("/jobs?active=past");
    setRateJob((prev: any) => ({
      data: {},
      isTrue: !prev.isTrue,
    }));
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (params?.jobId) {
      let jobId_ = params?.jobId;
      if (listData?.length) {
        let result = listData.find((item: any) => item?.jobId === jobId_);
        if (result) {
          setRateJob({
            data: result,
            isTrue: true,
          });
        }
      }
    }
  }, [props]);

  useEffect(() => {
    if (isLoading === false) {
      setEnable(true);
    }
  }, [isLoading]);

  if (enableRateJob?.isTrue) {
    return (
      <RateThisJob
        backToScreen={backToScreen}
        data={enableRateJob.data}
        history={null}
        location={null}
      />
    );
  }

  if (!isEnable) {
    return null;
  }
  return (
    <React.Fragment>
      <span className="sub_title">
        {jobType.charAt(0).toUpperCase() + jobType.slice(1)} Jobs
      </span>
      <div className="flex_row tradies_row">
        {listData?.length
          ? listData.map(
              ({
                amount,
                fromDate,
                jobData,
                jobId,
                isRated,
                jobName,
                locationName,
                isPublishedAgain,
                milestoneNumber,
                specializationId,
                specializationName,
                status,
                toDate,
                totalMilestones,
                tradeId,
                tradieId,
                tradeName,
                tradeSelectedUrl,
                tradieData,
              }: Post) => (
                <div className="flex_col_sm_6">
                  <div
                    className="tradie_card"
                    data-aos="fade-in"
                    data-aos-delay="250"
                    data-aos-duration="1000"
                  >
                    <span
                      onClick={() => {
                        redirectToInfo({ jobId, status });
                      }}
                      className="more_detail circle"
                    ></span>
                    <div className="user_wrap">
                      <figure className="u_img icon">
                        <img
                          src={jobData?.tradeSelectedUrl || jobTypePlaceholder}
                          alt="traide-img"
                          onError={(e: any) => {
                            if (e?.target?.onerror) {
                              e.target.onerror = null;
                            }
                            if (e?.target?.src) {
                              e.target.src = jobTypePlaceholder;
                            }
                          }}
                        />
                      </figure>
                      <div className="details">
                        <span className="name">{tradeName}</span>
                        <p className="commn_para">{jobName}</p>
                      </div>
                    </div>
                    <div className="job_info">
                      <ul>
                        <li className="icon calendar">
                          {renderTime(fromDate, toDate)}
                        </li>
                        <li className="icon dollar">{amount}</li>
                        <li className="icon location line-1">{locationName}</li>
                        <li className="job_status">{status}</li>
                      </ul>
                    </div>
                    <div className="job_progress_wrap" id="scroll-progress-bar">
                      <div className="progress_wrapper">
                        <span className="completed-digit" id="digit-progress">
                          <b>{`Job Milestones ${milestoneNumber} `}</b>
                          {`of ${totalMilestones}`}
                        </span>
                        <span className="progress_bar">
                          <input
                            className="done_progress"
                            id="progress-bar"
                            type="range"
                            min="0"
                            value={
                              milestoneNumber / totalMilestones > 0
                                ? (milestoneNumber / totalMilestones) * 100
                                : 0
                            }
                          />
                        </span>
                      </div>
                      {status === "COMPLETED"
                        ? !isRated && (
                            <button
                              onClick={() => {
                                setRateJob((prev: any) => ({
                                  data: {
                                    amount,
                                    fromDate,
                                    jobData,
                                    jobId,
                                    jobName,
                                    locationName,
                                    milestoneNumber,
                                    specializationId,
                                    specializationName,
                                    status,
                                    toDate,
                                    totalMilestones,
                                    tradeId,
                                    tradieId,
                                    tradeName,
                                    tradeSelectedUrl,
                                    tradieData,
                                  },
                                  isTrue: !prev.isTrue,
                                }));
                              }}
                              className="fill_grey_btn full_btn"
                            >
                              <React.Fragment>
                                <img src={rateStar} alt="rating-star" />
                                {"Rate this tradesperson"}
                              </React.Fragment>
                            </button>
                          )
                        : status === "EXPIRED" &&
                          !isPublishedAgain && (
                            <button
                              className="fill_grey_btn full_btn"
                              onClick={() => redirectToInfo({ jobId, status })}
                            >
                              {"Publish again"}
                            </button>
                          )}
                    </div>
                  </div>
                </div>
              )
            )
          : !isLoading && (
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
              //     You don't have any past job yet
              //   </span>
              //   <button
              //     className="empty_screen_button"
              //     onClick={() => props.history.push("/post-new-job")}
              //   >
              //     Post a job
              //   </button>
              // </div>
            )}
      </div>
    </React.Fragment>
  );
};

export default PastJobs;
