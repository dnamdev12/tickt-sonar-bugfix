import { useState } from 'react';
import Constants from '../../../utils/constants';
import regex from '../../../utils/regex';
import { validateABN } from '../../../utils/common';
import NumberFormat from "react-number-format";

interface Propstype {
    onSubmitSignup: (data: any) => void,
}

const AddABN = (props: Propstype) => {
    const [errors, setErrors] = useState<any>({});
    const [ABN, setAbn] = useState<any>('');
    const [businessName, setBusinessName] = useState<any>('');

    const validateForm = () => {
        const newErrors: any = {};
        if (!businessName) {
            newErrors.businessName = Constants.errorStrings.businessNameEmpty;
        }
        // else {
        //     const nameRegex = new RegExp(regex.fullname);
        //     if (!nameRegex.test(businessName.trim())) {
        //         newErrors.businessName = Constants.errorStrings.businessNameErr;
        //     }
        // }

        if (!ABN) {
            newErrors.abn = Constants.errorStrings.abnEmpty;
        } else {
            const abnRegex = new RegExp(regex.abn);
            if (!abnRegex.test(ABN.replaceAll(' ', ''))) {
                newErrors.abn = Constants.errorStrings.abnErr
            }
            if (!validateABN(ABN.replaceAll(' ', ''))) {
                newErrors.abn = Constants.errorStrings.abnErr
            }
        }
        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }

    const onSubmit = (e: any) => {
        e.preventDefault();
        if (validateForm()) {
            const abn = ABN.replaceAll(' ', '');
            props.onSubmitSignup({ abn, businessName: businessName })
        }
    }

    return (
        <div className="form_wrapper">
            <form onSubmit={onSubmit}>
                <div className="form_field">
                    <label className="form_label">Business Name</label>
                    <div className="text_field">
                        <input type="text" placeholder="Enter Business Name" value={businessName} name="businessName" onChange={({ target: { value } }: { target: { value: string } }) => setBusinessName(value.trimLeft())} maxLength={50} />
                    </div>
                    {!!errors.businessName && <span className="error_msg">{errors.businessName}</span>}
                </div>
                <div className="form_field">
                    <label className="form_label">Australian Business Number</label>
                    <div className="text_field">
                        <NumberFormat
                            type="text"
                            placeholder="51 824 753 556"
                            value={ABN}
                            onValueChange={({ value }) => {
                                setAbn(value);
                            }}
                            format="## ### ### ###"
                        />
                    </div>
                    {!!errors.abn && <span className="error_msg">{errors.abn}</span>}
                </div>

                <div className="form_field">
                    <button className="fill_btn btn-effect">Create account</button>
                </div>
            </form >
        </div >
    )
}

export default AddABN;
