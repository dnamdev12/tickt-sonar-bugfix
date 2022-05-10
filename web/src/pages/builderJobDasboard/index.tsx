import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import JobDashboard from './jobDashboard';
import {
  getActiveJobsBuilder,
  getPastJobsBuilder,
  getOpenJobsBuilder,
  getNewApplicantsBuilder,
  getnewJobApplicationListBuilder,
  getNewApprovalList,
  getClearJobs,
} from "../../redux/jobs/actions";
import { recallHeaderNotification } from '../../redux/homeSearch/actions';


const mapStateToProps = (state: any) => {
    console.log({ state });
    const {
        jobs: {
            builderActionJobs,
            builderOpenJobs,
            builderPastJobs,
            builderNewApplicants,
            builderNewApplicantsList,
            newApprovalList
        },
    } = state;
    return {
        activeJobs: builderActionJobs,
        openJobs: builderOpenJobs,
        pastJobs: builderPastJobs,
        applicantJobs: builderNewApplicants,
        approvalJobs: newApprovalList,
        applicantsListJobs: builderNewApplicantsList,
        isLoading: state.common.isLoading
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators(
        {
            getClearJobs,
            getActiveJobsBuilder,
            getPastJobsBuilder,
            getOpenJobsBuilder,
            getNewApplicantsBuilder,
            getnewJobApplicationListBuilder,
            getNewApprovalList,
            recallHeaderNotification,
        },
        dispatch
    );
};

const JobDashboardPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(JobDashboard);

export default JobDashboardPage;
