import React, { useState } from "react";
import close from "../../../assets/images/icon-close-1.png";
import addMedia from "../../../assets/images/add-image.png";
import { onFileUpload } from "../../../redux/auth/actions";
import { setShowToast } from "../../../redux/common/actions";

import { moengage, mixPanel } from "../../../services/analyticsTools";
import { MoEConstants } from "../../../utils/constants";
interface Props {
  milestoneAcceptOrDecline: any;
  jobId: any;
  jobName: any;
  milestoneId: any;
  toggleBack: () => void;
  resetStateLocal: any;
}
const imageFormats: Array<any> = ["jpeg", "jpg", "png"];

const DeclineMilestone = ({
  milestoneAcceptOrDecline,
  toggleBack,
  jobId,
  jobName,
  milestoneId,
  resetStateLocal,
}: Props) => {
  const [reason, setReason] = useState("");
  const [filesUrl, setFilesUrl] = useState([] as any);
  const [localFiles, setLocalFiles] = useState({});
  const [update, forceUpdate] = useState({});

  const onSubmitDecline = async () => {
    if (!filesUrl?.length) {
      setShowToast(true, "Please attach at least one media file");
      return true;
    }

    let data = {
      status: 2,
      jobId: jobId,
      milestoneId: milestoneId,
      reason: reason,
      url: filesUrl.length ? filesUrl.map((file: any) => file.link) : [],
    };

    let response: any = await milestoneAcceptOrDecline(data);
    if (response?.success) {
      moengage.moE_SendEvent(MoEConstants.MILESTONE_DECLINED, {
        timeStamp: moengage.getCurrentTimeStamp(),
      });
      mixPanel.mixP_SendEvent(MoEConstants.MILESTONE_DECLINED, {
        timeStamp: moengage.getCurrentTimeStamp(),
      });
      resetStateLocal(true);
    }
  };

  const removeFromItem = (index: any) => {
    filesUrl.splice(index, 1);
    setFilesUrl(filesUrl);
    Array.isArray(update) ? forceUpdate([]) : forceUpdate({});
  };

  const onFileChange = async (e: any) => {
    const formData = new FormData();
    const newFile = e.target.files[0];

    if (filesUrl?.length === 6) {
      setShowToast(true, "Max files upload limit is 6");
      return;
    }

    var fileType = newFile?.type?.split("/")[1]?.toLowerCase();
    var selectedFileSize = newFile?.size / 1024 / 1024; // size in mib

    if (imageFormats.indexOf(fileType) < 0 || selectedFileSize > 10) {
      setShowToast(true, "The file must be in proper format or size");
      return;
    }

    if (imageFormats.includes(fileType) && selectedFileSize > 10) {
      // image validations
      setShowToast(true, "The image file size must be below 10 mb");
      return;
    }

    formData.append("file", newFile);
    const res = await onFileUpload(formData);
    if (res.success) {
      let link: string = res.imgUrl;
      let check_type: any = imageFormats.includes(fileType) ? 1 : 2;
      setFilesUrl((prev: Array<any>) => [
        ...prev,
        {
          mediaType: check_type,
          link: link,
        },
      ]);
      setLocalFiles((prev: any) => ({ ...prev, newFile }));
    }
  };

  const renderbyFileFormat = (item: any, index: any) => {
    let split_item_format = item.split(".");
    let get_split_fromat = split_item_format[split_item_format.length - 1];

    let split_item_name = item.split("/");
    let get_split_name = split_item_name[split_item_name.length - 1];
    let image_render: any = null;
    if (get_split_fromat) {
      if (imageFormats.includes(get_split_fromat)) {
        image_render = <img title={get_split_name} src={item} alt="media" />;
      }
      return (
        <figure className="img_video">
          {image_render}
          <img
            onClick={() => {
              removeFromItem(index);
            }}
            src={close}
            alt="remove"
            className="remove"
          />
        </figure>
      );
    }
  };

  const isValidCheck = () => {
    if (!reason?.length || reason?.length > 1000) {
      return true;
    }

    return false;
  };

  return (
    <div className="flex_row">
      <div className="flex_col_sm_12">
        <div className="relate">
          <button onClick={toggleBack} className="back"></button>
          <span className="xs_sub_title">{jobName}</span>
        </div>
        <span className="sub_title">Decline milestone</span>
        <p className="commn_para">
          Please write your reason for declining the milestone
        </p>
        <div className="flex_row">
          <div className="flex_col_sm_7">
            <div className="form_field">
              <label className="form_label">Your reason</label>
              <div className="text_field">
                <textarea
                  value={reason}
                  maxLength={1000}
                  onChange={(e: any) => {
                    setReason(e.target.value.trimLeft());
                  }}
                  placeholder="Your reason..."
                ></textarea>
                <span className="char_count">
                  {"character length: "}
                  {reason?.length + " / 1000"}
                </span>
              </div>
              {reason?.length > 1000 && (
                <span className="error_msg">
                  {"Maximum 1000 characters are allowed."}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="upload_img_video pt-10">
          {filesUrl?.length
            ? filesUrl.map((item: any, index: number) =>
                renderbyFileFormat(item.link, index)
              )
            : null}

          {filesUrl?.length < 6 ? (
            <React.Fragment>
              <label className="upload_media" htmlFor="upload_img_video">
                <img src={addMedia} alt="" />
              </label>

              <input
                type="file"
                accept="image/png,image/jpg,image/jpeg,.pdf, .doc, video/mp4, video/wmv, video/avi"
                style={{ display: "none" }}
                onChange={onFileChange}
                id="upload_img_video"
              />
            </React.Fragment>
          ) : null}
        </div>
        <button
          onClick={onSubmitDecline}
          className={`fill_btn full_btn btn-effect ${
            isValidCheck() ? "disable_btn" : ""
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default DeclineMilestone;
