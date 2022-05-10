import React, { useState } from 'react';
import { createPassword } from '../../redux/auth/actions';
import CreatePassword from './components/createPassword';
import SuccessPage from './components/successPage';
import ResetPassword from './components/resetPassword';
import AuthParent from '../../common/auth/authParent';
import VerifyEmail from './components/EmailVerification';

interface Propstype {
    history: any,
    showModal?: boolean,
    setShowModal: (data: any) => void,
    updateSteps?: (data: any) => void,
    modalUpdateSteps: (data: any) => void,
}

const DATA = [
    { title: 'Reset Password' },
    { title: 'Verify your email' },
    { title: 'Create password' },
]

const ForgetPassword = (props: Propstype) => {
    const [steps, setSteps] = useState(1);
    const [loginData, setLoginData] = useState({
        mobileNumber: '',
        email:''
    })

    const updateSteps = (step: number, newData?: any) => {
        setSteps(step);
        if (newData) {
            setLoginData((prevData: any) => ({ ...prevData, ...newData }))
        }
    }

    const backButtonHandler = () => {
        let minStep = 1;
        if (steps === 1) {
            if(props.showModal){
                props.modalUpdateSteps(0);
                return;
            }
            return props?.history?.push('/login')
        }
        if (steps === 3) {
            minStep = 2
        }
        setSteps(steps - minStep)
    }

    const onResetPassword = async (password: any) => {
        const data = { ...loginData, ...password }
        console.log({data})
        delete data.mobileNumber;
        const res = await createPassword(data);
        if (res.success) {
            setSteps(4);
        }
    }
    console.log({loginData})
    const renderPages = () => {
        switch (steps) {
            case 1:
                return <ResetPassword updateSteps={updateSteps} history={props.history} step={steps} />
            case 2:
                return <VerifyEmail updateSteps={updateSteps} history={props.history} step={steps} email={loginData.email} />
            case 3:
                return <CreatePassword onResetPassword={onResetPassword} />
            case 4:
                return <SuccessPage history={props.history} showModal={props.showModal} setShowModal={props.setShowModal} modalUpdateSteps={props.modalUpdateSteps} />
            default: return null
        }
    }

    const header = DATA[steps - 1];

    return header ? (
        <AuthParent sliderType='login' backButtonHandler={backButtonHandler} hideProgres header={header} steps={steps} history={props.history} showModal={props.showModal} setShowModal={props.setShowModal} modalUpdateSteps={props.modalUpdateSteps}>{renderPages()}</AuthParent>
    ) : renderPages()
}

export default ForgetPassword