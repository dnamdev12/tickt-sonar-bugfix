importScripts("https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.7.1/firebase-messaging.js");

// import firebase from "firebase/app";
// import "firebase/messaging";

const qaStgFirebaseConfig = {
  apiKey: "AIzaSyDKFFrKp0D_5gBsA_oztQUhrrgpKnUpyPo",
  authDomain: "tickt-app.firebaseapp.com",
  databaseURL: "https://tickt-app-default-rtdb.firebaseio.com",
  projectId: "tickt-app",
  storageBucket: "tickt-app.appspot.com",
  messagingSenderId: "795502342919",
  appId: "1:795502342919:web:37a2294b55f69051d30ba2",
  measurementId: "G-KT3LTB6JMT",
};

firebase.initializeApp(qaStgFirebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  try {
    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload
    );
    var title = payload.data?.title;
    var body = payload.data?.notificationText;
    var data = { ...payload.data };
    var icon = data?.app_icon;

    return self.registration.showNotification(title, {
      // tag: tag,
      icon: icon,
      body: body,
      data: data,
    });
  } catch (e) {
    console.log("firebase message fetch error");
  }
});

const onNotificationClick = (notification) => {
  // const url = process.env.REACT_APP_BASE_URL;
  // const url = 'http://localhost:3000/';
  const url = "https://ticktreactstg.appskeeper.in/";
  // const url = 'https://ticktreactqa.appskeeper.in/';
  // const url = 'https://ticktreactdev.appskeeper.in/';
  if (notification?.notificationType === "25") {
    return `${url}chat`;
  } else if (notification?.notificationType === "13") {
    return `${url}`;
  }
  const { notificationType, user_type, receiverId, senderId, jobId } =
    notification;
  let extra_data = JSON.parse(notification?.extra_data);
  switch (Number(notificationType)) {
    case 1: //TRADIE
      if (user_type == 1) {
        return `${url}tradie-info?tradeId=${receiverId}`;
      } else {
        return `${url}tradie-info?jobId=${jobId}&tradeId=${senderId}&hideInvite=false`;
      }
    case 2: //BUILDER
      if (user_type == 1) {
        return `${url}builder-info?builderId=${senderId}`;
      } else {
        return `${url}builder-info?builderId=${receiverId}&type=2`;
      }
    case 3: //JOB
      if (user_type == 1) {
        return `${url}job-details-page?jobId=${jobId}&redirect_from=jobs`;
      } else {
        let urlEncode = `?jobId=${jobId}&status=${extra_data?.jobStatusText}&tradieId=${senderId}&edit=true&activeType=active`;
        return `${url}job-detail?${urlEncode}`;
      }
    case 4: //PAYMENT
      return `${url}payment-history`;
    case 5: //DISPUTES
      if (user_type == 1) {
        return `${url}job-details-page?jobId=${jobId}&redirect_from=jobs`;
      } else {
        let urlEncode = `?jobId=${jobId}&status=${extra_data?.jobStatusText}&tradieId=${senderId}&edit=true&activeType=active`;
        return `${url}job-detail?${urlEncode}`;
      }
    case 7: //REVIEW_TRADIE
      return `${url}jobs?active=past&jobId=${jobId}`;
    case 8: //REVIEW_BUILDER
      return `${url}review-builder?jobId=${jobId}`;
    case 9: //QUESTION
      if (user_type == 1) {
        return `${url}job-details-page?jobId=${jobId}&tradeId=${extra_data?.tradeId}&specializationId=${extra_data?.specializationId}&openQList=true`;
      } else {
        let urlEncode = `?jobId=${jobId}&status=${extra_data?.jobStatusText}&openQList=true`;
        return `${url}job-detail?${urlEncode}`;
      }
    case 10: //OPEN OPPOSITE USER REVIEW LIST
      if (user_type == 1) {
        //tradieId builderId in extra_data
        return `${url}builder-info?builderId=${extra_data?.builderId}`;
      } else {
        return `${url}tradie-info?tradeId=${extra_data?.tradieId}`;
      }
    case 11: //TERM_AND_CONDITION
      return `${url}update-user-info?menu=tnc`;
    case 12: //JOB_DASHBOARD
      if (user_type == 1) {
        const type = +extra_data?.redirect_status;
        return type === 1
          ? `${url}past-jobs`
          : type === 2
          ? `${url}active-jobs`
          : type === 3
          ? `${url}new-jobs`
          : `${url}active-jobs`;
      } else {
        const type = +extra_data?.redirect_status;
        return `${url}jobs?active=${
          type === 1
            ? `past`
            : type === 2
            ? `active`
            : type === 3
            ? "applicant"
            : "active"
        }`;
      }
    case 13: //BLOCK_ACCOUNT
      return `${url}`;
    case 14: //MARK_MILESTONE
      if (user_type == 1) {
        if (extra_data?.jobStatusText === "COMPLETED") {
          return `${url}job-details-page?jobId=${jobId}&redirect_from=jobs`;
        } else {
          return `${url}mark-milestone?jobId=${jobId}&redirect_from=jobs&force=true`;
        }
      } else {
        if (extra_data?.jobStatusText === "COMPLETED") {
          let urlEncode = `?jobId=${jobId}&status=${extra_data?.jobStatusText}&tradieId=${senderId}&edit=true&activeType=active`;
          return `${url}job-detail?${urlEncode}`;
        } else {
          return `${url}jobs?active=active&jobId=${jobId}&markMilestone=true`;
        }
      }
    case 15: //JOB_HOMEPAGE
      if (user_type == 1) {
        return `${url}job-details-page?jobId=${jobId}&tradeId=${extra_data?.tradeId}&specializationId=${extra_data?.specializationId}`;
      } else {
        return `${url}`;
      }
    case 16: //SELF_REVIEW_LIST_OPEN
      if (user_type == 1) {
        return `${url}tradie-info?tradeId=${receiverId}`;
      } else {
        return `${url}builder-info?builderId=${receiverId}`;
      }
    case 17: //TRADIE_RECEIVE_VOUCH
      if (user_type == 1) {
        return `${url}tradie-vouchers?tradieId=${receiverId}`;
      } else {
        return `${url}`;
      }
    case 18: //ADMIN_NOTIFICATION
      return `${url}admin-announcement-page?admin_notification_id=${extra_data?.admin_notification_id}`;
    case 19: //PRIVACY_POLICY
      return `${url}update-user-info?menu=pp`;
    case 20: // VIEW_QUOTE_JOB
      return `${url}jobs?active=active&viewQuotes=true&jobId=${jobId}&tradieId=${senderId}`;
    case 21: // BUILDER_QUOTE_CANCEL
      if (user_type == 1) {
        return `${url}job-details-page?jobId=${jobId}&redirect_from=jobs`;
      } else {
        return `${url}quote-job-cancel?jobId=${jobId}&tradieId=${senderId}`;
      }
    case 25: //CHAT_NOTIFICATION
      return `${url}chat`;
    default:
      return `${url}`;
  }
};

self.addEventListener("notificationclick", (event) => {
  console.log("notificationclick made service worker");
  let url = onNotificationClick(event.notification?.data);
  let dot = url.includes("?") ? "&" : "?";
  if (event.notification?.data?.notificationType !== "25") {
    url = url + `${dot}pushNotifId=${event.notification?.data?._id}`;
  }
  console.log("url ", url);
  event.waitUntil(self.clients.openWindow(`${url}`));

  // event.waitUntil(
  //     self.clients.matchAll({ type: 'window' }).then(windowClients => {
  //         console.log('windowClients: ', windowClients);
  //         // Check if there is already a window/tab open with the target URL
  //         for (var i = 0; i < windowClients.length; i++) {
  //             var client = windowClients[i];
  //             // If so, just focus it.
  //             if (client.url == url && 'focus' in client) {
  //                 return client.focus();
  //             }
  //         }
  //         // If not, then open the target URL in a new window/tab.
  //         if (self.clients.openWindow) {
  //             return self.clients.openWindow(url);
  //         }
  //     })
  // );
  // return self.clients.openWindow();
});

self.addEventListener("notificationclose", (event) => {
  event.notification.close();
  console.log("notification close");
});
