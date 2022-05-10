
export const moengage = {
    getCurrentTimeStamp() {
        return new Date().getTime();
    },
    moE_LoginEvent(userInfo) {
        window.Moengage.add_email(userInfo.email);
        window.Moengage.add_user_name(userInfo.userName); // Full name for user
        window.Moengage.add_unique_user_id(userInfo.userId);
    },
    moE_LogoutEvent() {
        window.Moengage.destroy_session();
    },
    moE_SendEvent(eventName, properties) {
        console.log('moE_SendEvent: ', eventName, 'zzz', properties);
        window.Moengage.track_event(eventName, properties);
    }
}

export const mixPanel = {
    mixP_SendEvent(eventName, properties) {
        console.log('mixP_SendEvent: ', eventName, 'zzz', properties);
        window.mixpanel.track(eventName, properties);
    }
}
