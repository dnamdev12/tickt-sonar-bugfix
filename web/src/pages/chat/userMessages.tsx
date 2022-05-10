import React, { useState, useEffect, useRef } from "react";
import { getJobDetails } from "../../redux/jobs/actions";
import storageService from "../../utils/storageService";

import notFound from "../../assets/images/not-found.png";
import chatVideoIcon from "../../assets/images/video@3x.png";
import dummy from "../../assets/images/u_placeholder.jpg";
import viewMore from "../../assets/images/icon-direction-blue.png";
import close from "../../assets/images/ic-cancel-blue.png";
import sendMedia from "../../assets/images/ic-media.png";
import sendBtn from "../../assets/images/ic-send.png";
import loader from "../../assets/images/loader.gif";

import { formatDateTime, renderTime } from "../../utils/common";
import { setShowToast } from "../../redux/common/actions";
import { onFileUpload } from "../../redux/auth/actions";
import {
  getMessagesOfRoom,
  sendTextMessage,
  sendImageVideoMessage,
} from "../../services/firebase";

import Constants, { MoEConstants } from "../../utils/constants";

//@ts-ignore
import FsLightbox from "fslightbox-react";
import { moengage, mixPanel } from "../../services/analyticsTools";
interface Types {
  [key: string]: any | string;
}

let lastDate = "";
const docTypes: Array<any> = ["jpeg", "jpg", "png", "mp4", "wmv", "avi"];

const UserMessages = (props: any) => {
  const divRref = useRef<HTMLDivElement>(null);
  const [userId] = useState<string>(storageService.getItem("userInfo")?._id);
  const [toggle, setToggle] = useState<boolean>(false);
  const [jobDetailLoader, setJobDetailLoader] = useState<boolean>(false);
  const [currentJobDetails, setCurrentJobDetails] = useState<any>(null);
  const [messageText, setMessageText] = useState<any>("");
  const [messages, setMessages] = useState<Array<any>>([]);
  const [isDocUploading, setIsDocUploading] = useState<boolean>(false);

  const [itemsMedia, setItemsMedia] = useState([]);
  const [toggler, setToggler] = useState(false);
  const [selectedSlide, setSelectSlide] = useState<any>(1);
  const [fsSlideListner, setFsSlideListner] = useState<any>({});

  useEffect(() => {
    if (props.roomId !== "") {
      lastDate = "";
      getMessagesOfRoom(props.roomId, onReceiveOfNewMsg);
      setSelectSlide(1);
      setFsSlideListner({});
      setItemsMedia([]);
      setCurrentJobDetails(null);
      setToggle(false);
    }
  }, [props.roomId]);

  useEffect(() => {
    scrollToBottom();
  });

  const scrollToBottom = () => {
    if (null !== divRref?.current) {
      const scroll =
        divRref.current.scrollHeight - divRref.current.clientHeight;
      divRref.current.scrollTo(0, scroll);
    }
  };

  const onReceiveOfNewMsg = (arrmsg: any) => {
    setMessages(arrmsg);
  };

  useEffect(() => {
    let fsSlideObj: any = {};
    let mediaMsgs: any = [];
    let slideCount = 1;
    if (messages.length) {
      mediaMsgs = messages.filter((item: any, index: number) => {
        if (item.messageType === "image" || item.messageType === "video") {
          fsSlideObj[`${index}`] = slideCount++;
          return item;
        }
      });
      setItemsMedia(mediaMsgs);
      setFsSlideListner(fsSlideObj);
    }
  }, [messages]);

  const setInboxToTopWithLastMsg = (lastMsg: any) => {
    const newInboxData = [...props.inBoxData];
    const currentIndex = newInboxData.findIndex(
      (i) => i.roomId === props.roomId
    );
    newInboxData[currentIndex].lastMsg = lastMsg;
    newInboxData.splice(currentIndex, 1);
    newInboxData.unshift(props.inBoxData[currentIndex]);
    props.setInBoxData(newInboxData);
  };

  const sendMessage = async () => {
    if (messageText && messageText.trimLeft() !== "") {
      setMessageText("");
      const lastMsg: any = await sendTextMessage(props.roomId, messageText);
      if (
        lastMsg &&
        props.roomData?.oppUserInfo?.deviceToken &&
        props.roomData?.oppUserInfo?.deviceType &&
        (props.roomData?.oppUserInfo?.hasOwnProperty("isNotification")
          ? props.roomData?.oppUserInfo?.isNotification
          : true)
      ) {
        sendFCMPushNotificationToOppUser(lastMsg);
        const mData = {
          timeStamp: moengage.getCurrentTimeStamp(),
        };
        moengage.moE_SendEvent(MoEConstants.CHAT, mData);
        mixPanel.mixP_SendEvent(MoEConstants.CHAT, mData);
      }
      setInboxToTopWithLastMsg(lastMsg);
    }
  };

  const handleKeyDown = (event: any) => {
    if (!event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      sendMessage();
      setMessageText("");
    }
  };

  const sendImageVideoMsg = async (url: string, msgType: string) => {
    if (url && url !== "") {
      const lastMsg: any = await sendImageVideoMessage(
        props.roomId,
        url,
        msgType
      );
      if (
        lastMsg &&
        props.roomData?.oppUserInfo?.deviceToken &&
        props.roomData?.oppUserInfo?.deviceType &&
        (props.roomData?.oppUserInfo?.hasOwnProperty("isNotification")
          ? props.roomData?.oppUserInfo?.isNotification
          : true)
      ) {
        sendFCMPushNotificationToOppUser(lastMsg);
      }
      setInboxToTopWithLastMsg(lastMsg);
    }
    setMessageText("");
  };

  const fetchJobDetail = async (jobId: any) => {
    setJobDetailLoader(true);
    const res = await getJobDetails(jobId);
    if (res.success) {
      const jobInfo = {
        jobDescription: res.data?.details || "",
        jobId: res.data?.jobId || "",
        jobName: res.data?.jobName || "",
        amount: res.data?.amount || "",
        locationName: res.data?.locationName || "",
        fromDate: res.data?.fromDate || "",
        toDate: res.data?.toDate || "",
        duration: res.data?.duration || "",
        status: res.data?.status || "",
      };
      setCurrentJobDetails(jobInfo);
      setJobDetailLoader(false);
    }
  };

  const renderMediaItems = (itemsMedia: any) => {
    let sources: any = [];
    let types: any = [];

    if (itemsMedia.length) {
      itemsMedia.forEach((item: any) => {
        if (item.messageType === "video") {
          sources.push(item.mediaUrl);
          types.push("video");
        }
        if (item.messageType === "image") {
          sources.push(item.mediaUrl);
          types.push("image");
        }
      });
    }

    return { sources, types };
  };

  const setResDeviceType = (deviceType: number, msg: any) => {
    switch (Number(deviceType)) {
      case 1:
        return {
          app_icon:
            "https://appinventiv-development.s3.amazonaws.com/1628513615740ic-logo-yellow.png",
          title: "Tickt App",
          notificationText: `${
            storageService.getItem("userInfo")?.userName
          } send you a message`,
          senderName: `${storageService.getItem("userInfo")?.userName}`,
          messageType: `${msg?.messageType}`,
          messageText: `${msg?.messageType === "text" ? msg?.messageText : ""}`,
          room_id: msg?.messageRoomId,
          image: storageService.getItem("userInfo")?.user_image,
          notificationType: 25,
          sound: "default",
        };
      case 2:
        return {
          body: msg?.messageText,
          messageText: msg?.messageText,
          sender: {
            first_name: storageService.getItem("userInfo")?.userName,
            device_token: storageService.getItem("fcmToken"),
            user_id: storageService.getItem("userInfo")?._id,
            device_type: 2,
          },
          jobId: msg?.messageRoomId?.split("_")?.[0],
          badge: 1,
          device_type: 2,
          title: storageService.getItem("userInfo")?.userName,
          jobName: props.roomData?.jobName,
          notification_type: 50,
          sound: "default",
          messageId: msg?.messageId,
        };
      case 3:
        return {
          notification: {
            body: msg?.messageText,
            title: storageService.getItem("userInfo")?.userName,
          },
          data: {
            body: msg?.messageText,
            messageText: msg?.messageText,
            sender: {
              first_name: storageService.getItem("userInfo")?.userName,
              device_token: storageService.getItem("fcmToken"),
              user_id: storageService.getItem("userInfo")?._id,
              device_type: 2,
            },
            jobId: msg?.messageRoomId?.split("_")?.[0],
            badge: 1,
            device_type: 2,
            title: storageService.getItem("userInfo")?.userName,
            jobName: props.roomData?.jobName,
            notification_type: 50,
            sound: "default",
            messageId: msg?.messageId,
          },
        };
      default:
        return;
    }
  };
  const sendFCMPushNotificationToOppUser = async (msg: any) => {
    let data = setResDeviceType(props.roomData?.oppUserInfo?.deviceType, msg);
    let newData = {
      to: `${props.roomData?.oppUserInfo?.deviceToken}`,
      ...(props.roomData?.oppUserInfo?.deviceType == 1 && { data: data }),
      ...(props.roomData?.oppUserInfo?.deviceType == 2 && {
        notification: data,
      }),
      ...(props.roomData?.oppUserInfo?.deviceType == 3 && {
        notification: data?.notification,
        data: data?.data,
      }),
    };

    const headers_: Types = {
      "Content-Type": "application/json",
      Authorization: Constants.FcmHeaderAuthorizationKey,
    };
    const response: any = await fetch(`https://fcm.googleapis.com/fcm/send`, {
      method: "POST",
      headers: headers_,
      body: JSON.stringify(newData),
    });
    if (response.status === 200) {
      console.log("Chat push notification send to opposite user: success");
    } else {
      console.log("Chat push notification send to opposite user: failure");
    }
  };

  const handleUpload = async (e: any) => {
    let maxFileSize: number = 10;
    const formData = new FormData();
    const newFile = e.target.files[0];
    var fileType = newFile?.type?.split("/")[1]?.toLowerCase();

    var selectedFileSize = newFile?.size / 1024 / 1024; // size in mb
    if (["mp4", "wmv", "avi"].includes(fileType)) {
      maxFileSize = 20;
    }
    if (docTypes.indexOf(fileType) < 0 || selectedFileSize > maxFileSize) {
      setShowToast(true, "The file must be in proper format or size");
      return;
    }

    formData.append("file", newFile);
    setIsDocUploading(true);
    let check_type: any = ["jpeg", "jpg", "png"].includes(fileType)
      ? 1
      : ["mp4", "wmv", "avi"].includes(fileType)
      ? 2
      : null;
    const res = await onFileUpload(formData);
    if (res.success && res.imgUrl) {
      if (check_type === 1) {
        sendImageVideoMsg(res.imgUrl, "image");
      } else if (check_type === 2) {
        sendImageVideoMsg(res.imgUrl, "video");
      } else {
        setShowToast(true, "There is some technical issue");
      }
      setIsDocUploading(false);
    }
  };

  const renderTextMsg = (msg: any) => {
    let curDate = formatDateTime(msg.messageTimestamp, "day");
    const messageClass =
      msg.senderId === userId ? "message" : "message recive_msg";
    if (lastDate === "" || lastDate !== curDate) {
      lastDate = curDate;
      return (
        <>
          <div className="date_time">
            <span>{curDate}</span>
          </div>
          <div className={`${messageClass}`}>
            <p className={`${msg.senderId === userId ? "mark" : ""}`}>
              {msg.messageText}
              <span className="time">
                {formatDateTime(msg.messageTimestamp, "time")}
              </span>
            </p>
          </div>
        </>
      );
    } else
      return (
        <div className={`${messageClass}`}>
          <p className={`${msg.senderId === userId ? "mark" : ""}`}>
            {msg.messageText}
            <span className="time">
              {formatDateTime(msg.messageTimestamp, "time")}
            </span>
          </p>
        </div>
      );
  };

  const renderImageMsg = (msg: any, index: number) => {
    let curDate = formatDateTime(msg.messageTimestamp, "day");
    const messageClass =
      msg.senderId === userId ? "message" : "message recive_msg";
    if (lastDate === "" || lastDate !== curDate) {
      lastDate = curDate;
      return (
        <>
          <div className="date_time">
            <span>{curDate}</span>
          </div>
          <div className={`${messageClass}`}>
            <figure className="media">
              <img
                src={msg.mediaUrl || notFound}
                alt="media"
                async-src={msg.mediaUrl || notFound}
                decoding="async"
                loading="lazy"
                onError={(e: any) => {
                  if (e?.target?.onerror) {
                    e.target.onerror = null;
                  }
                  if (e?.target?.src) {
                    e.target.src = notFound;
                  }
                }}
                onClick={() => {
                  setToggler((prev: any) => !prev);
                  setSelectSlide(fsSlideListner[`${index}`]);
                }}
              />
              <span className="time">
                {formatDateTime(msg.messageTimestamp, "time")}
              </span>
            </figure>
          </div>
        </>
      );
    } else
      return (
        <div className={`${messageClass}`}>
          <figure className="media">
            <img
              src={msg.mediaUrl || notFound}
              alt="media"
              async-src={msg.mediaUrl || notFound}
              decoding="async"
              loading="lazy"
              onError={(e: any) => {
                if (e?.target?.onerror) {
                  e.target.onerror = null;
                }
                if (e?.target?.src) {
                  e.target.src = notFound;
                }
              }}
              onClick={() => {
                setToggler((prev: any) => !prev);
                setSelectSlide(fsSlideListner[`${index}`]);
              }}
            />
            <span className="time">
              {formatDateTime(msg.messageTimestamp, "time")}
            </span>
          </figure>
        </div>
      );
  };

  const renderVideoMsg = (msg: any, index: number) => {
    let curDate = formatDateTime(msg.messageTimestamp, "day");
    const messageClass =
      msg.senderId === userId ? "message" : "message recive_msg";
    if (lastDate === "" || lastDate !== curDate) {
      lastDate = curDate;
      return (
        <>
          <div className="date_time">
            <span>{curDate}</span>
          </div>
          <div className={`${messageClass}`}>
            <figure className="media media_video ">
              <video
                src={msg.mediaUrl || notFound}
                poster={chatVideoIcon}
                onClick={() => {
                  setToggler((prev: any) => !prev);
                  setSelectSlide(fsSlideListner[`${index}`]);
                }}
              />
              <span className="time">
                {formatDateTime(msg.messageTimestamp, "time")}
              </span>
            </figure>
          </div>
        </>
      );
    } else
      return (
        <div className={`${messageClass}`}>
          <figure className="media media_video ">
            <video
              src={msg.mediaUrl || notFound}
              poster={chatVideoIcon}
              onClick={() => {
                setToggler((prev: any) => !prev);
                setSelectSlide(fsSlideListner[`${index}`]);
              }}
            />
            <span className="time">
              {formatDateTime(msg.messageTimestamp, "time")}
            </span>
          </figure>
        </div>
      );
  };

  const displayMessages = (msg: any, index: number) => {
    if (index === 0) lastDate = "";
    switch (msg.messageType) {
      case "text":
        return renderTextMsg(msg);
      case "image":
        return renderImageMsg(msg, index);
      case "video":
        return renderVideoMsg(msg, index);
    }
  };

  const { sources, types } = renderMediaItems(itemsMedia);

  return props.isNoRecords ? (
    <div className="detail_col">
      <div className="flex_row">
        <div></div>
      </div>
    </div>
  ) : (
    <>
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
      <div className="detail_col">
        <div className="flex_row">
          <div className={`chat_col ${toggle ? "active" : ""}`}>
            <div className="chat_user">
              <figure className="u_img">
                <img
                  src={props.roomData?.oppUserInfo?.image || dummy}
                  alt="user-img"
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
              <span
                className="name"
                onClick={() => {
                  if (storageService.getItem("userType") === 2) {
                    props.history.push(
                      `/tradie-info?tradeId=${props.roomData?.oppUserInfo?.userId}&hideInvite=true`
                    );
                  } else {
                    props.history.push(
                      `/builder-info?builderId=${props.roomData?.oppUserInfo?.userId}`
                    );
                  }
                }}
              >
                {props.roomData?.oppUserInfo?.name}
              </span>
              {!toggle && (
                <span
                  onClick={() => {
                    setToggle(true);
                    if (currentJobDetails) return;
                    fetchJobDetail(props.roomData?.jobId);
                  }}
                  className="view_detail"
                >
                  View Job Details
                  <img src={viewMore} alt="view-more" />
                </span>
              )}
            </div>
            <div className="message_wrapr" ref={divRref}>
              {messages.length > 0 &&
                messages.map((msg: any, index: number) => {
                  return displayMessages(msg, index);
                })}
              <div className="date_time">
                {props.roomData?.oppUserInfo?.isBlock && (
                  <i style={{ color: "#929292" }}>
                    {"You can no longer chat with the user"}
                  </i>
                )}
              </div>
            </div>

            {!props.roomData?.oppUserInfo?.isBlock && (
              <div className="send_msg">
                <div className="text_field">
                  <label className="upload_item" htmlFor="upload_item">
                    <span className="detect_icon_ltr">
                      <img src={sendMedia} alt="media" />
                    </span>
                  </label>
                  <input
                    id="upload_item"
                    className="hide"
                    type="file"
                    accept="image/png,image/jpg,image/jpeg, video/mp4, video/wmv, video/avi"
                    onChange={handleUpload}
                    disabled={isDocUploading}
                  />
                  <textarea
                    placeholder="Message.."
                    onKeyDown={handleKeyDown}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <span className="detect_icon">
                    <img src={sendBtn} alt="send" onClick={sendMessage} />
                  </span>
                </div>
              </div>
            )}
          </div>

          {toggle && jobDetailLoader ? (
            <div className="view_detail_col">
              <div className="no_record">
                <figure>
                  <img src={loader} alt="loader" width="130px" />
                </figure>
              </div>
            </div>
          ) : toggle ? (
            <div className="view_detail_col">
              <div className="f_spacebw relative">
                <span className="title line-2 pr-20">
                  {currentJobDetails?.jobName}
                </span>
                <span
                  onClick={() => {
                    setToggle((prev) => !prev);
                  }}
                  className="close"
                >
                  <img src={close} alt="close" />
                </span>
              </div>

              <div className="job_info">
                <ul>
                  <li className="icon clock">
                    {renderTime(
                      currentJobDetails?.fromDate,
                      currentJobDetails?.toDate
                    )}
                  </li>
                  <li className="icon dollar">{currentJobDetails?.amount}</li>
                  <li className="icon location line-1">
                    {currentJobDetails?.locationName}
                  </li>
                  <li className="icon calendar">
                    {currentJobDetails?.duration}
                  </li>
                </ul>
              </div>

              <p className="commn_para">{currentJobDetails?.jobDescription}</p>

              <button
                className="fill_btn full_btn btn-effect"
                onClick={() => {
                  if (storageService.getItem("userType") === 1) {
                    props.history.push(
                      `/job-details-page?jobId=${currentJobDetails?.jobId}&redirect_from=jobs`
                    );
                  } else {
                    let urlEncode: any = `?jobId=${currentJobDetails?.jobId}&status=${currentJobDetails?.status}&edit=true&activeType=active`;
                    props.history.push(`/job-detail?${urlEncode}`);
                  }
                }}
              >
                View Job details
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default UserMessages;
