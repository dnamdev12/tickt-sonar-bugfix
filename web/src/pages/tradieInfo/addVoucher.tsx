import React, { useState, useEffect } from "react";
import cancel from "../../assets/images/ic-cancel.png";
import addMedia from "../../assets/images/add-image.png";
import Modal from "@material-ui/core/Modal";
import { setShowToast } from "../../redux/common/actions";

import close from "../../assets/images/icon-close-1.png";
import { onFileUpload } from "../../redux/auth/actions";
import { AddVoucher, fetchVouchesJobs } from "../../redux/jobs/actions";
import docThumbnail from "../../assets/images/add-document.png";
import { moengage, mixPanel } from "../../services/analyticsTools";
import { MoEConstants } from "../../utils/constants";
import Select, { components } from "react-select";
const docformats: Array<any> = ["pdf", "doc", "docx", "msword"];

const AddVoucherComponent = (props: any) => {
  const { toggleProps, closeToggle } = props;
  const [toggle, setToggle] = useState(false);
  const [jobsList, setJobsList] = useState([]);
  const [reactSelect, setReactSelect] = useState({ label: "", value: "" });
  const [jobDescription, setJobDesciption] = useState("");

  const [errorData, setErrorData] = useState({
    name: "",
    detail: "",
    upload: "",
  });
  const [filesUrl, setFilesUrl] = useState([] as any);
  const [localFiles, setLocalFiles] = useState({});

  const [update, forceUpdate] = useState({});
  const [toggler, setToggler] = useState(false);
  const [selectedSlide, setSelectSlide] = useState(1);

  useEffect(() => {
    prefetch();
  }, []);

  useEffect(() => {
    console.log({
      toggleProps,
    });
    setToggle(toggleProps);
  }, [toggleProps]);

  useEffect(() => {
    setErrorData((prev: any) => ({
      ...prev,
      detail:
        jobDescription?.length > 1000
          ? "Maximum 1000 characters are allowed"
          : "",
    }));
  }, [jobDescription]);

  // useEffect(() => {
  //     setErrorData((prev: any) => ({ ...prev, upload: filesUrl?.length ? '' : 'Document file is required' }));
  // }, [filesUrl]);

  useEffect(() => {
    console.log({ toggle });
    if (!toggle) {
      closeToggle("isRecall");
      setReactSelect((prev: any) => ({ ...prev, label: "", value: "" }));
      setJobDesciption("");
      setFilesUrl([]);
      setErrorData((prev: any) => ({
        ...prev,
        name: "",
        detail: "",
        upload: "",
      }));
    } else {
      prefetch();
    }
  }, [toggle]);

  const prefetch = async () => {
    if (props?.id) {
      let res_jobs: any = await fetchVouchesJobs({
        page: 1,
        tradieId: props.id,
      });
      if (res_jobs?.success) {
        let list_data: any = res_jobs.data;
        if (list_data?.length) {
          // let item = list_data[0];
          // item?.jobId
          setReactSelect({ label: "Please select  a job", value: "" });
        }
        setJobsList(list_data);
      }
    }
  };

  const setItemToggle = (index: any) => {
    setToggler((prev: boolean) => !prev);
    setSelectSlide(index + 1);
  };

  const removeFromItem = (index: any) => {
    filesUrl.splice(index, 1);
    setFilesUrl(filesUrl);
    Array.isArray(update) ? forceUpdate([]) : forceUpdate({});
  };

  const onFileChange = async (e: any) => {
    const formData = new FormData();
    const newFile = e.target.files[0];

    var fileType = newFile?.type?.split("/")[1]?.toLowerCase();
    var selectedFileSize = newFile?.size / 1024 / 1024; // size in mib

    if (docformats.indexOf(fileType) < 0 || selectedFileSize > 10) {
      setShowToast(true, "The file must be in proper format or size");
      return;
    }

    if (docformats.includes(fileType) && selectedFileSize > 10) {
      // image validations
      setShowToast(true, "The image file size must be below 10 mb");
      return;
    }

    formData.append("file", newFile);
    const res = await onFileUpload(formData);
    if (res.success) {
      let link: string = res.imgUrl;

      setFilesUrl((prev: Array<any>) => [
        ...prev,
        {
          mediaType: ["doc", "docx", "msword"].includes(fileType) ? 3 : 4,
          link: link,
        },
      ]);
      setLocalFiles((prev: any) => ({
        ...prev,
        [filesUrl?.length]: URL.createObjectURL(newFile),
      }));
    }
  };

  const renderbyFileFormat = (item: any, index: any) => {
    let split_item_format = item.split(".");
    let get_split_fromat = split_item_format[split_item_format.length - 1];

    let split_item_name = item.split("/");
    let get_split_name = split_item_name[split_item_name.length - 1];
    let image_render: any = null;
    if (get_split_fromat) {
      if (docformats.includes(get_split_fromat)) {
        image_render = (
          <img
            onClick={() => {
              setItemToggle(index);
            }}
            title={get_split_name}
            src={docThumbnail}
            alt="media"
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
          {/* <span style={{ fontSize: '10px' }}>{get_split_name}</span> */}
        </figure>
      );
    }
  };

  const handleSubmit = async () => {
    let data = {
      jobId: reactSelect?.value,
      jobName: reactSelect?.label,
      tradieId: props.id,
      photos: [filesUrl[0].link],
      vouchDescription: jobDescription,
      recommendation: filesUrl[0].link,
    };
    let response = await AddVoucher(data);
    if (response?.success) {
      moengage.moE_SendEvent(MoEConstants.LEFT_VOUCHER, {
        timeStamp: moengage.getCurrentTimeStamp(),
      });
      mixPanel.mixP_SendEvent(MoEConstants.LEFT_VOUCHER, {
        timeStamp: moengage.getCurrentTimeStamp(),
      });
      setToggle((prev: any) => !prev);
      await prefetch();
    }
  };

  let JobSelectOptions: any = [];
  if (jobsList?.length) {
    JobSelectOptions = jobsList.map((item: any) => ({
      label: item?.jobName,
      value: item?.jobId,
    }));
    JobSelectOptions.unshift({ label: "Please select a job", value: "" });
  }

  const NoOptionsMessage = (props: any) => {
    return (
      <components.NoOptionsMessage {...props}>
        <span className="custom-css-class">
          {"No completed jobs with this tradesperson"}
        </span>
      </components.NoOptionsMessage>
    );
  };

  return (
    <Modal
      className="custom_modal"
      open={toggle}
      onClose={() => {
        closeToggle("isRecall");
        setToggle((prev: any) => !prev);
      }}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div
        className="custom_wh profile_modal vouch_modal"
        data-aos="zoom-in"
        data-aos-delay="30"
        data-aos-duration="1000"
      >
        <div className="heading">
          <span className="sub_title">{"Leave a Vouch"}</span>
          <span className="info_note">
            {"Upload the vouch and write the description."}
          </span>
          <button
            onClick={() => {
              closeToggle("isRecall");
              setToggle((prev: any) => !prev);
            }}
            className="close_btn"
          >
            <img src={cancel} alt="cancel" />
          </button>
        </div>
        <div className="inner_wrap">
          <div className="inner_wrappr">
            <div className="form_field">
              <label className="form_label">Job</label>
              <div className="text_field">
                <Select
                  className="select_menu"
                  value={reactSelect}
                  options={JobSelectOptions}
                  components={{ NoOptionsMessage }}
                  // options={jobsList.map((item: any) => ({ label: item?.jobName, value: item?.jobId }))}
                  onChange={(item: any) => {
                    setReactSelect(item);
                    setErrorData((prev: any) => ({ ...prev, name: "" }));
                  }}
                />
              </div>
              <span className="error_msg">{errorData?.name}</span>
            </div>
            <div className="form_field">
              <label className="form_label">{"Job Description"}</label>
              <div className="text_field">
                <textarea
                  onChange={(e) => {
                    setJobDesciption(e.target.value.trimLeft());
                  }}
                  value={jobDescription}
                  placeholder="Enter Description..."
                ></textarea>
                {jobDescription.length ? (
                  <span className="char_count">
                    {`character length : ${jobDescription.length} / 1000`}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <span className="error_msg">{errorData?.detail}</span>
            </div>
            <div className="upload_img_video">
              {filesUrl?.length
                ? filesUrl.map((item: any, index: number) =>
                    renderbyFileFormat(item.link, index)
                  )
                : null}

              {filesUrl?.length < 1 ? (
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
            <span className="error_msg">{errorData?.upload}</span>
          </div>
        </div>
        <div className="bottom_btn custom_btn">
          <button
            onClick={() => {
              if (!filesUrl?.length || !jobDescription?.length) {
                if (!filesUrl?.length) {
                  setErrorData((prev: any) => ({
                    ...prev,
                    upload: "Document file is required.",
                  }));
                }

                if (!jobDescription?.length) {
                  setErrorData((prev: any) => ({
                    ...prev,
                    detail: "Job Description is required",
                  }));
                }

                if (!reactSelect?.value?.length) {
                  setErrorData((prev: any) => ({
                    ...prev,
                    name: "Job Name is required",
                  }));
                }
              } else {
                handleSubmit();
              }
            }}
            className={`fill_btn full_btn btn-effect`}
          >
            {"Save changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddVoucherComponent;
