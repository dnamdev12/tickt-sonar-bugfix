import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import bannerimage1 from "../../assets/images/onboarding-banner-1.jpg";
import bannerimage2 from "../../assets/images/onboarding-banner-2.jpg";
import bannerimage3 from "../../assets/images/onboarding-banner-3.jpg";

import bannerimage11 from "../../assets/images/modal-slider-bg-1.png";
import bannerimage22 from "../../assets/images/modal-slider-bg-2.png";
import bannerimage33 from "../../assets/images/modal-slider-bg-3.png";

interface Props {
  type: string;
  history: any;
  showModal: boolean | undefined;
  modalUpdateSteps: (data: any) => void;
  setShowModal: (data: any) => void;
  setSocialData: (data: any) => void;
}

const DATA: any = {
  login: {
    title: "Have an account? ",
    button: "Log In",
    nav: "login",
  },
  signup: {
    title: "Don’t have an account?",
    button: "Sign up",
    nav: "signup",
  },
};

const AuthSlider = (props: Props) => {
  const SLIDER_DATA = [
    {
      image: props.showModal ? bannerimage11 : bannerimage1,
      imageText: "Find quality work and grow your reputation",
    },
    {
      image: props.showModal ? bannerimage22 : bannerimage2,
      imageText: "Choose work that suits your location, price, schedule",
    },
    {
      image: props.showModal ? bannerimage33 : bannerimage3,
      imageText: "Make yourself on what you do best",
    },
  ];

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };
  const data = DATA[props.type];


  return (
    <Carousel
      responsive={responsive}
      autoPlay={true}
      showDots={true}
      arrows={false}
      infinite={true}
    >
      {SLIDER_DATA.map((item: any, i: number) => {
        return (
          <div key={i}>
            <figure className="banner_img">
              <img src={item.image} alt="banner-img" />
              <div className="slider_txt">
                <span>{item.imageText}</span>
              </div>
              {/* <div className="bottom_txt">
                                <span className="reg">{data.title}
                                    <a className="link" onClick={onLoginSignupClicked}>{` ${data.button}`}</a>
                                </span>
                            </div> */}
            </figure>
          </div>
        );
      })}
    </Carousel>
  );
};

export default AuthSlider;
