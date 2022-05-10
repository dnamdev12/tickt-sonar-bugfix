import React, { useState, useEffect } from "react";
import close from "../../../../assets/images/icon-close-1.png";
import addMedia from "../../../../assets/images/add-image.png";

import { onFileUpload } from "../../../../redux/auth/actions";
import { setShowToast, setLoading } from "../../../../redux/common/actions";

import { withRouter } from "react-router-dom";

//@ts-ignore
import FsLightbox from "fslightbox-react";

import { lodgeDispute } from "../../../../redux/jobs/actions";

import { JobLodgeReasons } from "../../../../utils/common";

const imageFormats: Array<any> = ["jpeg", "jpg", "png"];

const LodgeDispute = (props: any) => {
  let jobId = props?.item?.jobId;
  let jobName = props?.item?.jobName;
  let history = props?.history;
  const [stateData, setStateData] = useState({
    reason: 0,
    detail: "",
    upload: [],
  });
  const [errorData, setErrorData] = useState({
    reason: "",
    detail: "",
    upload: "",
  });
  const [filesUrl, setFilesUrl] = useState([] as any);
  const [localFiles, setLocalFiles] = useState({});

  const [update, forceUpdate] = useState({});
  const [toggler, setToggler] = useState(false);
  const [selectedSlide, setSelectSlide] = useState(1);

  const [isItemsLoad, setLoadItems] = useState({});

  const { reason, detail } = stateData;

  const isValid = ({ name, value, title }: any) => {
    if (name === "reason") {
      return value === 0 ? `${title} is required.` : "";
    }
    return !value?.length ? `${title} is required.` : "";
  };

  const checkErrors = () => {
    let error_1 = isValid({ name: "reason", value: reason, title: "Reason" });

    if (!error_1?.length) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    setErrorData((prev: any) => ({
      ...prev,
      detail:
        stateData?.detail?.length > 1000
          ? "Maximum 1000 characters are allowed."
          : "",
    }));
  }, [stateData]);

  useEffect(() => {
    let IsRenderValues = null;
    if (Object.values(isItemsLoad)?.length) {
      IsRenderValues =
        Array.isArray(Object.values(isItemsLoad)) &&
        Object.values(isItemsLoad)[0] === true
          ? Object.values(isItemsLoad)[0]
          : false;
    }

    if (IsRenderValues === false) {
      setLoading(true);
    }

    if (IsRenderValues === true) {
      setLoading(false);
    }
  }, [isItemsLoad]);

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
    setLoadItems({});
    const res = await onFileUpload(formData);
    if (res.success) {
      let link: string = res.imgUrl;
      let check_type: any = 1;
      setFilesUrl((prev: Array<any>) => [
        ...prev,
        {
          mediaType: check_type,
          link: link,
        },
      ]);
      setLoadItems((prev: any) => ({
        [filesUrl.length - 1]: false,
      }));
      setLocalFiles((prev: any) => ({
        ...prev,
        [filesUrl?.length]: URL.createObjectURL(newFile),
      }));
    }
  };

  const setItemToggle = (index: any) => {
    setToggler((prev: boolean) => !prev);
    setSelectSlide(index + 1);
  };

  const renderbyFileFormat = (item: any, index: any) => {
    let split_item_format = item.split(".");
    let get_split_fromat = split_item_format[split_item_format.length - 1];

    let split_item_name = item.split("/");
    let get_split_name = split_item_name[split_item_name.length - 1];
    let image_render: any = null;
    if (get_split_fromat) {
      if (imageFormats.includes(get_split_fromat)) {
        image_render = (
          <img
            onClick={() => {
              setItemToggle(index);
            }}
            title={get_split_name}
            src={item}
            alt="media"
            onLoad={() => {
              setLoadItems((prev: any) => ({
                [index]: true,
              }));
            }}
          />
        );
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

  const handleSubmit = async () => {
    let data: any = {
      jobId: jobId,
      reason: reason,
    };

    if (filesUrl?.length) {
      data["photos"] = filesUrl;
    }

    if (detail?.length) {
      data["details"] = detail;
    }

    let response: any = await lodgeDispute(data);

    if (response?.success) {
      history.push("/lodge-success");
    }
  };

  const renderTypes = ({ id }: any) => {
    return (
      <div className="checkbox_wrap agree_check">
        <input
          value={reason}
          onClick={() => {
            setStateData((prev: any) => ({ ...prev, reason: id }));
          }}
          checked={reason === id}
          name="Reason"
          className="filter-type filled-in"
          type="checkbox"
          id={`reason${id}`}
        />
        <label htmlFor={`reason${id}`}>{JobLodgeReasons(id, true)}</label>
      </div>
    );
  };

  const renderFilteredItems = () => {
    let sources: any = [];
    let types: any = [];

    if (filesUrl?.length) {
      filesUrl.forEach((item: any) => {
        if (item?.mediaType === 1) {
          sources.push(item.link);
          types.push("image");
        }
      });
    }

    return { sources, types };
  };

  const { sources, types } = renderFilteredItems();

  return (
    <div className="flex_row">
      <div className="flex_col_sm_8">
        <div className="relate">
          <button
            onClick={() => {
              props.backTab("lodge");
            }}
            className="back"
          ></button>
          <span className="xs_sub_title">{jobName || ""}</span>
        </div>
        <span className="sub_title">Lodge dispute</span>
        <p className="commn_para">Enter reason text</p>

        <FsLightbox
          toggler={toggler}
          slide={selectedSlide}
          sources={sources}
          types={types}
        />

        <div className="reason_wrap">
          <div className="f_spacebw">
            {renderTypes({ id: 1 })}
            {renderTypes({ id: 2 })}
          </div>

          <div className="f_spacebw">
            {renderTypes({ id: 3 })}
            {renderTypes({ id: 4 })}
          </div>

          <div className="f_spacebw">
            {renderTypes({ id: 5 })}
            {renderTypes({ id: 6 })}
          </div>

          <div className="f_spacebw">{renderTypes({ id: 7 })}</div>
        </div>
      </div>

      <div className="flex_col_sm_9">
        <div className="form_field">
          <label className="form_label">Details (optional)</label>
          <div className="text_field">
            <textarea
              value={detail}
              onChange={(e: any) => {
                setStateData((prev: any) => ({
                  ...prev,
                  detail: e.target.value.trimLeft(),
                }));
              }}
              placeholder="It’s really bad work, because..."
            ></textarea>
          </div>
          <span className="error_msg">{errorData.detail}</span>
        </div>
      </div>
      <div className="flex_col_sm_12">
        <div className="upload_img_video">
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
                onChange={onFileChange}
                type="file"
                accept="image/png,image/jpg,image/jpeg,.pdf, .doc, video/mp4, video/wmv, video/avi"
                style={{ display: "none" }}
                id="upload_img_video"
              />
            </React.Fragment>
          ) : null}
        </div>
        <button
          onClick={handleSubmit}
          className={`fill_btn full_btn btn-effect ${
            checkErrors() ? "disable_btn" : ""
          }`}
        >
          {"Send"}
        </button>
      </div>
    </div>
  );
};

export default withRouter(LodgeDispute);
