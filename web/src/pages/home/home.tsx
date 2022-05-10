import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import GuestHome from './guestHome';
import TradieHome from './tradieHome/index';
import BuilderHome from './builderHome/index';
import storageService from '../../utils//storageService';
import { addFCMNotifToken } from '../../redux/auth/actions';
import { requestPermission, updateChatUserDetails } from "../../services/firebase";

const Home = () => {
    const [userType] = useState(storageService.getItem('userType'))
    const history: any = useHistory();

    const setTokenSentToServer = (sent: any) => {
        storageService.setItem('sentToServer', sent ? '1' : '0');
    }

    useEffect(() => {
        (async () => {
            if (userType === 1 || userType === 2) {
                const res: any = await requestPermission();
                const data: any = {
                    deviceToken: res?.deviceToken, //fcm device token
                    deviceId: `${storageService.getItem('userInfo')?.deviceId}`,
                    deviceType: 1
                }
                console.log(data.deviceToken, "---------------diff----------------", storageService.getItem('fcmToken'));
                if (res?.success) {
                    if (storageService.getItem('fcmToken') !== data.deviceToken) {
                        updateChatUserDetails('deviceToken', data.deviceToken);
                        const res2 = await addFCMNotifToken(data);
                        if (res2.success) {
                            storageService.setItem("fcmToken", data.deviceToken);
                            setTokenSentToServer(true);
                        } else {
                            setTokenSentToServer(false);
                        }
                    }
                }
            }
        })();
    }, []);

    if (userType === 1) {
        return <TradieHome history={history} />
    } else if (userType === 2) {
        return <BuilderHome history={history} />
    } else {
        return <GuestHome />
    }
}

export default Home;
