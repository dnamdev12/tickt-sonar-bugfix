import React, { useState } from "react";
import { addTemplate } from "../../../redux/jobs/actions";
interface Proptypes {
  data: any;
  milestones: any;
  stepCompleted: Boolean;
  handleStepComplete: (data: any) => void;
  handleStepForward: (data: any) => void;
  handleCombineMileStones: (data: any) => void;
  handleStepBack: () => void;
}

const SaveTemplate = ({
  milestones,
  handleCombineMileStones,
  handleStepForward,
}: Proptypes) => {
  const [templateName, setTemplateName] = useState("" as any);
  const [error, setError] = useState("" as any);

  const checkError = () => {
    if (!error?.length && templateName?.length) {
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!templateName?.length) {
      setError("Template name is required.");
      return;
    }
    let filter_milestone = milestones.filter((item: any) => {
      if (Object.keys(item).length) {
        if (!item?.to_date?.length) {
          delete item.to_date;
        }

        if (!item?.from_date?.length || item?.from_date === "Invalid date") {
          delete item.from_date;
        }

        return item;
      }
    });

    let { success } = await addTemplate({
      template_name: templateName,
      milestones: filter_milestone,
    });
    if (success) {
      handleCombineMileStones([]);
      handleStepForward(11);
    }
  };

  const handleChange = (value: any) => {
    if (templateName?.length && templateName?.length > 50) {
      setError("Maximum 50 characters are allowed.");
    } else {
      setError("");
    }
    setTemplateName(value.trimLeft().replace(/[^a-zA-Z|0-9 ]/g, ""));
  };
  return (
    <div className="app_wrapper">
      <div className="section_wrapper">
        <div className="custom_container">
          <div className="form_field">
            <div className="flex_row">
              <div className="flex_col_sm_5">
                <div className="relate">
                  <button
                    onClick={() => {
                      handleStepForward(6);
                    }}
                    className="back"
                  ></button>
                  <span className="title">Save as template</span>
                </div>
                <p className="commn_para">
                  {"Add template name. It will be stored in your profile"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex_row">
            <div className="flex_col_sm_5">
              <div className="form_field">
                <label className="form_label">Template Name</label>
                <div className="text_field">
                  <input
                    onChange={(e) => {
                      handleChange(e.target.value);
                    }}
                    value={templateName}
                    type="text"
                    placeholder="This job..."
                    name="name"
                  />
                </div>
                <span className="error_msg">{error}</span>
              </div>
              <div className="form_field">
                <button
                  onClick={handleContinue}
                  className={`fill_btn full_btn btn-effect ${
                    checkError() ? "disable_btn" : ""
                  }`}
                >
                  {"Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveTemplate;
