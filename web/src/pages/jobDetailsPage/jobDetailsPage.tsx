import { useState, useEffect } from "react";
import Constants, { MoEConstants } from "../../utils/constants";
import { renderTime, JobCancelReasons } from "../../utils/common";
import {
  getHomeJobDetails,
  getHomeSaveJob,
  postHomeApplyJob,
} from "../../redux/homeSearch/actions";
import {
  getJobDetails,
  getTradieQuestionList,
  postAskQuestion,
  askNestedQuestion,
  updateAnswer,
  deleteAnswer,
  deleteQuestion,
  updateQuestion,
  replyCancellation,
  replyChangeRequest,
  acceptDeclineJobInvitation,
} from "../../redux/jobs/actions";
import Modal from "@material-ui/core/Modal";

import cancel from "../../assets/images/ic-cancel.png";
import dummy from "../../assets/images/u_placeholder.jpg";
import jobDummyImage from "../../assets/images/ic-placeholder-detail.png";
import question from "../../assets/images/ic-question.png";
import leftIcon from "../../assets/images/ic-back-arrow-line.png";
import rightIcon from "../../assets/images/ic-next-arrow-line.png";
import noDataFound from "../../assets/images/no-search-data.png";
import editIconBlue from "../../assets/images/ic-edit-blue.png";
import pendingIcon from "../../assets/images/exclamation-icon.png";
import moment from "moment";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

//@ts-ignore
import FsLightbox from "fslightbox-react";
import Skeleton from "react-loading-skeleton";
import storageService from "../../utils/storageService";

import docThumbnail from "../../assets/images/add-document.png";
import { setShowToast } from "../../redux/common/actions";
import { moengage, mixPanel } from "../../services/analyticsTools";

interface PropsType {
  history: any;
  location: any;
  tradieProfileData: any;
  isSkeletonLoading: boolean;
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

const JobDetailsPage = (props: PropsType) => {
  const [errors, setErrors] = useState<any>({});
  const [jobDetailsData, setJobDetailsData] = useState<any>("");
  const [redirectFrom, setRedirectFrom] = useState<string>("");
  const [jobInviteAction, setJobInviteAction] = useState<string>("");
  const [jobConfirmation, setJobConfirmation] = useState<any>({
    isJobModalOpen: false,
    tradieTradeId: "",
    isJobModalAuthorized: false,
  });
  const [questionList, setQuestionList] = useState<Array<any>>([]);
  const [questionListPageNo, setQuestionListPageNo] = useState<number>(1);
  const [showMoreIndex, setShowMoreIndex] = useState<Array<any>>([]);
  const [questionsData, setQuestionsData] = useState<any>({
    askQuestionsClicked: false,
    showAllQuestionsClicked: false,
    submitQuestionsClicked: false,
    deleteQuestionsClicked: false,
    updateQuestionsClicked: false,
    isNestedAction: false,
    questionsClickedType: "",
    confirmationClicked: false,
    showAnswerButton: true,
    questionId: "",
    answerId: "",
    questionData: "",
    answerShownHideList: [],
    questionIndex: null,
  });

  const [toggler, setToggler] = useState(false);
  const [selectedSlide, setSelectSlide] = useState(1);
  const [jobActionState, setJobActionState] = useState({
    isCancelRequestAcceptedClicked: false,
    isCancelRequestRejectedClicked: false,
    replyCancelReason: "",
    isChangeRequestAcceptedClicked: false,
    isChangeRequestRejectedClicked: false,
    replyChangeRequestReason: "",
  });
  const [pendingRequestClicked, setPendingRequestClicked] =
    useState<boolean>(false);
  const [fsSlideListner, setFsSlideListner] = useState<any>({});

  useEffect(() => {
    console.log("143");
    const params = new URLSearchParams(props.location?.search);
    const jobInviteAction: any = params.get("jobAction");
    setJobInviteAction(jobInviteAction);
    (async () => {
      const redirectFrom: any = params.get("redirect_from");
      setRedirectFrom(redirectFrom);
      var data: any = {};
      var res1: any;
      if (redirectFrom) {
        data.jobId = params.get("jobId");
        res1 = await getJobDetails(data.jobId);
      } else {
        console.log(params.get("specializationId"), "params.get");
        data.jobId = params.get("jobId");
        data.tradeId = params.get("tradeId");
        if (params.get("specializationId")) {
          console.log("160");
          data.specializationId = params.get("specializationId");
        }
        res1 = await getHomeJobDetails(data);
        console.log(res1, "164");
      }
      if (res1.success) {
        setJobDetailsData(res1.data);
      }
      const questionData: any = {
        jobId: params.get("jobId"),
        page: 1,
      };
      const res2 = await getTradieQuestionList(questionData);
      if (res2.success) {
        if (params.get("openQList") === "true") {
          setQuestionsData((prevData: any) => ({
            ...prevData,
            showAllQuestionsClicked: true,
          }));
        }
        setQuestionList(res2.data);
      }
    })();
  }, []);

  useEffect(() => {
    if (props.tradieProfileData?.trade?.length > 0) {
      setJobConfirmation((prevData: any) => ({
        ...prevData,
        tradieTradeId: props.tradieProfileData?.trade[0],
      }));
    }
  }, [props.tradieProfileData]);

  useEffect(() => {
    let fsSlideObj: any = {};
    let slideCount = 1;

    if (jobDetailsData?.photos?.length) {
      jobDetailsData?.photos.forEach((item: any, index: number) => {
        if (item?.mediaType === 1 || item?.mediaType === 2) {
          fsSlideObj[`${index}`] = slideCount++;
        }
      });
    }
    if (Object.keys(fsSlideObj)?.length > 0) setFsSlideListner(fsSlideObj);
  }, [jobDetailsData?.photos]);

  const applyJobClicked = async () => {
    var isValid = true;
    if (
      jobConfirmation.tradieTradeId !== jobDetailsData?.tradeId &&
      !jobConfirmation.isJobModalAuthorized
    ) {
      setJobConfirmation((prevData: any) => ({
        ...prevData,
        isJobModalOpen: true,
        isJobModalAuthorized: true,
      }));
      isValid = false;
    } else if (jobDetailsData?.quoteJob) {
      quoteBtnActions();
      return;
    }

    if (isValid && !jobDetailsData?.quoteJob) {
      const data: any = {
        jobId: jobDetailsData?.jobId,
        builderId: jobDetailsData?.postedBy?.builderId,
        tradeId: jobDetailsData?.tradeId,
      };
      if (jobDetailsData?.specializationId) {
        data.specializationId = jobDetailsData?.specializationId;
      }
      const res = await postHomeApplyJob(data);
      if (res.success) {
        const mData = {
          timeStamp: moengage.getCurrentTimeStamp(),
        };
        moengage.moE_SendEvent(MoEConstants.APPLIED_FOR_A_JOB, mData);
        mixPanel.mixP_SendEvent(MoEConstants.APPLIED_FOR_A_JOB, mData);
        props.history.push("job-applied-successfully");
      }
    }
  };

  const saveJobClicked = () => {
    const data: any = {
      jobId: jobDetailsData?.jobId,
      tradeId: jobDetailsData?.tradeId,
      isSave: !jobDetailsData?.isSaved,
    };
    if (jobDetailsData?.specializationId) {
      data.specializationId = jobDetailsData?.specializationId;
    }
    getHomeSaveJob(data);
    setJobDetailsData((prevData: any) => ({
      ...prevData,
      isSaved: !prevData.isSaved,
    }));
  };

  const modalCloseHandler = (modalType: string) => {
    setQuestionsData((prevData: any) => ({
      ...prevData,
      [modalType]: false,
      deleteQuestionsClicked: false,
      answerShownHideList: [],
      questionData: "",
    }));
    setErrors({});
    showMoreIndex && setShowMoreIndex([]);
  };

  const loadMoreQuestionHandler = async () => {
    const data: any = {
      jobId: jobDetailsData?.jobId,
      page: questionListPageNo + 1,
    };
    const res = await getTradieQuestionList(data, true);
    if (res.success) {
      setQuestionList((prevData: any) => [...prevData, ...res.data]);
      setQuestionListPageNo(data.page);
    }
  };

  const validateForm = (type: string) => {
    if (type === "deleteQuestion") return true;
    const newErrors: any = {};
    if (!questionsData.questionData.trim()?.length) {
      newErrors.questionData = Constants.errorStrings.askQuestion;
    }
    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  const submitQuestionHandler = async (type: any) => {
    let isNestedAction = questionsData?.isNestedAction;

    if (["askQuestion", "deleteQuestion", "updateQuestion"].includes(type)) {
      if (!validateForm(type)) {
        return;
      }
      var response: any;
      var data: any;
      var data2: any;
      if (type === "askQuestion") {
        data = {
          jobId: jobDetailsData?.jobId,
          builderId: jobDetailsData?.postedBy?.builderId,
          question: questionsData.questionData.trim(),
          tradeId: jobDetailsData?.tradeId,
          specializationId: jobDetailsData?.specializationId,
        };

        data2 = {
          tradieId: questionList[0]?.tradieId,
          builderId: questionList[0]?.builderId,
          answer: questionsData.questionData.trim(),
          questionId: questionsData.questionId,
        };

        response = isNestedAction
          ? await askNestedQuestion(data2)
          : await postAskQuestion(data);
        if (response?.success) {
          const mData = {
            timeStamp: moengage.getCurrentTimeStamp(),
          };
          moengage.moE_SendEvent(MoEConstants.ASKED_A_QUESTION, mData);
          mixPanel.mixP_SendEvent(MoEConstants.ASKED_A_QUESTION, mData);
        }
      } else if (type === "deleteQuestion") {
        data = {
          jobId: jobDetailsData?.jobId,
          questionId: questionsData.questionId,
        };

        data2 = {
          questionId: questionsData.questionId,
          answerId: questionsData.answerId,
        };
        response = isNestedAction
          ? await deleteAnswer(data2)
          : await deleteQuestion(data);
      } else if (type === "updateQuestion") {
        data = {
          questionId: questionsData.questionId,
          question: questionsData.questionData.trim(),
        };

        data2 = {
          questionId: questionsData.questionId,
          answerId: questionsData.answerId,
          answer: questionsData.questionData,
        };
        response = isNestedAction
          ? await updateAnswer(data2)
          : await updateQuestion(data);
      }

      if (isNestedAction && response?.success) {
        const askData: any = {
          jobId: jobDetailsData?.jobId,
          page: 1,
        };
        const res = await getTradieQuestionList(askData, true);
        if (res.success) {
          setQuestionList(res.data);
          setQuestionListPageNo(1);
        }
      } else if (response?.success) {
        if (type === "askQuestion" && response.data?.questionData?.question) {
          const askData: any = {
            jobId: jobDetailsData?.jobId,
            page: 1,
          };
          const res = await getTradieQuestionList(askData, true);
          if (res.success) {
            setJobDetailsData((prevData: any) => ({
              ...prevData,
              questionsCount: prevData.questionsCount + 1,
            }));
          }
          setQuestionList(res.data);
          setQuestionListPageNo(1);
        }

        if (type === "updateQuestion" && response.data?.question) {
          let updatedQuestionList = [...questionList];
          var newList = updatedQuestionList.find(
            (item: any) => item._id == response.data?.questionId
          );
          newList.question = response.data?.question;
          setQuestionList(updatedQuestionList);
        }

        if (type === "deleteQuestion") {
          setJobDetailsData((prevData: any) => ({
            ...prevData,
            questionsCount: prevData.questionsCount - 1,
          }));
          let updatedQuestionList = [...questionList];
          updatedQuestionList.splice(questionsData.questionIndex, 1);
          setQuestionList(updatedQuestionList);
        }
      }

      if (response?.success) {
        setQuestionsData((prevData: any) => ({
          ...prevData,
          submitQuestionsClicked: false,
          askQuestionsClicked: false,
          showAllQuestionsClicked: true,
          confirmationClicked: false,
          questionsClickedType: "",
          deleteQuestionsClicked: false,
          updateQuestionsClicked: false,
          isNestedAction: false,
          questionId: "",
          answerId: "",
          questionData: "",
          showQuestionAnswer: false,
          questionIndex: null,
        }));
      }
    }
  };

  const questionHandler = (
    actionType: any,
    questionId?: string,
    question?: any,
    questionIndex?: any,
    answerId?: any
  ) => {
    let type = Array.isArray(actionType) ? actionType[0] : actionType;
    let isNestedAction = Array.isArray(actionType) ? true : false;

    if (type === "submitAskQuestion" && validateForm("askQuestion")) {
      setQuestionsData((prevData: any) => ({
        ...prevData,
        submitQuestionsClicked: true,
        confirmationClicked: true,
      }));
    } else if (type === "askQuestion") {
      setQuestionsData((prevData: any) => ({
        ...prevData,
        askQuestionsClicked: true,
        showAllQuestionsClicked: false,
        questionsClickedType: type,
        ...(questionId && { questionId: questionId }),
        ...(isNestedAction && { isNestedAction: true }),
      }));
    } else if (type === "deleteQuestion") {
      setQuestionsData((prevData: any) => ({
        ...prevData,
        confirmationClicked: true,
        deleteQuestionsClicked: true,
        questionId: questionId,
        answerId: answerId,
        questionsClickedType: type,
        questionIndex: questionIndex,
        ...(isNestedAction && { isNestedAction: true }),
      }));
    } else if (type === "updateQuestion") {
      setQuestionsData((prevData: any) => ({
        ...prevData,
        askQuestionsClicked: true,
        updateQuestionsClicked: true,
        questionId: questionId,
        answerId: answerId,
        questionsClickedType: type,
        showAllQuestionsClicked: false,
        questionData: question,
        ...(isNestedAction && { isNestedAction: true }),
      }));
    } else if (type === "questionCancelBtnClicked") {
      setQuestionsData((prevData: any) => ({
        ...prevData,
        askQuestionsClicked: false,
        updateQuestionsClicked: false,
        deleteQuestionsClicked: false,
        showAllQuestionsClicked: true,
        isNestedAction: false,
        questionData: "",
        questionsClickedType: "",
        questionId: "",
        answerId: "",
      }));
      setErrors({});
    } else if (type === "hideAnswerClicked") {
      const newData = [...questionsData.answerShownHideList].filter(
        (id) => id !== questionId
      );
      setQuestionsData((prevData: any) => ({
        ...prevData,
        answerShownHideList: newData,
      }));
    } else if (type === "showAnswerClicked") {
      const newData = [...questionsData.answerShownHideList];
      newData.push(questionId);
      setQuestionsData((prevData: any) => ({
        ...prevData,
        answerShownHideList: newData,
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    type: string
  ) => {
    if (e.target.value.trim().length <= 1000) {
      setQuestionsData((prevData: any) => ({
        ...prevData,
        [type]: e.target.value,
      }));
    }
  };

  const closeApplyJobModal = () => {
    setJobConfirmation((prevData: any) => ({
      ...prevData,
      isJobModalOpen: false,
      isJobModalAuthorized: false,
    }));
  };

  const replyCancellationHandler = async (type: string) => {
    const data: any = {
      jobId: jobDetailsData?.jobId,
      status: type === "acceptJobCancelRequest" ? 1 : 2,
      note:
        type === "acceptJobCancelRequest"
          ? "job accepted"
          : jobActionState.replyCancelReason
          ? jobActionState.replyCancelReason?.trim()
          : "job rejected",
    };
    const res = await replyCancellation(data);
    if (res.success) {
      if (type === "acceptJobCancelRequest") {
        const mData = {
          timeStamp: moengage.getCurrentTimeStamp(),
        };
        moengage.moE_SendEvent(MoEConstants.ACCEPT_CANCELLATION, mData);
        mixPanel.mixP_SendEvent(MoEConstants.ACCEPT_CANCELLATION, mData);
        props.history.push("/request-monitored/ccr");
      } else {
        const mData = {
          timeStamp: moengage.getCurrentTimeStamp(),
        };
        moengage.moE_SendEvent(MoEConstants.REJECT_CANCELLATION, mData);
        mixPanel.mixP_SendEvent(MoEConstants.REJECT_CANCELLATION, mData);
        props.history.push("/request-monitored/cc");
      }
      setJobActionState((prevData: any) => ({
        ...prevData,
        isCancelRequestAcceptedClicked: false,
        isCancelRequestRejectedClicked: false,
        replyCancelReason: "",
      }));
    }
  };

  const replyChangeRequestHandler = async (type: string) => {
    const data: any = {
      jobId: jobDetailsData?.jobId,
      status: type === "acceptChangeRequest" ? 1 : 2,
      note:
        type === "acceptChangeRequest"
          ? "change request accepted"
          : jobActionState.replyCancelReason
          ? jobActionState.replyCancelReason?.trim()
          : "change request rejected",
    };
    const res = await replyChangeRequest(data);
    if (res.success) {
      if (type === "acceptChangeRequest") {
        props.history.push("/request-monitored/cr");
      } else {
        props.history.push("/request-monitored/cc");
      }
      setJobActionState((prevData: any) => ({
        ...prevData,
        isChangeRequestAcceptedClicked: false,
        isChangeRequestRejectedClicked: false,
        replyCancelReason: "",
      }));
    }
  };

  const closeJobActionConfirmationModal = (name: string) => {
    setJobActionState((prevData: any) => ({
      ...prevData,
      [name]: false,
      isChangeRequestAcceptedClicked: false,
      isChangeRequestRejectedClicked: false,
    }));
  };

  const getPendingRequestCount = () => {
    const a: number = jobDetailsData?.isCancelJobRequest ? 1 : 0;
    const b: number = jobDetailsData?.isChangeRequest ? 1 : 0;
    const c: number = jobDetailsData?.rejectReasonNoteForCancelJobRequest
      ? 1
      : 0;
    return a + b + c;
  };

  const inviteJobActionHandler = async (type: number) => {
    let data = {
      jobId: jobDetailsData?.jobId,
      builderId: jobDetailsData?.postedBy?.builderId,
      isAccept: type === 1 ? true : false,
    };
    const res: any = await acceptDeclineJobInvitation(data);
    if (res.success) {
      setJobInviteAction("");
      props.history.replace(
        `job-details-page?jobId=${jobDetailsData?.jobId}&redirect_from=jobs`
      );
      if (type === 2) {
        setShowToast(true, res.msg);
        if (!jobInviteAction) {
          const newData = { ...jobDetailsData };
          newData.isInvited = false;
          delete newData.jobStatus;
          setJobDetailsData(newData);
        }
      }

      if (type === 1) {
        props.history.push("/active-jobs");
      }
    }
  };

  const quoteBtnActions = () => {
    const path =
      jobDetailsData?.jobStatus === ""
        ? `/quote-job`
        : jobDetailsData?.jobStatus === "applied"
        ? `/quote-job`
        : jobDetailsData?.jobStatus === "active"
        ? `/active-quote-job`
        : "";
    const redirectFrom =
      jobDetailsData?.jobStatus === ""
        ? "jobDetailPage"
        : jobDetailsData?.jobStatus === "applied"
        ? "appliedJobs"
        : "";
    if (path) {
      props.history.push({
        pathname: path,
        state: {
          jobData: jobDetailsData,
          ...(redirectFrom && { redirect_from: redirectFrom }),
          base_redirect: "jobDetailPage",
        },
      });
    }
  };

  const renderBuilderAvatar = (item: any) => {
    let postedBy: any = jobDetailsData?.postedBy;
    console.log({ jobDetailsData });
    if (item === "image") {
      if (
        postedBy &&
        Array.isArray(postedBy) &&
        postedBy[0] &&
        postedBy[0].builderImage
      ) {
        return (
          <img
            src={postedBy[0]?.builderImage || dummy}
            onError={(e: any) => {
              if (e?.target?.onerror) {
                e.target.onerror = null;
              }
              if (e?.target?.src) {
                e.target.src = dummy;
              }
            }}
            alt="traide-img"
          />
        );
      } else {
        return <img src={dummy} alt="traide-img" />;
      }
    }
    if (item === "name") {
      if (
        postedBy &&
        Array.isArray(postedBy) &&
        postedBy[0] &&
        postedBy[0].firstName
      ) {
        return postedBy[0].firstName;
      }
    }
  };

  const renderFilteredItems = (itemsMedia: any) => {
    let sources: any = [];
    let types: any = [];

    if (itemsMedia && Array.isArray(itemsMedia) && itemsMedia.length) {
      itemsMedia.forEach((item: any) => {
        if (item?.mediaType === 2) {
          sources.push(item.link);
          types.push("video");
        }
        if (item?.mediaType === 1) {
          sources.push(item.link);
          types.push("image");
        }
      });
    }

    return { sources, types };
  };

  let itemsMedia: any = [];
  if (jobDetailsData?.photos?.length) {
    itemsMedia = jobDetailsData.photos;
  }
  const { sources, types } = renderFilteredItems(itemsMedia);

  const filterFileName = (link: any) => {
    if (link?.length) {
      let arrItems = link.split("/");
      return arrItems[arrItems?.length - 1];
    }
  };

  const isPendingRequest = () => {
    if (
      !jobInviteAction &&
      ((jobDetailsData?.isCancelJobRequest &&
        jobDetailsData?.jobStatus === "active") ||
        (jobDetailsData?.isChangeRequest &&
          jobDetailsData?.jobStatus === "active") ||
        jobDetailsData?.reasonNoteForCancelJobRequest?.length > 0 ||
        jobDetailsData?.rejectReasonNoteForCancelJobRequest?.length > 0) &&
      ["active", "cancelled"].includes(
        redirectFrom === "jobs"
          ? jobDetailsData?.jobStatus?.toLowerCase()
          : jobDetailsData?.appliedStatus?.toLowerCase()
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  const showNestedAnswersData = (
    answers: Array<any>,
    questionId: string,
    indexP: number
  ) => {
    let val = answers
      .slice(
        0,
        showMoreIndex?.length && indexP === showMoreIndex[0]
          ? answers?.length
          : 3
      )
      ?.map((item: any, indexC: number) => {
        return (
          <div
            className={`question_ans_card answer ${
              item?.sender_user_type === 1 ? "tradie_ans" : ""
            }`}
          >
            <div className="user_detail">
              <figure className="user_img">
                <img
                  src={`${
                    item?.sender_user_type === 1
                      ? item?.tradie?.[0]?.user_image
                      : item?.builder?.[0]?.user_image
                      ? item?.builder?.[0]?.user_image
                      : dummy
                  }`}
                  alt="user-img"
                />
              </figure>
              <div className="details">
                <span className="user_name">{`${
                  item?.sender_user_type === 1
                    ? item?.tradie?.[0]?.firstName
                    : item?.builder?.[0]?.firstName
                    ? item?.builder?.[0]?.firstName
                    : ""
                }`}</span>
                <span className="date">
                  {moment(item?.updatedAt).format("Do MMMM YYYY") || ""}
                </span>
              </div>
            </div>
            <p>{item?.answer}</p>
            {indexC === answers?.length - 1 &&
              answers?.length > 0 &&
              answers?.[answers?.length - 1]?.sender_user_type === 1 && (
                <>
                  <span
                    className="action link"
                    onClick={() =>
                      questionHandler(
                        ["updateQuestion"],
                        questionId,
                        answers?.[answers?.length - 1]?.answer,
                        null,
                        item?._id
                      )
                    }
                  >
                    Edit
                  </span>
                  <span
                    className="action link"
                    onClick={() =>
                      questionHandler(
                        ["deleteQuestion"],
                        questionId,
                        "",
                        answers?.length - 1,
                        answers?.[answers?.length - 1]?._id
                      )
                    }
                  >
                    Delete
                  </span>
                </>
              )}

            {indexC === 2 &&
              answers?.length > 3 &&
              indexP !== showMoreIndex[0] && (
                <span
                  className="show_hide_ans link"
                  onClick={() => setShowMoreIndex([indexP])}
                >
                  Show more
                </span>
              )}

            {indexC === answers?.length - 1 &&
              answers?.length > 0 &&
              answers?.[answers?.length - 1]?.sender_user_type === 2 && (
                <span
                  onClick={() => questionHandler(["askQuestion"], questionId)}
                  className="show_hide_ans link"
                >
                  {"Reply"}
                </span>
              )}
          </div>
        );
      });
    return val;
  };
  console.log(
    jobDetailsData,
    "jobDetailsDatajobDetailsDatajobDetailsDatajobDetailsData"
  );
  return (
    <div className="app_wrapper">
      <div className="section_wrapper">
        <div className="custom_container">
          <FsLightbox
            toggler={toggler}
            slide={selectedSlide}
            sources={sources}
            types={types}
          />

          <div className="vid_img_wrapper pt-20">
            <div className="flex_row relative">
              {props.isSkeletonLoading ? (
                <Skeleton />
              ) : (
                <div className="flex_col_sm_8">
                  <button
                    className="back"
                    onClick={() => props.history?.goBack()}
                  ></button>
                </div>
              )}
              {!jobInviteAction &&
              !jobDetailsData?.isCancelJobRequest &&
              !jobDetailsData?.isChangeRequest &&
              !jobDetailsData?.appliedStatus &&
              !props.isSkeletonLoading &&
              jobDetailsData.jobStatus === "active" ? (
                <div className="flex_col_sm_4 text-right">
                  <span className="dot_menu">
                    <img src={editIconBlue} alt="edit" />
                    <div className="edit_menu">
                      <ul>
                        <li
                          className="icon lodge"
                          onClick={() =>
                            props.history.push(
                              `mark-milestone?jobId=${jobDetailsData?.jobId}&redirect_from=jobs&jobAction=dispute`
                            )
                          }
                        >
                          Lodge dispute
                        </li>
                        <li
                          className="icon delete"
                          onClick={() =>
                            props.history.push(
                              `mark-milestone?jobId=${jobDetailsData?.jobId}&redirect_from=jobs&jobAction=cancel`
                            )
                          }
                        >
                          Cancel job
                        </li>
                      </ul>
                    </div>
                  </span>
                  <span
                    className={`bookmark_icon ${
                      jobDetailsData?.isSaved ? "active" : ""
                    }`}
                    onClick={saveJobClicked}
                  ></span>
                </div>
              ) : props.isSkeletonLoading ? (
                <Skeleton />
              ) : (
                <span
                  className={`bookmark_icon ${
                    jobDetailsData?.isSaved ? "active" : ""
                  }`}
                  onClick={saveJobClicked}
                ></span>
              )}
            </div>
            <div className="flex_col_sm_4 relative">
              <div className="detail_card">
                <span className="title line-1" title={jobDetailsData?.jobName}>
                  {props.isSkeletonLoading ? (
                    <Skeleton />
                  ) : jobDetailsData?.jobName ? (
                    jobDetailsData?.jobName
                  ) : (
                    ""
                  )}
                </span>
                <span className="tagg">
                  {props.isSkeletonLoading ? <Skeleton /> : "Job details"}
                </span>
                <div className="job_info">
                  {props?.isSkeletonLoading ? (
                    <Skeleton count={2} />
                  ) : (
                    <ul>
                      <li
                        className={`icon ${
                          ["completed", "cancelled", "expired"].includes(
                            jobDetailsData?.jobStatus?.toLowerCase()
                          )
                            ? "calendar"
                            : "clock"
                        }`}
                      >
                        {`${
                          redirectFrom === "jobs"
                            ? renderTime(
                                jobDetailsData?.fromDate,
                                jobDetailsData?.toDate
                              )
                            : jobDetailsData?.time || ""
                        }`}
                      </li>
                      <li className="icon dollar">
                        {jobDetailsData?.amount || ""}
                      </li>
                      <li
                        className="icon location line-1"
                        title={jobDetailsData?.locationName}
                      >
                        {jobDetailsData?.locationName || ""}
                      </li>
                      {["completed", "cancelled", "expired"].includes(
                        jobDetailsData?.jobStatus?.toLowerCase()
                      ) ? (
                        <li>
                          <span className="job_status">
                            {jobDetailsData?.jobStatus?.toUpperCase()}
                          </span>
                        </li>
                      ) : (
                        <li className="icon calendar">
                          {jobDetailsData?.duration || ""}
                        </li>
                      )}
                    </ul>
                  )}
                </div>
                {props?.isSkeletonLoading ? (
                  <Skeleton />
                ) : jobDetailsData?.quoteJob ? null : ([
                    "cancelled",
                    "expired",
                    "completed",
                  ].includes(jobDetailsData?.jobStatus?.toLowerCase()) ||
                    jobDetailsData?.jobStatus === "") &&
                  jobDetailsData?.appliedStatus?.toUpperCase() === "APPLY" &&
                  jobDetailsData?.applyButtonDisplay &&
                  !jobDetailsData?.isInvited ? (
                  <div className="pt-10">
                    <button
                      className="fill_btn full_btn btn-effect"
                      onClick={applyJobClicked}
                    >
                      {jobDetailsData?.appliedStatus}
                    </button>
                  </div>
                ) : !jobDetailsData?.applyButtonDisplay &&
                  ["APPLIED", "ACCEPTED"].includes(
                    jobDetailsData?.appliedStatus?.toUpperCase()
                  ) &&
                  (jobInviteAction === "invite" ||
                    !jobDetailsData?.isInvited) ? (
                  <div className="pt-10">
                    <button className="fill_btn full_btn btn-effect disable_btn">
                      {jobDetailsData?.appliedStatus?.toUpperCase()}
                    </button>
                  </div>
                ) : null}
                {isPendingRequest() ? (
                  <button
                    className="fill_grey_btn full_btn pending_info"
                    onClick={() => setPendingRequestClicked(true)}
                  >
                    <span>
                      <img src={pendingIcon} alt="icon" />
                      {`View all request(s)`}
                    </span>
                  </button>
                ) : null}
                {props?.isSkeletonLoading ? (
                  <Skeleton />
                ) : (
                  !(jobInviteAction === "invite") &&
                  !jobDetailsData?.isInvited &&
                  jobDetailsData?.quoteJob &&
                  ["", "active", "applied"].includes(
                    jobDetailsData?.jobStatus?.toLowerCase()
                  ) && (
                    <button
                      className={`${
                        jobDetailsData?.jobStatus === ""
                          ? "fill_btn"
                          : "fill_grey_btn"
                      } full_btn btn-effect mt-sm`}
                      onClick={
                        jobDetailsData?.jobStatus === ""
                          ? applyJobClicked
                          : quoteBtnActions
                      }
                    >
                      {jobDetailsData?.jobStatus === ""
                        ? "Quote"
                        : jobDetailsData?.jobStatus === "applied"
                        ? "Quote sent"
                        : jobDetailsData?.jobStatus === "active"
                        ? "View your quote"
                        : ""}
                    </button>
                  )
                )}
                {props.isSkeletonLoading ? (
                  <Skeleton />
                ) : (
                  (jobInviteAction === "invite" || jobDetailsData?.isInvited) &&
                  ![
                    "active",
                    "applied",
                    "accepted",
                    "cancelled",
                    "expired",
                    "completed",
                  ].includes(jobDetailsData?.jobStatus?.toLowerCase()) && (
                    <>
                      <div className="form_field pt-10">
                        <button
                          onClick={() => {
                            if (jobDetailsData.quoteJob) {
                              props.history.push({
                                pathname: `/quote-job`,
                                state: {
                                  jobData: jobDetailsData,
                                  redirect_from: "jobDetailPage",
                                  base_redirect: "newJobs",
                                },
                              });
                            } else {
                              inviteJobActionHandler(1);
                            }
                          }}
                          className="fill_btn full_btn btn-effect"
                        >
                          Accept
                        </button>
                      </div>
                      <div className="form_field">
                        <button
                          onClick={() => {
                            inviteJobActionHandler(2);
                          }}
                          className="fill_grey_btn full_btn btn-effect"
                        >
                          Decline
                        </button>
                      </div>
                    </>
                  )
                )}
              </div>
            </div>
            <span className="sub_title" style={{ marginTop: "30px" }}>
              {props.isSkeletonLoading ? <Skeleton /> : "Photos & Docs"}
            </span>
            <div className="flex_row">
              <div className="flex_col_sm_8">
                <figure className="">
                  {props.isSkeletonLoading ? (
                    <Skeleton style={{ lineHeight: 2, height: 400 }} />
                  ) : (
                    <OwlCarousel {...options} className="customOwlCarousel">
                      {itemsMedia.length ? (
                        itemsMedia.map((image: any, index: number) => {
                          console.log({ image }, "---?");
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
                              style={{ height: "162px", width: "165px" }}
                            />
                          ) : (
                            <img
                              key={`${image}${index}`}
                              className="doc_icon"
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
                  )}
                </figure>
              </div>
            </div>

            {/* view pending request modal */}
            <Modal
              className="ques_ans_modal"
              open={pendingRequestClicked}
              onClose={() => setPendingRequestClicked(false)}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <div
                className="custom_wh"
                data-aos="zoom-in"
                data-aos-delay="30"
                data-aos-duration="1000"
              >
                <div className="heading">
                  {jobDetailsData?.jobStatus === "active" &&
                    (jobDetailsData?.isCancelJobRequest ||
                      jobDetailsData?.isChangeRequest) && (
                      <span className="sub_title">{`Pending Request(s)`}</span>
                    )}
                  <button
                    className="close_btn"
                    onClick={() => setPendingRequestClicked(false)}
                  >
                    <img src={cancel} alt="cancel" />
                  </button>
                </div>
                {jobDetailsData?.jobStatus === "active" &&
                  jobDetailsData?.isCancelJobRequest && (
                    <div className="chang_req_card">
                      <span className="xs_sub_title">
                        Job cancellation request
                      </span>
                      <p className="commn_para line-2">
                        <li>
                          {JobCancelReasons(
                            jobDetailsData?.reasonForCancelJobRequest
                          )}
                        </li>
                        <li>{jobDetailsData?.reasonNoteForCancelJobRequest}</li>
                      </p>
                      <button
                        className="fill_btn btn-effect"
                        onClick={() =>
                          setJobActionState((prevData: any) => ({
                            ...prevData,
                            isCancelRequestAcceptedClicked: true,
                          }))
                        }
                      >
                        Accept
                      </button>
                      <button
                        className="fill_grey_btn btn-effect"
                        onClick={() => {
                          setJobActionState((prevData: any) => ({
                            ...prevData,
                            isCancelRequestRejectedClicked: true,
                          }));
                          setPendingRequestClicked(false);
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                {jobDetailsData?.jobStatus === "active" &&
                  jobDetailsData?.isChangeRequest && (
                    <div className="chang_req_card">
                      <span className="xs_sub_title">
                        Change request details
                      </span>
                      <p className="commn_para line-2">
                        {jobDetailsData?.reasonForChangeRequest}
                      </p>
                      <button
                        className="fill_btn btn-effect"
                        onClick={() => {
                          setJobActionState((prevData: any) => ({
                            ...prevData,
                            isChangeRequestAcceptedClicked: true,
                          }));
                          setPendingRequestClicked(false);
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="fill_grey_btn btn-effect"
                        onClick={() => {
                          setJobActionState((prevData: any) => ({
                            ...prevData,
                            isChangeRequestRejectedClicked: true,
                          }));
                          setPendingRequestClicked(false);
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                {jobDetailsData?.rejectReasonNoteForCancelJobRequest ? (
                  <span className="sub_title">{"Reason(s)"}</span>
                ) : null}

                {jobDetailsData?.rejectReasonNoteForCancelJobRequest &&
                jobDetailsData?.jobStatus === "active" ? (
                  <div className="chang_req_card">
                    <span className="xs_sub_title">
                      Job cancel rejected reason
                    </span>
                    <p className="commn_para line-2">
                      <li>
                        {jobDetailsData?.rejectReasonNoteForCancelJobRequest}
                      </li>
                    </p>
                  </div>
                ) : null}

                {jobDetailsData?.reasonForCancelJobRequest &&
                jobDetailsData?.jobStatus !== "active" ? (
                  <div className="chang_req_card">
                    <span className="xs_sub_title">Job cancel reason</span>
                    <p className="commn_para line-2">
                      {JobCancelReasons(
                        jobDetailsData?.reasonForCancelJobRequest
                      )}
                    </p>
                    <p className="commn_para line-2">
                      <li>
                        {!jobDetailsData?.reasonNoteForCancelJobRequest?.length
                          ? jobDetailsData?.rejectReasonNoteForCancelJobRequest
                          : jobDetailsData?.reasonNoteForCancelJobRequest}
                      </li>
                    </p>
                  </div>
                ) : null}
              </div>
            </Modal>

            <Modal
              className="custom_modal"
              open={jobActionState.isChangeRequestAcceptedClicked}
              onClose={() => {
                closeJobActionConfirmationModal(
                  "isCancelRequestAcceptedClicked"
                );
              }}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <div
                className="custom_wh profile_modal"
                data-aos="zoom-in"
                data-aos-delay="30"
                data-aos-duration="1000"
              >
                <div className="heading">
                  <span className="sub_title">{`Change Request Details`}</span>
                  <button
                    className="close_btn"
                    onClick={() => {
                      closeJobActionConfirmationModal(
                        "isCancelRequestAcceptedClicked"
                      );
    
                    }}
                  >
                    <img src={cancel} alt="cancel" />
                  </button>
                </div>
                <div className="inner_wrap change_req_detail">
                  {jobDetailsData?.changeRequestData?.map((item: any) => {
                    return (
                      <ul>
                        <li>
                          <span className="show_label">New Milestone Name</span>
                          <span className="inner_title">
                            {item?.milestone_name}
                          </span>
                        </li>
                        <li>
                          <span className="show_label">New Duration</span>
                          <span className="inner_title">
                            {renderTime(item?.from_date, item?.to_date)}
                          </span>
                        </li>
                        <li>
                          <span className="show_label">
                            New Recommended Hours
                          </span>
                          <span className="inner_title">
                            {item?.recommended_hours}
                          </span>
                        </li>
                        {item?.isPhotoevidence && (
                          <li>
                            <span className="show_label">
                              Photo Evidence Required
                            </span>
                            <span className="inner_title">
                              {item?.isPhotoevidence ? "Yes" : "No"}
                            </span>
                          </li>
                        )}
                      </ul>
                    );
                  })}
                </div>
                <div className="bottom_btn custom_btn">
                  <button
                    className="fill_btn full_btn btn-effect"
                    onClick={() =>
                      replyChangeRequestHandler("acceptChangeRequest")
                    }
                  >
                    Accept
                  </button>
                </div>
              </div>
            </Modal>

            <Modal
              className="custom_modal"
              open={jobActionState.isCancelRequestAcceptedClicked}
              onClose={() =>
                closeJobActionConfirmationModal(
                  "isCancelRequestAcceptedClicked"
                )
              }
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <div
                className="custom_wh confirmation"
                data-aos="zoom-in"
                data-aos-delay="30"
                data-aos-duration="1000"
              >
                <div className="heading">
                  <span className="xs_sub_title">{`Accept Job Cancellation Request`}</span>
                  <button
                    className="close_btn"
                    onClick={() =>
                      closeJobActionConfirmationModal(
                        "isCancelRequestAcceptedClicked"
                      )
                    }
                  >
                    <img src={cancel} alt="cancel" />
                  </button>
                </div>
                <div className="modal_message">
                  <p>Are you sure you still want to proceed?</p>
                </div>
                <div className="dialog_actions">
                  <button
                    className="fill_btn btn-effect"
                    onClick={() =>
                      replyCancellationHandler("acceptJobCancelRequest")
                    }
                  >
                    Yes
                  </button>
                  <button
                    className="fill_grey_btn btn-effect"
                    onClick={() =>
                      closeJobActionConfirmationModal(
                        "isCancelRequestAcceptedClicked"
                      )
                    }
                  >
                    No
                  </button>
                </div>
              </div>
            </Modal>

            <Modal
              className="custom_modal"
              open={
                jobActionState.isCancelRequestRejectedClicked ||
                jobActionState.isChangeRequestRejectedClicked
              }
              onClose={() => {
                closeJobActionConfirmationModal(
                  "isCancelRequestRejectedClicked"
                );
              }}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <div
                className="custom_wh profile_modal"
                data-aos="zoom-in"
                data-aos-delay="30"
                data-aos-duration="1000"
              >
                <div className="heading">
                  <span className="sub_title">{`Your reply to job ${
                    jobActionState.isCancelRequestRejectedClicked
                      ? "cancellation"
                      : "change request"
                  }`}</span>
                  <button
                    className="close_btn"
                    onClick={() => {
                      closeJobActionConfirmationModal(
                        "isCancelRequestRejectedClicked"
                      );
                    }}
                  >
                    <img src={cancel} alt="cancel" />
                  </button>
                </div>
                <div className="form_field">
                  <label className="form_label">{`Let the builder and Tickt know if you accept or reject ${
                    jobActionState.isCancelRequestRejectedClicked
                      ? "cancelling"
                      : "change request"
                  } for this job.`}</label>
                  <div className="text_field">
                    <textarea
                      placeholder={`I disagree with this ${
                        jobActionState.isCancelRequestRejectedClicked
                          ? "cancelling"
                          : "change request"
                      }`}
                      maxLength={1000}
                      value={jobActionState.replyCancelReason}
                      onChange={({
                        target: { value },
                      }: {
                        target: { value: string };
                      }) =>
                        setJobActionState((prevData: any) => ({
                          ...prevData,
                          replyCancelReason: value?.trimLeft(),
                        }))
                      }
                    />
                    <span className="char_count">{`${jobActionState.replyCancelReason?.length}/1000`}</span>
                  </div>
                  {!!errors.replyCancelReason && (
                    <span className="error_msg">
                      {errors.replyCancelReason}
                    </span>
                  )}
                </div>
                <div className="bottom_btn custom_btn">
                  {jobActionState.isCancelRequestRejectedClicked && (
                    <button
                      className={`fill_btn full_btn btn-effect ${
                        jobActionState.replyCancelReason?.length > 0
                          ? ""
                          : "disable_btn"
                      }`}
                      onClick={() =>
                        replyCancellationHandler("rejectJobCancelRequest")
                      }
                    >
                      Send
                    </button>
                  )}
                  {jobActionState.isChangeRequestRejectedClicked && (
                    <button
                      className={`fill_btn full_btn btn-effect ${
                        jobActionState.replyCancelReason?.length > 0
                          ? ""
                          : "disable_btn"
                      }`}
                      onClick={() =>
                        replyChangeRequestHandler("rejectChangeRequest")
                      }
                    >
                      Send
                    </button>
                  )}
                  <button
                    className="fill_grey_btn btn-effect"
                    onClick={() => {
                      closeJobActionConfirmationModal(
                        "isCancelRequestRejectedClicked"
                      );
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>

            <Modal
              className="custom_modal"
              open={jobConfirmation.isJobModalOpen}
              onClose={closeApplyJobModal}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <div
                className="custom_wh confirmation"
                data-aos="zoom-in"
                data-aos-delay="30"
                data-aos-duration="1000"
              >
                <div className="heading">
                  <span className="xs_sub_title">Apply Job Confirmation</span>
                  <button className="close_btn" onClick={closeApplyJobModal}>
                    <img src={cancel} alt="cancel" />
                  </button>
                </div>
                <div className="modal_message">
                  <p>
                    This job doesn't match your specialisations. Do you want to
                    apply anyway?
                  </p>
                </div>
                <div className="dialog_actions">
                  <button
                    className="fill_btn btn-effect"
                    onClick={applyJobClicked}
                  >
                    Yes
                  </button>
                  <button
                    className="fill_grey_btn btn-effect"
                    onClick={closeApplyJobModal}
                  >
                    No
                  </button>
                </div>
              </div>
            </Modal>

            <div className="flex_row">
              <div className="flex_col_sm_8">
                <div className="description">
                  <span className="sub_title">
                    {props.isSkeletonLoading ? <Skeleton /> : "Job Description"}
                  </span>
                  <p className="commn_para">
                    {props.isSkeletonLoading ? (
                      <Skeleton />
                    ) : jobDetailsData?.details ? (
                      jobDetailsData?.details
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex_row">
              <div className="flex_col_sm_4">
                <span className="sub_title">
                  {props.isSkeletonLoading ? <Skeleton /> : "Job milestones"}
                </span>
                <ul className="job_milestone">
                  {props.isSkeletonLoading ? (
                    <Skeleton count={3} />
                  ) : jobDetailsData ? (
                    jobDetailsData?.jobMilestonesData?.map(
                      (item: any, index: number) => {
                        return (
                          <li key={item.milestoneId}>
                            <span>{`${index + 1}. ${
                              item?.milestoneName || ""
                            }`}</span>
                            <span>
                              {renderTime(item?.fromDate, item?.toDate)}
                            </span>
                          </li>
                        );
                      }
                    )
                  ) : null}
                </ul>
                {props.isSkeletonLoading ? (
                  <Skeleton />
                ) : (
                  <button
                    className="fill_grey_btn ques_btn btn-effect"
                    onClick={() =>
                      setQuestionsData((prevData: any) => ({
                        ...prevData,
                        showAllQuestionsClicked: true,
                      }))
                    }
                  >
                    <img src={question} alt="question" />
                    {`${
                      jobDetailsData?.questionsCount
                        ? `${
                            jobDetailsData?.questionsCount === 1
                              ? `${jobDetailsData?.questionsCount} question`
                              : `${jobDetailsData?.questionsCount} questions`
                          }`
                        : "0 questions"
                    }`}
                  </button>
                )}
              </div>

              <Modal
                className="ques_ans_modal"
                open={questionsData.showAllQuestionsClicked}
                onClose={() => modalCloseHandler("showAllQuestionsClicked")}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                <div
                  className="custom_wh"
                  data-aos="zoom-in"
                  data-aos-delay="30"
                  data-aos-duration="1000"
                >
                  <div className="heading">
                    <span className="sub_title">{`${
                      jobDetailsData?.questionsCount === 1
                        ? `${jobDetailsData?.questionsCount} question`
                        : jobDetailsData?.questionsCount > 1
                        ? `${jobDetailsData?.questionsCount} questions`
                        : ""
                    }`}</span>
                    <button
                      className="close_btn"
                      onClick={() =>
                        modalCloseHandler("showAllQuestionsClicked")
                      }
                    >
                      <img src={cancel} alt="cancel" />
                    </button>
                  </div>
                  {!jobDetailsData?.questionsCount && (
                    <div className="no_record align_centr">
                      <figure className="no_img">
                        <img src={noDataFound} alt="data not found" />
                      </figure>
                      <span>No Questions Found</span>
                    </div>
                  )}
                  <div className="inner_wrap">
                    {questionList?.map((item: any, index: number) => {
                      const { tradieData } = item;
                      return (
                        <div key={item?._id}>
                          <div className="question_ans_card">
                            <div className="user_detail">
                              <figure className="user_img">
                                <img
                                  src={tradieData?.[0]?.user_image || dummy}
                                  alt="user-img"
                                />
                              </figure>
                              <div className="details">
                                <span className="user_name">
                                  {tradieData?.[0]?.firstName || ""}
                                </span>
                                <span className="date">
                                  {moment(item?.updatedAt).format(
                                    "Do MMMM YYYY"
                                  ) || ""}
                                </span>
                              </div>
                            </div>
                            <p>{item?.question || ""}</p>
                            {item?.answers?.length === 0 && (
                              <span
                                className="action link"
                                onClick={() =>
                                  questionHandler(
                                    "updateQuestion",
                                    item?._id,
                                    item?.question
                                  )
                                }
                              >
                                Edit
                              </span>
                            )}
                            {item?.answers?.length === 0 && (
                              <span
                                className="action link"
                                onClick={() =>
                                  questionHandler(
                                    "deleteQuestion",
                                    item?._id,
                                    "",
                                    index
                                  )
                                }
                              >
                                Delete
                              </span>
                            )}
                          </div>
                          {item?.answers?.length > 0 &&
                            showNestedAnswersData(
                              item?.answers,
                              item?._id,
                              index
                            )}
                        </div>
                      );
                    })}
                    {jobDetailsData?.questionsCount > questionList.length && (
                      <div className="text-center">
                        <button
                          className="fill_grey_btn load_more"
                          onClick={loadMoreQuestionHandler}
                        >
                          View more
                        </button>
                      </div>
                    )}
                  </div>

                  {
                    <div className="bottom_btn custom_btn">
                      <button
                        className="fill_grey_btn full_btn btn-effect"
                        onClick={() => questionHandler("askQuestion")}
                      >
                        {"Ask question"}
                      </button>
                    </div>
                  }
                </div>
              </Modal>

              <Modal
                className="ques_ans_modal"
                open={questionsData.askQuestionsClicked}
                onClose={() => modalCloseHandler("askQuestionsClicked")}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                <div
                  className="custom_wh ask_ques"
                  data-aos="zoom-in"
                  data-aos-delay="30"
                  data-aos-duration="1000"
                >
                  <div className="heading">
                    <span className="sub_title">{`${
                      questionsData.updateQuestionsClicked
                        ? questionsData?.isNestedAction
                          ? "Edit Reply"
                          : "Edit Question"
                        : `Ask ${jobDetailsData?.postedBy?.builderName || ""} ${
                            questionsData?.isNestedAction ? "" : "Question"
                          }`
                    }`}</span>
                    <button
                      className="close_btn"
                      onClick={() => modalCloseHandler("askQuestionsClicked")}
                    >
                      <img src={cancel} alt="cancel" />
                    </button>
                  </div>
                  <div className="form_field">
                    <label className="form_label">{`Your ${
                      questionsData?.isNestedAction ? "Reply" : "Question"
                    }`}</label>
                    <div className="text_field">
                      <textarea
                        placeholder={`${
                          questionsData.updateQuestionsClicked
                            ? "Text"
                            : `Ask ${
                                jobDetailsData?.postedBy?.builderName || ""
                              } what do you want to know`
                        }`}
                        maxLength={1000}
                        value={questionsData.questionData}
                        onChange={(e) => handleChange(e, "questionData")}
                      ></textarea>
                      <span className="char_count">{`${questionsData.questionData?.length}/1000`}</span>
                    </div>
                    {!!errors.questionData && (
                      <span className="error_msg">{errors.questionData}</span>
                    )}
                  </div>
                  <div className="bottom_btn custom_btn">
                    {questionsData.updateQuestionsClicked ? (
                      <button
                        className="fill_btn full_btn btn-effect"
                        onClick={() => submitQuestionHandler("updateQuestion")}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="fill_btn full_btn btn-effect"
                        onClick={() => questionHandler("submitAskQuestion")}
                      >
                        Send
                      </button>
                    )}
                    <button
                      className="fill_grey_btn btn-effect"
                      onClick={() =>
                        questionHandler("questionCancelBtnClicked")
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Modal>

              <Modal
                className="custom_modal"
                open={questionsData.confirmationClicked}
                onClose={() => modalCloseHandler("confirmationClicked")}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                <div
                  className="custom_wh confirmation"
                  data-aos="zoom-in"
                  data-aos-delay="30"
                  data-aos-duration="1000"
                >
                  <div className="heading">
                    <span className="xs_sub_title">{`${
                      questionsData.deleteQuestionsClicked
                        ? "Delete"
                        : questionsData?.isNestedAction
                        ? ""
                        : "Ask"
                    } ${
                      questionsData?.isNestedAction ? "Reply" : "Question"
                    } Confirmation`}</span>
                    <button
                      className="close_btn"
                      onClick={() => modalCloseHandler("confirmationClicked")}
                    >
                      <img src={cancel} alt="cancel" />
                    </button>
                  </div>
                  <div className="modal_message">
                    <p>{`Are you sure you want to ${
                      questionsData.deleteQuestionsClicked
                        ? "delete"
                        : questionsData?.isNestedAction
                        ? ""
                        : "ask"
                    } ${
                      questionsData?.isNestedAction ? "reply" : "question"
                    }?`}</p>
                  </div>
                  <div className="dialog_actions">
                    <button
                      className="fill_btn btn-effect"
                      onClick={() =>
                        submitQuestionHandler(
                          questionsData.questionsClickedType
                        )
                      }
                    >
                      Yes
                    </button>
                    <button
                      className="fill_grey_btn btn-effect"
                      onClick={() =>
                        setQuestionsData((prevData: any) => ({
                          ...prevData,
                          confirmationClicked: false,
                        }))
                      }
                    >
                      No
                    </button>
                  </div>
                </div>
              </Modal>

              <div className="flex_col_sm_8">
                <div className="flex_row">
                  <div className="flex_col_sm_12">
                    <span className="sub_title">
                      {props.isSkeletonLoading ? <Skeleton /> : "Job type"}
                    </span>
                    <ul className="job_categories">
                      {props.isSkeletonLoading ? (
                        <Skeleton />
                      ) : (
                        <li>
                          <figure className="type_icon">
                            <img
                              alt=""
                              src={jobDetailsData?.jobType?.jobTypeImage}
                            />
                          </figure>
                          <span className="name">
                            {jobDetailsData?.jobType?.jobTypeName || ""}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="flex_row">
                  <div className="flex_col_sm_12">
                    {props.isSkeletonLoading ? (
                      <Skeleton />
                    ) : (
                      <span className="sub_title">
                        {"Specialisations needed"}
                      </span>
                    )}
                    <div className="tags_wrap">
                      {props.isSkeletonLoading ? (
                        <Skeleton />
                      ) : (
                        <ul>
                          {jobDetailsData?.specializationData?.map(
                            (item: any) => {
                              return (
                                <li key={item.specializationId}>
                                  {item.specializationName || ""}
                                </li>
                              );
                            }
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="section_wrapper">
              <span className="sub_title">
                {props.isSkeletonLoading ? <Skeleton /> : "Posted by"}
              </span>
              <div className="flex_row">
                <div className="flex_col_sm_3">
                  {props.isSkeletonLoading ? (
                    <Skeleton />
                  ) : (
                    <div className="tradie_card posted_by ">
                      {jobDetailsData.jobStatus === "active" && (
                        <span
                          className="chat circle"
                          onClick={(e) => {
                            e.preventDefault();
                            props.history.push({
                              pathname: `/chat`,
                              state: {
                                tradieId:
                                  storageService.getItem("userInfo")?._id,
                                builderId: jobDetailsData?.postedBy?.builderId,
                                jobId: jobDetailsData?.jobId,
                                jobName: jobDetailsData?.jobName,
                              },
                            });
                          }}
                        />
                      )}
                      <div
                        className="user_wrap"
                        onClick={() => {
                          if (jobDetailsData?.postedBy?.builderName) {
                            props?.history?.push(
                              `/builder-info?builderId=${jobDetailsData?.postedBy?.builderId}`
                            );
                          }
                        }}
                      >
                        <figure className="u_img">
                          {console.log({
                            image: jobDetailsData?.postedBy?.builderImage,
                          })}
                          {jobDetailsData?.postedBy?.hasOwnProperty(
                            "builderImage"
                          ) ? (
                            <img
                              src={
                                jobDetailsData?.postedBy?.builderImage || dummy
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
                          ) : Array.isArray(jobDetailsData?.postedBy) ? (
                            renderBuilderAvatar("image")
                          ) : (
                            <img src={dummy} alt="traide-img" />
                          )}
                        </figure>
                        <div className="details">
                          <span className="name">
                            {jobDetailsData?.postedBy?.builderName ||
                              renderBuilderAvatar("name")}
                          </span>
                          <span className="rating">
                            {`${jobDetailsData?.postedBy?.ratings || "0"} | ${
                              jobDetailsData?.postedBy?.reviews
                                ? `${
                                    jobDetailsData?.postedBy?.reviews === 1
                                      ? `${jobDetailsData?.postedBy?.reviews} review`
                                      : `${jobDetailsData?.postedBy?.reviews} reviews`
                                  }`
                                : "0 reviews"
                            }`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
