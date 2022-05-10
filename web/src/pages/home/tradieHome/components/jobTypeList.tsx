import { useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const categoriesjob = {
  desktop: {
    breakpoint: { max: 3000, min: 1200 },
    items: 5,
    slidesToSlide: 5, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 650, min: 0 },
    items: 2,
  },
};

const JobTypeList = (props: any) => {
  useEffect(() => {
    props.getJobTypeList();
  }, []);

  const jobTypeListClicked = (id: string, jobTypeHeadingName: string) => {
    props.history.push(
      `/search-job-results?jobResults=jobTypeList&heading=${jobTypeHeadingName}&jobTypes=${id}&defaultLat=${props.currentCoordinates?.coordinates[1]}&defaultLong=${props.currentCoordinates?.coordinates[0]}`
    );
  };

  return (
    <div className="home_job_categories">
      <div className="custom_container">
        <Carousel
          className="item_slider"
          responsive={categoriesjob}
          infinite={true}
          autoPlay={props.jobTypeListData?.length > 5 ? true : false}
          arrows={false}
          showDots={props.jobTypeListData?.length > 5 ? true : false}
        >
          {props.jobTypeListData?.map((item: any) => {
            return (
              <ul className="job_categories">
                <li
                  title={item.name}
                  key={item._id}
                  onClick={() => jobTypeListClicked(item._id, item.name)}
                >
                  <figure className="type_icon">
                    <img src={item.image} alt="" />
                  </figure>
                  <span className="name line-1">{item.name}</span>
                </li>
              </ul>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
};

export default JobTypeList;
