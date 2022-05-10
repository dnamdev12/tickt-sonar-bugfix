import React, { useState, useEffect } from "react";
import { setLoading } from "../../../../../../redux/common/actions";
import storageService from "../../../../../../utils/storageService";

import colorLogo from "../../../../../../assets/images/ic-logo-yellow.png";
import templateImage from "../../../../../../assets/images/thanks-bg.jpg";

interface Propstype {
  history: any;
}

const SuccessPage = (props: Propstype) => {
  const [isLoad, setImageLoad] = useState(true);

  useEffect(() => {
    if (!isLoad) {
      setLoading(false);
    }
  }, [isLoad]);

  useEffect(() => {
    setLoading(true);
    storageService.clearAll();
  }, []);

  const goToLogin = () => {
    props.history?.push("/login");
  };

  return (
    <div className="img_text_wrap">
      <figure className="full_image">
        <img
          src={templateImage}
          alt="template"
          onLoad={() => {
            setImageLoad(false);
          }}
        />

        <div className="short_info">
          <figure className="logo_img">
            <img src={colorLogo} alt="Tickt-logo" />
          </figure>
          <div className="content">
            <h1 className="title">Thanks!</h1>
            <span className="show_label msg">
              You have updated email for your account.
            </span>
            <button
              className="fill_btn full_btn btn-effect"
              onClick={goToLogin}
            >
              Login
            </button>
          </div>
        </div>
      </figure>
    </div>
  );
};

export default SuccessPage;
