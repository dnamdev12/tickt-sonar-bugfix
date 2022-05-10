import { useState } from 'react';
import eyeIconClose from '../../../assets/images/icon-eye-closed.png';
import eyeIconOpen from '../../../assets/images/icon-eye-open.png';
import Constants from '../../../utils/constants';
import regex from '../../../utils/regex'


interface Propstype {
    onResetPassword: (data: any) => void
}

const CreatePassword = (props: Propstype) => {
    const [errors, setErrors] = useState<any>({});
    const [password, setPassword] = useState<any>('')
    const [showPassword, setShowPassword] = useState(false)

    const changeHandler = (e: any) => {
        setPassword(e.target.value)
    }

    const validateForm = () => {
        const newErrors: any = {};
        if (!password) {
            newErrors.password = Constants.errorStrings.password;
        } else {
            const passwordRegex = new RegExp(regex.password);
            if (!passwordRegex.test(password.trim())) {
                newErrors.password = Constants.errorStrings.passwordError;
            }
        }
        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (validateForm()) {
            props.onResetPassword({ password })
        }
    }

    return (
        <div className="form_wrapper">
            <form onSubmit={onSubmit}>
                <div className="form_field">
                    <label className="form_label">Password</label>
                    <div className="text_field">
                        <input type={showPassword ? 'text' : 'password'} className="detect_input" value={password} placeholder="Enter Password" onChange={changeHandler} />
                        <span className="detect_icon" onClick={() => setShowPassword(!showPassword)}><img src={showPassword ? eyeIconOpen : eyeIconClose} /></span>
                    </div>
                    {!!errors.password && <span className="error_msg">{errors.password}</span>}
                </div>
                <div className="form_field">
                    <span className="show_label">Please ensure your password is at least 8 characters long and contains a special character &amp; an uppercase letter or number.</span>
                </div>
                <div className="form_field">
                    <button className="fill_btn btn-effect">Next</button>
                </div>
            </form>
            <div className="form_field hide text-center">
                <span className="reg">No account? <a className="link">Signup</a></span>
            </div>
        </div>
    )
}

export default CreatePassword
