import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import SearchResultFiltersComponent from './searchResultFilters';
import { callTradeList } from './../../redux/auth/actions';
import {
    getJobWithJobTypeLatLong,
    getJobTypeList
} from '../../redux/homeSearch/actions';

const mapStateToProps = (state: any) => {
    return {
        jobDataWithJobTypeLatLong: state.homeSearch.jobDataWithJobTypeLatLong,
        jobTypeListData: state.homeSearch.jobTypeListData,
        tradeListData: state.auth.tradeListData,
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getJobWithJobTypeLatLong,
        getJobTypeList,
        callTradeList
    }, dispatch);
}

const SearchResultFilters = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchResultFiltersComponent)

export default SearchResultFilters;