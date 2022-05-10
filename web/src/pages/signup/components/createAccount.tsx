import { useState } from 'react';
import { checkEmailId } from '../../../redux/auth/actions';
import Constants from '../../../utils/constants';
import regex from '../../../utils/regex';
import SocialAuth from "../../../common/auth/socialAuth";
import { setShowToast } from '../../../redux/common/actions';
import Urls,{ urlFor }  from '../../../network/Urls';

interface Propstype {
    updateSteps: (num: number, data: any) => void,
    step: number,
    history?: any,
    data: any,
    onNewAccount: Function,
    showModal?: boolean,
    modalUpdateSteps: (data: any) => void,
    setShowModal: (data: any) => void,
}

const CreateAccount = (props: Propstype) => {
    const [errors, setErrors] = useState<any>({});
    const [signupData, setSignupData] = useState<any>({
        firstName: props.data.firstName,
        email: props.data.email,
        tnc: false,
    })

    const changeHandler = (e: any) => {
        setSignupData((prevData: any) => ({ ...prevData, [e.target.name]: e.target.value }))
    }

    const tncHandler = () => {
        setSignupData((prevData: any) => ({ ...prevData, tnc: !prevData.tnc }))
    }

    const validateForm = () => {
        const newErrors: any = {};
        if (!signupData.firstName) {
            newErrors.firstName = Constants.errorStrings.fullNameEmpty;
        } else {
            const nameRegex = new RegExp(regex.fullname);
            if (!nameRegex.test(signupData.firstName.trim())) {
                newErrors.firstName = Constants.errorStrings.fullNameErr
            }
        }
        if (!signupData.email) {
            newErrors.email = Constants.errorStrings.emailEmpty;
        } else {
            const emailRegex = new RegExp(regex.email);
            if (!emailRegex.test(signupData.email)) {
                newErrors.email = Constants.errorStrings.emailErr;
            }
        }
        if (!signupData.tnc) {
            newErrors.tnc = Constants.errorStrings.tncEmpty;
        }
        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }

    const phoneViewHandler = (e: any) => {
        e.preventDefault();
        if(props.showModal){
            props.modalUpdateSteps(0)
            return;
        }
        props.history.push('/login')
    }

    const onSubmit = async (e: any) => {
        const data = { ...signupData };
        delete data.tnc;
        e.preventDefault();
        if (validateForm()) {
            const res: any = await checkEmailId(signupData.email)
            res?.isProfileCompleted && setShowToast(true, res.message);
            if (!res.isProfileCompleted && res.success) {
                props.updateSteps(props.step + 1, data)
            }
        }
    }

    return (
        <div className="form_wrapper">
            <form onSubmit={onSubmit}>
                <div className="form_field">
                    <label className="form_label">Full Name</label>
                    <div className="text_field">
                        <input placeholder="Enter Full Name" value={signupData.firstName} name="firstName" onChange={changeHandler} />
                    </div>
                    {!!errors.firstName && <span className="error_msg">{errors.firstName}</span>}
                </div>

                <div className="form_field">
                    <label className="form_label">Email</label>
                    <div className="text_field">
                        <input className="detect_input" name="email" value={signupData.email}
                            placeholder="Enter Email Address" onChange={changeHandler} />
                    </div>
                    {!!errors.email && <span className="error_msg">{errors.email}</span>}
                </div>


                <div className="form_field">
                    <div className="checkbox_wrap agree_check">
                        <input className="filter-type filled-in" type="checkbox" name="tnc" id="tnc"
                            checked={signupData.tnc} onChange={tncHandler} />
                        <label htmlFor="tnc">I agree to </label>
                        <a onClick={() => window.open(urlFor(Urls.privacyPolicyWeb), "_blank")} rel="noopener" className="link">Privacy Policy</a>
                        <label className="and">&nbsp;and&nbsp;</label>
                        <a onClick={() => window.open(urlFor(Urls.tncWeb), "_blank")}  rel="noopener" className="link m-l-30">Terms &amp; Conditions</a>
                    </div>
                    {!!errors.tnc && <span className="error_msg m-t">{errors.tnc}</span>}
                </div>
                <div className="form_field">
                    <button type="submit" className="fill_btn btn-effect">Sign up</button>
                </div>
                <span className="show_label text-center">or continue with</span>
                <SocialAuth onNewAccount={props.onNewAccount}
                    history={props.history}
                    userType={props.data.user_type}
                    showModal={props.showModal}
                    setShowModal={props.setShowModal}
                    modalUpdateSteps={props.modalUpdateSteps}
                />
                <div className="form_field hide text-center">
                    <span className="reg">Have an account? <a className="link" onClick={phoneViewHandler}>
                        Login</a></span>
                </div>

            </form>
        </div>
    )
}

export default CreateAccount
