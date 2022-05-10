import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import SearchResultsComponent from './tradieSearchJobResult';
import {
    getJobWithJobTypeLatLong,
    getViewNearByJob,
    postHomeSearchData,
    resetViewNearByJobData,
    resetHomeSearchJobData
} from '../../redux/homeSearch/actions';

const mapStateToProps = (state: any) => {
    return {
        jobDataWithJobTypeLatLong: state.homeSearch.jobDataWithJobTypeLatLong,
        viewNearByJobData: state.homeSearch.viewNearByJobData,
        homeSearchJobData: state.homeSearch.homeSearchJobData,
        tradeListData: state.auth.tradeListData,
        jobTypeListData: state.homeSearch.jobTypeListData,
        isLoading: state.common.isLoading,
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getJobWithJobTypeLatLong,
        getViewNearByJob,
        postHomeSearchData,
        resetViewNearByJobData,
        resetHomeSearchJobData
    }, dispatch);
}

const TradieSearchJobResult = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchResultsComponent)

export default TradieSearchJobResult;