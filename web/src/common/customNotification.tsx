import { useEffect } from 'react';
import { connect } from 'react-redux';
import { setShowNotification } from '../redux/common/actions';
import { onNotificationClick } from '../utils/common';
import { markNotifAsRead } from '../redux/auth/actions';
import { useHistory } from 'react-router-dom';
import dummy from '../assets/images/u_placeholder.jpg';
import close from '../assets/images/icon-close-1.png';

const NOTIFICATION_TIMEOUT = 3750;

const CustomNotification = (props: any) => {
    const history: any = useHistory();
    const notification = props.notificationData?.data;
    console.log('notification: ', notification, history);

    useEffect(() => {
        if (props?.showNotification) {
            setTimeout(() => setShowNotification(false), NOTIFICATION_TIMEOUT);
        }

        return () => clearTimeout();
    }, [props.showNotification]);

    const displayNotifText = () => {
        if (notification?.notificationType == 25) {
            if (notification?.messageType === 'text') {
                return notification?.messageText;
            } else if (notification?.messageType === 'image') {
                return `Send you a Photo`;
            } else if (notification?.messageType === 'video') {
                return `Send you a Video`;
            }
        } else {
            return notification?.notificationText;
        }
    }

    return !!props.showNotification && !(notification?.notificationType == 25 && window.location.pathname === '/chat') ? (
        <div className="body-message active">
            <span className="cross-icon" onClick={() => setShowNotification(false)}>
                <img src={close} alt="img" />
            </span>
            <div className="wrapppr" onClick={() => {
                markNotifAsRead({ notificationId: notification?._id });
                const url1: string = onNotificationClick(notification);
                const url2: string = history.location?.pathname + history.location?.search;
                setShowNotification(false);
                if (url1 === url2) {
                    window.location?.reload();
                    return;
                }
                history.push(url1);
            }}>
                <div className="notif">
                    <figure className="not_img">
                        <img src={notification?.image || dummy} alt="img" />
                    </figure>
                    <div className="info">
                        <span className="who line-1">{notification?.notificationType == 25 ? notification?.senderName : notification?.title}</span>
                        <span className="line-1">{displayNotifText()}</span>
                    </div>
                    {/* <span className="time">{formatNotificationTime(notification?.updatedAt, 'day')}</span> */}
                    <span className="time">{'just now'}</span>
                </div>
            </div>
        </div>
    ) : null;
}

const mapStateToProps = (state: any) => {
    return {
        showNotification: state.common.showNotification,
        notificationData: state.common.notificationData,
    }
}

export default connect(mapStateToProps)(CustomNotification);
