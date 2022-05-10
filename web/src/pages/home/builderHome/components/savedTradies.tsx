import React, { Component } from "react";
import dummy from "../../../../assets/images/u_placeholder.jpg";

export default class SavedTradies extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      isItemSpec: {},
    };
  }

  toggleMoreSpec = (index: any) => {
    let this_state: any = this.state;
    let isItemSpec = this_state.isItemSpec;
    if (isItemSpec[index] === undefined) {
      isItemSpec[index] = true;
    } else {
      isItemSpec[index] = !isItemSpec[index];
    }
    this.setState({ isItemSpec });
  };

  render() {
    let data: any = [];
    let props: any = this.props;
    if (props?.data?.length) {
      data = props.data;
    }

    let this_state: any = this.state;
    let isItemSpec = this_state.isItemSpec;
    console.log({ data });
    return (
      <div className="section_wrapper bg_gray">
        <div className="custom_container">
          <span className="title">Saved tradespeople</span>
          <div className="flex_row tradies_row">
            {data?.length
              ? data.map((item: any, index: number) => (
                  <div className="flex_col_sm_4">
                    <div
                      className="tradie_card"
                      data-aos="fade-in"
                      data-aos-delay="250"
                      data-aos-duration="1000"
                    >
                      <a
                        href="javascript:void(0)"
                        className="more_detail circle"
                      ></a>
                      <div className="user_wrap">
                        <figure className="u_img">
                          <img
                            src={item?.tradieImage}
                            onError={(e) => {
                              let event: any = e;
                              event.target.src = dummy;
                            }}
                            alt="traide-img"
                          />
                        </figure>
                        <div className="details">
                          <span className="name">{item?.tradieName}</span>
                          <span className="rating">
                            {item?.ratings || "0"} | {item?.reviews} reviews{" "}
                          </span>
                        </div>
                      </div>
                      <div className="tags_wrap">
                        <ul>
                          {item?.tradeData?.length
                            ? item?.tradeData?.map((item_trade: any) => (
                                <li className="main">
                                  {item_trade?.tradeName}
                                </li>
                              ))
                            : null}
                        </ul>
                      </div>
                      {item?.specializationData?.length ? (
                        <div className="tags_wrap">
                          <ul>
                            {isItemSpec[index]
                              ? item?.specializationData?.map(
                                  (item_spec: any) => (
                                    <li>{item_spec?.specializationName}</li>
                                  )
                                )
                              : item?.specializationData
                                  ?.slice(0, 4)
                                  ?.map((item_spec: any) => (
                                    <li>{item_spec?.specializationName}</li>
                                  ))}
                            {item?.specializationData?.length > 4 &&
                            !isItemSpec[index] ? (
                              <li
                                onClick={() => {
                                  this.toggleMoreSpec(index);
                                }}
                              >
                                {"More"}
                              </li>
                            ) : null}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))
              : null}
          </div>
          <button className="fill_grey_btn full_btn m-tb40 view_more">
            View all
          </button>
        </div>
      </div>
    );
  }
}
