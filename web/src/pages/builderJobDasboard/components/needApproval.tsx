import React, { Component } from "react";
import approved from "../../../assets/images/approved.png";
import jobTypePlaceholder from "../../../assets/images/job-type-placeholder.png";
import noDataFound from "../../../assets/images/no-search-data.png";
import waiting from "../../../assets/images/exclamation.png";
import MarkMilestones from "./markMilestones";

import { renderTime } from "../../../utils/common";

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
  tradeName: any;
  tradieId: any;
  tradeSelectedUrl: any;
  tradieImage: any;
}
interface State {
  isToggleApplicants: boolean;
  selectedIndex: any;
  localState: any;
  isRender: boolean;
}

interface Props {
  setJobLabel: any;
  dataItems: any;
  applicantsList?: any;
  jobType: any;
  history?: any;
  isLoading: any;
  activeType: any;
}

class NeedApproval extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isToggleApplicants: false,
      selectedIndex: "",
      localState: "",
      isRender: false,
    };
  }

  componentDidUpdate() {
    let nextProps = this.props;
    let isRender = this.state.isRender;
    if (nextProps?.isLoading === false) {
      if (!isRender) {
        this.setState({ isRender: true });
      }
    }
  }

  redirectToInfo = ({ jobId, status }: any) => {
    let props: any = this.props;
    if (jobId?.length && status?.length) {
      // let urlEncode: any = window.btoa(`?jobId=${jobId}&status=${status}&activeType=${props?.activeType || 'approval'}`)
      let urlEncode: any = `?jobId=${jobId}&status=${status}&activeType=${
        props?.activeType || "approval"
      }`;
      this.props.history.push(`/job-detail?${urlEncode}`);
    }
  };

  setToggle = () =>
    this.setState({ isToggleApplicants: !this.state.isToggleApplicants });

  resetStateLocal = () => {
    let activeType = this.props.activeType;
    this.setState(
      {
        localState: false,
      },
      () => {
        this.props.setJobLabel(activeType);
      }
    );
  };

  render() {
    const { dataItems, applicantsList, jobType, isLoading } =
      this.props;
    let listData: any = dataItems;
    let { isToggleApplicants, localState, selectedIndex, isRender } =
      this.state;
    console.log({ applicantsList, isToggleApplicants });

    if (localState && selectedIndex !== null) {
      return (
        <MarkMilestones
          resetStateLocal={this.resetStateLocal}
          selectedIndex={selectedIndex}
          listData={listData}
        />
      );
    }

    if (!isRender) {
      return null;
    }

    let titleText = jobType.charAt(0).toUpperCase() + jobType.slice(1);
    return (
      <React.Fragment>
        <span className="sub_title">
          {titleText == "Approval" ? "Need Approval" : ""}
        </span>
        <div className="flex_row tradies_row">
          {listData?.length
            ? listData.map(
                (
                  {
                    amount,
                    jobName,
                    fromDate,
                    toDate,
                    milestoneNumber,
                    status,
                    timeLeft,
                    total,
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
                        onClick={() => {
                          this.setState({
                            localState: true,
                            selectedIndex: index,
                          });
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
                          <span className="name">{tradeName}</span>
                          <p className="commn_para">{jobName}</p>
                        </div>
                      </div>
                      <div className="job_info">
                        <ul>
                          <li className="icon dollar">{amount}</li>
                          <li className="">
                            <span>{total}</span>
                          </li>
                          <li className="icon calendar">
                            {renderTime(fromDate, toDate)}
                          </li>
                          <li className="">
                            <span>{timeLeft}</span>
                          </li>
                        </ul>
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
                            {status === "APPROVED" && (
                              <img src={approved} alt="icon" />
                            )}
                            {status === "NEEDS APPROVAL" && (
                              <img src={waiting} alt="icon" />
                            )}
                            {status === "NEED APPROVAL" && (
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
                        {(status === "NEED APPROVAL" ||
                          status === "NEEDS APPROVAL") && (
                          <button
                            onClick={() => {
                              this.setState({
                                localState: true,
                                selectedIndex: index,
                              });
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
                //   <figure className="no_img">
                //     <img src={newApprovals} alt="data not found" />
                //   </figure>

                //   <span className="empty_screen_text">
                //     You don't have any approval requests yet
                //   </span>
                //   <span className="empty_screen_subtext">
                //     As soon as someone will request your approval you will be
                //     notified
                //   </span>
                // </div>
              )}
        </div>
      </React.Fragment>
    );
  }
}

export default NeedApproval;
