import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Chat from './chat';

const mapStateToProps = (state: any) => {
    return {
        isLoading: state.common.isLoading,
        isSkeletonLoading: state.common.isSkeletonLoading,
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
    }, dispatch);
}

const ChatComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat)

export default ChatComponent;