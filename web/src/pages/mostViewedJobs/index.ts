import { connect } from 'react-redux'
import MostViewedJobsComponent from './mostViewedJobs';

const mapStateToProps = (state: any) => {
    return {
        jobDataWithJobTypeLatLong: state.homeSearch.jobDataWithJobTypeLatLong,
    }
}

const MostViewedJobs = connect(
    mapStateToProps,
    null
)(MostViewedJobsComponent)

export default MostViewedJobs;