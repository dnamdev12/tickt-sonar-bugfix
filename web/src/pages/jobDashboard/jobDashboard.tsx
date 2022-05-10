import { useState } from 'react';
import { NavLink, Route, Switch, useHistory, useLocation } from 'react-router-dom';

import ActiveJobsPage from './components/activeJobs';
import AppliedJobsPage from './components/appliedJobs';
import PastJobsPage from './components/pastJobs';
import NewJobsPage from './components/newJobs';
import ApprovedMilestonesPage from './components/approvedMilestones';
import MarkMilestonePage from './components/markMilestone';
import ReviewBuilder from './components/reviewBuilder/reviewBuilder';
import QuoteOuter from './components/quoteJobs/quoteOuter';
import ActiveQuoteOuter from './components/activeQuoteJob/activeQuoteOuter';

import menu from '../../assets/images/menu-line-blue.png';
import close from '../../assets/images/ic-cancel-blue.png';
import templateImage from '../../assets/images/job-complete-bg.png';
import tickIcon from '../../assets/images/tick.svg';
interface Proptypes {
  loading: boolean,
  getActiveJobList: (page: number) => void;
  activeJobList: Array<any>;
  getAppliedJobList: (page: number) => void;
  appliedJobList: Array<any>;
  getPastJobList: (page: number) => void;
  pastJobList: Array<any>;
  getNewJobList: (page: number) => void;
  newJobList: Array<any>;
  getApprovedMilestoneList: (page: number) => void;
  approvedMilestoneList: Array<any>;
  getMilestoneList: (jobId: string) => void;
  milestoneList: any;
  milestonesCount: number;
  newJobsCount?: number;
  addBankDetails: (data: any) => void;
  updateBankDetails: (data: any) => void;
  getBankDetails: () => void;
  removeBankDetails: () => void;
  markMilestoneComplete: (data: any, callback: (jobCompletedCount: number) => void) => void;
  bankDetails: any;
  resetActiveJobList: () => void;
  resetAppliedJobList: () => void;
  resetPastJobList: () => void;
  resetNewJobList: () => void;
  resetApprovedMilestoneList: () => void;
}

const JobDashboard = ({
  loading,
  getActiveJobList,
  activeJobList,
  getAppliedJobList,
  appliedJobList,
  getPastJobList,
  pastJobList,
  getNewJobList,
  newJobList,
  getApprovedMilestoneList,
  approvedMilestoneList,
  getMilestoneList,
  milestoneList,
  milestonesCount,
  newJobsCount,
  addBankDetails,
  updateBankDetails,
  getBankDetails,
  removeBankDetails,
  markMilestoneComplete,
  bankDetails,
  resetActiveJobList,
  resetAppliedJobList,
  resetPastJobList,
  resetNewJobList,
  resetApprovedMilestoneList,
}: Proptypes) => {
  const history = useHistory();
  const { pathname } = useLocation();

  let params: any = new URLSearchParams(history.location?.search);
  params = {
    jobId: params.get('jobId'),
    tradeId: params.get('tradeId'),
    specializationId: params.get('specializationId'),
  };

  const [openSidebar, setOpenSidebar] = useState(false);
  const [milestoneComplete, setMilestoneComplete] = useState(false);
  const [jobComplete, setJobComplete] = useState<boolean | number>(false);

  const jobCompleteCount = jobComplete && `${jobComplete}${`${jobComplete}`.endsWith('1') ? 'st' : `${jobComplete}`.endsWith('2') ? 'nd' : `${jobComplete}`.endsWith('3') ? 'rd' : 'th'}`;

  return milestoneComplete ? (
    <div className="img_text_wrap">
      <figure className="full_image">
        <img src={templateImage} alt="template-image" />
        <div className="short_info">
          <div className="content">
            <h1 className="title">Milestone is completed!</h1>
            <span className="show_label">
              Nice one! The builder will review any required photos and approve
              your milestone shortly.
            </span>
            <img className="tick_img" src={tickIcon} />
            <div className="btn_wrapr">
              <button
                className="fill_btn btn-effect"
                onClick={() => {
                  history.push(
                    `/mark-milestone?jobId=${params.jobId}&redirect_from=jobs`
                  );
                  setMilestoneComplete(false);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </figure>
    </div>
  ) : !!jobComplete ? (
    <div className="img_text_wrap">
      <figure className="full_image">
        <img src={templateImage} alt="template-image" />
        <div className="short_info">
          <div className="content">
            <h1 className="title">Your {jobCompleteCount} job is completed!</h1>
            <span className="show_label">
              You have completed your {jobCompleteCount} Job using Tickt! Click
              here to view your completed jobs or leave a review. You will be
              paid as soon as the builder signs off.
            </span>
            {/* <img className="tick_img" src={tickIcon} /> */}
            <div className="btn_wrapr">
              <button
                className="fill_btn btn-effect"
                onClick={() => {
                  history.push(
                    `/mark-milestone?jobId=${params.jobId}&redirect_from=jobs`
                  );
                  setJobComplete(false);
                }}
              >
                OK
              </button>
              <button
                className="fill_btn white_btn"
                onClick={() => {
                  history.push("/past-jobs");
                  setJobComplete(false);
                }}
              >
                See completed jobs
              </button>
            </div>
          </div>
        </div>
      </figure>
    </div>
  ) : (
    <div className="app_wrapper">
      <div className="custom_container">
        <span
          className="mob_side_nav"
          onClick={() => setOpenSidebar(!openSidebar)}
        >
          <img src={menu} alt="mob-side-nav" />
        </span>
        <div className="f_row h-100">
          <div className={`side_nav_col${openSidebar ? " active" : ""}`}>
            <button className="close_nav" onClick={() => setOpenSidebar(false)}>
              <img src={close} alt="close" />
            </button>
            <div className="stick">
              <span className="title">Job Dashboard</span>
              <ul className="dashboard_menu">
                <li>
                  <NavLink
                    className="icon star"
                    to="/active-jobs"
                    isActive={() =>
                      [
                        "/active-jobs",
                        "/mark-milestone",
                        "/active-quote-job",
                      ].includes(pathname)
                    }
                  >
                    <span className="menu_txt">Active</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="icon applied"
                    to="/applied-jobs"
                    isActive={() =>
                      ["/applied-jobs", "/quote-job"].includes(pathname)
                    }
                  >
                    <span className="menu_txt">Applied</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink className="icon past" to="/past-jobs">
                    <span className="menu_txt">Past</span>
                  </NavLink>
                </li>
                {/* <hr></hr> */}
                <li>
                  <NavLink className="icon new" to="/new-jobs">
                    <span className="menu_txt">
                      New
                      {!!newJobsCount && (
                        <span className="badge_count">
                          {newJobsCount > 9 ? "9+" : newJobsCount}
                        </span>
                      )}
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink className="icon approved" to="/approved-milestones">
                    <span className="menu_txt">
                      Approved Milestones
                      {!!milestonesCount && (
                        <span className="badge_count">
                          {milestonesCount > 9 ? "9+" : milestonesCount}
                        </span>
                      )}
                    </span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          {/* <div className="detail_col"> */}
          <>
            <Switch>
              <Route
                path="/active-jobs"
                render={(props) => (
                  <ActiveJobsPage
                    {...props}
                    key={props.location.key}
                    loading={loading}
                    getActiveJobList={getActiveJobList}
                    resetActiveJobList={resetActiveJobList}
                    activeJobList={activeJobList}
                  />
                )}
              />
              <Route
                path="/applied-jobs"
                render={(props) => (
                  <AppliedJobsPage
                    {...props}
                    key={props.location.key}
                    loading={loading}
                    appliedJobList={appliedJobList}
                    getAppliedJobList={getAppliedJobList}
                    resetAppliedJobList={resetAppliedJobList}
                  />
                )}
              />
              <Route
                path="/past-jobs"
                render={(props) => (
                  <PastJobsPage
                    {...props}
                    key={props.location.key}
                    loading={loading}
                    pastJobList={pastJobList}
                    getPastJobList={getPastJobList}
                    resetPastJobList={resetPastJobList}
                  />
                )}
              />
              <Route
                path="/new-jobs"
                render={(props) => (
                  <NewJobsPage
                    {...props}
                    key={props.location.key}
                    loading={loading}
                    newJobList={newJobList}
                    getNewJobList={getNewJobList}
                    resetNewJobList={resetNewJobList}
                  />
                )}
              />
              <Route
                path="/approved-milestones"
                render={(props) => (
                  <ApprovedMilestonesPage
                    {...props}
                    key={props.location.key}
                    loading={loading}
                    approvedMilestoneList={approvedMilestoneList}
                    getApprovedMilestoneList={getApprovedMilestoneList}
                    resetApprovedMilestoneList={resetApprovedMilestoneList}
                  />
                )}
              />
              <Route
                path="/mark-milestone"
                render={(props) => (
                  <MarkMilestonePage
                    getMilestoneList={getMilestoneList}
                    milestoneList={milestoneList}
                    showMilestoneCompletePage={() => setMilestoneComplete(true)}
                    showJobCompletePage={(jobCompletedCount) =>
                      setJobComplete(jobCompletedCount)
                    }
                    getBankDetails={getBankDetails}
                    addBankDetails={addBankDetails}
                    updateBankDetails={updateBankDetails}
                    removeBankDetails={removeBankDetails}
                    markMilestoneComplete={markMilestoneComplete}
                    bankDetails={bankDetails}
                    {...props}
                  />
                )}
              />
              <Route
                path="/quote-job"
                render={(props) => <QuoteOuter {...props} />}
              />
              <Route
                path="/active-quote-job"
                render={(props) => <ActiveQuoteOuter {...props} />}
              />
              <Route
                path="/review-builder"
                render={(props) => (
                  <ReviewBuilder {...props} history={history} />
                )}
              />
            </Switch>
          </>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default JobDashboard;
