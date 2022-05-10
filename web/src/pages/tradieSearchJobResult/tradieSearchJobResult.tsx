import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import BannerSearch from "../../common/tradieBannerSearch/index";
import TradieJobInfoBox from "../../common/tradieJobInfoBox";
import SearchResultFilters from "../searchResultFilters/index";
import RenderMap from "./renderMap";
import InfiniteScroll from "react-infinite-scroll-component";

import mapIcon from "../../assets/images/map.png";
import noData from "../../assets/images/no-search-data.png";
import closeMap from "../../assets/images/close-white.png";
import { moengage, mixPanel } from "../../services/analyticsTools";
import { MoEConstants } from "../../utils/constants";
interface PropsType {
  history: any;
  location?: any;
  isLoading: boolean;
  tradeListData: Array<any>;
  jobTypeListData: Array<any>;
  viewNearByJobData: Array<any>;
  homeSearchJobData: Array<any>;
  getViewNearByJob: (data: any) => void;
  postHomeSearchData: (data: any) => void;
  resetHomeSearchJobData: () => void;
  resetViewNearByJobData: () => void;
}

const TradieSearchJobResult = (props: PropsType) => {
  const [searchResultData, setSearchResultData] = useState({
    page: 1,
    searchByFilter: false,
    cleanFiltersData: false,
  });
  const [mapData, setMapData] = useState<any>({
    showMap: false,
  });
  const [paramsData, setParamsData] = useState<any>({});
  const [isToggleModifySearch, setToggleModifySearch] =
    useState<boolean>(false);
  const [jobListData, setJobListData] = useState<Array<any>>([]);
  const [apiRequestData, setApiRequestData] = useState<any>({});
  const [hasMoreItems, setHasMoreItems] = useState<boolean>(true);
  const [isAllFilterSpecs, setIsAllFilterSpecs] = useState<boolean>(false);

  useEffect(() => {
    var queryParamsData = getQueryParamsData();
    let data: any = {};

    if (queryParamsData.jobResults === "viewNearByJob") {
      data = {
        page: 1,
        long: queryParamsData.defaultLong,
        lat: queryParamsData.defaultLat,
      };
      props.getViewNearByJob(data);
    } else {
      data = {
        page: 1,
        ...(queryParamsData.isFiltered
          ? { isFiltered: true }
          : { isFiltered: false }),
        ...(queryParamsData.tradeId?.length && {
          tradeId: queryParamsData.tradeId,
        }),
        ...(queryParamsData.jobTypes?.length && {
          jobTypes: queryParamsData.jobTypes,
        }),
        ...(queryParamsData.specializationId?.length && {
          specializationId: queryParamsData.specializationId,
        }),
        ...(queryParamsData.from_date && {
          from_date: queryParamsData.from_date,
        }),
        ...(queryParamsData.to_date && { to_date: queryParamsData.to_date }),
        ...(queryParamsData.min_budget >= 0 &&
          queryParamsData.max_budget > 0 && {
            pay_type: queryParamsData.pay_type,
          }),
        ...(queryParamsData.min_budget >= 0 &&
          queryParamsData.max_budget > 0 && {
            min_budget: queryParamsData.min_budget,
          }),
        ...(queryParamsData.min_budget >= 0 &&
          queryParamsData.max_budget > 0 && {
            max_budget: queryParamsData.max_budget,
          }),
        ...(queryParamsData.sortBy && { sortBy: queryParamsData.sortBy }),
        ...((queryParamsData.addres || queryParamsData.sortBy === 2) && {
          location: {
            coordinates: [
              queryParamsData.long
                ? queryParamsData.long
                : queryParamsData.defaultLong,
              queryParamsData.lat
                ? queryParamsData.lat
                : queryParamsData.defaultLat,
            ],
          },
        }),
        ...(queryParamsData.addres &&
          queryParamsData.address && { address: queryParamsData.address }),
      };
      props.postHomeSearchData(data);
      const mData = {
        timeStamp: moengage.getCurrentTimeStamp(),
        category: props.tradeListData.find(
          (i: any) => i._id === data?.tradeId?.[0]
        )?.trade_name,
        ...(data.address && {
          location: `${JSON.parse(data.address)?.mainText} ${
            JSON.parse(data.address)?.secondaryText
          }`,
        }),
        ...(data?.max_budget && { "Max budget": data?.max_budget }),
        ...(data?.from_date && { "start date": data?.from_date }),
        ...(data?.to_date && { "end date": data?.to_date }),
      };
      moengage.moE_SendEvent(MoEConstants.SEARCHED_FOR_JOBS, mData);
      mixPanel.mixP_SendEvent(MoEConstants.SEARCHED_FOR_JOBS, mData);
    }
    setApiRequestData(data);

    setIsAllFilterSpecs(
      queryParamsData?.isAllFilterSpecs == true ? true : false
    );
    return () => {
      props.resetViewNearByJobData();
      props.resetHomeSearchJobData();
    };
  }, []);

  const getQueryParamsData = () => {
    const params = new URLSearchParams(props.history?.location?.search);
    const specializationString = params.get("specializationId");
    const specializationArray = specializationString?.split(",");
    const tradeIdArray = params.get("tradeId") ? [params.get("tradeId")] : null;
    const jobTypesArray = params.get("jobTypes")
      ? [params.get("jobTypes")]
      : null;
    const queryParamsData: any = {
      page: Number(params.get("page")),
      isFiltered: params.get("isFiltered") === "true",
      isFilterOn: params.get("isFilterOn"),
      tradeId: tradeIdArray,
      specializationId: specializationArray,
      lat: Number(params.get("lat")),
      long: Number(params.get("long")),
      defaultLat: Number(params.get("defaultLat")),
      defaultLong: Number(params.get("defaultLong")),
      addres: params.get("addres"),
      address: params.get("address"),
      from_date: params.get("from_date"),
      to_date: params.get("to_date"),
      jobResults: params.get("jobResults"),
      heading: params.get("heading"),
      jobTypes: jobTypesArray,
      searchJob: params.get("searchJob")?.replaceAll("xxx", "&"),
      min_budget: Number(params.get("min_budget")),
      max_budget: Number(params.get("max_budget")),
      pay_type: params.get("pay_type"),
      sortBy: Number(params.get("sortBy")),
      isAllFilterSpecs:
        params.get("isAllFilterSpecs") === "true" ? true : false,
    };
    setParamsData(queryParamsData);
    return queryParamsData;
  };

  console.log(
    paramsData,
    "paramsData",
    jobListData,
    "jobListData",
    apiRequestData,
    "apiRequestData",
    hasMoreItems,
    "hasMoreItems"
  );

  const callJobList = () => {
    if (!hasMoreItems) {
      return;
    }
    const data = { ...apiRequestData };
    data.page = searchResultData.page;
    if (paramsData.jobResults === "viewNearByJob") {
      props.getViewNearByJob(data);
    } else {
      props.postHomeSearchData(data);
    }
  };
  console.log(jobListData, "@@@@@@@@@@@@@@@@@@@@@@@@");
  useEffect(() => {
    const jobResultsParam = new URLSearchParams(
      props.history?.location?.search
    ).get("jobResults");
    if (searchResultData.searchByFilter && props.homeSearchJobData?.length) {
      if (searchResultData.page === 1) {
        setJobListData(props.homeSearchJobData);
      } else {
        setJobListData((prevData: any) => [
          ...prevData,
          ...props.homeSearchJobData,
        ]);
      }
      setSearchResultData((prevData: any) => ({
        ...prevData,
        page: prevData.page + 1,
      }));
      if (props.homeSearchJobData?.length < 10) {
        setHasMoreItems(false);
      }
      return;
    }
    if (
      jobResultsParam === "viewNearByJob" &&
      props.viewNearByJobData?.length
    ) {
      if (searchResultData.page === 1) {
        setJobListData(props.viewNearByJobData);
      } else {
        setJobListData((prevData: any) => [
          ...prevData,
          ...props.viewNearByJobData,
        ]);
      }
      setSearchResultData((prevData: any) => ({
        ...prevData,
        page: prevData.page + 1,
      }));
      if (props.viewNearByJobData?.length < 10) {
        setHasMoreItems(false);
      }
      return;
    } else if (props.homeSearchJobData?.length) {
      if (searchResultData.page === 1) {
        setJobListData(props.homeSearchJobData);
      } else {
        setJobListData((prevData: any) => [
          ...prevData,
          ...props.homeSearchJobData,
        ]);
      }
      setSearchResultData((prevData: any) => ({
        ...prevData,
        page: prevData.page + 1,
      }));
      if (props.homeSearchJobData?.length < 10) {
        setHasMoreItems(false);
      }
    }
  }, [props.homeSearchJobData, props.viewNearByJobData]);

  const searchByFilter = (allFiltersData: any) => {
    const newParamsData = getQueryParamsData();
    if (allFiltersData === "callViewNearByJobApi") {
      const data = {
        page: 1,
        long: newParamsData.defaultLong,
        lat: newParamsData.defaultLat,
      };
      props.getViewNearByJob(data);
      props.history.replace(
        `/search-job-results?jobResults=viewNearByJob&defaultLat=${newParamsData.defaultLat}&defaultLong=${newParamsData.defaultLong}`
      );
      getQueryParamsData();
      setSearchResultData((prevData: any) => ({
        ...prevData,
        searchByFilter: false,
        page: 1,
      }));
      return;
    }
    var headingType: string = "";
    console.log(allFiltersData, "allFiltersData", newParamsData);

    if (newParamsData.tradeId?.length) {
      delete newParamsData.tradeId;
    }
    if (newParamsData.jobTypes?.length) {
      delete newParamsData.jobTypes;
    }
    if (newParamsData.specializationId?.length) {
      delete newParamsData.specializationId;
    }
    if (allFiltersData.jobTypes?.length && !allFiltersData.tradeId?.length) {
      headingType = props.jobTypeListData?.find(
        (i: any) => i._id === allFiltersData.jobTypes[0]
      )?.name;
      delete newParamsData.searchJob;
    }
    if (
      allFiltersData.tradeId?.length &&
      !allFiltersData.specializationId?.length
    ) {
      headingType = props.tradeListData?.find(
        (i: any) => i._id === allFiltersData?.tradeId?.[0]
      )?.trade_name;
      delete newParamsData.searchJob;
    }

    var data = {
      ...newParamsData,
      isFilterOn: "isFilterOn",
      jobResults: null,
      isFiltered: true,
      ...(allFiltersData.tradeId?.length && {
        tradeId: allFiltersData.tradeId,
      }),
      ...(allFiltersData.jobTypes?.length && {
        jobTypes: allFiltersData.jobTypes,
      }),
      ...(allFiltersData.jobTypes?.length &&
        !allFiltersData.tradeId?.length && { jobResults: "jobTypeList" }),
      ...(allFiltersData.jobTypes?.length &&
        !allFiltersData.tradeId?.length && { heading: headingType }),
      ...(allFiltersData.tradeId?.length &&
        !allFiltersData.specializationId?.length && {
          jobResults: "jobTypeList",
        }),
      ...(allFiltersData.tradeId?.length &&
        !allFiltersData.specializationId?.length && { heading: headingType }),
      ...(allFiltersData.specializationId?.length && {
        specializationId: allFiltersData.specializationId,
      }),
      ...(allFiltersData.min_budget >= 0 &&
        allFiltersData.max_budget > 0 && { pay_type: allFiltersData.pay_type }),
      ...(allFiltersData.min_budget >= 0 &&
        allFiltersData.max_budget > 0 && {
          min_budget: allFiltersData.min_budget,
        }),
      ...(allFiltersData.min_budget >= 0 &&
        allFiltersData.max_budget > 0 && {
          max_budget: allFiltersData.max_budget,
        }),
      ...([1, 2, 3].includes(allFiltersData.sortBy) && {
        sortBy: allFiltersData.sortBy,
      }),
    };

    if (allFiltersData.sortBy === 400) {
      delete data.sortBy;
    }
    if (data.searchJob) {
      delete data.heading;
      delete data.jobResults;
    }
    if (allFiltersData.max_budget === 0) {
      delete data.min_budget;
      delete data.max_budget;
      delete data.pay_type;
    }
    if (
      allFiltersData?.specializationId?.length &&
      allFiltersData?.tradeId?.length
    ) {
      const specializationList = props.tradeListData?.find(
        (i: any) => i._id === allFiltersData?.tradeId?.[0]
      )?.specialisations;
      const tradeName = props.tradeListData?.find(
        (i: any) => i._id === allFiltersData?.tradeId?.[0]
      )?.trade_name;
      const specializationName = specializationList?.find(
        (i: any) => i._id === allFiltersData?.specializationId?.[0]
      )?.name;
      if (specializationName) {
        data = {
          ...data,
          // searchJob: specializationName
          searchJob:
            allFiltersData?.specializationId?.length ===
            specializationList?.length
              ? tradeName
              : specializationName,
          ...(allFiltersData?.specializationId?.length ===
          specializationList?.length
            ? { isAllFilterSpecs: true }
            : { isAllFilterSpecs: false }),
        };
        setIsAllFilterSpecs(
          specializationList?.length > 0 &&
            allFiltersData?.specializationId?.length ===
              specializationList?.length
            ? true
            : false
        );
      }
    }

    const newObjData = {
      page: 1,
      isFiltered: true,
      ...(data.sortBy && { sortBy: data.sortBy }),
      ...(data.tradeId && { tradeId: data.tradeId }),
      ...(data.specializationId && { specializationId: data.specializationId }),
      ...(data.from_date && { from_date: data.from_date }),
      ...(data.to_date && { to_date: data.to_date }),
      ...(data.jobTypes && { jobTypes: data.jobTypes }),
      ...(data.min_budget >= 0 &&
        data.max_budget > 0 && { pay_type: data.pay_type }),
      ...(data.min_budget >= 0 &&
        data.max_budget > 0 && { min_budget: data.min_budget }),
      ...(data.min_budget >= 0 &&
        data.max_budget > 0 && { max_budget: data.max_budget }),
      ...((data.address || allFiltersData.sortBy === 2) && {
        location: {
          coordinates: [
            data.long ? data.long : data.defaultLong,
            data.lat ? data.lat : data.defaultLat,
          ],
        },
      }),
      // ...(data.addres && data.address && { address: data.address })
    };
    Object.keys(data).forEach(
      (key) =>
        (data[key] === undefined ||
          data[key] === null ||
          data[key] === 0 ||
          data[key] === "0") &&
        delete data[key]
    );
    var url = "search-job-results?";
    for (let [key, value] of Object.entries(data)) {
      console.log(key, value);
      url += `${key}=${value}&`;
    }
    const newUrl = url.slice(0, url.length - 1);
    props.postHomeSearchData(newObjData);
    const mData = {
      timeStamp: moengage.getCurrentTimeStamp(),
      category: props.tradeListData?.find(
        (i: any) => i._id === newObjData?.tradeId?.[0]
      )?.trade_name,
      ...(newObjData.address && {
        location: `${JSON.parse(newObjData.address)?.mainText} ${
          JSON.parse(newObjData.address)?.secondaryText
        }`,
      }),
      ...(newObjData?.max_budget && { "Max budget": newObjData?.max_budget }),
      ...(newObjData?.from_date && { "start date": newObjData?.from_date }),
      ...(newObjData?.to_date && { "end date": newObjData?.to_date }),
    };
    moengage.moE_SendEvent(MoEConstants.SEARCHED_FOR_JOBS, mData);
    mixPanel.mixP_SendEvent(MoEConstants.SEARCHED_FOR_JOBS, mData);

    props.history.replace(newUrl);
    setJobListData([]);
    setParamsData(data);
    setApiRequestData(newObjData);
    setSearchResultData((prevData: any) => ({
      ...prevData,
      page: 1,
      searchByFilter: true,
    }));
    setHasMoreItems(true);
    console.log(
      newUrl,
      "newUrl",
      data,
      "data",
      newObjData,
      "newObjData",
      newParamsData
    );
  };

  // const cleanFiltersHandler = (isFiltersClean: boolean) => {
  //     setSearchResultData((prevData: any) => ({ ...prevData, cleanFiltersData: isFiltersClean }));
  //     if (isFiltersClean) { getQueryParamsData(); }
  // }

  const refreshParams = (data: any) => {
    setJobListData([]);
    getQueryParamsData();
    setApiRequestData(data);
    setSearchResultData((prevData: any) => ({
      ...prevData,
      page: 1,
      cleanFiltersData: true,
    }));
    setHasMoreItems(true);
  };

  const handleChangeToggle = (value: boolean) => {
    setToggleModifySearch(value);
  };

  return (
    <InfiniteScroll
      dataLength={jobListData.length}
      next={callJobList}
      hasMore={true}
      loader={<h4></h4>}
    >
      <div className="app_wrapper">
        <div className={`top_search ${isToggleModifySearch ? "active" : ""}`}>
          <BannerSearch
            {...props}
            handleChangeToggle={handleChangeToggle}
            paramsData={paramsData}
            refreshParams={refreshParams}
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
                      setToggleModifySearch(true);
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
                    {/* <span className="title">{paramsData.jobResults == 'viewNearByJob' ? 'All around me' : paramsData.jobResults == 'jobTypeList' ? paramsData.heading : paramsData.searchJob ? `${paramsData.searchJob}${paramsData.specializationId?.length == 2 ? ' + 1 other' : paramsData.specializationId?.length >= 3 ? ` + ${paramsData.specializationId?.length - 1} others` : ''}` : ''} */}
                    <span className="title">
                      {paramsData?.tradeId?.length > 0 && !paramsData?.searchJob
                        ? ""
                        : paramsData.jobResults === "viewNearByJob"
                        ? "All around me"
                        : paramsData.jobResults === "jobTypeList"
                        ? paramsData.heading
                        : isAllFilterSpecs
                        ? paramsData.searchJob
                        : paramsData.searchJob
                        ? `${paramsData.searchJob}${
                            paramsData.specializationId?.length >= 2
                              ? ` +${paramsData.specializationId?.length - 1}`
                              : ""
                          }`
                        : ""}
                      <span className="count">{`${
                        jobListData.length || 0
                      } result(s)`}</span>
                    </span>
                    <SearchResultFilters
                      searchByFilter={searchByFilter}
                      cleanFiltersData={searchResultData.cleanFiltersData}
                      history={props?.history}
                    />
                  </div>
                  {jobListData.length > 0 && !mapData.showMap && (
                    <div className="flex_col_sm_4 text-right">
                      <a
                        className="map_btn"
                        onClick={() =>
                          setMapData((prevData: any) => ({
                            ...prevData,
                            showMap: !prevData.showMap,
                          }))
                        }
                      >
                        <img src={mapIcon} alt="map" /> Map
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex_row tradies_row">
                {/* If the map does not come, then this div not only class (card_col) will be hidden */}
                {mapData.showMap ? (
                  <div className="card_col">
                    {jobListData.length > 0 ? (
                      jobListData.map((jobData: any) => {
                        return (
                          <TradieJobInfoBox
                            item={jobData}
                            {...props}
                            key={jobData.jobId}
                          />
                        );
                      })
                    ) : (
                      <div className="no_record">
                        <figure className="no_img">
                          <img src={noData} alt="data not found" />
                        </figure>
                        <span>No Data Found</span>
                      </div>
                    )}
                  </div>
                ) : jobListData.length > 0 || props.isLoading ? (
                  jobListData.map((jobData: any) => {
                    return (
                      <TradieJobInfoBox
                        item={jobData}
                        {...props}
                        key={jobData.jobId}
                      />
                    );
                  })
                ) : (
                  <div className="no_record">
                    <figure className="no_img">
                      <img src={noData} alt="data not found" />
                    </figure>
                    <span>No Data Found</span>
                  </div>
                )}
                {
                  <div
                    className="map_col"
                    style={!mapData.showMap ? { display: "none" } : {}}
                  >
                    <div className="map_stick">
                      <span
                        className="close_map"
                        onClick={() =>
                          setMapData((prevData: any) => ({
                            ...prevData,
                            showMap: !prevData.showMap,
                          }))
                        }
                      >
                        <img src={closeMap} alt="close-map" />
                      </span>
                      <RenderMap
                        {...props}
                        searchByFilter={searchResultData.searchByFilter}
                      />
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </InfiniteScroll>
  );
};

export default TradieSearchJobResult;
