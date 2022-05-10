import React, { useState } from 'react';
import Constants from '../../../../../../utils/constants';
import regex from '../../../../../../utils/regex';
import { tradieChangeEmail } from '../../../../../../redux/profile/actions';

import eyeIconClose from '../../../../../../assets/images/icon-eye-closed.png';
import eyeIconOpen from '../../../../../../assets/images/icon-eye-open.png';
import cancel from "../../../../../../assets/images/ic-cancel.png";
import storageService from '../../../../../../utils/storageService';

interface PropsTypes {
    currentEmail: string,
    newEmail: string,
    currentPassword: string,
    updateSteps: (step: number, newData?: any) => void,
    backButtonHandler: () => void,
    closeModalHandler: () => void,
}

const NewEmail = (props: PropsTypes) => {
    const [errors, setErrors] = useState<any>({});
    const [newEmail, setNewEmail] = useState<string>(props.newEmail);
    const [currentPassword, setCurrentPassword] = useState<string>(props.currentPassword);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const validateChangeEmailForm = () => {
        const newErrors: any = {};
        if (!newEmail) {
            newErrors.newEmail = 'New Email Address is required';
        } else {
            const emailRegex = new RegExp(regex.email);
            if (!emailRegex.test(newEmail.trim())) {
                newErrors.newEmail = Constants.errorStrings.emailErr;
            }else if (newEmail.trim() === props.currentEmail) {
                newErrors.newEmail = "New Email Address and Current Email Address is same";
            }
        }

        if (!currentPassword) {
            newErrors.currentPassword = 'Current Password is required';
        }
        //  else {
        //     const passwordRegex = new RegExp(regex.password);
        //     if (!passwordRegex.test(currentPassword.trim())) {
        //         newErrors.currentPassword = Constants.errorStrings.passwordError;
        //     }
        // }

        setErrors(newErrors);
        return !Object.keys(newErrors)?.length;
    }

    const changeEmailHandler = async () => {
        console.log(newEmail,"newEmail",newEmail.trim(),props.currentEmail,"props.currentEmail","qazx",props.currentEmail.trim(),"trim")
        if (validateChangeEmailForm()) {
            const data = {
                currentEmail: props.currentEmail,
                newEmail: newEmail.trim(),
                password: currentPassword.trim(),
                user_type: storageService.getItem('userType'),
            }
            const res = await tradieChangeEmail(data);
            if (res?.success) {
                props.updateSteps(2, {newEmail: newEmail.trim(), currentPassword: currentPassword.trim()});
            }
        }
    }
    console.log(errors, "errors new Email Modal");

    return (
        <>
            <div className="heading form_field">
                <div className="relate">
                    <button className="back" onClick={props.backButtonHandler}></button>
                    <div className="md_heading">
                        <span className="sub_title">Change email</span>
                        <span className="show_label">Enter your password too and we will send you message to verify your new email</span>
                    </div>
                </div>
                <button className="close_btn" onClick={props.closeModalHandler}>
                    <img src={cancel} alt="cancel" />
                </button>
            </div>
            <div className="inner_wrap">
                <div className="inner_wrappr">
                    <div className="form_field">
                        <label className="form_label">New Email</label>
                        <div className="text_field">
                            <input type="text" placeholder="Enter New Email" value={newEmail} name='newEmail' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEmail(e.target.value)} />
                        </div>
                        {!!errors?.newEmail && <span className="error_msg">{errors?.newEmail}</span>}
                    </div>
                    <div className="form_field">
                        <label className="form_label">Current Password</label>
                        <div className="text_field">
                            <input type={showPassword ? 'text' : 'password'} className="detect_input" placeholder="Enter Current Password" name='password' value={currentPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)} />
                            <span className="detect_icon" onClick={() => setShowPassword(!showPassword)}>
                                <img src={showPassword ? eyeIconOpen : eyeIconClose} />
                            </span>
                        </div>
                        {!!errors?.currentPassword && <span className="error_msg">{errors?.currentPassword}</span>}
                    </div>
                </div>
            </div>
            <div className="bottom_btn custom_btn">
                <button className={`fill_btn full_btn btn-effect ${(newEmail && currentPassword) ? '' : 'disable_btn'}`} onClick={changeEmailHandler}>Next</button>
            </div>
        </>
    )
}

export default NewEmail;
