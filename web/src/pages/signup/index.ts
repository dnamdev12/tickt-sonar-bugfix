import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SignupComponent from './signup';
import { callTradeList } from './../../redux/auth/actions';

const mapStateToProps = (state: any) => {
  return {
    tradeListData: state.auth.tradeListData,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ callTradeList }, dispatch);
};

const Signup = connect(mapStateToProps, mapDispatchToProps)(SignupComponent);

export default Signup;
