import dummy from "../../../../assets/images/u_placeholder.jpg";

const PopularBuilders = (props: any) => {
  console.log("props: ", props);

  const viewAllBuilders = () => {
    props.history.push({
      pathname: "popular-builders",
      state: { coordinates: props.coordinates },
    });
  };

  const popularBuildersData =
    props.jobDataWithJobTypeLatLong?.popular_builders?.slice(0, 6);

  return (
    <>
      {popularBuildersData?.length > 0 && (
        <div className="section_wrapper">
          <div className="custom_container">
            <span className="title">Popular builders</span>
            <ul className="popular_tradies">
              {popularBuildersData?.length ? (
                popularBuildersData?.map((item: any) => {
                  return (
                    <li
                      key={item?._id}
                      data-aos="flip-right"
                      data-aos-delay="200"
                      data-aos-duration="1000"
                      onClick={() =>
                        props.history?.push(
                          `/builder-info?builderId=${item?._id}`
                        )
                      }
                    >
                      <figure className="tradies_img">
                        <img
                          src={item?.user_image ? item.user_image : dummy}
                          alt="tradies-img"
                          onError={(e: any) => {
                            let e_: any = e;
                            e_.target.src = dummy;
                          }}
                        />
                      </figure>
                      <span className="name">{item?.firstName}</span>
                      <span className="post">{item?.company_name}</span>
                    </li>
                  );
                })
              ) : (
                <span>No Data Found</span>
              )}
            </ul>
            <button
              className="fill_grey_btn full_btn m-tb40 view_more"
              onClick={viewAllBuilders}
            >
              View all
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PopularBuilders;
