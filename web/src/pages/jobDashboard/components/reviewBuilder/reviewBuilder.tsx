import { useState, useEffect } from "react";
// @ts-ignore
import ReactStars from "react-rating-stars-component";
import { reviewBuilder, getJobDetails } from "../../../../redux/jobs/actions";
import { setShowToast } from "../../../../redux/common/actions";
import { renderTime } from "../../../../utils/common";

import dummy from "../../../../assets/images/u_placeholder.jpg";
import more from "../../../../assets/images/icon-direction-right.png";
import { moengage, mixPanel } from "../../../../services/analyticsTools";
import { MoEConstants } from "../../../../utils/constants";

interface Proptypes {
  history: any;
  location: any;
}
const ReviewBuilder = (props: Proptypes) => {
  const [reviewBuilderData, setReviewBuilderData] = useState({
    rating: 0,
    review: "",
  });
  const [item, setItem] = useState<any>("");
  const [isParam, setIsParam] = useState<boolean>(false);

  useEffect(() => {
    const jobId: any = new URLSearchParams(props.location?.search)?.get(
      "jobId"
    );
    (async () => {
      if (jobId) {
        const res = await getJobDetails(jobId);
        if (res.success) {
          setItem(res.data);
          setIsParam(true);
        }
      } else if (props?.location?.state?.item) {
        setItem(props?.location?.state?.item);
      }
    })();
  }, []);
  console.log(props, "props data", item, "item");

  const ratingChanged = (newRating: number) => {
    console.log(newRating);
    setReviewBuilderData((prevdata: any) => ({
      ...prevdata,
      rating: newRating,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim().length <= 1000) {
      setReviewBuilderData((prevdata: any) => ({
        ...prevdata,
        review: e.target.value,
      }));
    }
  };

  const submitReviewClicked = async () => {
    if (reviewBuilderData.rating === 0) {
      setShowToast(true, "Star rating is required");
      return;
    }
    if (reviewBuilderData.rating > 0) {
      let data: any = {
        jobId: item?.jobId,
        builderId: isParam
          ? item?.postedBy?.builderId
          : item?.builderData?.builderId,
        rating: reviewBuilderData.rating,
        review: reviewBuilderData.review.trim(),
      };
      if (!data.review) delete data.review;
      const response = await reviewBuilder(data);
      if (response?.success) {
        const mData = {
          timeStamp: moengage.getCurrentTimeStamp(),
        };
        moengage.moE_SendEvent(MoEConstants.ADDED_REVIEW, mData);
        mixPanel.mixP_SendEvent(MoEConstants.ADDED_REVIEW, mData);
        props?.history?.push("/builder-review-submitted");
      }
    }
  };

  const jobClickHandler = () => {
    props.history.push(
      `/job-details-page?jobId=${item?.jobId}&redirect_from=jobs`
    );
  };

  const builderClicked = () => {
    props.history.push(
      `/builder-info?builderId=${
        isParam ? item.postedBy?.builderId : item.builderData?.builderId
      }`
    );
  };

  return (
    <div className="detail_col">
      <div className="flex_row">
        <div className="flex_col_sm_6">
          <div className="relate">
            <button
              className="back"
              onClick={() => props?.history?.goBack()}
            ></button>
            <span className="xs_sub_title">{item?.jobName}</span>
          </div>
          <div className="form_field">
            <span className="sub_title">Review completed job</span>
          </div>
          <span className="inner_title">Rate this builder</span>
          <div className="form_field">
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={55}
              isHalf={true}
              emptyIcon={<i className="far fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              fullIcon={<i className="fa fa-star"></i>}
              activeColor="#fee600"
            />
          </div>
          <div className="form_field">
            <label className="form_label">Comment (optional)</label>
            <div className="text_field">
              <input
                type="text"
                placeholder="Thanks.."
                maxLength={1000}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form_field">
            <button
              className="fill_btn full_btn btn-effect"
              onClick={submitReviewClicked}
            >
              Leave review
            </button>
          </div>
        </div>
        <div className="flex_col_sm_6 col_ruler">
          <div className="relate">
            <span className="sub_title">Job details</span>
            <span className="edit_icon" title="More" onClick={jobClickHandler}>
              <img src={more} alt="more" />
            </span>
          </div>
          <div className="tradie_card posted_by ">
            <div className="user_wrap" onClick={() => builderClicked()}>
              <figure className="u_img">
                <img
                  src={
                    isParam
                      ? item.postedBy?.builderImage
                      : item.builderData?.builderImage
                      ? item.builderData?.builderImage
                      : dummy
                  }
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
                <span className="name">
                  {item.builderData?.builderName || item.postedBy?.builderName}
                </span>
                <span className="prof">{item?.jobName}</span>
                <span className="prof">
                  {renderTime(item?.fromDate, item?.toDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewBuilder;
