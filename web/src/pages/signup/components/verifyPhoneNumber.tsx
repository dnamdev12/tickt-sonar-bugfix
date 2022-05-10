import { useState, useEffect } from 'react';
import { checkMobileNumber, verifyOtp, verifyMobileOtp , resendOtp, resendMobileOtp} from '../../../redux/auth/actions';
import Constants from '../../../utils/constants';
import regex from '../../../utils/regex';
import OtpInput from "react-otp-input";

interface Propstype {
    updateSteps: (num: number) => void
    step: number
    history?: any
    mobileNumber: string,
    userType?: any
}

const VerifyPhoneNumber = (props: Propstype) => {
    const [errors, setErrors] = useState<any>({});
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
            const otpRegex = new RegExp(regex.otp);
            if (!otpRegex.test(otp)) {
                newErrors.otp = Constants.errorStrings.otpIncorrect
            }
        }
        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (validateForm()) {
            const data = {
                otp: otp,
                mobileNumber: props.mobileNumber
            }
            // const res: any = await verifyOtp(data)
            const res: any = await verifyMobileOtp(data);
            if (res.success) {
                props.updateSteps(props.step + 1)
            }
        }
    }

    const resendHandler = async (e: any) => {
        e.preventDefault();
        let data = {
            "mobileNumber": props.mobileNumber
        };
        let response = await resendMobileOtp(data);
        if (response.success) {
        // const res: any = await checkMobileNumber(props.mobileNumber)
            setCounter(Constants.OTP_TIMER)
        }
    }

    return (
        <div className="form_wrapper">
            <form onSubmit={onSubmit}>
                <span className="show_label">Verification Code</span>
                {/* <div className="otp_input_wrapper">
                                <input type="number" className="sms-no-box" name="ssn-1" maxLength={1} onChange={changeHandler} />
                            </div> */}
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
                    <span className="show_label">We have sent a verification code to your phone.
                        Please check SMS and enter the 5-digit code here.</span>
                </div>
                {counter === 0 &&
                 <div className="form_field text-center">
                    <span className="show_label">Don’t you receive any codes?</span>
                    <a href="#" className="link" onClick={resendHandler}>Re-send code</a>
                </div>
                } 
                {counter > 0 && <div className="form_field text-center">
                    <span className="show_label timer">{counter > 59 ? `01 : 00` : `00 : ${counter}`}</span>
                </div>}
                <div className="form_field">
                    <button className="fill_btn btn-effect">Next</button>
                </div>
            </form>
        </div>
    )
}

export default VerifyPhoneNumber

