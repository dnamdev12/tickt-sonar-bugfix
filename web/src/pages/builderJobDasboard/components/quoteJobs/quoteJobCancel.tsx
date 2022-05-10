import React from 'react';
import templateImage from '../../../.././assets/images/job-posted-bg.jpg';
import { withRouter, useLocation } from 'react-router-dom';
import { closeQuoteJob } from '../../../../redux/quotes/actions'


const QuoteJobCancel = (props: any) => {
  let location = useLocation();
  let urlParams = new URLSearchParams(location.search);
  let jobId = urlParams.get('jobId');
  let tradieId = urlParams.get('tradieId');

  const cancelJob = async () => {
    let data = { jobId, tradieId };
    let response = await closeQuoteJob(data);
    if (response.success) {
      props.history.push('/jobs?active=past');
    }
  }

  return (
    <div className="img_text_wrap">
      <figure className="full_image">
        <img src={templateImage} alt="template-item" loading="eager" />
        <div className="short_info">
          <div className="content">
            <h1 className="title">
              {'Job Cancelled'}
            </h1>
            <span className="show_label">
              {'Your job for quoting has just being cancelled. Do you want to close the job or keep it open for new bidders?'}
            </span>

            <div className="form_field">
              <button
                onClick={cancelJob}
                className="fill_btn full_btn btn-effect">
                {`Close the job`}
              </button>
            </div>

            <div className="form_field">
              <button
                onClick={() => props.history.push(`/post-new-job?jobId=${jobId}`)}
                className="fill_grey_btn full_btn btn-effect">
                {'Keep the job open'}
              </button>
            </div>

          </div>
        </div>
      </figure>
    </div>
  )
}

export default withRouter(QuoteJobCancel);