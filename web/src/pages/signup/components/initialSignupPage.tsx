import React, { useEffect } from "react";
import storageService from "../../../utils/storageService";


interface Propstype {
  updateSteps: (num: number, data: any) => void;
  step: number;
  history: any;
  showModal: boolean;
  modalUpdateSteps: (data: any) => void;
  callTradeList: () => void;
}

const InitialSignupPage = (props: Propstype) => {
  let window_: any = window;



  useEffect(() => {
    if (window_?.Intercom) {
      window_?.Intercom("update", {
        hide_default_launcher: true,
      });
    }
  }, [window_]);

  const nextPageHandler = (userType: string) => {
    var user_type = 1;
    if (userType === "builder") {
      user_type = 2;
    }
    props.updateSteps(props.step + 1, { user_type });
    if (user_type === 1) {
      props.callTradeList();
    }
  };



  const phoneViewHandler = (e: any) => {
    e.preventDefault();
    if (props.showModal) {
      props.modalUpdateSteps(0);
      return;
    }
    props.history.push("/login");
  };

  return (
    <div className="form_wrapper">
      <div className="form_field">
        <button
          className="fill_btn btn-effect"
          onClick={() => nextPageHandler("builder")}
        >
          I’m a builder
        </button>
      </div>
      <div className="form_field">
        <button
          className="fill_grey_btn btn-effect"
          onClick={() => nextPageHandler("tradie")}
        >
          I’m a tradesperson
        </button>
      </div>
      <div className="form_field text-center">
        <span className="reg">
          Have an account?{" "}
          <a className="link" onClick={phoneViewHandler}>
            Login
          </a>
        </span>
      </div>
    </div>
  );
};

export default InitialSignupPage;
