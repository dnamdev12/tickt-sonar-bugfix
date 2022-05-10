import { useState, useEffect } from "react";
import { callLogin } from "../../redux/auth/actions";
import eyeIconClose from "../../assets/images/icon-eye-closed.png";
import eyeIconOpen from "../../assets/images/icon-eye-open.png";
import AuthParent from "../../common/auth/authParent";
import Constants, { MoEConstants } from "../../utils/constants";
import regex from "../../utils/regex";
import SocialAuth from "../../common/auth/socialAuth";
import { loginAnonymously } from "../../services/firebase";
import { moengage, mixPanel } from "../../services/analyticsTools";

interface Propstype {
  history: any;
  showModal?: boolean;
  modalUpdateSteps: (data: any) => void;
  setShowModal: (data: any) => void;
  setSocialData: (data: any) => void;
  modalLoginBackBtn?: string;
}

const LoginPage = (props: Propstype) => {
  const [errors, setErrors] = useState<any>({});
  const [loginData, setLoginData] = useState<any>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  let window_: any = window;
  window_.Intercom("shutdown");

  const backButtonHandler = () => {
    props?.history?.push("/signup");
  };

  useEffect(() => {
    if (window_?.Intercom) {
      window_.Intercom("shutdown");
      window_.Intercom("hide");
      localStorage.clear();
    }
  }, []);

  const changeHandler = (e: any) => {
    setLoginData((prevData: any) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!loginData.email) {
      newErrors.email = Constants.errorStrings.emailEmpty;
    } else {
      const emailRegex = new RegExp(regex.email);
      if (!emailRegex.test(loginData.email)) {
        newErrors.email = Constants.errorStrings.emailErr;
      }
    }

    if (!loginData.password) {
      newErrors.password = Constants.errorStrings.password;
    }

    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  const onNewAccount = (profileData: any, socialType: string) => {
    console.log("profileData: ", profileData);
    const newProfileData = {
      firstName: profileData.name,
      authType: "signup",
      email: profileData.email,
      accountType: socialType,
      user_image: profileData?.imageUrl,
      ...(socialType === "google" && { socialId: profileData.googleId }),
      ...(socialType === "linkedIn" && { socialId: profileData.socialId }),
    };
    if (props.showModal) {
      props.modalUpdateSteps(2);
      props.setSocialData(newProfileData);
      return;
    }
    props.history.push({
      pathname: "/signup",
      redirect: "socialRedirectFromLogin",
      state: { profileData: newProfileData },
    });
  };

  const forgetPasswordClicked = (e: any) => {
    e.preventDefault();
    if (props.showModal) {
      props.modalUpdateSteps(1);
      return;
    }
    props.history.push("/reset-password");
  };

  const phoneViewHandler = (e: any) => {
    e.preventDefault();
    if (props.showModal) {
      props.modalUpdateSteps(2);
      return;
    }
    props.history.push("/signup");
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    let newData = { email: loginData.email, password: loginData.password };
    if (validateForm()) {
      const res: any = await callLogin(newData);
      if (res.success) {
        loginAnonymously();
        if (props.showModal) {
          props.setShowModal(!props.showModal);
        }
        moengage.moE_LoginEvent({
          email: res.data?.email,
          userName: res.data?.userName,
          userId: res.data?._id,
        });
        moengage.moE_SendEvent(MoEConstants.APP_OPEN, { app_open: true });
        mixPanel.mixP_SendEvent(MoEConstants.APP_OPEN, { app_open: true });
        props?.history?.push("/");
      }
    }
  };

  return (
    <AuthParent
      sliderType="signup"
      backButtonHandler={backButtonHandler}
      header={{ title: "Log In" }}
      history={props.history}
      showModal={props.showModal}
      modalUpdateSteps={props.modalUpdateSteps}
      setSocialData={props.setSocialData}
      modalLoginBackBtn={props.modalLoginBackBtn}
    >
      <div className="form_wrapper">
        <form onSubmit={onSubmit}>
          <div className="form_field">
            <label className="form_label">Email</label>
            <div className="text_field">
              <input
                type="text"
                placeholder="Enter Email"
                name="email"
                onChange={changeHandler}
              />
            </div>
            {!!errors.email && (
              <span className="error_msg">{errors.email}</span>
            )}
          </div>
          <div className="form_field">
            <label className="form_label">Password</label>
            <div className="text_field">
              <input
                type={showPassword ? "text" : "password"}
                className="detect_input"
                placeholder="Enter Password"
                name="password"
                onChange={changeHandler}
              />
              <span
                className="detect_icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img src={showPassword ? eyeIconOpen : eyeIconClose} />
              </span>
            </div>
            {!!errors.password && (
              <span className="error_msg">{errors.password}</span>
            )}
          </div>
          <div className="form_field">
            <a className="link" onClick={forgetPasswordClicked}>
              Forgotten your password?
            </a>
          </div>
          <div className="form_field">
            <button className="fill_btn btn-effect">Log in</button>
          </div>
        </form>
        <span className="show_label text-center">or continue with</span>
        <SocialAuth
          onNewAccount={onNewAccount}
          history={props.history}
          showModal={props.showModal}
          setShowModal={props.setShowModal}
          modalUpdateSteps={props.modalUpdateSteps}
        />
        <div className="form_field hide text-center">
          <span className="reg">
            No account?{" "}
            <a className="link" onClick={phoneViewHandler}>
              Signup
            </a>
          </span>
        </div>
      </div>
    </AuthParent>
  );
};

export default LoginPage;
