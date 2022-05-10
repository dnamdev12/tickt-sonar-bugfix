import React, { useEffect, useState } from "react";
import dummy from "../../../assets/images/u_placeholder.jpg";
import { withRouter } from "react-router";
import noDataFound from "../../../assets/images/no-search-data.png";
import { renderTime } from "../../../utils/common";
interface Applicant {
  amount: any;
  builderId: any;
  builderImage: any;
  durations: any;
  fromDate: any;
  jobName: any;
  jobDescription: any;
  jobId: any;
  quote: any;
  quoteCount: any;
  quoteJob: any;
  specializationName: any;
  timeLeft: any;
  toDate: any;
  total: any;
  tradeId: any;
  location: any;
  location_name: any;
  specializationId: any;
  tradeName: any;
  tradieId: any;
  isLoading?: any;
  tradeSelectedUrl: any;
  activeType?: any;
}

const NewApplicants = (props: any) => {
  const { dataItems, setJobLabel, isLoading } = props;
  let listData: any = dataItems;

  const [isRender, setRender] = useState(false);

  const redirectToInfo = ({ jobId }: any) => {
    const props_: any = props;
    if (jobId?.length) {
      let urlEncode: any = `?jobId=${jobId}&activeType=${
        props_?.activeType || "applicant"
      }`;
      props_.history.push(`/job-detail?${urlEncode}`);
    }
  };

  useEffect(() => {
    if (isLoading == false) {
      setRender(true);
    }
  }, [isLoading]);

  if (!isRender) {
    return null;
  }

  return (
    <React.Fragment>
      <span className="sub_title">New Applicants</span>
      <div className="flex_row tradies_row">
        {listData?.length
          ? listData.map(
              ({
                amount,
                fromDate,
                jobName,
                jobDescription,
                jobId,
                quoteCount,
                quoteJob,
                specializationId,
                timeLeft,
                toDate,
                total,
                tradeName,
                tradeSelectedUrl,
              }: Applicant) => (
                <div className="flex_col_sm_6">
                  <div
                    className="tradie_card"
                    data-aos="fade-in"
                    data-aos-delay="250"
                    data-aos-duration="1000"
                  >
                    <span
                      onClick={() => {
                        redirectToInfo({ jobId });
                      }}
                      className="more_detail circle"
                    ></span>
                    <div className="user_wrap">
                      <figure className="u_img icon">
                        <img
                          src={tradeSelectedUrl || dummy}
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
                        <span className="name">{tradeName}</span>
                        <p className="commn_para">{jobName}</p>
                      </div>
                    </div>
                    <p className="commn_para line-2">{jobDescription}</p>
                    <div className="job_info">
                      <ul>
                        <li className="icon dollar">{amount}</li>
                        <li className="">
                          <span>{total}</span>
                        </li>
                        <li className="icon calendar">
                          {renderTime(fromDate, toDate)}
                        </li>
                        <li className="">
                          <span>{timeLeft}</span>
                        </li>
                      </ul>
                    </div>

                    {quoteJob ? (
                      <button
                        onClick={() => {
                          if (quoteCount?.length || quoteCount) {
                            setJobLabel("listQuote");
                            props.history.replace(
                              `/jobs?active=applicant&quote=true&jobId=${jobId}`
                            );
                          }
                        }}
                        className="fill_grey_btn full_btn btn-effect"
                      >
                        {`${quoteCount?.length || quoteCount} Application${
                          quoteCount === 1 ? "" : "s"
                        }`}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setJobLabel(
                            "applicantList",
                            jobId,
                            1,
                            specializationId
                          );
                        }}
                        className="fill_grey_btn full_btn btn-effect"
                      >
                        {"Applications"}
                      </button>
                    )}
                  </div>
                </div>
              )
            )
          : !isLoading && (
              <div className="no_record  m-t-vh">
                <figure className="no_img">
                  <img src={noDataFound} alt="data not found" />
                </figure>
                <span>{"No Data Found"}</span>
              </div>
            )}
      </div>
    </React.Fragment>
  );
};

export default withRouter(NewApplicants);
