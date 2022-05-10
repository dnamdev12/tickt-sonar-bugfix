import React from "react";
import templateImage from "../../../.././assets/images/job-posted-bg.jpg";
import { withRouter } from "react-router-dom";

const quoteAccept = (props: any) => {
  const location = props.location;
  console.log({ location });
  return (
    <div className="img_text_wrap">
      <figure className="full_image">
        <img src={templateImage} alt="template-item" loading="eager" />
        <div className="short_info">
          <div className="content">
            <h1 className="title">Quote accepted!</h1>
            <span className="show_label">
              {
                "You have accepted a quote. You will be find the job in your active jobs tab."
              }
            </span>
            <div className="btn_wrapr">
              <button
                onClick={() => {
                  props.history.push("/");
                }}
                className="fill_btn btn-effect"
              >
                {"OK"}
              </button>
            </div>
          </div>
        </div>
      </figure>
    </div>
  );
};

export default withRouter(quoteAccept);
