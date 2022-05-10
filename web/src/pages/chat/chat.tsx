import React, { useState, useEffect } from "react";

import dummy from "../../assets/images/u_placeholder.jpg";
import chatSearch from "../../assets/images/search-chat.png";
import menu from "../../assets/images/menu-line-blue.png";
import close from "../../assets/images/ic-cancel-blue.png";

import { setLoading } from "../../redux/common/actions";
import { formatDateTime } from "../../utils/common";
import noData from "../../assets/images/no-search-data.png";
import emptyChat from "../../assets/images/emptyChat.png";

import {
  auth,
  createRoom,
  checkRoomExist,
  getFirebaseInboxData,
  stopListeningOfRoom,
  resetUnreadCounter,
} from "../../services/firebase";

import UserMessages from "./userMessages";

interface PropTypes {
  builderProfile: any;
  tradieProfileData: any;
  isLoading: boolean;
  history: any;
}

let selectedRoomID = "";
let isFreshChatRoute: boolean = false;

const Chat = (props: PropTypes) => {
  const [initializing, setInitializing] = useState<boolean>(true);
  // firebase authenticated user details
  const [user, setUser] = useState<any>(() => auth.currentUser);
  const [inBoxData, setInBoxData] = useState<any>([]);
  const [filterInBoxData, setFilterInBoxData] = useState<any>([]);
  const [isNoRecords, setIsNoRecords] = useState<boolean>(false);
  const [roomData, setRoomData] = useState<any>({});
  const [roomId, setRoomId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [isInitialLoader, setIsInitialLoader] = useState(true);
  const [isMobInbox, setIsMobInbox] = useState<boolean>(false);

  const { tradieId, builderId, jobName, jobId } = props.history?.location?.state
    ? props.history?.location?.state
    : { tradieId: "", builderId: "", jobName: "", jobId: "" };

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (tradieId && builderId && jobName && jobId) {
        await setInitialItems();
      } else {
        isFreshChatRoute = true;
      }
      await getFirebaseInboxData(onUpdateofInbox);
    })();

    return () => {
      stopListeningOfRoom(selectedRoomID);
      selectedRoomID = "";
    };
  }, []);

  const setInitialItems = async () => {
    const roomID: string = `${jobId}_${tradieId}_${builderId}`;
    selectedRoomID = roomID;
    if (await checkRoomExist(roomID)) {
      return;
    } else {
      await createRoom(jobId, tradieId, builderId, jobName);
    }
  };

  const onUpdateofInbox = async (res: any) => {
    let selectedRoomInfo: any = "";
    const sortedRes = res.filter((item: any, index: number) => {
      if (item.hasOwnProperty("lastMsg") || item.roomId === selectedRoomID) {
        if (item.roomId === selectedRoomID && !isFreshChatRoute) {
          selectedRoomInfo = item;
        } else {
          return item;
        }
      }
    });

    sortedRes?.sort(function (x: any, y: any) {
      return y.lastMsg?.messageTimestamp - x.lastMsg?.messageTimestamp;
    });

    if (sortedRes.length === 0 && !selectedRoomInfo) {
      setIsNoRecords(true);
      if (isInitialLoader) {
        setIsInitialLoader(false);
        setLoading(false);
      }
      return;
    }
    setIsNoRecords(false);

    let ress: any;
    if (selectedRoomInfo) {
      ress = [...sortedRes];
      ress.unshift(selectedRoomInfo);
    }
    const newRes = Array.isArray(ress) && selectedRoomInfo ? ress : sortedRes;
    setInBoxData(newRes.length === 0 ? [{ firstKey: "emptyRes" }] : newRes);
    if (newRes.length > 0 && selectedRoomID === "") {
      selectedRoomID = newRes[0].roomId;
      setRoomId(newRes[0].roomId);
      if (newRes[0] && newRes[0]?.unreadMessages > 0) {
        newRes[0].unreadMessages = 0;
        resetUnreadCounter(newRes[0].roomId);
      }
      setRoomData(newRes[0]);
      return;
    }

    if (newRes.length > 0) {
      let itemObj = newRes.find((x: any) => x.roomId == selectedRoomID);

      if (itemObj && itemObj?.unreadMessages > 0) {
        itemObj.unreadMessages = 0;
        resetUnreadCounter(itemObj.roomId);
      }
      setRoomData(itemObj);
    }
  };

  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setIsMobInbox(false);
      } else {
        setUser(false);
        setIsMobInbox(true);
        setLoading(false);
        setIsInitialLoader(false);
      }
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [initializing]);


  const getRoomDetails = async (item: any) => {
    stopListeningOfRoom(selectedRoomID);
    selectedRoomID = item.roomId;
    setRoomId(item.roomId);
    setRoomData(item);
    resetUnreadCounter(item.roomId);
  };

  useEffect(() => {
    if (searchQuery) {
      let filteredVal = inBoxData.filter((item: any) =>
        item.oppUserInfo?.name
          ?.toLowerCase()
          ?.includes(searchQuery.toLowerCase())
      );
      setFilterInBoxData(filteredVal);
    }
    if (
      (inBoxData.length || inBoxData[0]?.["firstKey"] === "emptyRes") &&
      isInitialLoader
    ) {
      if (inBoxData[0]?.["firstKey"] === "emptyRes") setInBoxData([]);
      setLoading(false);
      setIsInitialLoader(false);
    }
  }, [searchQuery, inBoxData]);

  return (
    <div className="app_wrapper">
      <div className="custom_container">
        <span className="mob_side_nav" onClick={() => setIsMobInbox(true)}>
          <img src={menu} alt="mob-side-nav" />
        </span>
        <div className="f_row chat_wrapr h-100">
          <div className={`side_nav_col ${isMobInbox ? "active" : ""}`}>
            <button className="close_nav" onClick={() => setIsMobInbox(false)}>
              <img src={close} alt="close" />
            </button>
            <div className="stick">
              <span className="title" style={{ marginLeft: "50px" }}>
                Chat
              </span>

              <div
                className={`search_bar ${searchActive ? "active" : ""}`}
                onClick={() => {
                  setSearchActive(true);
                }}
              >
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e: any) =>
                    setSearchQuery(e.target.value.trimLeft())
                  }
                />
                <span className="detect_icon_ltr">
                  <img src={chatSearch} alt="search" />
                </span>
              </div>
              <ul className="chat_list">
                {searchQuery ? (
                  filterInBoxData.length === 0 ? (
                    <li>
                      <a href="javascript:void(0)" className="chat">
                        <div className="detail">
                          <span className="inner_title line-1">
                            No Record Found
                          </span>
                        </div>
                      </a>
                    </li>
                  ) : (
                    filterInBoxData.map((item: any) => {
                      return (
                        <li
                          onClick={() => {
                            getRoomDetails(item);
                          }}
                        >
                          <a
                            href="javascript:void(0)"
                            className={`chat ${
                              selectedRoomID === item.roomId ? "active" : ""
                            }`}
                          >
                            <figure className="u_img">
                              <img
                                src={item.oppUserInfo?.image || dummy}
                                alt="img"
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
                            <div className="detail">
                              <span className="inner_title line-1">
                                {item.oppUserInfo?.name}
                              </span>
                              <span className="inner_title job line-1">
                                {item.jobName}
                              </span>
                              <p className="commn_para line-1">
                                {item.lastMsg?.messageText}
                              </p>
                              {item.lastMsg?.messageTimestamp && (
                                <span className="date_time">
                                  {formatDateTime(
                                    item.lastMsg?.messageTimestamp,
                                    "inboxTime"
                                  )}
                                </span>
                              )}

                              {selectedRoomID ===
                              item.roomId ? null : item.unreadMessages ===
                                0 ? null : (
                                <span className="count">
                                  {item.unreadMessages}
                                </span>
                              )}
                            </div>
                          </a>
                        </li>
                      );
                    })
                  )
                ) : inBoxData?.length > 0 ? (
                  inBoxData.map((item: any) => {
                    return (
                      <li
                        onClick={() => {
                          getRoomDetails(item);
                        }}
                      >
                        <a
                          href="javascript:void(0)"
                          className={`chat ${
                            selectedRoomID === item.roomId ? "active" : ""
                          }`}
                        >
                          <figure className="u_img">
                            <img
                              src={item.oppUserInfo?.image || dummy}
                              alt="img"
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
                          <div className="detail">
                            <span className="inner_title line-1">
                              {item.oppUserInfo?.name}
                            </span>
                            <span className="inner_title job line-1">
                              {item.jobName}
                            </span>
                            <p className="commn_para line-1">
                              {item.lastMsg?.messageType === "text" ? (
                                item.lastMsg?.messageText
                              ) : item.lastMsg?.messageType === "image" ? (
                                <i style={{ color: "#929292" }}>Photo</i>
                              ) : item.lastMsg?.messageType === "video" ? (
                                <i style={{ color: "#929292" }}>Video</i>
                              ) : (
                                ""
                              )}
                            </p>
                            {item.lastMsg?.messageTimestamp && (
                              <span className="date_time">
                                {formatDateTime(
                                  item.lastMsg?.messageTimestamp,
                                  "inboxTime"
                                )}
                              </span>
                            )}
                            {selectedRoomID ===
                            item.roomId ? null : item.unreadMessages ===
                              0 ? null : (
                              <span className="count">
                                {item.unreadMessages}
                              </span>
                            )}
                          </div>
                        </a>
                      </li>
                    );
                  })
                ) : props.isLoading ? null : (
                  <li>
                    <a href="javascript:void(0)" className="chat">
                      <div className="detail">
                        <span className="inner_title line-1">
                          No Record Found
                        </span>
                      </div>

                      {/* <div className="detail">
                        <span className="no_record">
                          <figure>
                            <figure className="no_img">
                              <img src={emptyChat} alt="data not found" />
                            </figure>
                          </figure>

                          <span className="empty_screen_text">
                            You don't have any chat messages yet.
                          </span>
                          <span className="empty_screen_subtext">
                            Connect to your local network
                          </span>
                          <button
                            className="empty_screen_button"
                            onClick={() => props.history.push("/")}
                          >
                            View Recommended tradespeople
                          </button>
                        </span>
                      </div> */}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
          {/* {(isInitialLoader || inBoxData?.length === 0) ? null : */}
          {isInitialLoader ? null : !isInitialLoader &&
            inBoxData?.length === 0 ? (
            <div className="detail_col">
              <div className="flex_row tradies_row">
                <div className="no_record">
                  <figure className="no_img">
                    <img src={noData} alt="data not found" />
                  </figure>
                  <span>No Data Found</span>
                </div>
              </div>
            </div>
          ) : (
            <UserMessages
              roomId={selectedRoomID}
              roomData={roomData}
              isNoRecords={isNoRecords}
              history={props.history}
              isLoading={props.isLoading}
              inBoxData={inBoxData}
              setInBoxData={setInBoxData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
