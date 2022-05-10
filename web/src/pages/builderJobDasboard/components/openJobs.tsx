import React, { Component } from "react";
import approved from "../../../assets/images/approved.png";
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
  total: any;
  totalmem: any;
  location: any;
  locationName: any;
  totalMilestones: any;
  tradieListData: any;
  quoteCount: any;
  quoteJob: any;
  tradeName: any;
  tradieId: any;
  tradeSelectedUrl: any;
  tradieImage: any;
}
interface State {
  isToggleApplicants: boolean;
  quotesData: any;
  toggleQuoteSort: boolean;
}

interface Props {
  setJobLabel: any;
  dataItems: any;
  applicantsList?: any;
  jobType: any;
  history?: any;
  isLoading: any;
  activeType?: any;
}

class OpenJobs extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isToggleApplicants: false,
      quotesData: [],
      toggleQuoteSort: true,
    };
  }

  redirectToInfo = ({ jobId, status }: any) => {
    let props: any = this.props;
    if (jobId?.length && status?.length) {
      let urlEncode: any = `?jobId=${jobId}&status=${status}&activeType=${props?.activeType}`;
      this.props.history.push(`/job-detail?${urlEncode}`);
    } else {
      let urlEncode: any = `?jobId=${jobId}&status=${"open"}&activeType=${
        props?.activeType
      }`;
      this.props.history.push(`/job-detail?${urlEncode}`);
    }
  };

  setToggle = () =>
    this.setState({ isToggleApplicants: !this.state.isToggleApplicants });

  render() {
    // props defined & render by params
    const { setJobLabel, dataItems, jobType, isLoading } =
      this.props;
    let listData: any = dataItems;
   
    if (isLoading) {
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
                  jobId,
                  jobName,
                  fromDate,
                  toDate,
                  milestoneNumber,
                  specializationId,
                  status,
                  timeLeft,
                  total,
                  totalMilestones,
                  tradeName,
                  quoteCount,
                  quoteJob,
                  tradieId,
                  tradeSelectedUrl,
                }: Active) => (
                  <div className="flex_col_sm_6">
                    <div
                      className="tradie_card"
                      data-aos="fade-in"
                      data-aos-delay="250"
                      data-aos-duration="1000"
                    >
                      <span
                        onClick={() => {
                          this.redirectToInfo({ jobId, status });
                        }}
                        className="more_detail circle"
                      ></span>
                      <div className="user_wrap">
                        <figure className="u_img icon">
                          <img
                            src={tradeSelectedUrl || jobTypePlaceholder}
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
                          <span className="name">{tradeName || "0"}</span>
                          <p className="commn_para">{jobName}</p>
                        </div>
                      </div>
                      <div className="job_info">
                        {quoteJob ? (
                          <ul>
                            <li className="icon dollar">{amount}</li>
                            <li className=""></li>
                            <li className="icon calendar">
                              {renderTime(fromDate, toDate)}
                            </li>
                            <li>
                              <span>{timeLeft}</span>
                            </li>
                          </ul>
                        ) : (
                          <ul>
                            <li className="icon dollar">{amount}</li>
                            <li className="">
                              <span>{total}</span>
                            </li>
                            <li className="icon calendar">
                              {renderTime(fromDate, toDate)}
                            </li>
                            <li>
                              <span>{timeLeft}</span>
                            </li>
                          </ul>
                        )}
                      </div>
                      <div
                        className="job_progress_wrap"
                        id="scroll-progress-bar"
                      >
                        <div className="progress_wrapper">
                          <span className="completed-digit" id="digit-progress">
                            <b>{`Job Milestones ${milestoneNumber} `}</b>
                            {`of ${totalMilestones}`}
                          </span>
                          <span className="approval_info">
                            {status === "Approved" && (
                              <img src={approved} alt="icon" />
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

                        {quoteJob ? (
                          <button
                            onClick={() => {
                              if (quoteCount?.length || quoteCount) {
                                this.props.setJobLabel("listQuote");
                                this.props.history.replace(
                                  `/jobs?active=open&quote=true&jobId=${jobId}`
                                );
                              }
                            }}
                            className="fill_grey_btn full_btn btn-effect"
                          >
                            {`${quoteCount} Quote${
                              quoteCount === 1 ? "" : "s"
                            }`}
                          </button>
                        ) : null}
                        {!quoteJob && tradieId?.length ? (
                          <button
                            onClick={() => {
                              this.setToggle();
                              setJobLabel(
                                "applicantList",
                                jobId,
                                1,
                                specializationId
                              );
                            }}
                            className="fill_grey_btn full_btn btn-effect"
                          >
                            {"Applications"}
                          </button>
                        ) : null}
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
                //       <img src={newJobs} alt="data not found" />
                //     </figure>
                //   </figure>

                //   <span className="empty_screen_text">
                //     You don't have any open job yet
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
  }
}

export default OpenJobs;
