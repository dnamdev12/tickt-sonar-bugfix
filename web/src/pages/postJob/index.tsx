import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import PostJobComponent from './postJob';
import { callTradeList } from '../../redux/auth/actions';
import { updateMileStoneIndex,callCategories, updateMileStoneTimings, updateDetailScreen } from '../../redux/jobs/actions';
import { getProfileBuilder } from '../../redux/profile/actions'



const mapStateToProps = (state: any) => {
  return {
    tradeListData: state.auth.tradeListData,
    editMilestoneId: state.jobs.editMilestoneId,
    editMilestoneTiming: state.jobs.editMilestoneTiming,
    editDetailPage: state.jobs.editDetailPage,
    isLoading: state.common.isLoading,
    builderProfile:state.profile.builderProfile
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    callTradeList,
    callCategories,
    updateMileStoneIndex,
    updateMileStoneTimings,
    updateDetailScreen,
    getProfileBuilder
  }, dispatch);
}

const PostJob = connect(
  mapStateToProps,
  mapDispatchToProps
)(PostJobComponent)

export default PostJob;
