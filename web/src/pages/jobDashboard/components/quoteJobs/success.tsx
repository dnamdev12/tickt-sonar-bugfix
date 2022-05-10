import { connect } from 'react-redux';
import { withRouter, useHistory } from "react-router-dom";

import templateImage from '../../../../assets/images/thanks-bg.jpg';

const QuoteSuccess = (props: any) => {
  const history: any = useHistory();
  console.log('history: ', history);

  return (
    <div className="img_text_wrap">
      <figure className="full_image">
        <img src={templateImage} alt="template-item" loading="eager" />
        <div className="short_info">
          <div className="content">
            <h1 className="title">
              {'Nice!'}
            </h1>
            <span className="show_label">
              {`Your quote has been sent to ${history.location?.state?.builderName}`}
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

export default withRouter(connect(mapStateToProps, null)(QuoteSuccess));