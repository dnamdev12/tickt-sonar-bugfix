import React from 'react';
import templateImage from '../../../assets/images/job-complete-bg.png';
import { withRouter } from 'react-router-dom';

const DeclineMilestoneSuccess = (props: any) => {
    return (
        <div className="img_text_wrap">
      <figure className="full_image">
        <img src={templateImage} alt="template-image" />
        <div className="short_info">
          <div className="content">
            <h1 className="title">Got it!</h1>
            <span className="show_label">The tradesperson will review and get in touch with you. 
            </span>
            <div className="btn_wrapr">
              <button
              onClick={() => {
                props?.history.push('/');
              }}
              className="fill_btn btn-effect">OK</button>
            </div>
          </div>
        </div>
      </figure>
    </div>
    )
}

export default withRouter(DeclineMilestoneSuccess);