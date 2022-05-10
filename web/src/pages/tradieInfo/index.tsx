import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getBuilderProfile,
  tradieReviewReply,
  tradieUpdateReviewReply,
  tradieRemoveReviewReply,
  getTradieReviewListOnBuilder,
  getAcceptDeclineTradie,
  reviewReply,
  updateReviewReply,
  removeReviewReply,
  getTradeReviews,
  getTradeProfile,
  HomeTradieProfile,
  CancelInviteForJob,
  updateReviewTradie,
  deleteReviewTradie,
} from "../../redux/jobs/actions";
import {
  getTradieProfile,
  getTradieProfileView,
} from "../../redux/profile/actions";
import { setShowToast } from "../../redux/common/actions";
import { SaveTradie } from "../../redux/jobs/actions";
import storageService from "../../utils/storageService";
import { portfolio, portfolioModal } from "../builderInfo/builderInfo";
import VoucherDetail from "./voucherDetail";
import TradieJobInfoBox from "../../common/tradieJobInfoBox";
import Modal from "@material-ui/core/Modal";
import ReviewInfoBox from "../../common/reviewInfoBox";

import profilePlaceholder from "../../assets/images/ic-placeholder-detail.png";
import dummy from "../../assets/images/u_placeholder.jpg";
import portfolioPlaceholder from "../../assets/images/portfolio-placeholder.jpg";
import noData from "../../assets/images/no-search-data.png";
import menu from "../../assets/images/menu-line-blue.png";
import cancel from "../../assets/images/ic-cancel.png";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
//@ts-ignore
import Skeleton from "react-loading-skeleton";

import AddVoucherComponent from "./addVoucher";
import vouch from "../../assets/images/ic-template.png";
import _ from "lodash";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

import noDataFound from "../../assets/images/no-search-data.png";

//@ts-ignore
import ReactStars from "react-rating-stars-component";
import Rating from "react-rating";
import InfiniteScroll from "react-infinite-scroll-component";

import { moengage, mixPanel } from "../../services/analyticsTools";
import { MoEConstants } from "../../utils/constants";
interface Props {
  tradieInfo: any;
  tradieId: any;
  jobId: any;
  tradieReviews: any;
  userType: number;
  tradieProfileViewData: any;
  getTradieProfile: (data: any) => void;
  getTradieReviewListOnBuilder: (data: any) => void;
  getAcceptDeclineTradie: (data: any) => void;
  getTradieProfileView: () => void;
}

interface State {
  profilePictureLoading: boolean;
  tradieInfo: any;
  showError: boolean;
  tradieReviews: any;
  profileData: any;
  portfolioData: {
    portfolioImageClicked: boolean;
    portfolioDetails: {
      portfolioImage: any;
      portfolioId: any;
      jobDescription: any;
    };
  };
  delete: any;
  reviewsData: {
    reviewReplyClicked: boolean;
    showAllReviewsClicked: boolean;
    submitReviewsClicked: boolean;
    deleteReviewsClicked: boolean;
    updateReviewsClicked: boolean;
    reviewsClickedType: any;
    confirmationClicked: boolean;
    showReviewReplyButton: boolean;
    reviewId: any;
    reviewData: any;
    showReviewReply: boolean;
    replyShownHideList: any;
  };
  toggleVoucher: {
    item: string;
    isTrue: boolean;
  };
  toggleAddVoucher: boolean;
  toggleSpecialisation: boolean;
  hasMore: boolean;
  isSendEvent: boolean;
  currentReviewPage: number;
}

const empty_star_rating_below = (
  <span
    className=""
    data-index="4"
    data-forhalf="★"
    style={{
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      display: "block",
      float: "left",
      color: "rgb(223, 229, 239)",
      fontSize: "24px",
    }}
  >
    ★
  </span>
);

const full_star_rating_below = (
  <span
    className=""
    data-index="0"
    data-forhalf="★"
    style={{
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      display: "block",
      float: "left",
      color: "rgb(255, 215, 0)",
      fontSize: "24px",
    }}
  >
    ★
  </span>
);
class TradieInfo extends Component<Props, State> {
  state = {
    toggleSpecialisation: true,
    profilePictureLoading: true,
    tradieInfo: "",
    showError: false,
    tradieReviews: null,
    profileData: {},
    delete: {
      isToggle: false,
      deleteId: "",
    },
    portfolioData: {
      portfolioImageClicked: false,
      portfolioDetails: {
        portfolioImage: [],
        portfolioId: "",
        jobDescription: "",
      },
    },
    reviewsData: {
      reviewReplyClicked: false,
      showAllReviewsClicked: false,
      submitReviewsClicked: false,
      deleteReviewsClicked: false,
      updateReviewsClicked: false,
      reviewsClickedType: "",
      confirmationClicked: false,
      showReviewReplyButton: true,
      reviewId: "",
      reviewData: "",
      showReviewReply: false,
      replyShownHideList: [],
    },
    tradieReviewList: [],
    toggleVoucher: { item: "", isTrue: false },
    toggleAddVoucher: false,
    hasMore: true,
    currentReviewPage: 1,
    isSendEvent: false,
  };

  componentWillUnmount() {
    this.setState({
      toggleSpecialisation: true,
      tradieInfo: null,
      showError: false,
      tradieReviews: null,
      profileData: {},
      portfolioData: {
        portfolioImageClicked: false,
        portfolioDetails: {
          portfolioImage: [],
          portfolioId: "",
          jobDescription: "",
        },
      },
      delete: {
        isToggle: false,
        deleteId: "",
      },
      reviewsData: {
        reviewReplyClicked: false,
        showAllReviewsClicked: false,
        submitReviewsClicked: false,
        deleteReviewsClicked: false,
        updateReviewsClicked: false,
        reviewsClickedType: "",
        confirmationClicked: false,
        showReviewReplyButton: true,
        reviewId: "",
        reviewData: "",
        showReviewReply: false,
        replyShownHideList: [],
      },
    });
  }

  getItemsFromLocation = () => {
    let props: any = this.props;
    const urlParams = new URLSearchParams(props.location.search);
    let jobId = urlParams.get("jobId");
    let specializationId = urlParams.get("specializationId");
    let tradeId = urlParams.get("tradeId");
    let user_type = storageService.getItem("userType");
    let is_active = urlParams.get("active");
    return { jobId, specializationId, tradeId, user_type, is_active };
  };

  componentDidMount() {
    this.setItems();
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (
      nextProps.tradieProfileViewData &&
      !_.isEqual(nextProps.tradieProfileViewData, prevState.tradieInfo)
    ) {
      return {
        tradieInfo: nextProps.tradieProfileViewData,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    let props: any = this.props;
    let tradeStatus: any = props.tradieRequestStatus;
    let prevPath = `${prevProps?.location?.pathname}${prevProps?.location?.search}`;
    let currentPath = `${props?.location?.pathname}${props?.location?.search}`;

    if (prevPath !== currentPath) {
      this.setItems();
    }

    if (tradeStatus) {
      props.history.push("/jobs");
    }

    if (
      prevState.tradieInfo?.tradieName &&
      !this.state.isSendEvent &&
      storageService.getItem("userType") == 2
    ) {
      const mData = {
        name: prevState.tradieInfo?.tradieName,
        category: props.tradeListData.find(
          (i: any) => i._id === prevState.tradieInfo?.tradeId
        )?.trade_name,
      };
      moengage.moE_SendEvent(MoEConstants.VIEWED_TRADIE_PROFILE, mData);
      mixPanel.mixP_SendEvent(MoEConstants.VIEWED_TRADIE_PROFILE, mData);
      this.setState({ isSendEvent: true });
    }
  }

  portfolioImageHandler = (data: any) => {
    this.setState({
      portfolioData: { portfolioImageClicked: true, portfolioDetails: data },
    });
  };

  modalCloseHandler = (modalType: string) => {
    this.setState((prev: any) => ({
      reviewsData: {
        ...prev.reviewsData,
        [modalType]: false,
        deleteReviewsClicked: false,
      },
    }));
  };

  reviewHandler = (type: any, reviewId?: any, replyId?: any, reply?: any) => {
    console.log({ type, reviewId });
    if (type === "reviewReplyClicked") {
      this.setState((prevData: any) => ({
        reviewsData: {
          ...prevData.reviewsData,
          reviewReplyClicked: true,
          showAllReviewsClicked: false,
          // reviewsClickedType: type,
          reviewId: reviewId,
        },
      }));
    } else if (type === "reviewReply") {
      this.setState((prevData: any) => ({
        reviewsData: {
          ...prevData.reviewsData,
          submitReviewsClicked: true,
          reviewsClickedType: type,
          confirmationClicked: true,
        },
      }));
    } else if (type === "removeReviewReply") {
      this.setState((prevData: any) => ({
        reviewsData: {
          ...prevData.reviewsData,
          confirmationClicked: true,
          deleteReviewsClicked: true,
          reviewId: reviewId,
          replyId: replyId,
          reviewsClickedType: type,
        },
      }));
    } else if (type === "updateReviewReply") {
      this.setState((prevData: any) => ({
        reviewsData: {
          ...prevData.reviewsData,
          reviewReplyClicked: true,
          updateReviewsClicked: true,
          reviewId: reviewId,
          replyId: replyId,
          reviewsClickedType: type,
          showAllReviewsClicked: false,
          reviewData: reply,
        },
      }));
    } else if (type === "replyCancelBtnClicked") {
      this.setState((prevData: any) => ({
        reviewsData: {
          ...prevData.reviewsData,
          reviewReplyClicked: false,
          updateReviewsClicked: false,
          deleteReviewsClicked: false,
          showAllReviewsClicked: true,
          reviewData: "",
          reviewsClickedType: "",
          reviewId: "",
        },
      }));
    } else if (type === "hideReviewClicked") {
      let item_: any = {};
      let reply_id: any = replyId;
      item_ = this.state.reviewsData?.replyShownHideList;
      if (item_[reply_id] === undefined) {
        item_[reply_id] = true;
      } else {
        item_[reply_id] = !item_[reply_id];
      }

      this.setState((prevData: any) => ({
        reviewsData: { ...prevData.reviewsData, replyShownHideList: item_ },
      }));
    } else if (type === "showReviewClicked") {
      let item_: any = {};
      let reply_id: any = replyId;
      item_ = this.state.reviewsData?.replyShownHideList;
      if (item_[reply_id] === undefined) {
        item_[reply_id] = true;
      } else {
        item_[reply_id] = !item_[reply_id];
      }

      this.setState((prevData: any) => ({
        reviewsData: { ...prevData.reviewsData, replyShownHideList: item_ },
      }));
    } else if (type === "editBuilderReview") {
      this.setState((prevData: any) => ({
        reviewsData: {
          ...prevData.reviewsData,
          showAllReviewsClicked: false,
          editBuilderReview: true,
          reviewData: reply,
          reviewsClickedType: "",
          reviewId: reviewId,
        },
      }));
    } else if (type === "cancelBuilderReview") {
      this.setState((prevData: any) => ({
        reviewsData: {
          ...prevData.reviewsData,
          showAllReviewsClicked: false,
          editBuilderReview: false,
          reviewData: "",
          reviewsClickedType: "",
          reviewId: "",
        },
      }));
    }
  };

  handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    type: string,
    subtype?: string
  ) => {
    if (e.target.value.trim().length <= 250) {
      if (subtype) {
        this.setState((prevData: any) => {
          console.log({ prevData });
          return {
            reviewsData: {
              ...prevData.reviewsData,
              reviewData: {
                ...prevData?.reviewsData?.reviewData,
                [subtype]: e.target.value,
              },
            },
          };
        });
      } else {
        this.setState((prevData: any) => ({
          reviewsData: { ...prevData.reviewsData, [type]: e.target.value },
        }));
      }
    }
  };

  submitReviewHandler = async (type: any) => {
    let reviewsData: any = this.state.reviewsData;
    let profileData: any = this.state.profileData;
    if (
      [
        "reviewReply",
        "updateReviewReply",
        "removeReviewReply",
        "updateBuilderReview",
      ].includes(type)
    ) {
      var response;

      if (type === "reviewReply") {
        const data = {
          reviewId: reviewsData.reviewId,
          reply: reviewsData.reviewData,
        };
        // need to send reply id in response
        response = await reviewReply(data);
      }
      if (type === "updateReviewReply") {
        const data = {
          reviewId: reviewsData.reviewId,
          replyId: reviewsData?.replyId,
          reply: reviewsData.reviewData,
        };
        response = await updateReviewReply(data);
      }
      if (type === "removeReviewReply") {
        const data = {
          reviewId: reviewsData.reviewId,
          replyId: reviewsData.replyId,
        };
        response = await removeReviewReply(data);
      }

      if (type === "updateBuilderReview") {
        const {
          reviewData: { review, reviewId, rating },
        } = reviewsData;
        let data = {
          review,
          reviewId,
          rating,
        };

        if (!data?.review?.length) {
          delete data.review;
        }

        response = await updateReviewTradie(data);
      }

      if (response?.success) {
        this.forceUpdate();
        this.setItems();
      }

      this.setState((prevData: any) => ({
        reviewsData: {
          ...prevData.reviewsData,
          submitReviewsClicked: false,
          reviewReplyClicked: false,
          editBuilderReview: false,
          showAllReviewsClicked: true,
          confirmationClicked: false,
          reviewsClickedType: "",
          deleteReviewsClicked: false,
          updateReviewsClicked: false,
          reviewId: "",
          reviewData: "",
          replyShownHideList: [],
        },
      }));
    }
  };

  setItems = async () => {
    const { jobId, tradeId, user_type } = this.getItemsFromLocation();

    if (user_type == "1" || this.props.userType == 1) {
      console.log(
        user_type,
        "user_type",
        this.props.userType,
        "this.props.userType"
      );
      this.props.getTradieProfileView();
    } else if (jobId) {
      let res_profile: any = await getTradeProfile({
        tradieId: tradeId,
        jobId: jobId,
      });
      console.log({ res_profile });
      if (res_profile.success) {
        this.setState({ tradieInfo: res_profile.data, showError: false });
      } else {
        if (res_profile?.status == 404) {
          this.setState({ showError: true });
        }
      }
    } else {
      let res_profile: any = await HomeTradieProfile({ tradieId: tradeId });
      console.log({ res_profile });
      if (res_profile?.success) {
        this.setState({ tradieInfo: res_profile.data, showError: false });
      } else {
        if (res_profile?.status == 404) {
          this.setState({ showError: true });
        }
      }
    }

    let res_trade: any = await getTradeReviews({ tradieId: tradeId, page: 1 });
    console.log({ res_trade });
    if (res_trade?.success) {
      let data_ = res_trade?.data?.list || res_trade?.data;
      this.setState({ tradieReviews: data_ });
    }
  };

  capitalize = (input: any) => {
    console.log(input, "inputttts");
    if (!input) return;
    let words = input?.split(" ");
    let CapitalizedWords: any = [];
    words.forEach((element: any) => {
      CapitalizedWords.push(
        element[0].toUpperCase() + element.slice(1, element.length)
      );
    });
    return CapitalizedWords.join(" ");
  };
  submitAcceptDeclineRequest = (status: any) => {
    let props: any = this.props;
    const { getAcceptDeclineTradie } = props;
    const { jobId, tradeId } = this.getItemsFromLocation();
    let data = {
      jobId: jobId,
      tradieId: tradeId,
      status: status,
    };
    getAcceptDeclineTradie(data);
  };

  savedTradie = async ({ tradieInfo }: any) => {
    let props: any = this.props;
    let data = {
      tradieId: tradieInfo?._id || tradieInfo?.tradieId,
      isSave: tradieInfo?.isSaved ? false : true,
    };
    let response = await SaveTradie(data);
    if (response.success) {
      if (!tradieInfo?.isSaved) {
        const mData = {
          timeStamp: moengage.getCurrentTimeStamp(),
          category: props.tradeListData.find(
            (i: any) => i._id === tradieInfo?.tradeId
          )?.trade_name,
        };
        moengage.moE_SendEvent(MoEConstants.SAVED_TRADIE, mData);
        mixPanel.mixP_SendEvent(MoEConstants.SAVED_TRADIE, mData);
      }
      await this.setItems();
    }
  };

  cancelInvite = async ({ invitationId, tradieId, jobId }: any) => {
    if (jobId) {
      let data = {
        tradieId,
        jobId,
        invitationId,
      };
      let response: any = await CancelInviteForJob(data);
      if (response.success) {
        await this.setItems();
      }
    }
  };

  closeToggle = () => {
    this.setState({
      toggleVoucher: { item: "", isTrue: false },
    });
  };

  renderBtn = ({ hideInvite }: any) => {
    if (hideInvite) {
    }
  };

  renderPopup = () => {};

  closeAddVoucher = (isRecall?: any) => {
    if (isRecall === "isRecall") {
      this.setState(
        {
          toggleAddVoucher: false,
        },
        () => {
          if (this.state.toggleAddVoucher === false) {
            this.setItems();
          }
        }
      );
    }
  };

  render() {
    const SVGIcon = (props: any) => (
      <svg className={props.className} pointerEvents="none">
        <use xlinkHref={props.href} />
      </svg>
    );

    let props: any = this.props;
    console.log({
      props,
      path: props.location.pathname + props.location.search,
    });
    // let tradieInfo: any = props.tradieInfo;
    const { user_type, is_active } = this.getItemsFromLocation();
    let { portfolioData, toggleVoucher, showError } = this.state;
    let reviewsData: any = this.state.reviewsData;
    let tradieInfo: any = this.state.tradieInfo;
    let userType: number = Number(user_type);
    let tradieReviews: any = this.state.tradieReviews;
    let isSkeletonLoading: boolean = props.isSkeletonLoading;

    console.log(
      tradieInfo,
      "tradieInfo",
      userType,
      "userType",
      is_active,
      "is_active"
    );

    let profileData: any = tradieInfo;
    let {
      portfolioImageHandler,
      modalCloseHandler,
      reviewHandler,
      submitReviewHandler,
      handleChange,
      submitAcceptDeclineRequest,
    } = this;

    const urlParams = new URLSearchParams(props.location.search);
    let hideInvite: any = false;
    let haveJobId: any = false;
    let isActive = urlParams.get("active") == "true" ? true : false;
    if (urlParams.get("hideInvite")) {
      hideInvite = urlParams.get("hideInvite") === "false" ? false : true;
    }

    haveJobId = urlParams.get("jobId") == null ? false : true;
    let toggleSpecialisation = this.state.toggleSpecialisation;

    if (showError) {
      return (
        <div className="app_wrapper">
          <div className="custom_container">
            <div className="section_wrapper">
              <div className="vid_img_wrapper pt-20">
                <div className="flex_row">
                  <div className="flex_col_sm_3 relative">
                    <button
                      className="back"
                      onClick={() => {
                        // props.history.goBack();
                        let url = props?.location?.state?.url;
                        if (url && !url.indexOf("tradie-info")) {
                          props.history.push(props.location.state.url);
                        }
                        if (!isActive) {
                          props.history.push("/jobs");
                        } else {
                          props.history.push("/");
                        }
                      }}
                    ></button>
                  </div>
                </div>
              </div>

              <div className="no_record  m-t-vh">
                <figure className="no_img">
                  <img src={noDataFound} alt="data not found" />
                </figure>
                <span>{"This tradesperson is no longer available"}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="app_wrapper">
        <div className="custom_container">
          <div className="section_wrapper">
            <VoucherDetail
              toggleProps={toggleVoucher.isTrue}
              item={toggleVoucher.item}
              id={tradieInfo?.tradeId}
              closeToggle={this.closeToggle}
            />

            <div className="vid_img_wrapper pt-20">
              <div className="flex_row">
                <div className="flex_col_sm_3 relative">
                  <button
                    className="back"
                    onClick={() => {
                      // props.history.goBack();
                      let url = props?.location?.state?.url;
                      if (url && !url.indexOf("tradie-info")) {
                        props.history.push();
                      }
                      if (isActive) {
                        let url_: any = new URLSearchParams(
                          props.location.search
                        );
                        let jobId: any = url_.get("jobId");
                        props.history.push(
                          `/jobs?active=active&jobId=${jobId}&markMilestone=true`
                        );
                      } else {
                        props.history.push("/");
                      }
                    }}
                  ></button>
                </div>
              </div>

              <div className="flex_row">
                <div className="flex_col_sm_3">
                  <div className="upload_profile_pic">
                    <figure className="user_img">
                      {this.state.profilePictureLoading && (
                        <Skeleton style={{ lineHeight: 2, height: 240 }} />
                      )}
                      {!isSkeletonLoading && (
                        <img
                          src={tradieInfo?.tradieImage || profilePlaceholder}
                          alt="profile-pic"
                          onLoad={() =>
                            this.setState({
                              profilePictureLoading: false,
                            })
                          }
                          onError={(e: any) => {
                            let e_: any = e;
                            e_.target.src = dummy;
                          }}
                          hidden={this.state.profilePictureLoading}
                        />
                      )}
                    </figure>
                  </div>
                </div>
                <div className="flex_col_sm_3 relative">
                  {props.isSkeletonLoading ? null : (
                    <div className="text-right">
                      {storageService.getItem("userType") === 2 && (
                        <span
                          className={`bookmark_icon ${
                            tradieInfo?.isSaved ? "active" : ""
                          }`}
                          onClick={() => {
                            this.savedTradie({ tradieInfo });
                          }}
                        ></span>
                      )}
                    </div>
                  )}

                  <div className="detail_card">
                    {props.isSkeletonLoading ? (
                      <Skeleton count={5} height={25} />
                    ) : (
                      <>
                        <span
                          className="title line-1"
                          title={tradieInfo?.tradieName}
                        >
                          {tradieInfo?.tradieName || ""}
                        </span>
                        <span className="xs_sub_title">
                          {this.capitalize(tradieInfo?.businessName || "")}
                        </span>
                        <span className="tagg">
                          {tradieInfo?.areasOfSpecialization?.tradeData[0]
                            ?.tradeName || ""}
                        </span>
                        <ul className="review_job">
                          <li>
                            <span className="icon reviews">
                              {tradieInfo?.ratings || "0"}
                            </span>
                            <span className="review_count">{`${
                              tradieInfo?.reviewsCount || "0"
                            } reviews`}</span>
                          </li>
                          <li>
                            <span className="icon job">
                              {tradieInfo?.jobCompletedCount || "0"}
                            </span>
                            <span className="review_count">
                              {" "}
                              jobs completed
                            </span>
                          </li>
                        </ul>

                        {userType !== 1 && is_active == "true" ? (
                          <button
                            className="fill_btn full_btn btn-effect"
                            onClick={() => {
                              const tradieId = new URLSearchParams(
                                props.history?.location?.search
                              ).get("tradeId");
                              props.history.push({
                                pathname: `/choose-job-to-start-chat`,
                                state: {
                                  tradieId: tradieId ? tradieId : "",
                                },
                              });
                            }}
                          >
                            {"Write a message"}
                          </button>
                        ) : (
                          ""
                        )}

                        {userType === 1 ? (
                          <button
                            className="fill_btn full_btn btn-effect"
                            onClick={() => {
                              props.history.push("/update-user-info");
                            }}
                          >
                            Edit
                          </button>
                        ) : !tradieInfo?.isRequested && !hideInvite ? (
                          <div className="form_field">
                            {tradieInfo?.isInvited ? (
                              <>
                                {/* bottom_btn */}
                                {/* <span
                                                                    onClick={() => {
                                                                        this.savedTradie({ tradieInfo })
                                                                    }}
                                                                    className={`bookmark_icon ${tradieInfo?.isSaved ? 'active' : ''}`}></span> */}
                                {haveJobId ? (
                                  <button
                                    onClick={() => {
                                      console.log({ haveJobId, tradieInfo });
                                      if (haveJobId) {
                                        this.cancelInvite({
                                          invitationId:
                                            tradieInfo?.invitationId,
                                          tradieId: tradieInfo?.tradieId,
                                          jobId: urlParams.get("jobId"),
                                        });
                                      } else {
                                        props.history.push({
                                          pathname: "/cancel-the-job",
                                          state: {
                                            tradieId:
                                              tradieInfo?._id ||
                                              tradieInfo?.tradieId,
                                            path: props.location.search,
                                            cancelJob: true,
                                          },
                                        });
                                      }
                                    }}
                                    className="fill_btn full_btn btn-effect"
                                  >
                                    {"Cancel Invite"}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      console.log({ tradieInfo });
                                      props.history.push({
                                        pathname: "/choose-the-job",
                                        state: {
                                          tradieId:
                                            tradieInfo?._id ||
                                            tradieInfo?.tradieId,
                                          path: props.location.search,
                                        },
                                      });
                                    }}
                                    className="fill_btn full_btn btn-effect"
                                  >
                                    {"Invite for job"}
                                  </button>
                                )}
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  console.log(
                                    { tradieInfo },
                                    "tradieInfo --><--"
                                  );
                                  props.history.push({
                                    pathname: "/choose-the-job",
                                    state: {
                                      tradieId:
                                        tradieInfo?._id || tradieInfo?.tradieId,
                                      path: props.location.search,
                                    },
                                  });
                                }}
                                className="fill_btn full_btn btn-effect"
                              >
                                {"Invite for job"}
                              </button>
                            )}
                          </div>
                        ) : haveJobId && tradieInfo?.isRequested ? (
                          <>
                            <div className="form_field">
                              <button
                                onClick={() => {
                                  submitAcceptDeclineRequest(1);
                                }}
                                className="fill_btn full_btn btn-effect"
                              >
                                Accept
                              </button>
                            </div>
                            <div className="form_field">
                              <button
                                onClick={() => {
                                  submitAcceptDeclineRequest(2);
                                }}
                                className="fill_grey_btn full_btn btn-effect"
                              >
                                Decline
                              </button>
                            </div>
                          </>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex_row">
                <div className="flex_col_sm_8">
                  {props.isSkeletonLoading ? (
                    <Skeleton count={2} />
                  ) : tradieInfo?.about?.length > 0 ? (
                    <div
                      className={`description ${
                        haveJobId && tradieInfo?.isRequested
                          ? "public_view_btn2"
                          : ""
                      }`}
                    >
                      <span className="sub_title">About</span>
                      <p className="commn_para">{tradieInfo?.about}</p>
                    </div>
                  ) : null}
                </div>
                {/* <div className="flex_col_sm_8">
                                    {props.isSkeletonLoading ? <Skeleton count={3} /> : userType === 1 ? (
                                        <>
                                            <div className="area">
                                                <span className="sub_title">Areas of specialisation</span>
                                                <div className={`tags_wrap ${toggleSpecialisation ? 'active' : ''}`}>
                                                    <ul>
                                                        {tradieInfo?.areasOfSpecialization?.tradeData[0]?.tradeName &&
                                                            <li className="main">
                                                                {tradieInfo?.areasOfSpecialization?.tradeData[0]?.tradeName || ''}
                                                            </li>}
                                                        {tradieInfo?.areasOfSpecialization?.specializationData?.map((item: any, index: any) => {
                                                            return toggleSpecialisation ? index <= 4 && <li key={item.specializationId}>{item.specializationName || ''}</li> : <li key={item.specializationId}>{item.specializationName || ''}</li>
                                                        })}
                                                    </ul>
                                                    <span className="link show_more"
                                                        onClick={(e: any) => {
                                                            e.preventDefault();
                                                            this.setState({ toggleSpecialisation: !this.state.toggleSpecialisation })
                                                        }}>
                                                        {toggleSpecialisation ? 'Show more' : 'Show less'}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (tradieInfo?.areasOfSpecialization?.length > 0 ? (
                                        <>
                                            <div className="area">
                                                <span className="sub_title">Areas of specialisation</span>
                                                <div className="tags_wrap">
                                                    <ul>
                                                        {tradieInfo?.tradeName && <li className="main">
                                                            {tradieInfo?.tradeName || ''}
                                                        </li>}
                                                        {tradieInfo?.areasOfSpecialization?.map((item: any) => {
                                                            return <li key={item.specializationId}>{item.specializationName}</li>
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </>
                                    ) : null)}
                                </div> */}
              </div>
            </div>
          </div>
          {tradieInfo?.portfolio?.length ? (
            <div className="section_wrapper">
              <span className="sub_title">
                {props.isSkeletonLoading ? <Skeleton /> : "Portfolio"}
              </span>
              <Carousel
                responsive={portfolio}
                showDots={false}
                arrows={true}
                infinite={true}
                className="portfolio_wrappr"
                partialVisbile
              >
                {props.isSkeletonLoading ? (
                  <Skeleton height={256} />
                ) : tradieInfo?.portfolio?.length ? (
                  tradieInfo?.portfolio?.map((item: any) => {
                    return (
                      <div
                        className="media"
                        key={item.portfolioId}
                        onClick={() => portfolioImageHandler(item)}
                      >
                        <figure className="portfolio_img">
                          <img
                            src={
                              item.portfolioImage?.length
                                ? item.portfolioImage[0]
                                : portfolioPlaceholder
                            }
                            alt="portfolio-images"
                          />
                          <span className="xs_sub_title">
                            <p className="line-3" title={item.jobName}>
                              {item.jobName}
                            </p>
                          </span>
                        </figure>
                      </div>
                    );
                  })
                ) : (
                  <img alt="" src={portfolioPlaceholder} />
                )}
              </Carousel>
            </div>
          ) : null}

          {/* portfolio Image modal desc */}
          {portfolioData?.portfolioImageClicked && (
            <Modal
              className="custom_modal"
              open={portfolioData.portfolioImageClicked}
              onClose={() => {
                this.setState((prev: any) => ({
                  portfolioData: {
                    ...prev.portfolioData,
                    portfolioImageClicked: false,
                  },
                }));
              }}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <div className="custom_wh portfolio_preview">
                <div className="heading">
                  <button
                    onClick={() => {
                      this.setState((prev: any) => ({
                        portfolioData: {
                          ...prev.portfolioData,
                          portfolioImageClicked: false,
                        },
                      }));
                    }}
                    className="close_btn"
                  >
                    <img src={cancel} alt="cancel" />
                  </button>
                </div>
                <div className="flex_row">
                  <div className="flex_col_sm_6">
                    <Carousel
                      responsive={portfolioModal}
                      showDots={true}
                      infinite={true}
                      autoPlay={true}
                      arrows={false}
                      className="portfolio_wrappr"
                    >
                      {portfolioData?.portfolioDetails &&
                      portfolioData?.portfolioDetails?.portfolioImage &&
                      portfolioData?.portfolioDetails?.portfolioImage
                        ?.length ? (
                        portfolioData?.portfolioDetails?.portfolioImage?.map(
                          (image: string) => {
                            return (
                              <div
                                className="media"
                                key={
                                  portfolioData?.portfolioDetails?.portfolioId
                                }
                              >
                                <figure className="portfolio_img">
                                  <img
                                    src={image ? image : portfolioPlaceholder}
                                    alt="portfolio-images"
                                  />
                                </figure>
                              </div>
                            );
                          }
                        )
                      ) : (
                        <img alt="" src={portfolioPlaceholder} />
                      )}
                    </Carousel>
                  </div>
                  <div className="flex_col_sm_6">
                    <span className="xs_sub_title">Job Description</span>
                    <div className="job_content">
                      <p>{portfolioData?.portfolioDetails?.jobDescription}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          )}

          <div className="section_wrapper">
            <span className="sub_title">
              {props.isSkeletonLoading ? <Skeleton /> : "Reviews"}
            </span>
            {props.isSkeletonLoading ? (
              <Skeleton height={200} />
            ) : (
              <div className="flex_row review_parent">
                {tradieInfo?.reviewData?.length > 0 ? (
                  tradieInfo?.reviewData?.slice(0, 8)?.map((jobData: any) => {
                    return <ReviewInfoBox item={jobData} {...props} />;
                  })
                ) : (
                  <div className="no_record">
                    <figure className="no_data_img">
                      <img src={noData} alt="data not found" />
                    </figure>
                    <span>No Data Found</span>
                  </div>
                )}
              </div>
            )}
            {props.isSkeletonLoading ? (
              <Skeleton height={25} />
            ) : (
              <button
                className={`fill_grey_btn full_btn view_more ${
                  !tradieInfo?.reviewsCount ? "disable_btn" : ""
                }`}
                onClick={() => {
                  this.setState((prevData: any) => ({
                    reviewsData: {
                      ...prevData.reviewsData,
                      showAllReviewsClicked: true,
                    },
                  }));
                  if (user_type == "1" || props.userType == 1) {
                    const mData = {
                      timeStamp: moengage.getCurrentTimeStamp(),
                    };
                    moengage.moE_SendEvent(MoEConstants.VIEWED_REVIEWS, mData);
                    mixPanel.mixP_SendEvent(MoEConstants.VIEWED_REVIEWS, mData);
                  }
                }}
              >
                {`View all ${tradieInfo?.reviewsCount || 0} ${
                  !!tradieInfo?.reviewsCount ? "review" : "reviews"
                } `}
              </button>
            )}
          </div>

          {tradieInfo?.vouchesData?.length ? (
            <div className="section_wrapper">
              <span className="sub_title">Vouches</span>
              <div className="flex_row">
                {tradieInfo?.vouchesData.slice(0, 8).map((item: any) => (
                  <div className="flex_col_sm_3">
                    <div className="review_card vouchers">
                      <div className="pic_shot_dtl">
                        <figure className="u_img">
                          <img
                            src={item?.builderImage || dummy}
                            onError={(e: any) => {
                              if (e?.target?.onerror) {
                                e.target.onerror = null;
                              }
                              if (e?.target?.src) {
                                e.target.src = dummy;
                              }
                            }}
                            alt="user-img"
                          />
                        </figure>
                        <div className="name_wrap">
                          <span
                            className="user_name"
                            title={item?.builderName || ""}
                          >
                            {item?.builderName || ""}
                          </span>
                          <span className="date">{item?.date}</span>
                        </div>
                      </div>

                      <span className="xs_head">{item?.jobName}</span>

                      <p className="commn_para" title="">
                        {item?.vouchDescription || ""}
                      </p>
                      <div className="vouch">
                        <figure className="vouch_icon">
                          <img src={vouch} alt="vouch" />
                        </figure>
                        <span
                          onClick={() => {
                            this.setState({
                              toggleVoucher: { item: item, isTrue: true },
                            });
                          }}
                          className="link"
                        >
                          {`Vouch for ${item?.tradieName}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className={`fill_grey_btn full_btn view_more ${
                  !tradieInfo?.vouchesData?.length ? "disable_btn" : ""
                }`}
                onClick={() => {
                  props.history.push({
                    pathname: "/tradie-vouchers",
                    state: {
                      path: props.location.search,
                      id: tradieInfo.tradieId,
                    },
                  });
                }}
              >
                {`View ${tradieInfo?.vouchesData?.length === 1 ? "" : "all"} ${
                  tradieInfo?.vouchesData?.length
                } vouch${tradieInfo?.vouchesData?.length === 1 ? "" : "es"}`}
              </button>
            </div>
          ) : storageService.getItem("userType") === 2 ? (
            <div className="section_wrapper">
              <div className="custom_container">
                <span className="sub_title">Vouches</span>

                <div className="flex_row review_parent">
                  <div className="no_record">
                    <figure className="no_data_img">
                      <img src={noData} alt="data not found" />
                    </figure>
                    <span>No Data Found</span>
                  </div>
                </div>

                <button
                  className="fill_grey_btn full_btn"
                  onClick={() => {
                    this.setState({
                      toggleAddVoucher: !this.state.toggleAddVoucher,
                    });
                  }}
                >
                  {`Leave a Vouch`}
                </button>
              </div>
            </div>
          ) : null}

          {storageService.getItem("userType") === 2 && (
            <AddVoucherComponent
              toggleProps={this.state.toggleAddVoucher}
              id={tradieInfo?.tradieId}
              closeToggle={this.closeAddVoucher}
            />
          )}

          {reviewsData.showAllReviewsClicked && tradieReviews?.length && (
            <Modal
              className="ques_ans_modal"
              open={reviewsData.showAllReviewsClicked}
              onClose={() => modalCloseHandler("showAllReviewsClicked")}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <div className="custom_wh">
                <div className="heading">
                  <span className="sub_title">{`${tradieInfo.reviewsCount} ${
                    tradieInfo?.reviewsCount === 1 ? "review" : "reviews"
                  }`}</span>
                  <button
                    className="close_btn"
                    onClick={() => modalCloseHandler("showAllReviewsClicked")}
                  >
                    <img src={cancel} alt="cancel" />
                  </button>
                </div>
                <div id="divScrollable" className="inner_wrap">
                  <InfiniteScroll
                    dataLength={tradieReviews?.length}
                    next={async () => {
                      const { tradeId } = this.getItemsFromLocation();
                      let cp = this.state.currentReviewPage + 1;
                      let prevValues = tradieReviews;
                      this.setState({
                        currentReviewPage: this.state.currentReviewPage + 1,
                      });
                      let res_trade: any = await getTradeReviews({
                        tradieId: tradeId,
                        page: cp,
                      });
                      if (res_trade?.success) {
                        let data_ = res_trade?.data?.list || res_trade?.data;
                        if (data_?.length) {
                          this.setState({
                            tradieReviews: [...prevValues, ...data_],
                          });
                        } else {
                          this.setState({ hasMore: false });
                        }
                      }
                    }}
                    hasMore={this.state.hasMore}
                    loader={<></>}
                    scrollableTarget="divScrollable"
                  >
                    {tradieReviews?.map((item: any) => {
                      let reviewData: any = item.reviewData;
                      let replyData: any = reviewData.replyData;
                      let replyId: any = replyData.replyId;
                      return (
                        <>
                          <div
                            className="question_ans_card"
                            key={reviewData.reviewId}
                          >
                            <div className="user_detail">
                              <figure className="user_img">
                                <img
                                  src={reviewData?.userImage || dummy}
                                  alt="user-img"
                                />
                              </figure>

                              <div className="details">
                                <span className="user_name">
                                  {reviewData?.name}
                                </span>
                                <span className="date">{reviewData?.date}</span>
                                <span className="item-star">
                                  <Rating
                                    fractions={2}
                                    emptySymbol={empty_star_rating_below}
                                    fullSymbol={full_star_rating_below}
                                    initialRating={reviewData?.rating}
                                    readonly={true}
                                  />
                                </span>
                              </div>
                            </div>
                            <p>{reviewData?.review}</p>

                            {storageService.getItem("userType") === 2 &&
                            item.reviewData.name ==
                              storageService.getItem("userInfo")?.userName ? (
                              <span
                                onClick={() => {
                                  reviewHandler(
                                    "editBuilderReview",
                                    reviewData?.reviewId,
                                    "",
                                    reviewData
                                  );
                                }}
                                className="action link"
                              >
                                {"Edit "}
                              </span>
                            ) : null}
                            {storageService.getItem("userType") === 2 &&
                            item.reviewData.name ==
                              storageService.getItem("userInfo")?.userName ? (
                              <span
                                onClick={() => {
                                  this.setState({
                                    delete: {
                                      isToggle: true,
                                      deleteId: reviewData?.reviewId,
                                    },
                                  });
                                }}
                                className="action link"
                              >
                                {"Delete "}
                              </span>
                            ) : null}
                            <br />
                            <br />
                            {Object.keys(reviewsData.replyShownHideList)
                              .length &&
                            reviewsData.replyShownHideList[
                              item?.reviewData?.reviewId
                            ] ? (
                              <span
                                className="action link"
                                onClick={() => {
                                  reviewHandler(
                                    "hideReviewClicked",
                                    "",
                                    item?.reviewData?.reviewId
                                  );
                                }}
                              >
                                {"Hide reply"}
                              </span>
                            ) : Object.keys(item?.reviewData?.replyData)
                                .length ? (
                              <span
                                className="show_hide_ans link"
                                onClick={() => {
                                  reviewHandler(
                                    "showReviewClicked",
                                    "",
                                    item?.reviewData?.reviewId
                                  );
                                }}
                              >
                                {"Show reply"}
                              </span>
                            ) : storageService.getItem("userType") === 1 ? (
                              <span
                                className="action link"
                                onClick={() => {
                                  reviewHandler(
                                    "reviewReplyClicked",
                                    item?.reviewData?.reviewId
                                  );
                                }}
                              >
                                {"Reply"}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                          {Object.keys(reviewsData.replyShownHideList).length &&
                          reviewsData.replyShownHideList[
                            item?.reviewData?.reviewId
                          ] ? (
                            <div className="question_ans_card answer">
                              <div className="user_detail">
                                <figure className="user_img">
                                  <img
                                    src={
                                      reviewData?.replyData?.userImage || dummy
                                    }
                                    alt="user-img"
                                  />
                                </figure>
                                <div className="details">
                                  <span className="user_name">
                                    {reviewData?.replyData?.userName}
                                  </span>
                                  <span className="date">
                                    {reviewData?.replyData?.date}
                                  </span>
                                </div>
                              </div>
                              <p>{reviewData?.replyData?.reply}</p>
                              {reviewData?.replyData?.isModifiable && (
                                <span
                                  className="action link"
                                  onClick={() => {
                                    reviewHandler(
                                      "updateReviewReply",
                                      item?.reviewData?.reviewId,
                                      item?.reviewData?.replyData?.replyId,
                                      reviewData?.replyData?.reply
                                    );
                                  }}
                                >
                                  {"Edit"}
                                </span>
                              )}
                              {reviewData?.replyData?.isModifiable && (
                                <span
                                  className="action link"
                                  onClick={() => {
                                    reviewHandler(
                                      "removeReviewReply",
                                      item?.reviewData?.reviewId,
                                      item?.reviewData?.replyData?.replyId
                                    );
                                  }}
                                >
                                  {"Delete"}
                                </span>
                              )}
                            </div>
                          ) : null}
                        </>
                      );
                    })}
                  </InfiniteScroll>
                </div>
              </div>
            </Modal>
          )}
          {/* post reply modal */}
          {reviewsData.reviewReplyClicked && (
            <Modal
              className="ques_ans_modal"
              open={reviewsData.reviewReplyClicked}
              onClose={() => {
                modalCloseHandler("reviewReplyClicked");
              }}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <>
                <div className="custom_wh ask_ques">
                  <div className="heading">
                    <span className="sub_title">{`${
                      reviewsData?.updateReviewsClicked ? "Edit reply" : "Reply"
                    }`}</span>
                    <button
                      className="close_btn"
                      onClick={() => {
                        modalCloseHandler("reviewReplyClicked");
                      }}
                    >
                      <img src={cancel} alt="cancel" />
                    </button>
                  </div>
                  <div className="form_field">
                    <label className="form_label">Your reply</label>
                    <div className="text_field">
                      <textarea
                        placeholder="Text"
                        value={reviewsData.reviewData}
                        onChange={(e) => {
                          handleChange(e, "reviewData");
                        }}
                      ></textarea>
                      <span className="char_count">{`${
                        reviewsData.reviewData?.length || "0"
                      }/250`}</span>
                    </div>
                  </div>
                  <div className="bottom_btn custom_btn">
                    {reviewsData.updateReviewsClicked ? (
                      <button
                        className="fill_btn full_btn btn-effect"
                        onClick={() => {
                          submitReviewHandler("updateReviewReply");
                        }}
                      >
                        {"Save"}
                      </button>
                    ) : (
                      <button
                        className="fill_btn full_btn btn-effect"
                        onClick={() => {
                          reviewHandler("reviewReply");
                        }}
                      >
                        {"Send"}
                      </button>
                    )}
                    <button
                      className="fill_grey_btn btn-effect"
                      onClick={() => {
                        reviewHandler("replyCancelBtnClicked");
                      }}
                    >
                      {"Cancel"}
                    </button>
                  </div>
                </div>
              </>
            </Modal>
          )}
          {/* send confirmation yes/no modal */}
          {reviewsData.confirmationClicked && (
            <Modal
              className="custom_modal"
              open={reviewsData.confirmationClicked}
              onClose={() => modalCloseHandler("confirmationClicked")}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <>
                <div className="custom_wh confirmation">
                  <div className="heading">
                    <span className="xs_sub_title">{`${
                      reviewsData.deleteReviewsClicked
                        ? "Delete"
                        : reviewsData.updateReviewsClicked
                        ? "Update"
                        : ""
                    } Reply Confirmation`}</span>
                    <button
                      className="close_btn"
                      onClick={() => modalCloseHandler("confirmationClicked")}
                    >
                      <img src={cancel} alt="cancel" />
                    </button>
                  </div>
                  <div className="modal_message">
                    <p>{`Are you sure you want to ${
                      reviewsData.deleteReviewsClicked ? "delete " : ""
                    }reply?`}</p>
                  </div>
                  <div className="dialog_actions">
                    <button
                      className="fill_btn btn-effect"
                      onClick={() =>
                        submitReviewHandler(reviewsData.reviewsClickedType)
                      }
                    >
                      Yes
                    </button>
                    <button
                      className="fill_grey_btn btn-effect"
                      onClick={() => modalCloseHandler("confirmationClicked")}
                    >
                      No
                    </button>
                  </div>
                </div>
              </>
            </Modal>
          )}

          {reviewsData.editBuilderReview && (
            <Modal
              className="ques_ans_modal"
              open={reviewsData.editBuilderReview}
              onClose={() => {
                modalCloseHandler("editBuilderReview");
              }}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <>
                <div className="custom_wh ask_ques">
                  <div className="heading">
                    <span className="sub_title">{"Edit Review"}</span>
                    <button
                      className="close_btn"
                      onClick={() => {
                        modalCloseHandler("editBuilderReview");
                      }}
                    >
                      <img src={cancel} alt="cancel" />
                    </button>
                  </div>
                  <div className="form_field">
                    <label className="form_label">Your Review</label>
                    <ReactStars
                      value={reviewsData?.reviewData?.rating}
                      count={5}
                      isHalf={true}
                      onChange={(newRating: any) => {
                        this.setState((prevData: any) => {
                          console.log({ prevData });
                          return {
                            reviewsData: {
                              ...prevData.reviewsData,
                              reviewData: {
                                ...prevData?.reviewsData?.reviewData,
                                rating: newRating,
                              },
                            },
                          };
                        });
                      }}
                      size={40}
                      activeColor="#ffd700"
                      color="#DFE5EF"
                    />
                    <div className="text_field">
                      <textarea
                        placeholder="Text"
                        value={reviewsData?.reviewData?.review}
                        onChange={(e) => {
                          handleChange(e, "reviewData", "review");
                        }}
                      ></textarea>
                      <span className="char_count">{`${
                        reviewsData?.reviewData?.review?.length || "0"
                      }/250`}</span>
                    </div>
                  </div>
                  <div className="bottom_btn custom_btn">
                    <button
                      className="fill_btn full_btn btn-effect"
                      onClick={() => {
                        submitReviewHandler("updateBuilderReview");
                      }}
                    >
                      {"Save"}
                    </button>
                    <button
                      className="fill_grey_btn btn-effect"
                      onClick={() => {
                        reviewHandler("cancelBuilderReview");
                      }}
                    >
                      {"Cancel"}
                    </button>
                  </div>
                </div>
              </>
            </Modal>
          )}

          <Dialog
            open={this.state?.delete?.isToggle}
            // onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Do you want to delete this review ?"}
            </DialogTitle>
            <DialogActions>
              <Button
                onClick={async () => {
                  let response = await deleteReviewTradie({
                    reviewId: this.state?.delete?.deleteId,
                  });
                  if (response?.success) {
                    this.setState(
                      {
                        delete: {
                          isToggle: false,
                          deleteId: "",
                        },
                      },
                      () => {
                        this.setItems();
                      }
                    );
                  }
                }}
                color="primary"
              >
                {"Yes"}
              </Button>
              <Button
                onClick={() => {
                  this.setState({
                    delete: {
                      isToggle: false,
                      deleteId: "",
                    },
                  });
                }}
                color="primary"
                autoFocus
              >
                {"No"}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

const mapState = (state: any) => ({
  tradieInfo: state.profile.tradieInfo,
  userType: state.profile.userType,
  tradeListData: state.auth.tradeListData,
  tradieReviews: state.jobs.tradieReviews,
  tradieRequestStatus: state.jobs.tradieRequestStatus,
  tradieProfileViewData: state.profile.tradieProfileViewData,
  isSkeletonLoading: state.common.isSkeletonLoading,
});

const mapProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getTradieProfile,
      getTradieReviewListOnBuilder,
      getAcceptDeclineTradie,
      getTradieProfileView,
    },
    dispatch
  );
};

export default connect(mapState, mapProps)(TradieInfo);
