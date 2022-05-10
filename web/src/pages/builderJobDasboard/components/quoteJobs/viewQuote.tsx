import React, { Component } from "react";
import dummy from "../../../../assets/images/u_placeholder.jpg";
import noDataFound from "../../../../assets/images/no-search-data.png";
import jobTypePlaceholder from "../../../../assets/images/job-type-placeholder.png";
import { renderTime } from "../../../../utils/common";
import NumberFormat from "react-number-format";
import { moengage, mixPanel } from "../../../../services/analyticsTools";
import { MoEConstants } from "../../../../utils/constants";

import {
  getAcceptDeclineTradie,
  quoteByJobId,
} from "../../../../redux/quotes/actions";
import { setShowToast } from "../../../../redux/common/actions";

type State = {
  toggle: boolean;
  dataItems: any;
};

type Props = {
  // quotes_param: any,
  history: any;
  setJobLabel: any;
  // quotesData: any
};

class ViewQuote extends Component<Props, State> {
  state: State = {
    toggle: false,
    dataItems: [],
  };

  handleSubmit = async (item: any, status: number) => {
    const { jobId, userId } = item;
    let data = {
      jobId: jobId,
      tradieId: userId,
      status: status,
    };
    let response = await getAcceptDeclineTradie(data);
    if (response.success) {
      if (status == 1) {
        this.props.history.push("/quote-job-accepted");
        moengage.moE_SendEvent(MoEConstants.ACCEPT_QUOTE, {
          timeStamp: moengage.getCurrentTimeStamp(),
        });
        mixPanel.mixP_SendEvent(MoEConstants.ACCEPT_QUOTE, {
          timeStamp: moengage.getCurrentTimeStamp(),
        });
      }

      if (status == 2) {
        this.props.setJobLabel("open");
        this.props.history.push("/jobs?active=open");
        setShowToast(true, response.msg);
      }
    }
  };

  componentDidMount() {
    this.preFetchForQuotes();
    moengage.moE_SendEvent(MoEConstants.VIEW_QUOTE, {
      timeStamp: moengage.getCurrentTimeStamp(),
    });
    mixPanel.mixP_SendEvent(MoEConstants.VIEW_QUOTE, {
      timeStamp: moengage.getCurrentTimeStamp(),
    });
  }

  preFetchForQuotes = () => {
    const props: any = this.props;
    const params = new URLSearchParams(props?.history?.location?.search);
    const jobId: any = params.get("jobId");
    const tradieId: any = params.get("tradieId");
    if (jobId?.length && !tradieId) {
      this.fetchQuotesById({ jobId: jobId, sortBy: 1 });
    } else {
      if (tradieId?.length) {
        console.log({ tradieId });
        this.fetchQuotesById({ jobId: jobId, sortBy: 1, tradieId: tradieId });
      }
    }
  };

  fetchQuotesById = async ({
    jobId,
    sortBy,
    tradieId,
  }: {
    jobId: string;
    sortBy: number;
    tradieId?: string;
  }) => {
    let result = null;
    console.log({ tradieId }, "tradieId");
    if (tradieId) {
      result = await quoteByJobId({ jobId, tradieId });
    } else {
      result = await quoteByJobId({ jobId, sortBy });
    }

    if (result?.success) {
      let data = result?.data?.resultData;
      if (data) {
        this.setState({ dataItems: data });
      }
    }
  };

  render() {
    let { dataItems } = this.state;
    const props: any = this.props;
    const quotesData = dataItems || [];
    const params = new URLSearchParams(props?.history?.location?.search);
    const id = params.get("id");
    const jobId = params.get("jobId");
    const tradieId = params.get("tradieId");
    const activeType: any = params.get("active");

    let item: any = {};
    if (tradieId?.length && Array.isArray(quotesData) && quotesData?.length) {
      item = quotesData[0];
    } else {
      if (quotesData && Array.isArray(quotesData) && quotesData?.length) {
        item = quotesData.find((item: any) => item._id === id);
      }
    }
    console.log({ dataItems }, "dataItems");
    let CASE_1 = ["open", "applicant"].includes(activeType);
    return (
      <React.Fragment>
        <div className="flex_row">
          <div className="flex_col_sm_5">
            <div className="relate" style={{ marginBottom: "50px" }}>
              <button
                onClick={() => {
                  if (CASE_1) {
                    this.props.setJobLabel("listQuote");
                    props.history.replace(
                      `/jobs?active=${activeType}&quote=true&jobId=${jobId}`
                    );
                  }

                  if (activeType == "active") {
                    this.props.setJobLabel("active");
                    this.props.history.goBack();
                  }
                }}
                className="back"
              ></button>
              <span style={{ fontSize: "24px" }} className="title">
                Quote
              </span>
            </div>
          </div>
        </div>

        {props.isLoading ? null : quotesData.length === 0 ||
          !props.isLoading ? (
          <>
            <div className="flex_row tradies_row">
              <div className="flex_col_sm_6">
                <div
                  style={{ minHeight: "180px" }}
                  className="tradie_card aos-init aos-animate"
                  data-aos="fade-in"
                  data-aos-delay="250"
                  data-aos-duration="1000"
                >
                  <div className="user_wrap">
                    <figure className="u_img">
                      <img
                        src={item?.selected_url || jobTypePlaceholder}
                        alt="traide-img"
                        onError={(e: any) => {
                          if (e?.target?.onerror) {
                            e.target.onerror = null;
                          }
                          if (e?.target?.src) {
                            e.target.src = jobTypePlaceholder;
                          }
                        }}
                      />
                    </figure>
                    <div className="details">
                      <span className="name">{item?.trade_name} </span>
                      <p className="commn_para">{item?.jobName}</p>
                    </div>
                  </div>
                  <div className="job_info">
                    <ul>
                      <li className="icon clock">
                        <span>
                          {renderTime(item?.from_date, item?.to_date)}
                        </span>
                      </li>
                      <li className="icon dollar">{item?.amount}</li>
                      <li className="icon location">
                        <span>{item?.location_name}</span>
                      </li>
                      <li className="icon calendar">{item?.duration}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex_row tradies_row">
              <div className="flex_col_sm_6">
                <div
                  style={{ minHeight: "180px" }}
                  className="tradie_card posted_by"
                  data-aos="fade-in"
                  data-aos-delay="250"
                  data-aos-duration="1000"
                >
                  <span
                    onClick={() => {
                      props.history.push(
                        `/tradie-info?jobId=${item?.jobId}&tradeId=${item?.userId}`
                      );
                    }}
                    className="more_detail circle"
                  ></span>
                  <div className="user_wrap">
                    <figure className="u_img">
                      <img
                        src={item?.tradieImage || dummy}
                        alt="traide-img"
                        onError={(e: any) => {
                          if (e?.target?.onerror) {
                            e.target.onerror = null;
                          }
                          if (e?.target?.src) {
                            e.target.src = dummy;
                          }
                        }}
                      />
                    </figure>
                    <div className="details">
                      <span className="name">{item?.tradieName}</span>
                      <p className="commn_para">
                        <span className="rating">
                          {item?.rating ? (item?.rating).toFixed(1) : "0"} |{" "}
                          {item?.reviewCount} reviews
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                {item?.quote_item?.length
                  ? item?.quote_item.map((quote_item: any) => (
                      <div className="change_req">
                        <div className="flex_row">
                          <div className="flex_col_sm_2">
                            <label className="form_label">Item</label>
                          </div>
                          <div className="flex_col_sm_6">
                            <label className="form_label">Description</label>
                          </div>
                          <div className="flex_col_sm_4">
                            <label className="form_label">Price</label>
                          </div>
                          <div className="flex_col_sm_2">
                            <span className="show_label">
                              {` ${quote_item?.item_number}`}
                            </span>
                          </div>
                          <div className="flex_col_sm_6">
                            <span className="show_label line-1">
                              {` ${quote_item?.description}`}
                            </span>
                          </div>
                          <div className="flex_col_sm_4">
                            <span className="show_label">
                              <span>{`$ ${quote_item?.price}`}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  : null}
                <div className="total_quote">
                  <span className="fill_grey_btn">
                    {`Total : `}
                    {
                      <NumberFormat
                        value={
                          !!item?.totalQuoteAmount
                            ? item?.totalQuoteAmount
                            : "0"
                        }
                        displayType={"text"}
                        prefix={"$"}
                        thousandSeparator={true}
                        isNumericString={true}
                      />
                    }
                  </span>
                </div>

                {quotesData[0]?.status?.toLowerCase() === "pending" && (
                  <>
                    <div className="form_field">
                      <button
                        onClick={() => {
                          this.handleSubmit(item, 1);
                        }}
                        className="fill_btn w100per btn-effect"
                      >
                        {"Accept Quote"}
                      </button>
                    </div>
                    <div className="form_field">
                      <button
                        onClick={() => {
                          this.handleSubmit(item, 2);
                        }}
                        className="fill_grey_btn w100per btn-effect"
                      >
                        {"Decline Quote"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="no_record  m-t-vh">
            <figure className="no_img">
              <img src={noDataFound} alt="data not found" />
            </figure>
            <span>{"No Data Found"}</span>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default ViewQuote;
