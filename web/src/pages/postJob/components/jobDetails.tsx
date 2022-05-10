import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dummy from "../../../assets/images/u_placeholder.jpg";
import question from "../../../assets/images/ic-question.png";
import editIconBlue from "../../../assets/images/ic-edit-blue.png";
import leftIcon from "../../../assets/images/ic-back-arrow-line.png";
import rightIcon from "../../../assets/images/ic-next-arrow-line.png";
import {
  createPostJob,
  publishJobAgain,
  publishOpenJobAgain,
} from "../../../redux/jobs/actions";
import moment from "moment";
import jobDummyImage from "../../../assets/images/ic-placeholder-detail.png";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

import docThumbnail from "../../../assets/images/add-document.png";

import {  renderTimeWithFormat } from "../../../utils/common";
import { useHistory } from "react-router-dom";
import { moengage, mixPanel } from "../../../services/analyticsTools";
import { MoEConstants } from "../../../utils/constants";

//@ts-ignore
import FsLightbox from "fslightbox-react";

interface Proptypes {
  data: any;
  milestones: any;
  builderProfile: any;
  stepCompleted: Boolean;
  categories: any;
  jobTypes: any;
  handleStepComplete: (data: any) => void;
  handleStepForward: (data: any) => void;
  handleStepBack: () => void;
  clearParentStates: () => void;
  updateDetailScreen: (data: any) => void;
  jobId: string;
}

const options = {
  items: 1,
  nav: true,
  navText: [
    `<div class='nav-btn prev-slide'> <img src="${leftIcon}"> </div>`,
    `<div class='nav-btn next-slide'> <img src="${rightIcon}"> </div>`,
  ],
  rewind: true,
  autoplay: false,
  slideBy: 1,
  dots: true,
  dotsEach: true,
  dotData: true,
  responsive: {
    0: {
      items: 1,
    },
    600: {
      items: 1,
    },
    1000: {
      items: 1,
    },
  },
};

const JobDetails = ({
  data,
  milestones,
  categories,
  builderProfile,
  jobTypes,
  stepCompleted,
  updateDetailScreen,
  handleStepForward,
  handleStepComplete,
  clearParentStates,
  handleStepBack,
  jobId,
}: Proptypes) => {
  const [categorySelected, setSelected] = useState<{ [index: string]: any }>({
    category: {},
    job_type: {},
  });

  const [toggler, setToggler] = useState(false);
  const [selectedSlide, setSelectSlide] = useState(1);
  const [fsSlideListner, setFsSlideListner] = useState<any>({});

  const history = useHistory();
  const tradeListRedux = useSelector((state: any) => state.auth.tradeListData);

  const findSelectedCategory = () => {
    let preSelectedItem: any = null;
    let preSelectedJobType: any = null;
    let preSelectedSpecialization: any = null;

    if (data?.categories && data?.categories?.length) {
      preSelectedItem = data?.categories[0];
    }

    if (data?.job_type && data?.job_type?.length) {
      preSelectedJobType = data?.job_type[0];
    }

    if (data?.specialization && data?.specialization?.length) {
      preSelectedSpecialization = data?.specialization;
    }

    if (categories?.length && preSelectedItem && preSelectedJobType) {
      let filterItem = categories.find(
        (item: any) => item._id === preSelectedItem
      );
      let filter_specialization = [];
      if (filterItem?.specialisations && filterItem?.specialisations?.length) {
        filter_specialization = filterItem?.specialisations?.filter(
          (item: any) => {
            if (preSelectedSpecialization.includes(item._id)) {
              return item;
            }
          }
        );
      }

      let filterJobType = jobTypes.find(
        (item: any) => item._id === preSelectedJobType
      );
      if (filterJobType || filter_specialization) {
        setSelected({
          category: filter_specialization, // specialisations
          job_type: filterJobType,
        });
      }
    }
  };

  useEffect(() => {
    updateDetailScreen(null);
    if (
      (categorySelected !== undefined &&
        categorySelected !== null &&
        !Object.keys(categorySelected?.category).length) ||
      (categorySelected !== undefined &&
        categorySelected !== null &&
        !Object.keys(categorySelected?.job_type).length)
    ) {
      findSelectedCategory();
    }
  }, [categories, jobTypes, stepCompleted]);

  useEffect(() => {
    let fsSlideObj: any = {};
    let slideCount = 1;

    if (data?.urls?.length) {
      data?.urls.forEach((item: any, index: number) => {
        if (item?.mediaType === 1 || item?.mediaType === 2) {
          fsSlideObj[`${index}`] = slideCount++;
        }
      });
    }
    if (Object.keys(fsSlideObj)?.length > 0) setFsSlideListner(fsSlideObj);
  }, [data.urls]);

  const forwardScreenStep = (id: any, data?: any) => {
    updateDetailScreen({ currentScreen: id, data });
    handleStepForward(id);
  };

  const filterFileName = (link: any) => {
    if (link?.length) {
      let arrItems = link.split("/");
      return arrItems[arrItems?.length - 1];
    }
  };

  const handlePost = async (e: any) => {
    e.preventDefault();
    let data_clone: any = data;
    let milestones_clone: any = milestones;
    const params = new URLSearchParams(history.location?.search);
    const update: any = params.get("update") || "";
    let filter_milestones = milestones_clone.filter((item: any, index: any) => {
      if (Object.keys(item).length) {
        if (!item?.to_date?.length) {
          delete item.to_date;
        }

        if (!item?.from_date?.length || item?.from_date === "Invalid date") {
          delete item.from_date;
        }
        item["order"] = index + 1;
        return item;
      }
    });

    data_clone["milestones"] = filter_milestones;
    let from_date = data_clone?.from_date;
    let to_date = data_clone?.to_date;
    console.log({ from_date, to_date });
    if (
      !data_clone.isSingleDayJob &&
      moment(from_date).isSame(moment(to_date))
    ) {
      delete data_clone.to_date;
    }

    if (!to_date?.length) {
      delete data_clone.to_date;
    }

    if (!data_clone?.urls?.length) {
      delete data_clone.urls;
    } else {
      let urls_: any = data_clone?.urls;
      let filteredItems: any = [];
      if (urls_ && Array.isArray(urls_) && urls_?.length) {
        filteredItems = urls_.map((item_dt: any) => {
          if (item_dt?.base64) {
            delete item_dt.base64;
          }
          return item_dt;
        });
        data_clone["urls"] = filteredItems;
      }
    }

    if (jobId) {
      data_clone.jobId = jobId;
    }

    const createJob = jobId ? publishJobAgain : createPostJob;

    let response: any = null;
    if (data_clone.isJobRepublish) delete data_clone.isJobRepublish;
    delete data_clone.isSingleDayJob;
    if (data_clone.quoteJob == "1" && data_clone.amount)
      delete data_clone.amount;
    if (update) {
      delete data_clone.editJob;
      if (data_clone.to_date === "Invalid date" || data_clone.to_date === "")
        delete data_clone.to_date;
      response = await publishOpenJobAgain(data_clone);
    } else {
      response = await createJob(data_clone);
      if (jobId) {
        moengage.moE_SendEvent(MoEConstants.REPUBLISHED_JOB, {
          timeStamp: moengage.getCurrentTimeStamp(),
        });
        mixPanel.mixP_SendEvent(MoEConstants.REPUBLISHED_JOB, {
          timeStamp: moengage.getCurrentTimeStamp(),
        });
      } else {
        const mData = {
          timeStamp: moengage.getCurrentTimeStamp(),
          category: tradeListRedux.find(
            (i: any) => i._id === data_clone?.categories[0]
          )?.trade_name,
          location: data_clone?.location_name,
          "Number of milestones": data_clone?.milestones?.length,
          "start date": data_clone?.from_date,
          ...(data_clone?.to_date && { "end date": data_clone?.to_date }),
        };
        moengage.moE_SendEvent(MoEConstants.POSTED_A_JOB, mData);
        mixPanel.mixP_SendEvent(MoEConstants.POSTED_A_JOB, mData);
      }
    }
    if (response?.success) {
      clearParentStates();
      handleStepForward(12);
    }
  };

  let data_clone: any = data;

  const renderFilteredItems = () => {
    let sources: any = [];
    let types: any = [];

    if (data_clone?.urls?.length) {
      data_clone?.urls.forEach((item: any) => {
        if (item?.mediaType === 2) {
          sources.push(item.link);
          types.push("video");
        }
        if (item?.mediaType === 1) {
          sources.push(item.link);
          types.push("image");
        }
        if (item?.mediaType === 3) {
          sources.push(docThumbnail);
          types.push("image");
        }
      });
    }

    return { sources, types };
  };

  const renderTime = (data: any) => {
    let format = "YYYY-MM-DD";
    let current_date = moment().startOf("day").toDate();
    let start_date = moment(data?.from_date, format).isValid()
      ? moment(data?.from_date, format).startOf("day").toDate()
      : false;
    let end_date = moment(data?.to_date, format).isValid()
      ? moment(data?.to_date, format).startOf("day").toDate()
      : false;
    let result = null;

    if (start_date && end_date) {
      if (moment(start_date).isSame(moment(end_date))) {
        end_date = false;
      }

      if (moment(start_date).isSame(moment(current_date))) {
        result = "Today";
      }

      if (moment(start_date).isAfter(moment(current_date))) {
        let days_diff = moment(start_date).diff(moment(current_date), "days");
        result = `${days_diff} days`;
      }
    }

    if (start_date && !end_date) {
      if (moment(start_date).isSame(moment(current_date))) {
        result = "Today";
      }

      if (moment(start_date).isAfter(moment(current_date))) {
        let days_diff = moment(start_date).diff(moment(current_date), "days");
        result = `${days_diff} days`;
      }
    }

    if (start_date) {
      if (moment(start_date).isAfter(moment(current_date))) {
        let days_diff = moment(start_date).diff(moment(current_date), "days");
        result = `${days_diff} days`;
      }
    }

    return result;
  };

  const format = "MM-DD-YYYY";
  const { sources, types } = renderFilteredItems();
  return (
    <div className="app_wrapper">
      <div className="section_wrapper">
        <div className="custom_container">
          <FsLightbox
            toggler={toggler}
            slide={selectedSlide}
            sources={sources}
            types={types}
            key={sources?.length}
            onClose={() => {
              setSelectSlide(1);
            }}
          />

          <div className="vid_img_wrapper pt-20">
            <div className="flex_row">
              <div className="flex_col_sm_8 relative">
                <button onClick={handleStepBack} className="back"></button>
              </div>
            </div>
            <div className="flex_col_sm_4 relative">
              <div className="detail_card">
                <span className="title line-3 pr-20" title={data?.jobName}>
                  {data?.jobName}
                  <span
                    onClick={() => {
                      forwardScreenStep(1);
                    }}
                    className="edit_icon"
                    title="Edit"
                  >
                    <img src={editIconBlue} alt="edit" />
                  </span>
                </span>
                <span className="tagg">Job details</span>
                <div className="job_info">
                  <ul>
                    <li className="icon calendar">{renderTime(data)}</li>
                    {data.quoteJob == 0 && (
                      <li className="icon dollar">
                        ${data?.amount}{" "}
                        {data?.pay_type === "Fixed price" ? "f/p" : "p/h"}{" "}
                      </li>
                    )}
                    {data.quoteJob == 1 && (
                      <li className="icon dollar">For Quoting</li>
                    )}
                    <li
                      className="icon location line-1"
                      title={data?.location_name}
                    >
                      {data?.location_name}
                    </li>
                  </ul>
                </div>
                <button
                  onClick={handlePost}
                  className="fill_btn full_btn btn-effect mt-15"
                >
                  {jobId ? "Republish job" : "Post job"}
                </button>
              </div>
            </div>
            <span className="sub_title" style={{ marginTop: "30px" }}>
              {"Photos & Docs"}
            </span>
            <div className="flex_row">
              <div className="flex_col_sm_8">
                <figure className="">
                  {data_clone?.urls?.length ? (
                    <OwlCarousel {...options} className="customOwlCarousel">
                      {data?.urls?.length ? (
                        data?.urls?.map((image: any, index: number) => {
                          console.log(
                            {
                              image,
                              mediaType: image?.mediaType,
                            },
                            "---?"
                          );
                          return image?.mediaType === 1 ? (
                            <img
                              key={`${image}${index}`}
                              onClick={() => {
                                setToggler((prev: any) => !prev);
                                setSelectSlide(fsSlideListner[`${index}`]);
                              }}
                              title={filterFileName(image.link)}
                              alt=""
                              src={image?.link ? image?.link : jobDummyImage}
                            />
                          ) : image?.mediaType === 2 ? (
                            <video
                              key={`${image}${index}`}
                              onClick={() => {
                                setToggler((prev: any) => !prev);
                                setSelectSlide(fsSlideListner[`${index}`]);
                              }}
                              title={filterFileName(image.link)}
                              src={image?.link}
                              style={{ height: "400px", width: "800px" }}
                            />
                          ) : (
                            <img
                              key={`${image}${index}`}
                              onClick={() => {
                                let url = `/doc-view?url=${image.link}`; //
                                window.open(url, "_blank");
                              }}
                              title={filterFileName(image.link)}
                              alt=""
                              src={docThumbnail}
                            />
                          );
                        })
                      ) : (
                        <img alt="" src={jobDummyImage} />
                      )}
                    </OwlCarousel>
                  ) : (
                    <img src={jobDummyImage} alt="item-url" />
                  )}
                </figure>
              </div>
            </div>
            <div className="flex_row">
              <div className="flex_col_sm_8">
                <div className="description">
                  <span className="sub_title">
                    {"Job Description"}
                    <span
                      onClick={() => {
                        forwardScreenStep(1);
                      }}
                      className="edit_icon"
                      title="Edit"
                    >
                      <img src={editIconBlue} alt="edit" />
                    </span>
                  </span>
                  <p className="commn_para">{data?.job_description}</p>
                </div>
              </div>
            </div>
            <div className="flex_row">
              <div className="flex_col_sm_4">
                <span className="sub_title">
                  {"Job milestones"}
                  <span
                    onClick={() => {
                      forwardScreenStep(6);
                    }}
                    className="edit_icon"
                    title="Edit"
                  >
                    <img src={editIconBlue} alt="edit" />
                  </span>
                </span>
                <ul className="job_milestone">
                  {milestones?.length
                    ? milestones.map(
                        (item: any, index: any) =>
                          item?.milestone_name && (
                            <li>
                              <span>{`${index + 1}. ${
                                item?.milestone_name
                              }`}</span>
                              <span>
                                {renderTimeWithFormat(
                                  item?.from_date,
                                  item?.to_date,
                                  format
                                )}
                              </span>
                            </li>
                          )
                      )
                    : null}
                </ul>
                <button
                  style={{ cursor: "default" }}
                  className="fill_grey_btn ques_btn btn-effect"
                >
                  <img src={question} alt="question" />
                  {"0 questions"}
                </button>
              </div>

              <div className="flex_col_sm_8">
                <div className="flex_row">
                  <div className="flex_col_sm_12">
                    <span className="sub_title">
                      {"Job type"}
                      <span
                        onClick={() => {
                          forwardScreenStep(2);
                        }}
                        className="edit_icon"
                        title="Edit"
                      >
                        <img src={editIconBlue} alt="edit" />
                      </span>
                    </span>
                    <ul className="job_categories">
                      <li>
                        <figure className="type_icon">
                          <img
                            src={categorySelected?.job_type?.image}
                            alt="icon"
                          />
                        </figure>
                        <span className="name">
                          {categorySelected?.job_type?.name}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex_row">
                  <div className="flex_col_sm_12">
                    <span className="sub_title">
                      {"Specialisations needed"}
                      <span
                        onClick={() => {
                          forwardScreenStep(2);
                        }}
                        className="edit_icon"
                        title="Edit"
                      >
                        <img src={editIconBlue} alt="edit" />
                      </span>
                    </span>
                    <div className="tags_wrap">
                      <ul>
                        {categorySelected?.category?.length
                          ? categorySelected?.category?.map((item: any) => (
                              <li>{item?.name}</li>
                            ))
                          : null}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="section_wrapper">
              <span className="sub_title">Posted by</span>
              <div className="flex_row">
                <div className="flex_col_sm_3">
                  <div
                    onClick={() => {
                      history.push(
                        `/builder-info?builderId=${builderProfile?.userId}`
                      );
                    }}
                    className="tradie_card posted_by "
                  >
                    <div className="user_wrap">
                      <figure className="u_img">
                        <img
                          src={builderProfile?.userImage || dummy}
                          alt="traide-img"
                          onError={(e: any) => {
                            if (e?.target?.onerror) {
                              e.target.onerror = null;
                            }
                            if (e?.target?.src) {
                              e.target.src = dummy;
                            }
                          }}
                        />
                      </figure>
                      <div className="details">
                        <span className="name">{builderProfile?.userName}</span>
                        <span className="rating">
                          {builderProfile?.rating || "0"} |{" "}
                          {builderProfile?.reviews || "0"} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
