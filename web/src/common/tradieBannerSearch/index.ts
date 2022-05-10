import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import BannerSearchComponent from './tradieBannerSearch';
import {
    getSearchJobList,
    getRecentSearchList,
    postHomeSearchData,
    getRecentLocationList
} from '../../redux/homeSearch/actions';

const mapStateToProps = (state: any) => {
    return {
        searchJobListData: state.homeSearch.searchJobListData,
        recentSearchJobData: state.homeSearch.recentSearchJobData,
        homeSearchJobData: state.homeSearch.homeSearchJobData,
        recentLocationData: state.homeSearch.recentLocationData,
        tradeListData: state.auth.tradeListData,
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getSearchJobList,
        getRecentSearchList,
        getRecentLocationList,
        postHomeSearchData
    }, dispatch);
}

const BannerSearch = connect(
    mapStateToProps,
    mapDispatchToProps
)(BannerSearchComponent)

export default BannerSearch