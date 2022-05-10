import templateImage from "../../../assets/images/cancel-job-bg.png";

const IDSuccess = (props: any) => {
  return (
    <div className="img_text_wrap">
      <figure className="full_image">
        <img src={templateImage} alt="template-item" loading="eager" />
        <div className="short_info">
          <div className="content">
            <h1 className="title">{"Thanks!"}</h1>
            <span className="id_verification_label">
              {`If we need anything we will reach out`}
            </span>
            <div className="btn_wrapr">
              <button
                onClick={() => {
                  props.history.push("/");
                }}
                className="fill_btn btn-effect"
              >
                {"OK"}
              </button>
            </div>
          </div>
        </div>
      </figure>
    </div>
  );
};

export default IDSuccess;
