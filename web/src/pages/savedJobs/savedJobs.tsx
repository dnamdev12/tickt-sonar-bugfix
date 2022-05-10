import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import TradieJobInfoBox from "../../common/tradieJobInfoBox";
import noData from "../../assets/images/no-search-data.png";

const SavedJobs = ({
  getSavedJobList,
  clearSavedJobList,
  savedJobs,
  isLoading,
  ...props
}: any) => {
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const backButtonClicked = () => {
    props.history?.goBack();
  };

  useEffect(() => {
    return clearSavedJobList;
  }, [clearSavedJobList]);

  useEffect(() => {
    getSavedJobList(page);
  }, [getSavedJobList, page]);

  useEffect(() => {
    setJobs((job) => (job || []).concat(savedJobs));
    setHasMore(savedJobs.length === 10);
  }, [savedJobs]);

  const loadMoreJobs = () => {
    setPage((pages) => pages + 1);
  };

  return (
    <InfiniteScroll
      dataLength={jobs.length}
      next={loadMoreJobs}
      hasMore={hasMore}
      loader={<h4></h4>}
    >
      <div className={"app_wrapper"}>
        <div className="section_wrapper">
          <div className="custom_container">
            <div className="relate">
              <button className="back" onClick={backButtonClicked}></button>
              <span className="title">Saved jobs</span>
            </div>
            <div className="flex_row tradies_row">
              {jobs?.length > 0
                ? jobs?.map((jobData: any) => {
                    return (
                      <TradieJobInfoBox
                        item={jobData}
                        {...props}
                        key={jobData.jobId}
                      />
                    );
                  })
                : !isLoading && (
                    <div className="no_record">
                      <figure className="no_img">
                        <img src={noData} alt="data not found" />
                      </figure>
                      <span>No Data Found</span>
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>
    </InfiniteScroll>
  );
};

export default SavedJobs;
