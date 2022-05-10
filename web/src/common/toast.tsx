import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setShowToast } from '../redux/common/actions';
import noInternet from '../assets/images/internet-connection-graphic.png';

export const TYPES = {
    success: 'success',
    error: 'failed',
    warning: 'warning',
    info: 'info'
}

// handles the auto hiding of toast
const TOAST_TIMEOUT = 3000;
const checkConnection = window.navigator.onLine;
const Toast = (props: any) => {
    const [isOnline, setNetwork] = useState(checkConnection);

    useEffect(() => {
        window.addEventListener("offline", handleConnectionChange);
        window.addEventListener("online", handleConnectionChange);
        return () => {
            window.removeEventListener("offline", handleConnectionChange);
            window.removeEventListener("online", handleConnectionChange);
        };
    }, []);

    useEffect(() => {
        setTimeout(() => hideToast(), TOAST_TIMEOUT);
    }, [props.showToast]);

    useEffect(() => {
        if (isOnline) {
            addRemoveClass(false);
        }
    }, [isOnline]);

    const handleConnectionChange = () => {
        const condition = navigator.onLine ? 'online' : 'offline';
        if (condition === 'online') {
            const webPing = setInterval(
                () => {
                    fetch('//google.com', {
                        mode: 'no-cors',
                    })
                        .then(() => {
                            setNetwork(true);
                            (() => {
                                return clearInterval(webPing)
                            })();
                        }).catch(() => setNetwork(false))
                }, 2000);
            return;
        }
        return setNetwork(false);
    }

    const hideToast = () => {
        setShowToast(false);
    }

    const addRemoveClass = (if_add: boolean) => {
        var element = document.getElementsByTagName("BODY")[0];
        if (if_add) {
            element.classList.add("hide_scroll");
        } else {
            element.classList.remove("hide_scroll");
        }
    }

    const renderToast = () => {
        return props.toastMessage;
    }
    console.log({ isOnline });
    return !!props.showToast ? (
        <div className={`body-message active ${props.toastType}`}>
            <div className="wrapppr">
                <p className="commn_para">{renderToast()}</p>
            </div>
        </div>
    ) : !isOnline ? (
        <div className="offline_mode">
            {addRemoveClass(true)}
            <figure className="no_img">
                <img src={noInternet} alt="no-internet" />
            </figure>
            <div className="content">
                <h1>{'No Internet Connection'}</h1>
            </div>
        </div>
    ) : null;
}

Toast.defaultProps = {
    toastType: TYPES.error,
    toastMessage: 'Something Went Wrong'
}

const mapStateToProps = (state: any) => {
    return {
        showToast: state.common.showToast,
        toastType: state.common.toastType,
        toastMessage: state.common.toastMessage,
    }
}

export default connect(mapStateToProps)(Toast);