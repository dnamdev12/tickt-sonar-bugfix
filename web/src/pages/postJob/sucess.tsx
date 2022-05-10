import React, { useState, useEffect } from "react";
import { setLoading } from "../../redux/common/actions";
import templateImage from "../../assets/images/job-posted-bg.jpg";

interface Proptypes {
  data: any;
  history: any;
  editDetailPage: any;
  templateImage: any;
  stepCompleted: boolean;
  handleStepComplete: (data: any) => void;
  handleStepForward: (data: any) => void;
  handleStepBack: () => void;
}

const JobPostedSuccess = ({ history }: Proptypes) => {
  const [isLoad, setImageLoad] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    if (!isLoad) {
      setLoading(false);
    }
  }, [isLoad]);

  return (
    <div className="img_text_wrap">
      <figure className="full_image">
        <img
          src={
            templateImage ||
            "https://appinventiv-development.s3.amazonaws.com/1624879540474job-posted-bg.jpg"
          }
          alt="template"
          loading="eager"
          onLoad={() => {
            setImageLoad(false);
          }}
        />

        <div className="short_info">
          <div className="content">
            <h1 className="title">Job posted!</h1>
            <span className="show_label">
              Your job will be sent to the most suitable candidates in your
              area.
            </span>
            <button
              onClick={() => {
                if (history) {
                  history.push("/");
                  // handleStepForward(1)
                }
              }}
              className="fill_btn full_btn btn-effect"
            >
              OK
            </button>
          </div>
        </div>
      </figure>
    </div>
  );
};

export default JobPostedSuccess;
