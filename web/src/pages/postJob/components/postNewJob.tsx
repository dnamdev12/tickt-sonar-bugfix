import React, { useEffect, useState } from "react";
import Constants from "../../../utils/constants";
import { useLocation } from "react-router-dom";
//@ts-ignore
import _ from "lodash";
//@ts-ignore
import "quill/dist/quill.snow.css"; // Add css for snow theme

interface Proptypes {
  data: any;
  jobUpdateParam?: any;
  editDetailPage: any;
  stepCompleted: boolean;
  handleStepComplete: (data: any) => void;
  handleStepJustUpdate: (data: any, goto: any) => void;
  handleStepForward: (data: any) => void;
}

const PostNewJob = ({
  data,
  jobUpdateParam,
  editDetailPage,
  stepCompleted,
  handleStepJustUpdate,
  handleStepForward,
  handleStepComplete,
}: Proptypes) => {
  const [basicDetails, setBasicDetails] = useState<{ [index: string]: string }>(
    { jobName: "", job_description: "" }
  );
  const [errors, setErrors] = useState({ jobName: "", job_description: "" });
  const [continueClicked, setContinueClicked] = useState(false);
  const { jobName, job_description } = basicDetails;

  let location = useLocation();
  let jobId: any = null;
  let update: any = null;
  if (location.search) {
    let urlParams = new URLSearchParams(location.search);
    jobId = urlParams.get("jobId");
    update = urlParams.get("update");
  }

  useEffect(() => {
    if (stepCompleted) {
      setBasicDetails({
        jobName: data?.jobName,
        job_description: data?.job_description,
      });
    }
  }, [stepCompleted, data]);

  // for error messages
  const label: { [index: string]: string } = {
    jobName: "Job Name",
    job_description: "Job Details",
  };

  const isInvalid = (name: string, value: string) => {
    switch (name) {
      case "jobName":
        return !value.length
          ? `${label[name]} is required.`
          : value.length > 100
          ? "Maximum 100 characters are allowed."
          : "";
      case "job_description":
        return !value.length
          ? `${label[name]} is required.`
          : value.length > 1000
          ? "Maximum 1000 characters are allowed."
          : "";
    }
  };

  const capitalize = (str: any) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleChange = ({
    target: { value, name },
  }: {
    target: { value: string; name: string };
  }) => {
    let valueElem: any = value.trimLeft();
    let alphaNumericPunctuation =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890~!@#$%^&*()_+=-`{}|[]:;<>?,./";
    if (name === "jobName" || name === "job_description") {
      if (name === "jobName") {
        valueElem = valueElem.replace(alphaNumericPunctuation, "");
      }
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: isInvalid(name, valueElem),
    }));
    setBasicDetails((prevDetails) => ({
      ...prevDetails,
      [name]: valueElem,
    }));
  };

  const handleContinue = () => {
    let hasErrors;

    if (!continueClicked) {
      setContinueClicked(true);

      hasErrors = Object.keys(basicDetails).reduce((prevError, name) => {
        const hasError = !!isInvalid(name, basicDetails[name]);

        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: isInvalid(name, basicDetails[name]),
        }));

        return hasError || prevError;
      }, false);
    }

    if (!hasErrors) {
      if (editDetailPage?.currentScreen) {
        handleStepJustUpdate(basicDetails, true);
      } else {
        handleStepComplete(basicDetails);
      }
    } else {
      setContinueClicked(false);
    }
  };

  const checkErrors = () => {
    let error_1 = isInvalid("jobName", basicDetails["jobName"]);
    if (!error_1?.length) {
      return false;
    }
    return true;
  };

  console.log({ jobUpdateParam, jobId });
  return (
    <div className="app_wrapper">
      <div className="section_wrapper">
        <div className="custom_container">
          <div className="form_field">
            <div className="flex_row">
              <div className="flex_col_sm_5">
                {editDetailPage?.currentScreen ? (
                  <React.Fragment>
                    <div className="relate">
                      <button
                        className="back"
                        onClick={() => {
                          handleStepForward(14);
                        }}
                      ></button>
                      <span className="title">
                        {!jobUpdateParam && jobId
                          ? "Republish a job"
                          : update
                          ? "Update job"
                          : "Post new job"}
                      </span>
                    </div>
                    <p className="commn_para">
                      Write the job name and try to describe all details for
                      better comprehension.
                    </p>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <span className="title">
                      {!jobUpdateParam && jobId
                        ? "Republish a job"
                        : update
                        ? "Update job"
                        : "Post new job"}
                    </span>
                    <p className="commn_para">
                      Write the job name and try to describe all details for
                      better comprehension.
                    </p>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>

          <div className="flex_row">
            <div className="flex_col_sm_5">
              <div className="form_field">
                <span className="xs_sub_title">Job</span>
              </div>
              <div className="form_field">
                <label className="form_label">Job Name</label>
                <div className="text_field">
                  <input
                    type="text"
                    placeholder="Enter Job Name"
                    name="jobName"
                    value={jobName}
                    onChange={handleChange}
                  />
                </div>
                <span className="error_msg">{errors.jobName}</span>
              </div>
              <div className="form_field">
                <label className="form_label">Job Description</label>
                <div className="text_field">
                  <textarea
                    placeholder="Please give a general description of your job."
                    name="job_description"
                    value={job_description}
                    onChange={handleChange}
                    maxLength={1000}
                    onBlur={() => {
                      if (job_description?.length) {
                        let stringItem = job_description;
                        if (job_description) {
                          stringItem = job_description.split(". ").join(". ");
                        }
                        stringItem = stringItem
                          .split(".")
                          .map(capitalize)
                          .join(".");
                        stringItem = stringItem
                          .split(". ")
                          .map(capitalize)
                          .join(". ");
                        setBasicDetails((prev: any) => ({
                          ...prev,
                          job_description: stringItem,
                        }));
                      }
                    }}
                  />
                  {job_description.length ? (
                    <span className="char_count">
                      {`character length : ${job_description.length} / 1000`}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <span className="error_msg">{errors.job_description}</span>
              </div>
              <div className="form_field">
                <button
                  className={`fill_btn full_btn btn-effect ${
                    checkErrors() ? "disable_btn" : ""
                  }`}
                  onClick={handleContinue}
                >
                  {"Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostNewJob;
