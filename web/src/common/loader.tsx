import { connect } from 'react-redux';
import loader from '../assets/images/loader.gif';

const Loader = (props: any) => {
  // Add active class next to loader class to show loader
  return (
    <div className={`loader ${props.isLoading ? 'active' : ''}`}>
      <figure>
        <img src={loader} alt="loader" />
      </figure>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    isLoading: state.common.isLoading,
  }
}

export default connect(mapStateToProps)(Loader);
