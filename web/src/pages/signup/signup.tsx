import { useState, useEffect } from 'react';
import CreateAccount from './components/createAccount';
import InitialSignupPage from './components/initialSignupPage';
import LetsGo from './components/letsGo';
import SelectYourSphere from './components/selectYourSphere';
import PhoneNumber from './components/phoneNumber';
import VerifyPhoneNumber from './components/verifyPhoneNumber';
import CreatePassword from './components/createPassword';
import Specialization from './components/specialization';
import AlmostDone from './components/almostDone';
import AddQualification from './components/addQualification';
import AddABN from './components/addABN';
import { postSignup, socialSignupLogin } from '../../redux/auth/actions';
import AuthParent from '../../common/auth/authParent';
import VerifyEmail from './components/EmailVerification'
import { moengage, mixPanel } from '../../services/analyticsTools';
import { MoEConstants } from '../../utils/constants';

interface Propstype {
    history?: any,
    showModal: boolean,
    callTradeList: () => void,
    tradeListData: Array<any>,
    modalUpdateSteps: (data: any) => void,
    setShowModal: (data: any) => void,
    socialData: any,
}

const DATA = [
    { title: 'Welcome to Tickt', subTitle: 'A new marketplace for builders and tradespeople' },
    { title: 'Create account' },
    { title: 'Verify your email' },
    { title: 'Phone number' },
    { title: 'Verify your number' },
    { title: 'Create password' },
    { title: 'Select the trade you used the most', tradieTitle: 'What is your trade?' },
    { title: 'What Specialisation?' },
    { title: 'Almost done', tradieTitle: 'Add qualification' },
    { title: 'Almost done' }
]

const Signup = (props: Propstype) => {
    const [steps, setSteps] = useState<number>(0);
    const [signupData, setSignupData] = useState<any>({
        firstName: '',
        mobileNumber: '',
        email: '',
        user_image: '',
        password: '',
        socialId: '',
        accountType: '',
        trade: '',
        specialization: [],
        qualification: [],
        user_type: 0,
        location: {
            type: "Point",
            coordinates: [
                144.9631,
                -37.8136
            ]
        }
    });

    useEffect(() => {
        var locationNew: any = {
            location: {
                type: "Point",
                coordinates: [
                    144.9631, //long
                    37.8136 //lat
                ]
            }
        }

        const showPosition = (position: any) => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            locationNew.location.coordinates[0] = long;
            locationNew.location.coordinates[1] = lat;
            setSignupData((prevData: any) => ({ ...prevData, ...locationNew }));
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    }, [])

    const backButtonHandler = () => {
        let minStep = 1;
        let stateStepsValue = steps;

        if (stateStepsValue === 5 && signupData.user_type === 2) {
            minStep = 2;
        }

        if (stateStepsValue === 5 && signupData.user_type === 1) {
            minStep = 2;
        }

        if (stateStepsValue === 3 && (props.socialData || props.history?.location?.redirect === "socialRedirectFromLogin")) {
            minStep = 3;
        } else {
            if (stateStepsValue === 3 && signupData.user_type === 2) {
                minStep = 2;
            }

            if (stateStepsValue === 3 && signupData.user_type === 1) {
                minStep = 2;
            }
        }

        if (stateStepsValue === 8 && signupData.user_type === 2) {
            stateStepsValue = 6;
        }
        if ((stateStepsValue === 6 || stateStepsValue === 3) && signupData.socialId) {
            minStep = 3;
        }
        console.log({
            stateStepsValue,
            minStep,
            set: stateStepsValue - minStep
        }, 'update')
        setSteps(stateStepsValue - minStep);
    }

    const updateSteps = (step: number, newData?: any) => {
        var newStep = step;
        if (!signupData.socialId && (props.socialData || props.history?.location?.redirect === "socialRedirectFromLogin")) {
            const profile = props.socialData ? props.socialData : props.history?.location?.state?.profileData;
            console.log(profile, "profile updateSteps", props.history)
            if (props.socialData) {
                setSignupData((prevData: any) => ({ ...prevData, ...profile }))
            }
            if (props.history?.location?.state?.profileData) {
                setSignupData((prevData: any) => ({ ...prevData, ...profile }))
            }
            newStep += 2;
        }
        if (newStep === 1 && (props.socialData || props.history?.location?.redirect === "socialRedirectFromLogin" || signupData.socialId)) {
            newStep += 2;
        }
        if (newStep === 5 && signupData.socialId) {
            newStep += 1;
        }
        if (newStep === 6 && signupData.user_type === 2) {
            newStep += 2;
        }
        setSteps(newStep);
        console.log({ newStep }, 'update')
        if (newData) {
            setSignupData((prevData: any) => ({ ...prevData, ...newData }))
        }
    }

    const onNewAccount = (profileData: any, socialType: string) => {
        console.log('profileData: ', profileData);
        setSteps(steps + 2);
        const newProfileData = {
            firstName: profileData.name,
            authType: "signup",
            email: profileData.email,
            accountType: socialType,
            user_image: profileData?.imageUrl || '',
            ...(socialType === 'google' && { socialId: profileData.googleId }),
            ...(socialType === 'linkedIn' && { socialId: profileData.socialId })
        }
        setSignupData((prevData: any) => ({ ...prevData, ...newProfileData }))
    }

    const onSubmitSignup = async (lastStepFields: any) => {
        var res: any;
        const newData = { ...signupData, ...lastStepFields };
        const data = {
            ...newData,
            trade: [newData.trade],
            user_type: signupData.user_type,
            deviceToken: "323245356tergdfgrtuy68u566452354dfwe",
        }
        if (data.user_type === 2) {
            delete data.trade;
            delete data.specialization;
            delete data.qualification;
        }
        if (signupData.accountType) {
            delete data.password;
            res = await socialSignupLogin(data);
        } else {
            delete data.socialId;
            delete data.accountType;
            res = await postSignup(data);
        }
        if (res.success) {
            const mData = {
                success_status: true,
                name: data?.firstName,
                //'sign up source': '',
                Platform: 'Web',
                email: data?.email
            };
            moengage.moE_SendEvent(MoEConstants.SIGN_UP, mData);
            mixPanel.mixP_SendEvent(MoEConstants.SIGN_UP, mData);
            if (signupData.user_type === 2) {
                setSteps(9);
            } else {
                setSteps(10)
            }
        }
    }

    console.log("signupData ==>", signupData)

    const renderPages = () => {
        console.log(steps, 'step---->');
        switch (steps) {
            case 0:
                return <InitialSignupPage updateSteps={updateSteps} history={props.history} step={steps} showModal={props.showModal} modalUpdateSteps={props.modalUpdateSteps} callTradeList={props.callTradeList} />
            case 1:
                return <CreateAccount updateSteps={updateSteps} history={props.history} step={steps} data={signupData} onNewAccount={onNewAccount} showModal={props.showModal} setShowModal={props.setShowModal} modalUpdateSteps={props.modalUpdateSteps} />
            case 2:
                return <VerifyEmail updateSteps={updateSteps} step={steps} userType={signupData.user_type} email={signupData.email} />
            case 3:
                return <PhoneNumber updateSteps={updateSteps} step={steps} mobileNumber={signupData.mobileNumber} />
            case 4:
                return <VerifyPhoneNumber updateSteps={updateSteps} step={steps} userType={signupData.user_type} mobileNumber={signupData.mobileNumber} />
            case 5:
                return <CreatePassword updateSteps={updateSteps} step={steps} password={signupData.password} />
            case 6:
                return <SelectYourSphere updateSteps={updateSteps} step={steps} tradeListData={props.tradeListData} trade={signupData.trade} />
            case 7:
                return <Specialization updateSteps={updateSteps} step={steps} tradeListData={props.tradeListData} trade={signupData.trade} specialization={signupData.specialization} />
            case 8:
                if (signupData.user_type === 2) {
                    return <AlmostDone onSubmitSignup={onSubmitSignup} />
                } else {
                    return <AddQualification updateSteps={updateSteps} step={steps} tradeListData={props.tradeListData} trade={signupData.trade} qualification={signupData.qualification} />
                }
            case 9:
                if (signupData.user_type === 2) {
                    return <LetsGo history={props.history} showModal={props.showModal} setShowModal={props.setShowModal} modalUpdateSteps={props.modalUpdateSteps} />
                } else {
                    return <AddABN onSubmitSignup={onSubmitSignup} />
                }
            case 10:
                return <LetsGo history={props.history} showModal={props.showModal} setShowModal={props.setShowModal} modalUpdateSteps={props.modalUpdateSteps} />
            default:
                return null
        }
    }

    const header = DATA[steps];
    const isSuccess = signupData.user_type === 2 ? steps === 9 : steps === 10;

    return !isSuccess ? (
        <AuthParent sliderType='login' backButtonHandler={backButtonHandler} header={header} userType={signupData.user_type} steps={steps} history={props.history} showModal={props.showModal} setShowModal={props.setShowModal} modalUpdateSteps={props.modalUpdateSteps} socialId={signupData.socialId} >{renderPages()}</AuthParent>
    ) : renderPages()
}

export default Signup;
