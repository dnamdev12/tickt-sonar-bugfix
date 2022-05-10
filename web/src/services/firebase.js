import firebase from "firebase/app";
import "firebase/messaging";
import "firebase/auth";
import "firebase/database";
import storageService from "../utils/storageService";
import Constants from "../utils/constants";
import moment from "moment";

if (!firebase.apps.length) {
  firebase.initializeApp(Constants.qaStgFirebaseConfig);
}

const checkIfSupport = () => {
  if (firebase.messaging.isSupported()) {
    return firebase.messaging();
  }
  return false;
};

export const auth = firebase.auth();
export const messaging = checkIfSupport();
export const db = firebase.database();

const CHAT_TYPE = "single";
const FIREBASE_COLLECTION = {
  ROOM_INFO: "room_info",
  JOBS: "jobs",
  INBOX: "inbox",
  MESSAGES: "messages",
  LAST_MESSAGES: "lastMessage",
  USERS: "users",
};

let msgListnerObj;
let inboxListner;

const getRegisterToken = () => {
  return new Promise((resolve, reject) => {
    messaging
      .getToken({
        vapidKey: Constants.FirebasePushServiceKey,
      })
      .then((currentToken) => {
        if (currentToken) {
          console.log("firebase token fetched successsfully", currentToken);
          resolve({ success: true, deviceToken: currentToken });
        } else {
          console.log("No registration token available.");
          setTokenSentToServer(false);
          resolve({ success: false });
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving  from firebase. ", err);
        setTokenSentToServer(false);
        reject({ success: false });
      });
  });
};

const setTokenSentToServer = (sent) => {
  storageService.setItem("sentToServer", sent ? "1" : "0");
  storageService.setItem("fcmToken", "");
};

const isTokenSentToServer = () => {
  return storageService.getItem("sentToServer") === "1";
};

export const requestPermission = () => {
  if (checkIfSupport()) {
    return new Promise((resolve, reject) => {
      Notification.requestPermission()
        .then(() => {
          const data = getRegisterToken();
          resolve(data);
        })
        .catch((err) => {
          console.log(
            "Unable to get permission to show notification browser : ",
            err
          );
          reject({ success: false });
        });
    });
  }
};

export const deleteToken = () => {
  if (checkIfSupport()) {
    messaging
      .deleteToken()
      .then(() => {
        console.log("firebase Token deleted.");
      })
      .catch((err) => {
        console.log("Unable to delete firebase token. ", err);
      });
  }
};

export const signOut = () => {
  auth
    .signOut()
    .then(() => {
      console.log("Firebase signout successful.");
    })
    .catch((err) => {
      console.log("Firebase sign out error.", err);
    });
};

export const firebaseSignUpWithEmailPassword = async ({
  email,
  password,
  id,
  fullName,
  user_type,
}) => {
  try {
    let ref = await auth.createUserWithEmailAndPassword(email, password);
    if (ref) {
      await ref.user.updateProfile({
        displayName: fullName,
      });

      await db.ref(`${FIREBASE_COLLECTION.USERS}/${id}`).set({
        email: email,
        image: "",
        name: fullName,
        userId: id,
        onlineStatus: true,
        userType: user_type,
      });
      console.log("firebase authentication success");
    }
  } catch (err) {
    console.log("firebase authentication failure: ", { err });
  }
};

export const firebaseLogInWithEmailPassword = async (
  authData,
  loginRes,
  isSignup
) => {
  console.log("authData: ", authData);
  try {
    let response = await auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    );
    if (response) {
      console.log("firebase auth login success: ");
      if (isSignup) return;
      await db.ref(`${FIREBASE_COLLECTION.USERS}/${loginRes?._id}`).set({
        email: loginRes?.email,
        image: loginRes?.user_image,
        name: loginRes?.userName,
        userId: loginRes?._id,
        onlineStatus: true,
        userType: loginRes?.user_type,
      });
    }
  } catch (err) {
    console.log("firebase auth login failure: ");
  }
};

////////////////////////  firebase chat

export const loginAnonymously = async () => {
  let userInfo = storageService.getItem("userInfo");
  try {
    let response = await auth.signInAnonymously();
    if (response) {
      console.log("firebase anonymous auth login success: ");
      await db.ref(`${FIREBASE_COLLECTION.USERS}/${userInfo?._id}`).update({
        email: userInfo?.email,
        image: userInfo?.user_image,
        name: userInfo?.userName,
        userId: userInfo?._id,
        onlineStatus: true,
        userType: userInfo?.user_type,
        deviceType: 1,
      });
    }
  } catch (error) {
    console.log("firebase anonymous auth login failure: ");
    var errorCode = error.code;
    if (errorCode === "auth/operation-not-allowed") {
      alert("You must enable Anonymous auth in the Firebase Console.");
    } else {
      console.error(error);
    }
  }
};

export const getLoggedInuserId = () => {
  return storageService.getItem("userInfo")?._id;
};

export const updateChatUserDetails = async (updateType, value) => {
  let loggedInuserId = getLoggedInuserId();
  try {
    await db.ref(`${FIREBASE_COLLECTION.USERS}/${loggedInuserId}`).update({
      ...(updateType === "userImage" && { image: value }),
      ...(updateType === "userName" && { name: value }),
      ...(updateType === "deviceToken" && { deviceToken: value }),
      ...(updateType === "isNotification" && { isNotification: value }),
    });
    console.log(`firebase ${updateType} update success`);
  } catch (err) {
    console.log(`firebase ${updateType} update failure: `, { err });
  }
};

export const createRoom = async (jobId, tradieId, builderId, jobName) => {
  let loggedInuserId = getLoggedInuserId();

  const roomID = `${jobId}_${tradieId}_${builderId}`;

  if (await checkRoomExist(roomID)) {
    return;
  }

  let roomInfoObj = {
    id: roomID,
    chatRoomType: CHAT_TYPE,
    chatLastUpdate: firebase.database.ServerValue.TIMESTAMP,
  };
  let chatLastUpdates = {};
  chatLastUpdates[tradieId] =
    tradieId === loggedInuserId ? firebase.database.ServerValue.TIMESTAMP : 0;
  chatLastUpdates[loggedInuserId] = firebase.database.ServerValue.TIMESTAMP;

  let chatRoomMembers = {};
  chatRoomMembers[tradieId] = {
    memberDelete: firebase.database.ServerValue.TIMESTAMP,
    memberJoin: firebase.database.ServerValue.TIMESTAMP,
    memberLeave: 0,
  };

  chatRoomMembers[builderId] = {
    memberDelete: firebase.database.ServerValue.TIMESTAMP,
    memberJoin: firebase.database.ServerValue.TIMESTAMP,
    memberLeave: 0,
  };
  roomInfoObj.chatRoomMembers = chatRoomMembers;
  roomInfoObj.chatLastUpdates = chatLastUpdates;

  await db.ref(`${FIREBASE_COLLECTION.ROOM_INFO}/${roomID}/`).set(roomInfoObj);
  //loggedin user inbox
  await createInbox(tradieId, roomID, jobId, builderId, jobName);
  // opposite user inbox
  await createInbox(builderId, roomID, jobId, tradieId, jobName);
  return roomInfoObj;
};

export const checkRoomExist = async (roomID) => {
  let room = await db
    .ref(`${FIREBASE_COLLECTION.ROOM_INFO}/${roomID}/`)
    .once("value");
  return room.exists();
};

export const createJob = async (jobInfo) => {
  await db.ref(`${FIREBASE_COLLECTION.JOBS}/${jobInfo.jobId}/`).set(jobInfo);
};

export const createInbox = async (
  userid,
  roomId,
  jobId,
  oppuserid,
  jobName
) => {
  const inboxKey = `${oppuserid}_${jobId}`;
  await db.ref(`${FIREBASE_COLLECTION.INBOX}/${userid}/${inboxKey}`).set({
    jobId: jobId,
    jobName: jobName,
    roomId: roomId,
    unreadMessages: 0,
  });
};

export const getFirebaseInboxData = async (listner) => {
  let userId = getLoggedInuserId();
  if (!userId) {
    listner([]);
    return;
  }
  let dbRef = `${FIREBASE_COLLECTION.INBOX}/${userId}`;
  console.log("getFirebaseIndexData", dbRef);
  if (inboxListner) {
    db.ref(dbRef).off();
    db.ref(dbRef).off("value", msgListnerObj);
  }
  inboxListner = db.ref(dbRef).on("value", async (snapshot) => {
    let indexlist = [];
    snapshot.forEach((snap) => {
      indexlist.push(snap.val());
    });
    let users = [];
    for (let i = 0; i < indexlist.length; i++) {
      let lastMsg = await db
        .ref(
          `${FIREBASE_COLLECTION.LAST_MESSAGES}/${indexlist[i].roomId}/chatLastMessage`
        )
        .once("value");
      if (lastMsg.exists()) {
        indexlist[i].lastMsg = lastMsg.val();
      }
      let oppUserId = "";
      if (storageService.getItem("userType") === 1) {
        oppUserId = indexlist[i].roomId.split("_")[2];
      } else {
        oppUserId = indexlist[i].roomId.split("_")[1];
      }
      let userIndex = users.findIndex((item) => item.userId === oppUserId);
      if (userIndex == -1) {
        let oppUserInfo = await db
          .ref(`${FIREBASE_COLLECTION.USERS}/${oppUserId}`)
          .once("value");
        if (oppUserInfo.exists()) {
          indexlist[i].oppUserInfo = oppUserInfo.val();
          users.push(oppUserInfo.val());
        }
      } else {
        indexlist[i].oppUserInfo = users[userIndex];
      }
    }
    setPendingCounter(indexlist);
    await listner(indexlist);
  });
};
export const getFirebaseInboxDataForUnreadMsgCount = async (listner) => {
  let userId = getLoggedInuserId();
  if (!userId) {
    listner([]);
    return;
  }
  let dbRef = `${FIREBASE_COLLECTION.INBOX}/${userId}`;
  inboxListner = db.ref(dbRef).on("value", async (snapshot) => {
    let indexlist = [];
    snapshot.forEach((snap) => {
      indexlist.push(snap.val());
    });
    let users = [];
    for (let i = 0; i < indexlist.length; i++) {
      let lastMsg = await db
        .ref(
          `${FIREBASE_COLLECTION.LAST_MESSAGES}/${indexlist[i].roomId}/chatLastMessage`
        )
        .once("value");
      if (lastMsg.exists()) {
        indexlist[i].lastMsg = lastMsg.val();
      }
      let oppUserId = "";
      if (storageService.getItem("userType") === 1) {
        oppUserId = indexlist[i].roomId.split("_")[2];
      } else {
        oppUserId = indexlist[i].roomId.split("_")[1];
      }
      let userIndex = users.findIndex((item) => item.userId === oppUserId);
      if (userIndex == -1) {
        let oppUserInfo = await db
          .ref(`${FIREBASE_COLLECTION.USERS}/${oppUserId}`)
          .once("value");
        if (oppUserInfo.exists()) {
          indexlist[i].oppUserInfo = oppUserInfo.val();
          users.push(oppUserInfo.val());
        }
      } else {
        indexlist[i].oppUserInfo = users[userIndex];
      }
    }
    setPendingCounter(indexlist);
    await listner(indexlist);
  });
};

export const setPendingCounter = (indexlist) => {
  let count = 0;
  let unreadMsg = indexlist.filter((d) => d.unreadMessages > 0);
  unreadMsg.length === 0 ? (count = 0) : (count = unreadMsg.length);
};


export const getMessagesOfRoom = async (roomId, listner) => {
  msgListnerObj = db
    .ref(`${FIREBASE_COLLECTION.MESSAGES}/${roomId}`)
    .orderByChild("messageTimestamp")
    .limitToLast(500)
    .on("value", (snapshot) => {
      let itemlist = [];
      snapshot.forEach((snap) => {
        itemlist.push(snap.val());
      });
      listner(itemlist);
    });
};

export const stopListeningOfRoom = async (roomId) => {
  if (msgListnerObj) {
    db.ref(`${FIREBASE_COLLECTION.MESSAGES}/${roomId}`).off(
      "value",
      msgListnerObj
    );
    db.ref(`${FIREBASE_COLLECTION.MESSAGES}/${roomId}`).off();
  }
  console.log("Stop listening Of Room");
};

export const sendTextMessage = async (roomId, message) => {
  let senderId = getLoggedInuserId();
  let roomids = roomId.split("_");
  let jobId = "";
  let receiverId = "";
  if (roomids.length == 3) {
    if (roomids[1] == senderId) {
      receiverId = roomids[2];
    } else {
      receiverId = roomids[1];
    }
    jobId = roomids[0];
  }

  let dbRef = db.ref(`${FIREBASE_COLLECTION.MESSAGES}/${roomId}`);
  const newMsgRef = dbRef.push();
  // Get the unique key generated by push()
  const messageID = newMsgRef.key;

  let msgData = {
    isBlock: false,
    isDeleted: false,
    mediaDuration: "",
    mediaUrl: "",
    messageCaption: "",
    messageId: messageID,
    messageRoomId: roomId,
    messageStatus: "send",
    messageText: message,
    messageTimestamp: firebase.database.ServerValue.TIMESTAMP,
    messageType: "text",
    progress: 0,
    receiverId: receiverId,
    senderId: senderId,
    thumbnail: "",
  };
  await db
    .ref(`${FIREBASE_COLLECTION.LAST_MESSAGES}/${roomId}/chatLastMessage`)
    .set(msgData);
  await db
    .ref(`${FIREBASE_COLLECTION.MESSAGES}/${roomId}/${messageID}`)
    .set(msgData);
  msgData.messageTimestamp = moment().toDate().getTime();

  //TODO Implement Update Message Counter
  //https://stackoverflow.com/questions/42276881/increment-firebase-value-from-javascript-subject-to-constraint
  let inboxId = `${senderId}_${jobId}`;
  await db
    .ref(`${FIREBASE_COLLECTION.INBOX}/${receiverId}/${inboxId}`)
    .child("unreadMessages")
    .set(firebase.database.ServerValue.increment(1));
  return msgData;
};

export const sendImageVideoMessage = async (roomId, url, type) => {
  let senderId = getLoggedInuserId();
  let roomids = roomId.split("_");
  let jobId = "";
  let receiverId = "";
  if (roomids.length == 3) {
    if (roomids[1] == senderId) {
      receiverId = roomids[2];
    } else {
      receiverId = roomids[1];
    }
    jobId = roomids[0];
  }

  let dbRef = db.ref(`${FIREBASE_COLLECTION.MESSAGES}/${roomId}`);
  const newMsgRef = dbRef.push();
  // Get the unique key generated by push()
  const messageID = newMsgRef.key;

  let msgData = {
    isBlock: false,
    isDeleted: false,
    mediaDuration: "",
    mediaUrl: url,
    messageCaption: "",
    messageId: messageID,
    messageRoomId: roomId,
    messageStatus: "send",
    messageText: "",
    messageTimestamp: firebase.database.ServerValue.TIMESTAMP,
    messageType: type === "image" ? "image" : "video",
    progress: 0,
    receiverId: receiverId,
    senderId: senderId,
    thumbnail: url,
  };
  await db
    .ref(`${FIREBASE_COLLECTION.LAST_MESSAGES}/${roomId}/chatLastMessage`)
    .set(msgData);
  await db
    .ref(`${FIREBASE_COLLECTION.MESSAGES}/${roomId}/${messageID}`)
    .set(msgData);
  msgData.messageTimestamp = moment().toDate().getTime();

  //Implement Update Message Counter
  //https://stackoverflow.com/questions/42276881/increment-firebase-value-from-javascript-subject-to-constraint
  let inboxId = `${senderId}_${jobId}`;
  await db
    .ref(`${FIREBASE_COLLECTION.INBOX}/${receiverId}/${inboxId}`)
    .child("unreadMessages")
    .set(firebase.database.ServerValue.increment(1));
  return msgData;
};

export const resetUnreadCounter = async (roomId) => {
  let senderId = getLoggedInuserId();
  let roomids = roomId.split("_");
  let jobId = "";
  let receiverId = "";
  if (roomids.length === 3) {
    if (roomids[1] == senderId) {
      receiverId = roomids[2];
    } else {
      receiverId = roomids[1];
    }
    jobId = roomids[0];
  }
  let inboxId = `${receiverId}_${jobId}`;
  await db
    .ref(`${FIREBASE_COLLECTION.INBOX}/${senderId}/${inboxId}`)
    .child("unreadMessages")
    .set(0);
};

export default firebase;
