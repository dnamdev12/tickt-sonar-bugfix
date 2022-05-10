import BannerSearch from "../../../../common/tradieBannerSearch/index";
import ticktHomeImg from "../../../../assets/images/tickt_home_screen.png";

interface PropsType {
  history: any;
  currentCoordinates: any;
  setTradieHomeData: (data: any) => void;
  getViewNearByJob: (data: any) => void;
}

const HomeBanner = (props: PropsType) => {
  const viewMoreClicked = () => {
    props.history.push(
      `/search-job-results?jobResults=viewNearByJob&defaultLat=${props.currentCoordinates?.coordinates[1]}&defaultLong=${props.currentCoordinates?.coordinates[0]}`
    );
  };

  return (
    <div className="home_banner">
      <figure className="banner_img_img">
        <img src={ticktHomeImg} alt="bannerimg" />
        <div className="banner_container">
          <BannerSearch {...props} />
          <div className="text-center">
            <h1 className="heading">See jobs around me</h1>
            <p className="commn_para">Find jobs in your local area</p>
            <button className="fill_btn view-btn" onClick={viewMoreClicked}>
              View Nearby
            </button>
          </div>
        </div>
      </figure>
    </div>
  );
};

export default HomeBanner;
