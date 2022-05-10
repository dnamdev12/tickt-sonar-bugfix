import Constants from '../../utils/constants';
import gmail from '../../assets/images/ic-google.png';
import linkedin from '../../assets/images/ic-linkedin.png';
import { checkSocialId, getLinkedinProfile, socialSignupLogin } from '../../redux/auth/actions';
// @ts-ignore
import { GoogleLogin } from 'react-google-login';
// @ts-ignore
import { LinkedIn } from 'react-linkedin-login-oauth2';
// @ts-ignore
//import AppleLogin from 'react-apple-login';
import { loginAnonymously } from '../../services/firebase';

interface Propstype {
    onNewAccount: Function,
    history: any,
    userType?: number,
    showModal?: boolean,
    modalUpdateSteps: (data: any) => void,
    setShowModal: (data: any) => void,
}

const SocialAuth = (props: Propstype) => {

    const onFailure = (error: any) => {
        console.log(error);
    };

    const googleResponse = async (response: any) => {
        const res = await checkSocialId({ socialId: response.googleId, email: response.profileObj.email })
        if (res.success) {
            if (res.isProfileCompleted) {
                //in case of existing social account
                let data: any = {
                    authType: "login",
                    email: response.profileObj?.email,
                    socialId: response.profileObj?.googleId,
                    accountType: "google",
                    ...(props.userType && { user_type: props.userType })
                }
                const res = await socialSignupLogin(data)
                if (res.success) {
                    loginAnonymously();
                    if (props.showModal) {
                        props.setShowModal(!props.showModal);
                    }
                    props.history.push('/');
                }
            } else {
                //in case of new social account
                props.onNewAccount(response.profileObj, 'google');
            }
        }
    };

    const linkedInResponse = async (response: any) => {
        const resSocial = await getLinkedinProfile({ code: response.code, redirect_uri: Constants.LinkedInAuth.REDIRECT_URI })
        const resCheckId = await checkSocialId({ socialId: resSocial.result.id, email: resSocial.result.email })
        if (resCheckId.success) {
            if (resCheckId.isProfileCompleted) {
                //in case of existing social account
                let data: any = {
                    authType: "login",
                    email: resSocial.result?.email,
                    accountType: "linkedIn",
                    socialId: resSocial.result?.id,
                    ...(props.userType && { user_type: props.userType })
                }
                const resAuth = await socialSignupLogin(data)
                console.log('resAuth: ', resAuth);
                if (resAuth.success) {
                    loginAnonymously();
                    if (props.showModal) {
                        props.setShowModal(!props.showModal);
                    }
                    props.history.push('/');
                }
            } else {
                //in case of new social account
                props.onNewAccount({ name: resSocial.result.firstName, email: resSocial.result.email, socialId: resSocial.result.id }, 'linkedIn');
            }
        }
    }

    return (
        <div className="continue_with">
            <GoogleLogin
                clientId={Constants.SocialAuth.GOOGLE_CLIENT_ID}
                onSuccess={googleResponse}
                onFailure={onFailure}
                render={(renderProps: any) => (<a className="hvr-ripple-out" onClick={renderProps.onClick}>
                    <img src={gmail} alt="google" />
                </a>)}
            />
            <LinkedIn
                clientId={Constants.LinkedInAuth.CLIENT_ID}
                onSuccess={linkedInResponse}
                onFailure={onFailure}
                scope="r_liteprofile r_emailaddress"
                state="gjhcbf355ESDE"
                redirectUri={Constants.LinkedInAuth.REDIRECT_URI}
                renderElement={(renderProps: any) => (<a className="hvr-ripple-out" onClick={renderProps.onClick} >
                    <img src={linkedin} alt="linkedin" />
                </a>
                )}
            />
        </div>
    )
}

export default SocialAuth
