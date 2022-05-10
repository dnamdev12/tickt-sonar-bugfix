import { connect } from 'react-redux'
import RecommendedJobsComponent from './recommendedJobs';

const mapStateToProps = (state: any) => {
    return {
        jobDataWithJobTypeLatLong: state.homeSearch.jobDataWithJobTypeLatLong,
    }
}

const RecommendedJobs = connect(
    mapStateToProps,
    null
)(RecommendedJobsComponent)

export default RecommendedJobs;