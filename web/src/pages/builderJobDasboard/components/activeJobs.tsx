import React, { useState, useEffect } from "react";
import approved from "../../../assets/images/approved.png";
import waiting from "../../../assets/images/exclamation.png";
import MarkMilestones from "./markMilestones";
import { withRouter } from "react-router-dom";
import activeJobs from "../../../assets/images/activeJobs.png";
import jobTypePlaceholder from "../../../assets/images/job-type-placeholder.png";
import { renderTime } from "../../../utils/common";
import noDataFound from "../../../assets/images/no-search-data.png";
interface Active {
  amount: any;
  durations: any;
  jobId: any;
  jobName: any;
  fromDate: any;
  toDate: any;
  milestoneNumber: any;
  specializationId: any;
  specializationName: any;
  status: any;
  timeLeft: any;
  locationName: any;
  total: any;
  quote: any;
  totalmem: any;
  totalMilestones: any;
  tradieListData: any;
  tradeName: any;
  location: any;
  tradieId: any;
  tradieImage: any;
  tradeSelectedUrl: any;
  activeType: any;
  setJobLabel: (item: any) => void;
  enableEditMilestone: boolean;
  enableLodgeDispute: boolean;
  enableCancelJob: boolean;
  globalJobId: string;
  mathrandom?: any;
  setToggleActiveToFalse: any;
  toggleClearActiveChecks: () => void;
}

const ActiveJobs = ({
  setJobLabel,
  activeType,
  history,
  dataItems,
  jobType,
  isLoading,
  enableEditMilestone,
  enableLodgeDispute,
  enableMakMilestone,
  enableCancelJob,
  globalJobId,
  setToggleActiveToFalse,
  toggleClearActiveChecks,
  recallHeaderNotification,
}: any) => {
  let listData: any = dataItems;
  const [selectedIndex, setSelectedIndex] = useState<any>(null);
  const [localState, setLocalState] = useState(false);

  const resetStateLocal = (isTrue: boolean) => {
    setJobLabel(activeType);
    setLocalState(false);
    if (isTrue) {
      history.push("/decline-milestone-success");
    }
  };

  useEffect(() => {
    console.log("here!");
  }, [jobType]);

  useEffect(() => {
    if (toggleClearActiveChecks === true) {
      setSelectedIndex(null);
      setLocalState(false);
      setToggleActiveToFalse();
    }
  }, [toggleClearActiveChecks]);

  useEffect(() => {
    let filteredItem: any = {};
    listData.forEach((item_: any, index: any) => {
      if (item_.jobId === globalJobId) {
        filteredItem = {
          ...item_,
          index,
        };
      }
    });

    if (Object.keys(filteredItem)?.length) {
      setSelectedIndex(filteredItem?.index);
      setLocalState(true);
    }
  }, [
    enableEditMilestone,
    enableLodgeDispute,
    enableCancelJob,
    enableMakMilestone,
  ]);

  if (localState && selectedIndex !== null) {
    console.log({ localState, selectedIndex, listData });
    return (
      <MarkMilestones
        resetStateLocal={resetStateLocal}
        selectedIndex={selectedIndex}
        listData={listData}
        enableEditMilestone={enableEditMilestone}
        enableLodgeDispute={enableLodgeDispute}
        enableCancelJob={enableCancelJob}
        recallHeaderNotification={recallHeaderNotification}
      />
    );
  }

  if (isLoading || listData == undefined) {
    return null;
  }

  console.log({ listData, isLoading });
  return (
    <React.Fragment>
      <span className="sub_title">
        {jobType.charAt(0).toUpperCase() + jobType.slice(1)} Jobs
      </span>
      <div className="flex_row tradies_row">
        {listData?.length
          ? listData.map(
              (
                {
                  amount,
                  jobId,
                  jobName,
                  fromDate,
                  toDate,
                  milestoneNumber,
                  status,
                  timeLeft,
                  total,
                  quote,
                  totalMilestones,
                  tradeName,
                  tradeSelectedUrl,
                }: Active,
                index: number
              ) => (
                <div className="flex_col_sm_6">
                  <div
                    className="tradie_card"
                    data-aos="fade-in"
                    data-aos-delay="250"
                    data-aos-duration="1000"
                  >
                    <span
                      className="more_detail circle"
                      onClick={() => {
                        setLocalState(true);
                        setSelectedIndex(index);
                      }}
                    ></span>
                    <div className="user_wrap">
                      <figure className="u_img icon">
                        <img
                          src={tradeSelectedUrl || jobTypePlaceholder}
                          onError={(e: any) => {
                            if (e?.target?.onerror) {
                              e.target.onerror = null;
                            }
                            if (e?.target?.src) {
                              e.target.src = jobTypePlaceholder;
                            }
                          }}
                          alt="traide-img"
                        />
                      </figure>
                      <div className="details">
                        <span className="name">{tradeName}</span>
                        <p className="commn_para">{jobName}</p>
                      </div>
                    </div>
                    <div className="job_info">
                      <ul>
                        <li className="icon dollar">{amount}</li>
                        <li className="">
                          {total.toUpperCase() == "VIEW QUOTE" ? (
                            <span
                              className="view_quote"
                              onClick={() => {
                                let quoteId = null;
                                if (quote && quote[0] && quote[0]._id) {
                                  quoteId = quote[0]._id;
                                  history.push(
                                    `/jobs?active=active&viewQuotes=true&jobId=${jobId}&id=${quoteId}`
                                  );
                                  setJobLabel("quotes");
                                }
                              }}
                            >
                              {total}
                            </span>
                          ) : (
                            <span>{total}</span>
                          )}
                        </li>
                        <li className="icon calendar">
                          {/* {durations} */}
                          {renderTime(fromDate, toDate)}
                        </li>
                        <li className="">
                          <span>{timeLeft}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="job_progress_wrap" id="scroll-progress-bar">
                      <div className="progress_wrapper">
                        <span className="completed-digit" id="digit-progress">
                          <b>{`Job Milestones ${milestoneNumber} `}</b>
                          {`of ${totalMilestones}`}
                        </span>
                        <span className="approval_info">
                          {status.toUpperCase() === "APPROVED" && (
                            <img src={approved} alt="icon" />
                          )}
                          {[
                            "QUOTE REQUEST ACCEPTED",
                            "QUOTE ACCEPTED",
                          ].includes(status.toUpperCase()) && (
                            <img src={approved} alt="icon" />
                          )}
                          {(status.toUpperCase() === "NEEDS APPROVAL" ||
                            status.toUpperCase() === "NEED APPROVAL") && (
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
                            value={(milestoneNumber / totalMilestones) * 100}
                          />
                        </span>
                      </div>
                      {(status === "NEEDS APPROVAL" ||
                        status === "NEED APPROVAL" ||
                        status === "need approval") && (
                        <button
                          onClick={() => {
                            setLocalState(true);
                            setSelectedIndex(index);
                          }}
                          className="fill_grey_btn full_btn btn-effect"
                        >
                          {"Approve"}
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
              //       <img src={activeJobs} alt="data not found" />
              //     </figure>
              //   </figure>

              //   <span className="empty_screen_text">
              //     You don't have any active job yet
              //   </span>
              //   <button
              //     className="empty_screen_button"
              //     onClick={() => history.push("/post-new-job")}
              //   >
              //     Post a job
              //   </button>
              // </div>
            )}
      </div>
    </React.Fragment>
  );
};

export default withRouter(ActiveJobs);
