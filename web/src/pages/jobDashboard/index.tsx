import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import JobDashboard from './jobDashboard';
import {
  getActiveJobList,
  getAppliedJobList,
  getPastJobList,
  getNewJobList,
  getApprovedMilestoneList,
  getMilestoneList,
  markMilestoneComplete,
  resetActiveJobList,
  resetAppliedJobList,
  resetPastJobList,
  resetNewJobList,
  resetApprovedMilestoneList,
} from '../../redux/jobs/actions';
import {
  getBankDetails,
  addBankDetails,
  updateBankDetails,
  removeBankDetails,
} from '../../redux/profile/actions';

const mapStateToProps = (state: any) => {
  const {
    jobs: {
      activeJobList,
      appliedJobList,
      pastJobList,
      newJobList,
      approvedMilestoneList,
      milestonesCount,
      newJobsCount,
      milestoneList,
    },
    profile: {
      bankDetails,
    },
    common: {
      isLoading: loading,
    }
  } = state;

  return {
    activeJobList,
    appliedJobList,
    pastJobList,
    newJobList,
    approvedMilestoneList,
    milestoneList,
    milestonesCount,
    newJobsCount,
    bankDetails,
    loading,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getActiveJobList,
      getAppliedJobList,
      getPastJobList,
      getNewJobList,
      getApprovedMilestoneList,
      getMilestoneList,
      getBankDetails,
      addBankDetails,
      updateBankDetails,
      removeBankDetails,
      markMilestoneComplete,
      resetActiveJobList,
      resetAppliedJobList,
      resetPastJobList,
      resetNewJobList,
      resetApprovedMilestoneList,
    },
    dispatch
  );
};

const JobDashboardPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(JobDashboard);

export default JobDashboardPage;
