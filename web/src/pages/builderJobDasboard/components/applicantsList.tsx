import React, { useState, useEffect } from "react";
import TradieBox from "../../shared/tradieBox";
import Menu from "@material-ui/core/Menu";
import cancel from "../../../assets/images/ic-cancel.png";
import noDataFound from "../../../assets/images/no-search-data.png";
interface Props {
  items: any;
  jobid: any;
  setJobLabel: any;
  activeType: any;
  history: any;
  specializationId: any;
  isLoading: any;
}

const ApplicantsList = (props: Props) => {
  const { items, jobid, specializationId, setJobLabel, isLoading, activeType } =
    props;
  const [isRender, setRender] = useState(false);
  const [sortBySorting, setSortBySorting] = useState<any>({
    sortBySorting: false,
    sortBy: 1,
  });
  const [sortingAnchorEl, setSortingAnchorEl] = useState(null);

  const sortBySortingClick = (event: any) => {
    setSortingAnchorEl(event.currentTarget);
    setSortBySorting((prevData: any) => ({ ...prevData, sortBySorting: true }));
  };

  const sortBySortingClose = () => {
    setSortingAnchorEl(null);
    setSortBySorting((prevData: any) => ({
      ...prevData,
      sortBySorting: false,
    }));
  };

  const sortByButtonClicked = (num: number) => {
    setSortBySorting((prevData: any) => ({ ...prevData, sortBy: num }));
    sortBySortingClose();
    setJobLabel("applicantList", jobid, num);
  };

  useEffect(() => {
    if (isLoading === false) {
      setRender(true);
    }
  }, [isLoading]);

  if (!isRender) {
    return null;
  }

  return (
    <>
      <div className="flex_row center_flex">
        <React.Fragment>
          <div className="flex_col_sm_6">
            <div className="relate">
              <span className="xs_sub_title">{"New applicants"}</span>
              <button
                className="back"
                onClick={() => {
                  setJobLabel(activeType);
                }}
              ></button>
            </div>
          </div>

          <div className="flex_col_sm_6 text-right">
            {activeType === "applicant" && (
              <button
                onClick={sortBySortingClick}
                className="fill_grey_btn sort_btn"
              >
                {"Sort by"}
              </button>
            )}

            <Menu
              // id="simple-menu"
              className="fsp_modal range sort"
              anchorEl={sortingAnchorEl}
              keepMounted
              open={Boolean(sortingAnchorEl)}
              onClose={sortBySortingClose}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <span className="close_btn" onClick={sortBySortingClose}>
                <img src={cancel} alt="cancel" />
              </span>
              <span className="sub_title">Sort by</span>
              <div className="radio_wrap agree_check">
                <input
                  className="filter-type filled-in"
                  type="radio"
                  id="highestRated"
                  value="Highest rated"
                  checked={sortBySorting.sortBy === 1}
                  onChange={() => sortByButtonClicked(1)}
                />
                <label htmlFor="highestRated">Highest rated</label>
              </div>
              <div className="radio_wrap agree_check">
                <input
                  className="filter-type filled-in"
                  type="radio"
                  id="closest"
                  value="Closest to me"
                  checked={sortBySorting.sortBy === 2}
                  onChange={() => sortByButtonClicked(2)}
                />
                <label htmlFor="closest">Closest to me</label>
              </div>
              <div className="radio_wrap agree_check">
                <input
                  className="filter-type filled-in"
                  type="radio"
                  id="mostJob"
                  value="Most jobs completed"
                  checked={sortBySorting.sortBy === 3}
                  onChange={() => sortByButtonClicked(3)}
                />
                <label htmlFor="mostJob">Most jobs completed</label>
              </div>
            </Menu>
          </div>
        </React.Fragment>
      </div>

      <div className="flex_row applicants_row">
        {console.log({ items }, "------------>")}
        {items?.length
          ? items.map((item: any, index: any) => (
              <TradieBox
                item={item}
                index={index}
                specializationId={specializationId}
                jobId={jobid}
                hideInvite={item.status === "CANCELLED JOB"}
                showStatus
              />
            ))
          : !isLoading && (
              <div className="no_record m-t-vh">
                <figure className="no_img">
                  <img src={noDataFound} alt="data not found" />
                </figure>
                <span>{"No Data Found"}</span>
              </div>
            )}
      </div>
    </>
  );
};

export default ApplicantsList;
