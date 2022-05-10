import { useEffect, useState } from "react";
import QuoteMark from "../quoteJobs/quoteMark";
import { getHomeJobDetails } from "../../../../redux/homeSearch/actions";

import dummy from "../../../../assets/images/u_placeholder.jpg";
import more from "../../../../assets/images/icon-direction-right.png";
import noDataFound from "../../../../assets/images/no-search-data.png";

const QuoteOuter = (props: any) => {
  const [dataItems, setDataItems] = useState<any>({});
  const [isDataFetched, setIsDataFetched] = useState<boolean>(false);
  const [isLoad, setIsLoad] = useState(true);

  var jobData = props.location?.state?.jobData;
  const params = new URLSearchParams(props.location?.search);
  let jobId = params.get("jobId");
  let tradeId = params.get("tradeId");
  let specializationId = params.get("specializationId");
  useEffect(() => {
    if (!jobData?.postedBy) {
      preFetch();
    }
  }, [jobData]);

  const preFetch = async () => {
    let data: any = {};
    if (!isLoad) {
      setIsLoad(true);
    }
    data.jobId = jobId ? jobId : jobData?.jobId;
    data.tradeId = tradeId ? tradeId : jobData?.tradeId;
    data.specializationId = specializationId
      ? specializationId
      : jobData?.specializationId;
    let result: any = await getHomeJobDetails(data);
    if (result.success) {
      setDataItems(result?.data);
    }
    setIsLoad(false);
  };

  const dataFetched = (val: boolean) => {
    setIsDataFetched(val);
    if (jobData) {
      setIsLoad(false);
    }
  };

  const postedBy: any = dataItems?.postedBy || jobData?.postedBy || {};
  const { builderId, builderImage, builderName, ratings, reviews } = postedBy;

  return (
    <div className="detail_col">
      <div className="flex_row">
        <QuoteMark
          {...props}
          builderName={builderName}
          jobId={jobId}
          dataFetched={dataFetched}
          isDataFetched={isDataFetched}
        />
        {isDataFetched ? (
          <div className="flex_col_sm_6 col_ruler">
            <span className="sub_title">Posted by</span>
            <div className="tradie_card posted_by ">
              <div
                className="user_wrap"
                onClick={() => {
                  props.history.push(`/builder-info?builderId=${builderId}`);
                }}
              >
                <figure className="u_img">
                  <img
                    src={builderImage || dummy}
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
                  <span className="name">{builderName}</span>
                  <span className="rating">
                    {ratings} | {reviews} reviews
                  </span>
                </div>
              </div>
            </div>
            <div className="relate">
              <span className="sub_title">{"Job details"}</span>
              <span
                className="edit_icon"
                title="More"
                onClick={() =>
                  props.history.push(
                    `/job-details-page?jobId=${
                      jobId ? jobId : jobData?.jobId
                    }&redirect_from=jobs`
                  )
                }
              >
                <img src={more} alt="more" />
              </span>
            </div>
          </div>
        ) : (
          !props.loading &&
          !isLoad && (
            <div className="no_record  m-t-vh">
              <figure className="no_img">
                <img src={noDataFound} alt="data not found" />
              </figure>
              <span>No Data Found</span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default QuoteOuter;
