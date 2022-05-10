import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import templateImage from '../../../../assets/images/cancel-job-bg.png';

const DeclineMilestoneSuccess = (props: any) => {
  return (
    <div className="img_text_wrap">
      <figure className="full_image">
        <img src={templateImage} alt="template-item" loading="eager" />
        <div className="short_info">
          <div className="content">
            <h1 className="title">
            {'Got it!'}
            </h1>
            <span className="show_label">
              {`We’ll send it to your ${props.userType === 1 ? 'builder' : 'tradesperson'}. Why not check out new recommended jobs on the homepage.`}
            </span>
            <div className="btn_wrapr">
              <button
                onClick={() => {
                  props.history.push('/');
                }}
                className="fill_btn btn-effect">
                {'OK'}
              </button>
            </div>
          </div>
        </div>
      </figure>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    userType: state.profile.userType
  }
}

export default withRouter(connect(mapStateToProps, null)(DeclineMilestoneSuccess));