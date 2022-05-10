import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { setShowToast } from "../../../redux/common/actions";
import UploadMedia from "../../postJob/components/uploadMedia";
import { renderTime } from "../../../utils/common";
import LodgeDispute from "./lodgeDispute/lodgeDispute";
import CancelJobs from "./cancelJobs/cancelJob";
import DigitalIdVerification from "../../tradieEditProfile/components/digitalIdVerification";
import Modal from "@material-ui/core/Modal";

//@ts-ignore
import FsLightbox from "fslightbox-react";
import storageService from "../../../utils/storageService";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import dummy from "../../../assets/images/u_placeholder.jpg";
import editIconBlue from "../../../assets/images/ic-edit-blue.png";
import more from "../../../assets/images/icon-direction-right.png";
import check from "../../../assets/images/checked-2.png";
import pendingIcon from "../../../assets/images/exclamation-icon.png";
import noDataFound from "../../../assets/images/no-search-data.png";
import verifiedIcon from "../../../assets/images/checked-2.png";
import cancel from "../../../assets/images/ic-cancel.png";
import { moengage, mixPanel } from "../../../services/analyticsTools";
import { MoEConstants } from "../../../utils/constants";

const digitalInfoPoints: Array<string> = [
  "Passport",
  "Driver Licence (Driver's license) - scans of front and back are required",
  "Photo Card - scans of front and back are required",
  "New South Wales Driving Instructor Licence - scans of front and back are required",
  "Tasmanian Government Personal Information Card - scans of front and back are required",
  "ImmiCard - scans of front and back are required",
  "Proof of Age card - scans of front and back are required",
  "Australian Defence Force (ADF) identification card (Military ID) - scans of front and back are required",
];

const declinedImages = {
  desktop: {
    breakpoint: { max: 3000, min: 1200 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 650, min: 0 },
    items: 1,
  },
};

interface BuilderDetails {
  builderId: string;
  builderImage: string;
  builderName: string;
  ratings: number;
  reviews: number;
}

interface JobDetails {
  jobId: string;
  jobName: string;
  milestones: Array<any>;
  postedBy: BuilderDetails;
  categories: Array<any>;
}

interface BankDetails {
  userId: string;
  account_name: string;
  account_number: string;
  bsb_number: string;
  accountVerified: boolean;
  stripeAccountId: string;
}
interface Proptypes {
  getMilestoneList: (jobId: string) => void;
  milestoneList: JobDetails;
  showMilestoneCompletePage: () => void;
  showJobCompletePage: (jobCompletedCount: number) => void;
  addBankDetails: (data: any) => void;
  updateBankDetails: (data: any) => void;
  getBankDetails: () => void;
  removeBankDetails: () => void;
  markMilestoneComplete: (
    data: any,
    callback: (jobCompletedCount: number) => void
  ) => void;
  bankDetails: BankDetails;
}

const MarkMilestone = (props: Proptypes) => {
  const {
    getMilestoneList,
    milestoneList,
    showJobCompletePage,
    showMilestoneCompletePage,
    getBankDetails,
    addBankDetails,
    updateBankDetails,
    removeBankDetails,
    markMilestoneComplete,
    bankDetails,
  } = props;
  const history: any = useHistory();
  let params: any = new URLSearchParams(history.location?.search);
  params = {
    jobId: params.get("jobId"),
    tradeId: params.get("tradeId"),
    specializationId: params.get("specializationId"),
  };

  const defaultData = {
    urls: [],
    description: "",
    actualHours: "",
    totalAmount: "0",
    account_name: "",
    account_number: "",
    bsb_number: "",
    accountVerified: false,
    stripeAccountId: "",
  };
  const [data, setData] = useState<any>(defaultData);
  const [errors, setErrors] = useState({
    actualHours: "",
    account_name: "",
    account_number: "",
    bsb_number: "",
  });
  const [step, setStep] = useState(1);
  const [stepCompleted, setStepCompleted] = useState<Array<number>>([]);
  const [isLastMilestone, setIsLastMilestone] = useState(false);
  const [milestoneIndex, setMilestoneIndex] = useState(0);
  const [readOnly, setReadOnly] = useState(false);
  const [toggleItem, setToggleItem] = useState<{ [index: string]: boolean }>({
    edit: false,
    cancel: false,
    lodge: false,
  });

  const [milestoneDeclineData, setMilestoneDeclineData] = useState<any>({
    multipleDeclineListCount: 0,
    prevMilestoneDeclineId: "",
    currentMilestoneDeclineId: "",
  });
  const [mediaList, setMediaList] = useState([]);
  const [toggler, setToggler] = useState(false);
  const [selectedSlide, setSelectSlide] = useState(1);
  const [digitalIDInfo, setDigitalIDInfo] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(history.location?.search);
    const jobActionType: any = params.get("jobAction");
    if (jobActionType === "dispute") {
      setToggleItem((prev: any) => ({ ...prev, lodge: true }));
    } else if (jobActionType === "cancel") {
      setToggleItem((prev: any) => ({ ...prev, cancel: true }));
    }
  }, []);

  useEffect(() => {
    getMilestoneList(params.jobId);
    getBankDetails();
  }, [params.jobId, getMilestoneList, getBankDetails]);

  useEffect(() => {
    setData((prevData: any) => ({
      ...prevData,
      ...bankDetails,
    }));

    setReadOnly(!!bankDetails?.userId);
  }, [bankDetails]);

  const validateActualHours = (value: any) => {
    if (!value) {
      return "Time Spent is required.";
    }

    let pattern = "^([0-9]?[0-9]?[0-9]?[0-9]?[0-9]):[0-5][0-9]$";
    if (value.match(pattern) !== null) {
      if (!(+value.split(":")[1] % 5 === 0)) {
        return "Time should be in mutiples of 5 like 10:05, 10:10";
      }
      return "";
    }
    return "Please enter a valid pattern like : 10:05";
    // '([0-9]?[0-9]{1}|2[0-9]{1}|3[0-9]{1}|4[0-9]{1}|5[0-9]{1}|6[0-9]{1}):[0-5]{1}[0-9]{1}';
    // return 'Hours should be in hh:mm format.';
  };

  const errorLabel = {
    account_number: "Account Number",
    account_name: "Account Name",
    bsb_number: "BSB Number",
  } as { [key: string]: string };

  const validateBankDetails = (name: string, value: string) => {
    if (!value) {
      return `${errorLabel[name]} is required`;
    }

    switch (name) {
      case "account_number":
        return value.length > 10
          ? "Maximum 10 digits are allowed"
          : value.length < 6
          ? "Minimum 6 digits are required"
          : "";
      case "bsb_number":
        return !/^\d{3}-\d{3}$/.test(value)
          ? "Please enter valid BSB Number like 123-444"
          : "";
    }

    return "";
  };

  const handleChange = ({ target: { name, value } }: any) => {
    let newVal: "";
    value = value.trimLeft();
    if (name === "actualHours") {
      let tim = value?.split(":")[0];
      if (value.includes(":") && tim?.length < 3) {
        if (tim?.length === 2) {
          newVal = value;
        } else {
          newVal =
            value.split(":")[0] < 10 && value.split(":")[0] > 0
              ? `0${value}`
              : value;
        }
      } else {
        newVal = value;
      }
    }
    setData((prevData: any) => ({
      ...prevData,
      [name]: name === "actualHours" ? newVal : value,
    }));

    if (step === 3 && stepCompleted.includes(3)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateActualHours(value),
      }));
    }

    if (step === 5 && stepCompleted.includes(5)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateBankDetails(name, value),
      }));
    }
  };

  const { jobId, jobName, milestones, postedBy } = milestoneList || {};
  const { builderId, builderImage, builderName, reviews, ratings } =
    postedBy || {};

  const hoursMinutes = data.actualHours
    ?.split(":")
    .map((key: string) => parseInt(key));
  const totalAmount =
    milestones?.[milestoneIndex].amount *
    (milestones?.[milestoneIndex].pay_type === "Fixed price"
      ? 1
      : hoursMinutes?.[0] + hoursMinutes?.[1] / 60);

  useEffect(() => {
    const multipleList: any = milestones?.filter(
      ({ status }: { status: number }) => status === 3
    );
    if (multipleList?.length > 1) {
      const list: any = milestones?.find(
        ({ status }: { status: number }) => status === 3
      );
      setMilestoneDeclineData((prevData: any) => ({
        ...prevData,
        multipleDeclineListCount: multipleList?.length,
        prevMilestoneDeclineId: list?.milestoneId,
        currentMilestoneDeclineId: list?.milestoneId,
      }));
      setMediaList(list?.declinedReason?.url);
    } else if (multipleList?.length === 1) {
      const list: any = milestones?.find(
        ({ status }: { status: number }) => status === 3
      );
      setMilestoneDeclineData((prevData: any) => ({
        ...prevData,
        multipleDeclineListCount: multipleList?.length,
        prevMilestoneDeclineId: list?.milestoneId,
        currentMilestoneDeclineId: list?.milestoneId,
      }));
      setMediaList(list?.declinedReason?.url);
    }
  }, [milestones]);
  console.log(milestoneDeclineData, "milestoneDeclineData");

  const setItemToggle = (index: any) => {
    setToggler((prev: boolean) => !prev);
    setSelectSlide(index + 1);
  };

  const renderFilteredItems = () => {
    let sources: any = [];
    let types: any = [];

    if (mediaList?.length) {
      mediaList.forEach((item: any) => {
        if (item?.mediaType === 2) {
          sources.push(item.link);
          types.push("video");
        } else if (item?.mediaType === 1) {
          sources.push(item.link);
          types.push("image");
        } else {
          sources.push(item);
          types.push("image");
        }
      });
    }

    return { sources, types };
  };

  const backTab = (name: string) => {
    const params = new URLSearchParams(history.location?.search);
    const jobActionType: any = params.get("jobAction");
    if (jobActionType) {
      history.goBack();
      return;
    }
    setToggleItem((prev: any) => ({ ...prev, [name]: false }));
  };

  if (toggleItem?.lodge) {
    return (
      <LodgeDispute
        item={{ jobId: jobId, jobName: jobName }}
        backTab={backTab}
        history={history}
      />
    );
  }

  if (toggleItem?.cancel) {
    return (
      <CancelJobs
        item={{ jobId: jobId, jobName: jobName }}
        backTab={backTab}
        history={history}
      />
    );
  }

  const markMilestoneVerif = (val: any) => {
    if (val === "backStep") setStep(5);
    if (val === "verifSuccess") {
      setData((prevData: any) => ({
        ...prevData,
        accountVerified: true,
      }));
      setStep(5);
    }
  };

  const { sources, types } = renderFilteredItems();
  let page = null;
  let isMilestoneList: any = props?.milestoneList || false;
  let isShowError = false;
  if (
    isMilestoneList &&
    isMilestoneList[0] &&
    isMilestoneList[0]?.status === 404
  ) {
    isShowError = true;
  }
  const renderSteps = () => {
    switch (step) {
      case 1:
        return (page = !isShowError ? (
          <div className="flex_row">
            <div className="flex_col_sm_6">
              <div className="relate">
                <button
                  className="back"
                  onClick={() => history.push("/active-jobs")}
                ></button>

                <span className="xs_sub_title">{jobName}</span>
                <span className="dot_menu">
                  <img src={editIconBlue} alt="edit" />
                  <div className="edit_menu">
                    <ul>
                      <li
                        onClick={() => {
                          setToggleItem((prev: any) => ({
                            ...prev,
                            lodge: true,
                          }));
                        }}
                        className="icon lodge"
                      >
                        Lodge dispute
                      </li>
                      <li
                        onClick={() => {
                          setToggleItem((prev: any) => ({
                            ...prev,
                            cancel: true,
                          }));
                        }}
                        className="icon delete"
                      >
                        Cancel job
                      </li>
                    </ul>
                  </div>
                </span>
              </div>

              <p className="commn_para">
                Your job point of contact has indicated they want to be notified
                when you reach the following milestones. Tap the milestone and
                Submit when a milestone is completed
              </p>
              {milestoneDeclineData.multipleDeclineListCount > 1 && (
                <button className="fill_grey_btn full_btn pending_info">
                  <span>
                    <img src={pendingIcon} alt="icon" />
                    {`${milestoneDeclineData.multipleDeclineListCount} Milestones were declined`}
                  </span>
                </button>
              )}

              <ul className="milestones_check">
                {milestones
                  ?.sort(({ order: prevOrder }, { order }) => prevOrder - order)
                  ?.map(
                    (
                      {
                        milestoneId,
                        milestoneName,
                        isPhotoevidence,
                        status,
                        fromDate,
                        toDate,
                        declinedReason,
                        declinedCount,
                      },
                      index
                    ) => {
                      // As discussed now we take this status 4 as status 0 bacause after the decline on the change-request the status becomes 4.
                      const prevMilestoneStatus = milestones[index - 1]?.status;
                      const isActive =
                        (status === 0 || status === 4 || status === 5) && // here changes done for status 4
                        // completed or approved
                        ([1, 2].includes(prevMilestoneStatus) ||
                          prevMilestoneStatus === undefined);
                      const isDeclined = status === 3;

                      return (
                        <li
                          key={milestoneId}
                          className={
                            [1, 2].includes(status)
                              ? `check`
                              : isActive
                              ? "active"
                              : status === 3
                              ? "declined"
                              : "disabled"
                          }
                        >
                          <div
                            className="circle_stepper"
                            onClick={() => {
                              setMediaList(declinedReason?.url);
                              setMilestoneDeclineData((prevData: any) => ({
                                ...prevData,
                                currentMilestoneDeclineId: milestoneId,
                              }));
                            }}
                          >
                            <span></span>
                          </div>
                          <div className="info">
                            <label>{`${milestoneName} ${
                              status === 3 ? "declined" : ""
                            }`}</label>
                            {isPhotoevidence && (
                              <span>Photo evidence required</span>
                            )}
                            <span>{renderTime(fromDate, toDate)}</span>
                          </div>

                          {isDeclined &&
                            milestoneDeclineData.currentMilestoneDeclineId ===
                              milestoneId && (
                              <>
                                {Object.keys(declinedReason)?.length > 0 && (
                                  <div className="decline_reason">
                                    <FsLightbox
                                      toggler={toggler}
                                      slide={selectedSlide}
                                      sources={sources}
                                      types={types}
                                    />
                                    <label className="form_label">
                                      Decline reason:
                                    </label>
                                    <div className="text_field">
                                      <p className="commn_para">
                                        {declinedReason?.reason}
                                      </p>
                                    </div>

                                    {declinedReason?.url?.length > 0 && (
                                      <Carousel
                                        className="decline_media"
                                        responsive={declinedImages}
                                        showDots={false}
                                        arrows={true}
                                      >
                                        {declinedReason?.url?.map(
                                          (image: string, index: number) => {
                                            return (
                                              <div className="upload_img_video">
                                                <figure className="img_video">
                                                  <img
                                                    src={image}
                                                    alt="image"
                                                    onClick={() =>
                                                      setItemToggle(index)
                                                    }
                                                  />
                                                </figure>
                                              </div>
                                            );
                                          }
                                        )}
                                      </Carousel>
                                    )}
                                  </div>
                                )}
                                <button
                                  onClick={() => {
                                    if (declinedCount >= 5) {
                                      setShowToast(
                                        true,
                                        "You have exceeded maximum number of chances to submit the milestone"
                                      );
                                      return;
                                    }
                                    setMilestoneIndex(index);

                                    if (index === milestones?.length - 1) {
                                      setIsLastMilestone(true);
                                    }

                                    if (isPhotoevidence) {
                                      setStep(2);
                                    } else {
                                      setStep(3);
                                    }
                                  }}
                                  className={`fill_btn full_btn btn-effect ${
                                    milestoneDeclineData.prevMilestoneDeclineId !==
                                    milestoneId
                                      ? "disable_btn"
                                      : ""
                                  }`}
                                >
                                  Remark as Complete
                                </button>
                              </>
                            )}
                          {isActive && (
                            <button
                              className="fill_btn full_btn btn-effect"
                              onClick={() => {
                                setMilestoneIndex(index);

                                if (index === milestones?.length - 1) {
                                  setIsLastMilestone(true);
                                }

                                if (isPhotoevidence) {
                                  setStep(2);
                                } else {
                                  setStep(3);
                                }
                              }}
                            >
                              Done
                            </button>
                          )}
                        </li>
                      );
                    }
                  )}
              </ul>
            </div>
            {/* )} */}
            <div className="flex_col_sm_6 col_ruler">
              <span className="sub_title">Posted by</span>
              <div className="tradie_card posted_by ">
                <a
                  href="javascript:void(0)"
                  className="chat circle"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push({
                      pathname: `/chat`,
                      state: {
                        tradieId: storageService.getItem("userInfo")?._id,
                        builderId: builderId,
                        jobId: jobId,
                        jobName: jobName,
                      },
                    });
                  }}
                />
                <div
                  className="user_wrap"
                  onClick={() =>
                    history.push(`/builder-info?builderId=${builderId}`)
                  }
                >
                  <figure className="u_img">
                    <img
                      src={builderImage || dummy}
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
                    <span className="name">{builderName}</span>
                    <span className="rating">
                      {ratings} | {reviews} reviews
                    </span>
                  </div>
                </div>
              </div>
              <div className="relate">
                <span className="sub_title">Job details</span>
                <span
                  className="edit_icon"
                  title="More"
                  onClick={() =>
                    history.push(
                      `/job-details-page?jobId=${params.jobId}&redirect_from=jobs`
                    )
                  }
                >
                  <img src={more} alt="more" />
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="custom_container">
            <div className="vid_img_wrapper pt-20">
              <div className="flex_row">
                <div className="flex_col_sm_8 relative">
                  <button
                    className="back"
                    onClick={() => {
                      history.goBack();
                    }}
                  ></button>
                </div>
              </div>
            </div>

            <div className="no_record  m-t-vh">
              <figure className="no_img">
                <img src={noDataFound} alt="data not found" />
              </figure>
              <span>{"This builder is no longer available."}</span>
              <span>{"Please contact admin."}</span>
            </div>
          </div>
        ));
      case 2:
        return (page = (
          <UploadMedia
            jobName={jobName}
            title="Photo required"
            para="Your job point of contact has indicated they want to be notified when you reach the following milestones. Tap the milestone and Submit when a milestone is completed"
            stepCompleted={stepCompleted.includes(2)}
            data={data}
            handleStepBack={() => setStep(1)}
            handleStepForward={() => {}}
            handleStepComplete={(stepData: any) => {
              setData((prevData: any) => ({
                ...prevData,
                ...stepData,
              }));

              setStepCompleted((prevValue) => prevValue.concat([2]));
              setStep(3);
            }}
            hasDescription
          />
        ));
      case 3:
        return (page = (
          <div className="flex_row">
            <div className="flex_col_sm_8">
              <div className="relate">
                <button
                  className="back"
                  onClick={() => {
                    if (milestones[milestoneIndex]?.isPhotoevidence) {
                      setStep(2);
                    } else {
                      setStep(1);
                    }
                  }}
                ></button>
                <span className="xs_sub_title">{jobName}</span>
              </div>
              <span className="sub_title">Worked hours in this milestone</span>

              <p className="commn_para">
                The amount paid will be recalculated based on approval of the
                actual hours by the Builder
              </p>

              <div className="form_field">
                <label className="form_label">Time Spent</label>
                <div className="text_field time_spent">
                  <input
                    type="text"
                    placeholder="hh:mm"
                    name="actualHours"
                    value={data.actualHours}
                    onChange={handleChange}
                    maxLength={5}
                  />
                  <span className="detect_icon">hours</span>
                </div>
                <span className="error_msg">{errors.actualHours}</span>
              </div>
              <button
                className="fill_btn full_btn btn-effect"
                onClick={() => {
                  setStepCompleted((prevValue) => prevValue.concat([3]));

                  const error = validateActualHours(data.actualHours);
                  if (error) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      actualHours: error,
                    }));
                  } else {
                    setStep(4);
                  }
                }}
              >
                Submit
              </button>
            </div>
          </div>
        ));
      case 4:
        return (page = (
          <div className="flex_row">
            <div className="flex_col_sm_7">
              <div className="relate">
                <button className="back" onClick={() => setStep(3)}></button>
                <span className="xs_sub_title">{jobName}</span>
              </div>
              <span className="sub_title">
                {isLastMilestone ? "Job Complete" : "Add payment details"}
              </span>
              <p className="commn_para">
                {isLastMilestone
                  ? "Please enter your prefered payment method below so your point of contact can organise payment"
                  : "You need to add your bank account details for payment from the builder after approving this milestone"}
              </p>
              {isLastMilestone && (
                <div className="f_spacebw total_payment">
                  <span>Total payment</span>
                  <span>${totalAmount?.toFixed(2)}</span>
                </div>
              )}
              <button className="fill_grey_btn bank_btn">
                {data.userId && <img src={check} alt="check" />} Bank account
              </button>
            </div>
            <div className="flex_col_sm_9">
              <div className="form_field">
                <span className="payment_note">
                  Tickt does not store your payment information.{" "}
                </span>
                <p className="commn_para">
                  {" "}
                  Tickt does not handle payment for jobs, we only facilitate
                  communication between tradespeople and builders. If you have
                  problems receiving your payment, please contact your builder.
                </p>
              </div>
              <button
                className="fill_btn full_btn btn-effect"
                onClick={() => setStep(5)}
              >
                {data.userId ? "Continue" : "Add Details"}
              </button>
            </div>
          </div>
        ));
      case 5:
        return (page = (
          <div className="flex_row">
            <div className="flex_col_sm_8">
              <div className="relate">
                <button className="back" onClick={() => setStep(4)}></button>
                <span className="xs_sub_title">{jobName}</span>
                {data?.userId && readOnly && (
                  <>
                    <div className="edit_delete">
                      <span
                        className="edit"
                        title="Edit"
                        onClick={() => setReadOnly(!readOnly)}
                      ></span>
                      <span
                        className="delete"
                        title="Remove"
                        onClick={() => removeBankDetails()}
                      ></span>
                    </div>
                  </>
                )}
              </div>
              <span className="sub_title">Payment Details</span>
              <p className="commn_para">Enter your bank account details</p>

              <div className="form_field">
                <label className="form_label">Account Name</label>
                <div className="text_field">
                  <input
                    type="text"
                    placeholder="Enter Account Name"
                    name="account_name"
                    value={data.account_name}
                    onChange={handleChange}
                    maxLength={50}
                    readOnly={readOnly}
                  />
                </div>
                <span className="error_msg">{errors.account_name}</span>
              </div>
              <div className="form_field">
                <label className="form_label">BSB Number</label>
                <div className="text_field">
                  <input
                    type="text"
                    placeholder="Enter BSB Number"
                    name="bsb_number"
                    value={data.bsb_number}
                    onChange={handleChange}
                    maxLength={7}
                    readOnly={readOnly}
                  />
                </div>
                <span className="error_msg">{errors.bsb_number}</span>
              </div>
              <div className="form_field">
                <label className="form_label">Account Number</label>
                <div className="text_field">
                  <input
                    type="number"
                    placeholder="Enter Account Number"
                    name="account_number"
                    value={data.account_number}
                    onChange={handleChange}
                    maxLength={10}
                    max={9999999999}
                    readOnly={readOnly}
                  />
                </div>
                <span className="error_msg">{errors.account_number}</span>
              </div>
              {data.account_name &&
                data.account_number &&
                data.bsb_number &&
                data.stripeAccountId && (
                  <>
                    <div className="form_field">
                      <button
                        className="fill_grey_btn full_btn btn-effect id_verified"
                        onClick={() => {
                          if (data?.accountVerified) return;
                          setStep(6);
                        }}
                      >
                        {data?.accountVerified && (
                          <img src={check} alt="verified" />
                        )}
                        {`${
                          data?.accountVerified
                            ? "ID Verified"
                            : "Add ID Verification"
                        }`}
                      </button>
                    </div>
                    <span
                      className="show_label id_info"
                      onClick={() => setDigitalIDInfo(true)}
                    >
                      ID verification is required as part of Stripe ID
                      verification process.
                    </span>
                  </>
                )}

              <Modal
                className="custom_modal"
                open={digitalIDInfo}
                onClose={() => setDigitalIDInfo(false)}
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
                    <span className="sub_title">ID verification</span>
                    <button
                      className="close_btn"
                      onClick={() => setDigitalIDInfo(false)}
                    >
                      <img src={cancel} alt="cancel" />
                    </button>
                  </div>
                  <div className="inner_wrap">
                    <span className="show_label">
                      ID verification is required as part of Stripe ID
                      verification process.
                    </span>
                    <span className="show_label">
                      Below is a spansting of documents that can accept as proof
                      of identity, address, and entity.
                    </span>
                    <ul className="verificationid_list">
                      {digitalInfoPoints.map((info, index) => (
                        <li className="show_label" key={index}>
                          {info}
                        </li>
                      ))}
                    </ul>
                    <div className="bottom_btn custom_btn center">
                      <button
                        className={`fill_btn full_btn btn-effect`}
                        onClick={() => setDigitalIDInfo(false)}
                      >
                        Ok
                      </button>
                    </div>
                  </div>
                </div>
              </Modal>

              <button
                className={`fill_btn full_btn btn-effect ${
                  readOnly ? (data?.accountVerified ? "" : "disable_btn") : ""
                }`}
                onClick={
                  readOnly
                    ? () => {
                        const milestoneData = {
                          evidence: milestones[milestoneIndex].isPhotoevidence
                            ? data.urls
                            : undefined,
                          jobId: params.jobId,
                          milestoneId: milestones[milestoneIndex].milestoneId,
                          description: milestones[milestoneIndex]
                            .isPhotoevidence
                            ? data.description
                            : undefined,
                          actualHours: data.actualHours,
                          totalAmount: `${totalAmount?.toFixed(2)}`,
                        };

                        const callback = (jobCompletedCount: number) => {
                          const mData = {
                            timeStamp: moengage.getCurrentTimeStamp(),
                            category:
                              milestoneList?.categories?.[0]?.trade_name,
                            "Milestone number": milestoneIndex + 1,
                          };
                          moengage.moE_SendEvent(
                            MoEConstants.MILESTONE_COMPLETED,
                            mData
                          );
                          mixPanel.mixP_SendEvent(
                            MoEConstants.MILESTONE_COMPLETED,
                            mData
                          );
                          if (isLastMilestone) {
                            showJobCompletePage(jobCompletedCount);
                          } else {
                            setStepCompleted([]);
                            setData(defaultData);
                            showMilestoneCompletePage();
                          }
                        };

                        markMilestoneComplete(milestoneData, callback);
                      }
                    : () => {
                        setStepCompleted((prevValue) => prevValue.concat([5]));

                        const hasErrors = [
                          "account_name",
                          "account_number",
                          "bsb_number",
                        ].reduce((prevValue, name) => {
                          const error = validateBankDetails(name, data[name]);
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            [name]: error,
                          }));

                          return prevValue || error;
                        }, "");

                        const updatedBankDetails = {
                          account_name: data.account_name,
                          account_number: data.account_number,
                          bsb_number: data.bsb_number,
                        };
                        if (!hasErrors) {
                          if (bankDetails.userId) {
                            updateBankDetails({
                              userId: data.userId,
                              ...updatedBankDetails,
                            });
                          } else {
                            addBankDetails(updatedBankDetails);
                            const mData = {
                              timeStamp: moengage.getCurrentTimeStamp(),
                            };
                            moengage.moE_SendEvent(
                              MoEConstants.ADDED_PAYMENT_DETAILS,
                              mData
                            );
                            mixPanel.mixP_SendEvent(
                              MoEConstants.ADDED_PAYMENT_DETAILS,
                              mData
                            );
                          }
                        }
                      }
                }
              >
                {readOnly ? "Continue" : "Save changes"}
              </button>
            </div>
          </div>
        ));
      case 6:
        return (page = (
          <DigitalIdVerification
            redirect_from={"mark-milestone"}
            markMilestoneVerif={markMilestoneVerif}
            stripeAccountId={data.stripeAccountId}
          />
        ));

      default:
        return null;
    }
  };

  return <div className="detail_col">{renderSteps()}</div>;
};

export default MarkMilestone;
