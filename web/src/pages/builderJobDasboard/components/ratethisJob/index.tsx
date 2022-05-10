import { useState } from "react";
import moment from "moment";
// @ts-ignore
import ReactStars from "react-rating-stars-component";
import { ratingTradieProfile } from "../../../../redux/jobs/actions";
import { setShowToast } from "../../../../redux/common/actions";

import dummy from "../../../../assets/images/u_placeholder.jpg";
import more from "../../../../assets/images/icon-direction-right.png";
import { withRouter } from "react-router-dom";

interface Proptypes {
  history: any;
  location: any;
  data: any;
  backToScreen: () => void;
}
const RateThisJob = (props: any) => {
  const [reviewBuilderData, setReviewBuilderData] = useState({
    startDate: "",
    endDate: "",
    rating: 0,
    review: "",
  });

  let data: any = props?.data;

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
      const dataItem: any = {
        jobId: data?.jobId,
        tradieId: data?.tradieId,
        rating: reviewBuilderData.rating,
      };

      if (reviewBuilderData.review.trim().length > 1) {
        dataItem["review"] = reviewBuilderData?.review?.length
          ? reviewBuilderData.review.trim()
          : "";
      }

      const response = await ratingTradieProfile(dataItem);
      if (response?.success) {
        props?.history?.push("/rate-success");
      }
    }
  };

  const jobClickHandler = ({ jobId, data }: any) => {
    console.log({ data }, "----- data----- data");
    if (data?.status) {
      let urlEncode: any = `?jobId=${jobId}&status=${data?.status}&job=past&activeType=past`;
      props.history.push(`/job-detail?${urlEncode}`);
    }
  };

  const tradieClicked = ({ tradieId, jobId }: any) => {
    console.log({ props });
    props.history.push(`/tradie-info?tradeId=${tradieId}&jobId=${jobId}`);
  };

  const renderTime = ({ fromDate, toDate }: any) => {
    if (moment(fromDate).isValid() && !moment(toDate).isValid()) {
      return `${moment(fromDate).format("DD MMM")}`;
    }

    if (moment(fromDate).isValid() && moment(toDate).isValid()) {
      let yearEnd = moment().endOf("year").toISOString();
      let monthEnd = moment(fromDate).endOf("month").toISOString();

      let item: any = moment(toDate).diff(moment(fromDate), "months", true);
      let item_year: any = moment(toDate).diff(moment(fromDate), "years", true);

      let monthDiff = parseInt(item.toString());
      let yearDiff = parseInt(item_year.toString());

      if (
        yearDiff > 0 ||
        moment(toDate).isAfter(yearEnd) ||
        moment(toDate).isAfter(yearEnd)
      ) {
        return `${moment(fromDate).format("DD MMM YY")} - ${moment(
          toDate
        ).format("DD MMM YY")}`;
      }
      if (monthDiff > 0 || moment(toDate).isAfter(monthEnd)) {
        return `${moment(fromDate).format("DD MMM")} - ${moment(toDate).format(
          "DD MMM"
        )}`;
      }
      return `${moment(fromDate).format("DD MMM")} - ${moment(toDate).format(
        "DD"
      )}`;
    }
  };

  console.log({ data });
  return (
    <div className="flex_row">
      <div className="flex_col_sm_6">
        <div className="form_field relate">
          <button
            className="back"
            onClick={() => {
              props?.backToScreen();
            }}
          ></button>
          <span className="xs_sub_title">Review the tradesperson</span>
        </div>
        <span className="inner_title">{"Rate this tradesperson"}</span>
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
          <label className="form_label">{"Comment (optional)"}</label>
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
            {"Leave review"}
          </button>
        </div>
      </div>
      <div className="flex_col_sm_6 col_ruler">
        <>
          <div className="relate">
            <span className="sub_title">{"Job details"}</span>
            <span
              className="edit_icon"
              title="More"
              onClick={() => {
                jobClickHandler({ jobId: data?.jobId, data });
              }}
            >
              <img src={more} alt="more" />
            </span>
          </div>
          <div className="tradie_card posted_by ">
            <div className="user_wrap">
              <figure className="u_img">
                <img
                  src={data?.jobData?.tradeSelectedUrl || dummy}
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
              <div
                className="details"
                onClick={() => {
                  jobClickHandler({ jobId: data?.jobId, data });
                }}
              >
                <span className="name">{data?.jobData?.tradeName}</span>
                <span className="prof">{data?.jobName}</span>
                <span className="prof">
                  {renderTime({
                    fromDate: data?.jobData?.fromDate,
                    toDate: data?.jobData?.toDate,
                  })}
                </span>
              </div>
            </div>
          </div>
        </>

        <>
          <div className="relate">
            <span className="sub_title">{"Tradesperson"}</span>
            <span
              className="edit_icon"
              title="More"
              onClick={() => {
                tradieClicked({
                  jobId: data?.jobId,
                  tradieId: data?.tradieId,
                });
              }}
            >
              <img src={more} alt="more" />
            </span>
          </div>
          <div className="tradie_card posted_by ">
            <div className="user_wrap">
              <figure className="u_img">
                <img
                  src={data?.tradieData?.tradieImage || dummy}
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
              <div
                className="details"
                onClick={() => {
                  tradieClicked({
                    jobId: data?.jobId,
                    tradieId: data?.tradieId,
                  });
                }}
              >
                <span className="name">{data?.tradieData?.tradieName}</span>
                <span className="rating">
                  {`${data?.tradieData?.ratings || "0"} | ${
                    data?.tradieData?.reviews || 0
                  } reviews`}
                </span>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default withRouter(RateThisJob);
