import React, { Component } from "react";
import dummy from "../../../../assets/images/u_placeholder.jpg";
import NumberFormat from "react-number-format";

import { quoteByJobId } from "../../../../redux/quotes/actions";

type State = {
  toggle: boolean;
  dataItems: any;
};

type Props = {
  quotes_param: any;
  history: any;
  setJobLabel: any;
  jobId: string;
};

class ListQuotes extends Component<Props, State> {
  state: State = {
    toggle: true,
    dataItems: [],
  };

  componentDidMount() {
    this.preFetchForQuotes();
  }

  preFetchForQuotes = () => {
    const props: any = this.props;
    const params = new URLSearchParams(props?.history?.location?.search);
    const jobId: any = params.get("jobId");
    if (jobId?.length) {
      this.fetchQuotesById(jobId, 1);
    }
  };

  fetchQuotesById = async (jobId: string, sortBy: number) => {
    let result = await quoteByJobId({ jobId, sortBy });
    console.log({ result });
    if (result?.success) {
      let data = result?.data?.resultData;
      if (data) {
        this.setState({ dataItems: data });
      }
    }
  };

  render() {
    const props: any = this.props;
    const params = new URLSearchParams(props?.history?.location?.search);
    const activeType = params.get("active");
    const jobId = params.get("jobId");
    let { dataItems, toggle } = this.state;
    return (
      <React.Fragment>
        <div className="flex_row">
          <div className="flex_col_sm_5">
            <div className="relate">
              <button
                onClick={() => {
                  if (activeType === "open") {
                    this.props.history.replace(`/jobs?active=open`);
                    this.props.setJobLabel("open");
                  }

                  if (activeType === "applicant") {
                    this.props.history.replace(`/jobs?active=applicant`);
                    this.props.setJobLabel("applicant");
                  }
                }}
                className="back"
              ></button>
              <span style={{ fontSize: "24px" }} className="title">
                Quotes
              </span>
            </div>
          </div>
        </div>

        <span className="sub_title">
          <button
            onClick={() => {
              this.setState({ toggle: !this.state.toggle }, () => {
                this.preFetchForQuotes();
              });
            }}
            className="fill_grey_btn sort_btn"
          >
            {`${toggle ? "Highest" : "Lowest"} quote`}
          </button>
        </span>

        <div className="flex_row tradies_row">
          {dataItems.map((item: any) => (
            <div className="flex_col_sm_6">
              <div
                style={{ minHeight: "180px" }}
                className="tradie_card"
                data-aos="fade-in"
                data-aos-delay="250"
                data-aos-duration="1000"
              >
                <span
                  onClick={() => {
                    this.props.history.replace(
                      `/jobs?active=${activeType}&viewQuotes=true&jobId=${jobId}&id=${item?._id}`
                    );
                    this.props.setJobLabel("quotes");
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
                        {item?.reviewCount || "0"} reviews
                      </span>
                    </p>
                  </div>
                </div>

                {item?.status && (
                  <div className="form_field">
                    <div className="job_status">
                      {item?.status?.toUpperCase()}
                    </div>
                  </div>
                )}

                <button
                  className="fill_grey_btn full_btn btn-effect"
                  onClick={() => {
                    this.props.history.replace(
                      `/jobs?active=${activeType}&viewQuotes=true&jobId=${jobId}&id=${item?._id}`
                    );
                    this.props.setJobLabel("quotes");
                  }}
                >
                  {`Total quote:`}
                  {
                    <NumberFormat
                      value={
                        !!item?.totalQuoteAmount ? item?.totalQuoteAmount : "0"
                      }
                      displayType={"text"}
                      prefix={"$"}
                      thousandSeparator={true}
                      isNumericString={true}
                    />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default ListQuotes;
