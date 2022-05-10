import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import JobDetailsPageComponent from './jobDetailsPage';
import {
    getHomeSaveJob,
} from '../../redux/homeSearch/actions';

const mapStateToProps = () => {
    return {
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getHomeSaveJob,
    }, dispatch);
}

const JobDetailsPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(JobDetailsPageComponent)

export default JobDetailsPage;