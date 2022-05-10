import colorLogo from "../../assets/images/ic-logo-yellow.png";
import AuthSlider from "./authSlider";

interface Props {
  backButtonHandler?: () => void;
  steps?: number;
  header: any;
  children: any;
  sliderType?: string;
  hideProgres?: boolean;
  userType?: number;
  showModal?: boolean;
  history?: any;
  setShowModal: (data: any) => void;
  modalUpdateSteps: (data: any) => void;
  setSocialData: (data: any) => void;
  modalLoginBackBtn?: string;
  socialId?: string;
}

const builderEnableSteps = [
  {
    2: false,
  },
];
const AuthParent = (props: any) => {
  const handleSteps = ({ step, index, type }: any) => {
    console.log({ step, index, type });
    if (type == 2 && props.socialId) {
      if (index == 0) {
        return step > 3 ? "active" : "";
      }
      if (index == 1) {
        return step > 4 ? "active" : "";
      }
      if (index == 2) {
        return step > 5 ? "active" : "";
      }
      if (index == 3) {
        return step > 8 ? "active" : "";
      }
      if (index == 4) {
        return step > 9 ? "active" : "";
      }
    } else if (type == 2) {
      if (index == 0) {
        return step === 3 || step > 3 ? "active" : "";
      }
      if (index == 1) {
        return step === 4 || step > 4 ? "active" : "";
      }
      if (index == 2) {
        return step === 5 || step > 5 ? "active" : "";
      }
      if (index == 3) {
        return step === 8 || step > 8 ? "active" : "";
      }
      if (index == 4) {
        return step === 9 || step > 9 ? "active" : "";
      }
    } else if (type == 1 && props.socialId) {
      if (index == 0) {
        return step > 3 ? "active" : "";
      }
      if (index == 1) {
        return step > 4 ? "active" : "";
      }
      if (index == 2) {
        return step > 5 ? "active" : "";
      }
      if (index == 3) {
        return step > 6 ? "active" : "";
      }
      if (index == 4) {
        return step > 7 ? "active" : "";
      }
      if (index == 5) {
        return step > 8 ? "active" : "";
      }
      if (index == 6) {
        return step > 9 ? "active" : "";
      }
    } else if (type == 1) {
      if (index == 0) {
        return step === 3 || step > 3 ? "active" : "";
      }
      if (index == 1) {
        return step === 4 || step > 4 ? "active" : "";
      }
      if (index == 2) {
        return step === 5 || step > 5 ? "active" : "";
      }
      if (index == 3) {
        return step === 6 || step > 6 ? "active" : "";
      }
      if (index == 4) {
        return step === 7 || step > 7 ? "active" : "";
      }
      if (index == 5) {
        return step === 8 || step > 8 ? "active" : "";
      }
      if (index == 6) {
        return step === 9 || step > 9 ? "active" : "";
      }
    }
    return "";
  };

  const tradieStepsLength = props?.socialId ? 7 : 8;
  const builderStepsLength = props?.socialId ? 4 : 5;
  let step_ = props.steps;
  let type = props.userType;
  return (
    <div className="onboard_wrapper">
      <div className="f_row h-100">
        <div className={props.steps === 0 ? "left_col" : "left_col_hide"}>
          <AuthSlider
            type={props.sliderType}
            history={props.history}
            showModal={props.showModal}
            setShowModal={props.setShowModal}
            modalUpdateSteps={props.modalUpdateSteps}
            setSocialData={props.setSocialData}
          />
        </div>
        <div className="right_col">
          <figure
            className={props.steps === 0 ? "mob_logo" : "mob_logo left_logo"}
          >
            <img src={colorLogo} alt="Tickt-logo" />
          </figure>
          <div className="onboarding_head">
            {props.steps !== 0 ? (
              <div className="text-left">
                {(!!props.steps || props.sliderType === "signup") &&
                  !props.modalLoginBackBtn && (
                    <button
                      className="back_btn"
                      onClick={props.backButtonHandler}
                    />
                  )}
                <h1>
                  {props.userType === 1 && props.header.tradieTitle
                    ? props.header.tradieTitle
                    : props.header.title}
                </h1>
                {props.header.subTitle && (
                  <span className="show_label">{props.header.subTitle}</span>
                )}
              </div>
            ) : (
              <div className="initial_head"></div>
            )}

            {!!props.steps && props.steps > 1 && !props.hideProgres && (
              <ul className="custom_steppr">
                {/* <div style={{fontSize:30, color:'#fff'}}>
                                    {props.userType === 1 ? 'true' : 'false'}
                                    {` -- ${step_}`}
                                </div> */}
                {/* <span style={{color:'#fff', marginRight:'20px'}}>{step_}</span> */}
                {Array.from(
                  Array(
                    type === 1 ? tradieStepsLength : builderStepsLength
                  ).keys()
                ).map((i) => {
                  return (
                    <li
                      key={i}
                      className={handleSteps({ step: step_, index: i, type })}
                      // className={props.steps !== undefined && i + 1 < props.steps ? 'active' : ''}
                    />
                  );
                })}
              </ul>
            )}
          </div>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default AuthParent;
