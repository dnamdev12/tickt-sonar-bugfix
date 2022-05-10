import React from 'react';
import templateImage from '../../../../assets/images/job-complete-bg.png';
import { withRouter } from 'react-router-dom';


const DeclineMilestoneSuccess = (props: any) => {
  return (
    <div className="img_text_wrap">
      <figure className="full_image">
        <img src={templateImage} alt="template-item" loading="eager" />
        <div className="short_info">
          <div className="content">
            <h1 className="title">
              {'Request sent'}
            </h1>
            <span className="show_label">
              {'Your milestone change request has been sent to the tradesperson.'}
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

export default withRouter(DeclineMilestoneSuccess);