import { connect } from 'react-redux'
import PopularBuildersComponent from './popularBuilders';

const mapStateToProps = (state: any) => {
    return {
        jobDataWithJobTypeLatLong: state.homeSearch.jobDataWithJobTypeLatLong,
    }
}

const PopularBuilders = connect(
    mapStateToProps,
    null
)(PopularBuildersComponent)

export default PopularBuilders;