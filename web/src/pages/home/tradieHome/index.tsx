import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import TradieHomeComponent from './tradieHome';
import {
    getSearchJobList,
    getRecentSearchList,
    getJobTypeList,
    getJobWithJobTypeLatLong,
} from '../../../redux/homeSearch/actions';

const mapStateToProps = (state: any) => {
    return {
        isLoading: state.common.isLoading,
        searchJobListData: state.homeSearch.searchJobListData,
        jobTypeListData: state.homeSearch.jobTypeListData,
        jobDataWithJobTypeLatLong: state.homeSearch.jobDataWithJobTypeLatLong,
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getJobTypeList,
        getJobWithJobTypeLatLong,
        getSearchJobList,
        getRecentSearchList,
    }, dispatch);
}

const TradieHome = connect(
    mapStateToProps,
    mapDispatchToProps
)(TradieHomeComponent)

export default TradieHome