import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchFilters from "./searchFilters";
import noData from "../../assets/images/no-search-data.png";
import BannerSearchProps from "../shared/bannerSearchProps";
import TradieBox from "../shared/tradieBox";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import { moengage, mixPanel } from "../../services/analyticsTools";
import { MoEConstants } from "../../utils/constants";

const SearchResultTradie = (props: any) => {
  const location: any = useLocation();

  const [stateData, setStateData] = useState(location.state);
  const [specialiZationName, setSpecialiZationName] = useState<any>([]);
  const [isToggle, setToggleSearch] = useState(false);
  const [localInfo, setLocalInfo] = useState({}); // localInfo

  const [localData, setLocalData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortByFilter, setSortByFilter] = useState<any>({
    sortByFilterClicked: false,
    tradeId: [],
    sortChanged: false,
    specializationId: [],
    specializationName: [],
    allSpecializationClicked: false,
  });

  const { homeSearchJobData } = props; // props here.

  useEffect(() => {
    props.getRecentSearchList();

    let data: any = {
      page: 1,
      isFiltered: false,
    };

    if (stateData?.tradeId) {
      data["tradeId"] = stateData?.tradeId;
    }

    if (stateData?.specializations) {
      data["specializationId"] = stateData?.specializations;
      data["specializationId"] = specialiZationName;
    }

    if (stateData?.location) {
      data["location"] = stateData?.location;
    }

    if (props?.location?.state?.suggestionSelected) {
      data["address"] = JSON.stringify(
        props?.location?.state?.suggestionSelected
      );
    }

    if (stateData?.calender?.startDate) {
      data["from_date"] = moment(stateData?.calender?.startDate).format(
        "YYYY-MM-DD"
      );
    }
    if (stateData?.calender?.endDate) {
      data["to_date"] = moment(stateData?.calender?.endDate).format(
        "YYYY-MM-DD"
      );
    }
 
    if (!data?.address || !data?.address?.length) {
      delete data.address;
    }

    setLocalInfo({
      name: stateData?.name,
      count: 0,
      tradeId: data.tradeId,
      specializationId: data.specializationId,
      specializationName: data.specialiZationName,
      location: data.location,
      doingLocalChanges: false,
      suggestionSelected: stateData?.suggestionSelected,
    });

    if (data?.address) {
      return;
    }
    props.postHomeSearchData(data);
    const mData = {
      timeStamp: moengage.getCurrentTimeStamp(),
      category: props?.tradeListData.find(
        (i: any) => i._id === data?.tradeId[0]
      )?.trade_name,
      ...(data.address && {
        location: `${JSON.parse(data.address)?.mainText} ${
          JSON.parse(data.address)?.secondaryText
        }`,
      }),
      //'length of hire': '',
      ...(data?.from_date && { "start date": data?.from_date }),
      ...(data?.to_date && { "end date": data?.to_date }),
    };
    moengage.moE_SendEvent(MoEConstants.SEARCHED_FOR_TRADIES, mData);
    mixPanel.mixP_SendEvent(MoEConstants.SEARCHED_FOR_TRADIES, mData);
  }, []);

  const getTitleInfo = (info: any) => {
    setLocalInfo(info);
  };

  const checkIfExist = (data: any) => {
    if (data && Array.isArray(data) && data?.length) {
      let element_id = data[0].tradieId;
      let response = localData.find(
        (item: any) => item.tradieId === element_id
      );
      if (response) {
        return true;
      }
      return false;
    }
    return false;
  };
  const filterChangeHandler = (id: any, name: string, newName?: string) => {
    if (name === "jobTypes") {
      if (sortByFilter.jobTypes[0] == id) {
        setSortByFilter((prevData: any) => ({ ...prevData, jobTypes: [] }));
      } else {
        setSortByFilter((prevData: any) => ({ ...prevData, jobTypes: [id] }));
      }
    } else if (name === "specializationId") {
      setSortByFilter((prevData: any) => {
        var newData: any = [];
        var newNameData: any = [];
        if (
          Array.isArray(prevData.specializationId) &&
          prevData?.specializationId?.length
        ) {
          newData = [...prevData.specializationId];
          newNameData = [...prevData.specializationName];
        }
        if (sortByFilter.allSpecializationClicked) {
          newData = [];
          newNameData = [];
        }
        const itemIndex = newData.indexOf(id);

        if (newData.indexOf(id) < 0) {
          newData.push(id);
          newNameData.push(newName);
        } else {
          newData.splice(itemIndex, 1);
          newNameData.splice(itemIndex, 1);
        }

        setSpecialiZationName(newNameData);
        return {
          ...prevData,
          specializationId: newData,
          specializationName: newNameData,
          allSpecializationClicked: false,
        };
      });
    } else if (name == "categories") {
      if (sortByFilter.tradeId.length && sortByFilter.tradeId[0] == id) {
        setSortByFilter((prevData: any) => ({
          ...prevData,
          tradeId: [],
          specializationId: [],
          allSpecializationClicked: false,
        }));
      } else {
        setSortByFilter((prevData: any) => ({
          ...prevData,
          tradeId: [id],
          specializationId: [],
          specializationName: [],
          allSpecializationClicked: false,
        }));
      }
    } else if (name == "All Clicked") {
      setSpecialiZationName([]);
      if (sortByFilter.allSpecializationClicked) {
        setSpecialiZationName([]);
        setSortByFilter((prevData: any) => ({
          ...prevData,
          allSpecializationClicked: false,
          specializationId: [],
          specializationName: [],
        }));
      } else {
        const newSpecialization = id.map(({ _id }: { _id: string }) => {
          return _id;
        });
        setSortByFilter((prevData: any) => ({
          ...prevData,
          allSpecializationClicked: true,
          specializationId: newSpecialization,
        }));
      }
    } else if (name == "Clear All") {
      setSortByFilter((prevData: any) => ({
        ...prevData,
        allSpecializationClicked: false,
        jobTypes: [],
        specializationId: [],
        specializationName: [],
        tradeId: [],
      }));
    }
  };
  useEffect(() => {
    let newProps = homeSearchJobData;
    let propsPage = 1;
    let propsTradeId = "";
    let localTradeId = "";
    let local_info: any = localInfo;
    let local_info_tradeId = "";
    if (
      local_info?.tradeId &&
      Array.isArray(local_info?.tradeId) &&
      local_info?.tradeId?.length
    ) {
      local_info_tradeId = local_info?.tradeId[0];
    }

    if (!hasMore) {
      setHasMore((prev: any) => !prev);
    }

    if (
      homeSearchJobData &&
      Array.isArray(homeSearchJobData) &&
      homeSearchJobData?.length
    ) {
      propsTradeId = homeSearchJobData[0]?.tradeData[0]?.tradeId;
      propsPage = homeSearchJobData[0]?.page;
    }

    if (localData && Array.isArray(localData) && localData?.length) {
      localTradeId = localData[0]?.tradeData[0]?.tradeId;
    }


    if (!local_info_tradeId?.length && localTradeId?.length) {
      getTitleInfo({
        name: "",
        count: 0,
        tradeId: [],
        specializationId: [],
        location: null,
        doingLocalChanges: false,
        suggestionSelected: "",
      });
    }

    if (propsPage) {
      if (local_info_tradeId?.length && localTradeId?.length) {
        if (!propsTradeId?.length && local_info_tradeId === localTradeId) {
          return;
        }
      }

      if (propsPage === 1 && currentPage === 1) {
        setLocalData(newProps);
        setCurrentPage(propsPage);
      } else if (
        propsPage > 1 &&
        currentPage > 1 &&
        currentPage === propsPage
      ) {
        if (!checkIfExist(newProps)) {
          setLocalData((prev: any) => [...prev, ...newProps]);
        }
      } else if (propsPage === 1 && currentPage > 1) {
        setLocalData(newProps);
        setCurrentPage(propsPage);
      } else {
        if (
          !local_info_tradeId?.length &&
          localTradeId?.length &&
          propsTradeId?.length
        ) {
          if (localTradeId === propsTradeId) {
            setLocalData(newProps);
            setCurrentPage(propsPage);
          }
        }
      }
    }
  }, [homeSearchJobData]);

  const handleChangeToggle = (value: any) => {
    setToggleSearch(value);
  };

  let local_info: any = localInfo;
  let isLoading: any = props.isLoading;

  return (
    <div className="app_wrapper">
      <div className={`top_search ${isToggle ? "active" : ""}`}>
        <BannerSearchProps
          {...props}
          tradeListData={props.tradeListData}
          showOnlyTradeName={props.history?.location?.state?.showOnlyTradeName}
          getTitleInfo={getTitleInfo}
          localInfo={localInfo}
          handleChangeToggle={handleChangeToggle}
        />
      </div>
      <div className="search_result">
        <div className="section_wrapper">
          <div className="custom_container">
            <div className="flex_row mob_srch_option">
              <div className="flex_col_sm_6"></div>
              <div className="flex_col_sm_6 text-right">
                <button
                  onClick={() => {
                    setToggleSearch(true);
                  }}
                  className="fill_grey_btn btn-effect"
                >
                  Modify Search
                </button>
              </div>
            </div>

            <div className="result_heading">
              <div className="flex_row">
                <div className="flex_col_sm_8">
                  <span className="title">
                    {console.log(
                      specialiZationName.length,
                      "specialiZationName.length"
                    )}
                    {specialiZationName.length
                      ? `${specialiZationName[0]} ${
                          local_info?.count > 1
                            ? `+${local_info?.count - 1}`
                            : ""
                        }`
                      : local_info?.name || ""}
                    <span className="count">
                      {`${localData?.length || 0} result(s)`}
                    </span>
                  </span>
                  <SearchFilters
                    {...props}
                    localInfo={localInfo}
                    getTitleInfo={getTitleInfo}
                    filterChangeHandler={filterChangeHandler}
                    sortByFilter={sortByFilter}
                    setSortByFilter={setSortByFilter}
                  />
                </div>
              </div>
            </div>

            <InfiniteScroll
              dataLength={localData?.length}
              next={() => {
                if (localData?.length < currentPage * 10) {
                } else {
                  let cp = currentPage + 1;
                  setCurrentPage((prev: any) => prev + 1);
                  let local_info: any = localInfo;

                  let data: any = {
                    page: cp,
                    isFiltered: false,
                  };

                  if (local_info?.location) {
                    data["location"] = local_info?.location;
                  }

                  if (local_info?.tradeId?.length) {
                    data["tradeId"] = local_info?.tradeId;
                  }

                  if (local_info?.specializationId?.length) {
                    data["specializationId"] = local_info?.specializationId;
                  }

                  if (
                    props?.location?.state?.suggestionSelected &&
                    props?.location?.state?.suggestionSelected !== "{}"
                  ) {
                    data["address"] = JSON.stringify(
                      props?.location?.state?.suggestionSelected
                    );
                  }

                  if (local_info?.from_date) {
                    data["from_date"] = local_info?.from_date;
                  }

                  if (local_info?.to_date) {
                    data["to_date"] = local_info?.to_date;
                  }

                  if (local_info?.sortBy > 0) {
                    data["sortBy"] = local_info?.sortBy;
                  }

                  if (!data?.hasOwnProperty("specializationId")) {
                    data["isFiltered"] = true;
                  }

                  props.postHomeSearchData(data);
                }
              }}
              hasMore={hasMore}
              loader={<></>}
              className="flex_row tradies_row"
            >
              {localData?.length ? (
                localData.map((item: any, index: number) => (
                  <TradieBox item={item} index={index} />
                ))
              ) : !isLoading && !localData?.length ? (
                <div className="no_record">
                  <figure className="no_img">
                    <img src={noData} alt="data not found" />
                  </figure>
                  <span>{"No Data Found"}</span>
                </div>
              ) : null}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultTradie;
