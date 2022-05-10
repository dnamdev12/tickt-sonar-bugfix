import React, { useState, useEffect } from 'react';
import Constants from '../../../../../../utils/constants';
import regex from '../../../../../../utils/regex';
import {
  verifyEmailOtp,
  tradieChangeEmail,
} from "../../../../../../redux/profile/actions";
import OtpInput from "react-otp-input";

import cancel from "../../../../../../assets/images/ic-cancel.png";
import storageService from '../../../../../../utils/storageService';

interface PropsTypes {
    history: any,
    currentEmail: string,
    newEmail: string,
    currentPassword: string,
    updateSteps: (step: number, newData?: any) => void,
    backButtonHandler: () => void,
    closeModalHandler: () => void,
}

const VerifyNewEmail = (props: PropsTypes) => {
    const [errors, setErrors] = useState<any>({});
    const [counter, setCounter] = useState(Constants.OTP_TIMER);
    const [otp, setOTP] = useState('');

    const changeHandler = (newOtp: any) => {
        setOTP(newOtp);
    }

    useEffect(() => {
        const timer: any = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);

    const validateForm = () => {
        const newErrors: any = {};
        if (!otp) {
            newErrors.otp = Constants.errorStrings.otpEmpty;
        } else {
            const otpregex = new RegExp(regex.otp);
            if (!otpregex.test(otp)) {
                newErrors.otp = Constants.errorStrings.otpIncorrect;
            }
        }
        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }

    const resendHandler = async (e: any) => {
        e.preventDefault()
        const data = {
            currentEmail: props.currentEmail,
            newEmail: props.newEmail,
            password: props.currentPassword,
            user_type: storageService.getItem('userType'),
        }
        const res = await tradieChangeEmail(data);
        if (res.success) {
            setCounter(Constants.OTP_TIMER);
        }
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (validateForm()) {
            const data = {
                newEmail: props.newEmail,
                otp: otp
            }
            const res: any = await verifyEmailOtp(data);
            if (res.success) {
                props.history?.push('/email-updated-successfully');
            }
        }
    }

    return (
        <>
            <div className="heading form_field">
                <div className="relate">
                    <button className="back" onClick={props.backButtonHandler}></button>
                    <div className="md_heading">
                        <span className="sub_title">Verify your email</span>
                    </div>
                </div>
                <button className="close_btn" onClick={props.closeModalHandler}>
                    <img src={cancel} alt="cancel" />
                </button>
            </div>
            <form onSubmit={onSubmit}>
                <div className="inner_wrap">
                    <div className="form_wrapper">
                        <span className="show_label">Verification Code</span>
                        <div className="form_field">
                            <div className="otp_input_wrapper">
                                <OtpInput
                                    className="sms-no-box"
                                    inputStyle={{ "width": "48px" }}
                                    value={otp}
                                    onChange={changeHandler}
                                    numInputs={5}
                                    isInputNum
                                //separator={<span>-</span>}
                                />
                            </div>
                            {!!errors.otp && <span className="error_msg">{errors.otp}</span>}
                        </div>
                        <div className="form_field">
                            <span className="show_label">We have sent a verification code to your new email.
                                Please check email and enter the 5-digit code here.</span>
                        </div>
                        {counter === 0 && <div className="form_field f_spacebw">
                            <span className="show_label">Don’t you receive any codes?</span>
                            <a href="#" className="link" onClick={resendHandler}>Re-send code</a>
                        </div>}
                        {counter > 0 && <div>
                            <span className="show_label timer">{counter > 59 ? `01 : 00` : `00 : ${counter}`}</span>
                        </div>}

                    </div>
                </div>
                <div className="bottom_btn custom_btn">
                    <button className="fill_btn full_btn btn-effect">Next</button>
                </div>
            </form>
        </>
    )
}

export default VerifyNewEmail;
