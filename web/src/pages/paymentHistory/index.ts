import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import PaymentHistoryComponent from './paymentHistory';
import {
  getPaymentHistory,
  getPaymentDetails,
} from '../../redux/profile/actions';

const mapStateToProps = (state: any) => {
    const { profile: { paymentHistory, paymentDetails, searching }, common: { isLoading } } = state;

    return {
      isLoading,
      searching,
      paymentHistory,
      paymentDetails,
    };
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
      getPaymentHistory,
      getPaymentDetails,
    }, dispatch);
}

const PaymentHistory = connect(
    mapStateToProps,
    mapDispatchToProps
)(PaymentHistoryComponent)

export default PaymentHistory;