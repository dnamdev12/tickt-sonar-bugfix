import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HeaderComponent from './header';
import { recallHeaderNotification } from '../../redux/homeSearch/actions';
import {
    callTradieProfileData,
    getProfileBuilder
} from '../../redux/profile/actions';
import {
    callTradeList
} from '../../redux/auth/actions';

const mapStateToProps = (state: any) => {
    return {
        tradieProfileData: state.profile.tradieProfileData,
        builderProfile: state.profile.builderProfile,
        userType: state.profile.userType,
        tradeListData: state.auth.tradeListData,
        recallHeaderNotif: state.homeSearch.recallHeaderNotif,
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        callTradeList,
        callTradieProfileData,
        getProfileBuilder,
        recallHeaderNotification,
    }, dispatch);
}

const Header = connect(
    mapStateToProps,
    mapDispatchToProps
)(HeaderComponent)

export default Header;