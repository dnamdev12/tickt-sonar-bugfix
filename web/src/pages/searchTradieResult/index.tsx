import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import SearchResultTradie from './searchResultTradie';
import { callTradeList } from './../../redux/auth/actions';
import {
    getJobWithJobTypeLatLong,
    getJobTypeList,
    getRecentSearchList,
    postHomeSearchData,
} from '../../redux/homeSearch/actions';
import { isHandleChanges } from '../../redux/jobs/actions';

const mapStateToProps = (state: any) => {
    return {
        jobDataWithJobTypeLatLong: state.homeSearch.jobDataWithJobTypeLatLong,
        jobTypeListData: state.homeSearch.jobTypeListData,
        tradeListData: state.auth.tradeListData,
        homeSearchJobData: state.homeSearch.homeSearchJobData,
        localChanges:state.jobs.localChanges,
        isLoading:state.common.isLoading
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getJobWithJobTypeLatLong,
        getJobTypeList,
        callTradeList,
        getRecentSearchList,
        postHomeSearchData,
        isHandleChanges
    }, dispatch);
}

const SearchResultFilters = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchResultTradie)

export default SearchResultFilters;