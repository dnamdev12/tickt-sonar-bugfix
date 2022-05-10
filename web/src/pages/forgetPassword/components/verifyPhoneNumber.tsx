import { useState, useEffect } from 'react';
import { callForgotPassword, verifyOtp } from '../../../redux/auth/actions';
import Constants from '../../../utils/constants';
import regex from '../../../utils/regex';
import OtpInput from "react-otp-input";

interface Propstype {
    updateSteps: (num: number) => void
    step: number
    history?: any
    mobileNumber: string
}

const VerifyPhoneNumber = (props: Propstype) => {
    const [counter, setCounter] = useState(Constants.OTP_TIMER);
    const [otp, setOTP] = useState('');

    const changeHandler = (newOtp: any) => {
        setOTP(newOtp)
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
        return !Object.keys(newErrors).length;
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (validateForm()) {
            const data = {
                otp: otp
            }
            const res: any = await verifyOtp(data)
            if (res.success) {
                props.updateSteps(props.step + 1)
            }
        }
    }

    const resendHandler = async (e: any) => {
        e.preventDefault()
        const data = {
            mobileNumber: props.mobileNumber
        }
        const res: any = await callForgotPassword(data)
        if (res.success) {
            setCounter(Constants.OTP_TIMER)
        }
    }

    return (
        <div className="form_wrapper">
            <form onSubmit={onSubmit}>
                <span className="show_label">Verification Code</span>
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
                <div className="form_field">
                    <span className="show_label">We have sent a verification code to your phone.
                          Please check SMS and enter the 5-digit code here.</span>
                </div>
                {counter === 0 && <div className="form_field text-center">
                    <span className="show_label">Don’t you receive any codes?</span>
                    <a href="#" className="link" onClick={resendHandler}>Re-send code</a>
                </div>}
                {counter > 0 && <div className="form_field text-center">
                    <span className="show_label timer">{counter}</span>
                </div>}
                <div className="form_field">
                    <button className="fill_btn btn-effect">Next</button>
                </div>
            </form>
        </div>
    )
}

export default VerifyPhoneNumber

