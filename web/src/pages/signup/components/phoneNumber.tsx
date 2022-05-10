import React, { useState } from 'react';
import { checkMobileNumber } from '../../../redux/auth/actions';
import Constants from '../../../utils/constants';
import regex from '../../../utils/regex';
import { setShowToast } from '../../../redux/common/actions';
import NumberFormat from "react-number-format";
interface Propstype {
    updateSteps: (num: number, data: any) => void
    step: number
    history?: any
    mobileNumber: any,
}

const PhoneNumber = (props: Propstype) => {
    const [errors, setErrors] = useState<any>({});
    const [mobileNumb, setMobileNumb] = useState<any>(props.mobileNumber)

    const validateForm = () => {
        const newErrors: any = {};
        if (!mobileNumb) {
            newErrors.mobileNumber = Constants.errorStrings.phoneNumberEmpty;
        } else {
            const phoneRegex = new RegExp(regex.mobile);
            if (!phoneRegex.test(mobileNumb.replaceAll(' ', ''))) {
                newErrors.mobileNumber = Constants.errorStrings.phoneNumberErr
            }
        }
        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (validateForm()) {
            const res: any = await checkMobileNumber(mobileNumb.replaceAll(' ', ''))
            res?.isProfileCompleted && setShowToast(true, res.message);
            if (!res.isProfileCompleted && res.success) {
                const mobileNumber = mobileNumb.replaceAll(' ', '');
                props.updateSteps(props.step + 1, { mobileNumber })
            }
        }
    }

    return (
        <div className="form_wrapper">
            <form onSubmit={onSubmit}>
                <div className="form_field">
                    <label className="form_label">Phone Number</label>
                    <div className="text_field">
                        <NumberFormat
                            type="text"
                            className="detect_input_ltr"
                            placeholder="400 123 456"
                            value={mobileNumb}
                            onValueChange={({ value }) => {
                                setMobileNumb(value);
                            }}
                            format="### ### ###"
                        />
                        <span className="detect_icon_ltr">+61</span>
                    </div>
                    {!!errors.mobileNumber && <span className="error_msg">{errors.mobileNumber}</span>}
                </div>

                <div className="form_field">
                    <button className="fill_btn btn-effect">Next</button>
                </div>
            </form>

        </div>
    )
}

export default PhoneNumber

