import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import SavedJobsComponent from './savedJobs';
import { getSavedJobList, clearSavedJobList } from '../../redux/profile/actions';

const mapStateToProps = (state: any) => {
    return {
        jobDataWithJobTypeLatLong: state.homeSearch.jobDataWithJobTypeLatLong,
        savedJobs: state.profile.savedJobs,
        isLoading: state.common.isLoading,
    }
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
      {
          getSavedJobList,
          clearSavedJobList,
      },
      dispatch
  );
};


const SavedJobs = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SavedJobsComponent)

export default SavedJobs;