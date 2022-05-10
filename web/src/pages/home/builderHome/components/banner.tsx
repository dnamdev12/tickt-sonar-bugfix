import React, { useEffect, useState } from "react";
import ticktHomeImg from "../../../../assets/images/tickt_home_screen.png";
import BannerSearch from "../../../shared/bannerSearch";

const Banner = (props: any) => {
  const [positions, setPositions] = useState<any>([]);

  const preFetch = (isTrue?: boolean) => {
    let position: any = props.position;
    let positions_: any = [];
    if (position?.long && !positions?.length) {
      let long: any = parseFloat(position?.long);
      let lat: any = parseFloat(position?.lat);
      positions_ = [long, lat];
      setPositions(positions_);
    }
    if (isTrue && positions_?.length) {
      redirectToUrl(positions_);
    }
  };

  const redirectToUrl = (position: any) => {
    props.history.push({
      pathname: `search-tradie-results`,
      state: {
        name: null,
        tradeId: null,
        specializations: null,
        location: Object.keys(position).length
          ? { coordinates: position }
          : null,
        calender: null,
        address: null,
      },
    });
  };

  useEffect(() => {
    preFetch();
  }, []);

  return (
    <div className="home_banner">
      <figure className="banner_img_img">
        <img src={ticktHomeImg} alt="bannerimg" />
        <div className="banner_container">
          <BannerSearch {...props} />
          <div className="text-center">
            <h1 className="heading">Need a tradie?</h1>
            <p className="commn_para">Find the right person for the job now.</p>
            <button
              className="fill_btn view-btn"
              onClick={() => props.history.push("/post-new-job")}
            >
              Post a job!
            </button>
          </div>
        </div>
      </figure>
    </div>
  );
};

export default Banner;
