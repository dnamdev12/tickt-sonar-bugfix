import React, { useState, useEffect } from "react";
import Constants,{ MoEConstants } from "../../utils/constants";
import { useDetectClickOutside } from "react-detect-click-outside";
import { deleteRecentSearch } from "../../redux/homeSearch/actions";
import { setShowToast } from "../../redux/common/actions";
// @ts-ignore
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
// @ts-ignore
import { format, differenceInCalendarYears } from "date-fns";
// @ts-ignore
import moment from "moment";
// @ts-ignore
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Geocode from "react-geocode";

import Searchicon from "../../assets/images/main-search.png";
import search from "../../assets/images/ic-search.png";
import Location from "../../assets/images/ic-location.png";
import cross from "../../assets/images/close-black.png";
import icgps from "../../assets/images/ic-gps.png";
import residential from "../../assets/images/ic-residential.png";
import close from "../../assets/images/icon-close-1.png";
import { moengage, mixPanel } from "../../services/analyticsTools";

Geocode.setApiKey(Constants.SocialAuth.GOOGLE_GEOCODE_KEY);
Geocode.setLanguage("en");
Geocode.setRegion("au");
interface PropsType {
  history: any;
  location?: any;
  paramsData?: any;
  currentCoordinates?: any;
  searchJobListData: Array<any>;
  recentSearchJobData: Array<any>;
  recentLocationData: Array<any>;
  homeSearchJobData: Array<any>;
  tradeListData: Array<any>;
  setTradieHomeData?: (data: any) => void;
  getSearchJobList: (data: any) => void;
  postHomeSearchData: (data: any) => void;
  getRecentSearchList: () => void;
  getRecentLocationList: () => void;
  refreshParams?: (data: any) => void;
  handleChangeToggle?: (data: boolean) => void;
}

const TradieBannerSearch = (props: PropsType) => {
  const { paramsData } = props;
  const [stateData, setStateData] = useState<any>({
    page: 1,
    searchedJob: "",
    isFiltered: false,
    isSearchedJobSelected: false,
    tradeId: [],
    specializationId: [],
    searchedJobId: null,
    location: {
      coordinates: [
        144.9631, //long
        -37.8136, //lat
      ],
    },
    bannerLocation: "",
    locationDenied: false,
    selectedMapLocation: "",
    isMapLocationSelected: false,
    from_date: "",
    startDate: "",
    to_date: "",
    endDate: "",
  });
  const [inputFocus1, setInputFocus1] = useState<boolean>(false);
  const [inputFocus2, setInputFocus2] = useState<boolean>(false);
  const [inputFocus3, setInputFocus3] = useState<boolean>(false);
  const [calenderRange1, setCalenderRange1] = useState<any>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection1",
  });


  const handleOnOutsideSearch = () => setInputFocus1(false);
  const handleOnOutsideLocation = () => setInputFocus2(false);
  const handleOnOutsideCalender = () => setInputFocus3(false);

  const searchRef = useDetectClickOutside({
    onTriggered: handleOnOutsideSearch,
  });
  const locationRef = useDetectClickOutside({
    onTriggered: handleOnOutsideLocation,
  });
  const calenderRef = useDetectClickOutside({
    onTriggered: handleOnOutsideCalender,
  });

  const [suggestionSelected, setSuggestion] = useState<any>("");

  console.log(inputFocus1, inputFocus2, inputFocus3, "inputfocus---------");

  useEffect(() => {
    props.getRecentSearchList();
    props.getRecentLocationList();
  }, []);

  useEffect(() => {
    if (paramsData) {
      var data = {
        page: paramsData?.page ? paramsData?.page : 1,
        searchedJob:
          paramsData?.isFilterOn === "isFilterOn"
            ? ""
            : paramsData?.jobResults === "jobTypeList"
            ? ""
            : paramsData?.isAllFilterSpecs
            ? paramsData.searchJob
            : paramsData?.specializationId?.length >= 2
            ? `${paramsData?.searchJob} +${
                paramsData?.specializationId?.length - 1
              }`
            : paramsData?.tradeId?.length > 0
            ? paramsData.searchJob
            : "",
        isFiltered: paramsData?.isFiltered ? paramsData?.isFiltered : false,
        isSearchedJobSelected:
          paramsData?.specializationId?.length > 1 ? false : true,
        tradeId: paramsData?.tradeId ? paramsData?.tradeId : [],
        specializationId: paramsData?.specializationId
          ? paramsData?.specializationId
          : [],
        location: {
          coordinates: [
            paramsData?.long ? paramsData?.long : paramsData?.defaultLong,
            paramsData?.lat ? paramsData?.lat : paramsData?.defaultLat,
          ],
        },
        selectedMapLocation: paramsData?.addres ? paramsData?.addres : "",
        isMapLocationSelected: paramsData?.addres ? true : false,
        from_date: paramsData?.from_date ? paramsData?.from_date : "",
        startDate: "",
        to_date: paramsData?.to_date ? paramsData?.to_date : "",
        endDate: "",
      };
      if (paramsData?.from_date || paramsData?.to_date) {
        const differenceInYears: number = differenceInCalendarYears(
          new Date(),
          paramsData?.to_date
        );
        if (differenceInYears !== 0) {
          data.startDate = moment(paramsData?.from_date).format("DD MMM YYYY");
          data.endDate = moment(paramsData?.to_date).format("DD MMM YYYY");
        } else {
          data.startDate = moment(paramsData?.from_date).format("DD MMM");
          data.endDate = moment(paramsData?.to_date).format("DD MMM");
        }
      }
      setStateData((prevData: any) => ({ ...prevData, ...data }));
    }
  }, [paramsData]);

  useEffect(() => {
    if (calenderRange1 && inputFocus3) {
      const differenceInYears: number = differenceInCalendarYears(
        new Date(),
        calenderRange1.endDate
      );
      var startDate: string;
      var endDate: string;
      if (differenceInYears !== 0) {
        startDate = format(new Date(calenderRange1.startDate), "dd MMM yyyy");
        endDate = format(new Date(calenderRange1.endDate), "dd MMM yyyy");
      } else {
        startDate = format(new Date(calenderRange1.startDate), "dd MMM");
        endDate = format(new Date(calenderRange1.endDate), "dd MMM");
      }
      const from_date = format(
        new Date(calenderRange1.startDate),
        "yyyy-MM-dd"
      );
      const to_date = format(new Date(calenderRange1.endDate), "yyyy-MM-dd");
      setStateData((prevData: any) => ({
        ...prevData,
        startDate: startDate,
        endDate: endDate,
      }));
      setStateData((prevData: any) => ({
        ...prevData,
        from_date: from_date,
        to_date: to_date,
      }));
    }
  }, [calenderRange1]);

  useEffect(() => {
    if (props.currentCoordinates) {
      setStateData((prevData: any) => ({
        ...prevData,
        location: props.currentCoordinates,
      }));
    }
  }, [props.currentCoordinates]);

  const handleCalenderRange = (item: any) => {
    setCalenderRange1(item.selection1);
  };

  const handleJobChange = (e: any) => {
    e.target.value.length >= 3 && props.getSearchJobList(e.target.value);
    setStateData((prevData: any) => ({
      ...prevData,
      searchedJob: e.target.value,
      isSearchedJobSelected: false,
    }));
  };

  const cleanInputData = (item: string) => {
    if (item === "calender") {
      setStateData((prevData: any) => ({
        ...prevData,
        from_date: "",
        to_date: "",
        startDate: "",
        endDate: "",
      }));
      return;
    }
    if (item == "searchedJob") {
      setStateData((prevData: any) => ({
        ...prevData,
        [item]: "",
        isSearchedJobSelected: false,
      }));
    }
    setStateData((prevData: any) => ({ ...prevData, [item]: "" }));
  };

  const searchedJobClicked = (item: any, isRecentSearchesClicked?: string) => {
    setStateData((prevData: any) => ({
      ...prevData,
      searchedJob: item.name,
      tradeId: [item._id],
      specializationId: [item.specializationsId],
      isSearchedJobSelected: true,
      isFirstJobSelectedCount: 1,
    }));
    setInputFocus1(false);
    if (isRecentSearchesClicked === "isRecentSearchesClicked") {
      const newSearchData = {
        tradeId: [item._id],
        specializationId: [item.specializationsId],
        searchedJob: item.name,
        isRecentSearchesClicked: "isRecentSearchesClicked",
      };
      bannerSearchClicked(newSearchData);
    }
  };

  const cleanRecentSearch = async (event: any, recentSearchId: string) => {
    event.stopPropagation();
    const data = {
      id: recentSearchId,
      status: 0,
    };
    const res = await deleteRecentSearch(data);
    if (res.success) {
      props.getRecentSearchList();
    }
  };

  const recentJobSearches = () => {
    return (
      props.recentSearchJobData?.length > 0 && (
        <div className="custom_autosuggestion" id="recent-job-search-div">
          <span className="sub_title">Recent searches</span>
          <div className="flex_row recent_search">
            {props.recentSearchJobData?.slice(0, 4)?.map((item: any) => {
              return (
                <div className="flex_col_sm_3" key={item.recentSearchId}>
                  <div
                    className="card ico_txt_wrap"
                    onClick={() =>
                      searchedJobClicked(item, "isRecentSearchesClicked")
                    }
                  >
                    <figure className="ico">
                      <img src={item?.image || residential} alt="icon" />
                    </figure>
                    <div className="f_column">
                      <span>{item.name}</span>
                      <span className="name">{item.trade_name}</span>
                    </div>
                    <span
                      className="remove_card"
                      onClick={(event) =>
                        cleanRecentSearch(event, item.recentSearchId)
                      }
                    >
                      <img src={close} alt="remove" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )
    );
  };

  const renderJobResult = () => {
    return (
      props.searchJobListData?.length > 0 &&
      stateData.searchedJob.length >= 3 && (
        <div
          className="custom_autosuggestion"
          id="fetched-custom-job-category-div"
        >
          <div className="recent_search">
            <ul className="drop_data">
              {props.searchJobListData?.map((item: any) => {
                return (
                  <li key={item._id} onClick={() => searchedJobClicked(item)}>
                    <figure className="category">
                      <img
                        src={item.image ? item.image : residential}
                        alt="icon"
                      />
                    </figure>
                    <div className="details">
                      <span className="name">{item.name}</span>
                      <span className="prof">{item.trade_name}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )
    );
  };

  const locationSelectedHandler = (
    address: string,
    placeId?: any,
    suggestion?: any
  ) => {
    setSuggestion(suggestion?.formattedSuggestion);
    geocodeByAddress(address)
      .then((results: any) => getLatLng(results[0]))
      .then(({ lat, lng }: any) => {
        const locationNew: any = {
          location: {
            coordinates: [lng, lat],
          },
        };
        setStateData((prevData: any) => ({
          ...prevData,
          ...locationNew,
          selectedMapLocation: suggestion?.formattedSuggestion?.mainText,
          isMapLocationSelected: true,
        }));
        setInputFocus2(false);
      });
  };

  const filterFromAddress = (results: any) => {
    let city,
      state,
      country = null;
    for (let i = 0; i < results[0].address_components.length; i++) {
      for (let j = 0; j < results[0].address_components[i].types.length; j++) {
        switch (results[0].address_components[i].types[j]) {
          case "locality":
            city = results[0].address_components[i].long_name;
            break;
          case "administrative_area_level_1":
            state = results[0].address_components[i].long_name;
            break;
          case "country":
            country = results[0].address_components[i].long_name;
            break;
        }
      }
    }
    return { city, state, country: country.toLowerCase() };
  };

  const getCurrentLocation = (e: any) => {
    e.preventDefault();
    const showPosition = (position: any) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      var latlng = new google.maps.LatLng(lat, long);
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latlng }, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
          alert(status);
        }
        if (status === google.maps.GeocoderStatus.OK) {
          const { country } = filterFromAddress(results);
          if (["australia", "au"].includes(country)) {
            setInputFocus2(false);
            if (results && Array.isArray(results) && results[0]) {
              setStateData((prevData: any) => ({
                ...prevData,
                selectedMapLocation: results[0].formatted_address,
                isMapLocationSelected: true,
                locationDenied: false,
              }));
            }
          } else {
            setInputFocus2(false);
            setShowToast(
              true,
              "Uh Oh! We don't provide service currently in your Location"
            );
          }
        }
      });
    };

    const showError = (error: any) => {
      if (error.code === error.PERMISSION_DENIED) {
        setStateData((prevData: any) => ({
          ...prevData,
          bannerLocation: "",
          locationDenied: true,
        }));
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
  };

  const validateForm = (type?: string) => {
    if (
      type === "isRecentSearchesClicked" &&
      props.history?.location?.pathname === "/"
    ) {
      return true;
    }
    const newErrors: any = {};
    if (!stateData?.isSearchedJobSelected) {
      newErrors.searchedJob = Constants.errorStrings.bannerSearchJob;
    } else if (!stateData?.searchedJob) {
      newErrors.searchedJob = Constants.errorStrings.bannerSearchJobEmpty;
    }
    if (!stateData?.isMapLocationSelected && stateData?.selectedMapLocation) {
      newErrors.selectedMapLocation =
        Constants.errorStrings.bannerSearchLocation;
    }
    if (type === "showErrorToast") {
      return newErrors;
    }
    // setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  const bannerSearchClicked = (newSearchData?: any) => {
    const newErrors = validateForm(
      newSearchData?.isRecentSearchesClicked
        ? newSearchData?.isRecentSearchesClicked
        : "showErrorToast"
    );
    if (!!newErrors.searchedJob || !!newErrors.selectedMapLocation) {
      if (!!newErrors.searchedJob) {
        setShowToast(true, "Please select job type from the list");
        return;
      }
      if (!!newErrors.selectedMapLocation) {
        setShowToast(true, "Please select location from the list");
        return;
      }
    }
    if (validateForm(newSearchData?.isRecentSearchesClicked)) {
      const params = new URLSearchParams(props.location?.search);
      const queryParamsData: any = {
        defaultLat: Number(params.get("defaultLat")),
        defaultLong: Number(params.get("defaultLong")),
      };
      const data = {
        page: stateData.page,
        isFiltered: false,
        ...(suggestionSelected && {
          address: JSON.stringify(suggestionSelected),
        }),
        tradeId: newSearchData?.tradeId
          ? newSearchData?.tradeId
          : stateData?.tradeId,
        ...(stateData.isMapLocationSelected && {
          location: stateData?.location,
        }),
        specializationId: newSearchData?.specializationId
          ? newSearchData?.specializationId
          : stateData?.specializationId,
        ...(stateData?.from_date && { from_date: stateData?.from_date }),
        ...(stateData?.to_date && { to_date: stateData?.to_date }),
      };
      if (props?.location?.pathname === "/search-job-results") {
        props.postHomeSearchData(data);
        const mData = {
          timeStamp: moengage.getCurrentTimeStamp(),
          category: props.tradeListData?.find(
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
      const newData = {
        ...data,
        lat: stateData.location.coordinates[1],
        long: stateData.location.coordinates[0],
        defaultLat: props.currentCoordinates?.coordinates[1]
          ? props.currentCoordinates?.coordinates[1]
          : queryParamsData.defaultLat,
        defaultLong: props.currentCoordinates?.coordinates[0]
          ? props.currentCoordinates?.coordinates[0]
          : queryParamsData.defaultLong,
        ...(stateData.selectedMapLocation && {
          addres: stateData.selectedMapLocation.replaceAll("#", ""),
        }),
        searchJob: newSearchData?.searchedJob
          ? newSearchData?.searchedJob.replaceAll("&", "xxx")
          : stateData?.searchedJob.replaceAll("&", "xxx"),
        jobResults: null,
      };
      if (
        props?.location?.pathname === "/search-job-results" &&
        newData.address
      ) {
        setTimeout(() => {
          props.getRecentLocationList();
        }, 500);
      }
      delete newData.location;
      delete newData.isFilterOn;
      if (newData.searchJob) {
        delete newData.heading;
        delete newData.jobResults;
      }
      Object.keys(newData).forEach(
        (key) =>
          (newData[key] === "" ||
            newData[key] === undefined ||
            newData[key] === null ||
            newData[key] === 0 ||
            newData[key] == "0") &&
          delete newData[key]
      );
      var url = "search-job-results?";
      for (let [key, value] of Object.entries(newData)) {
        url += `${key}=${value}&`;
      }
      const newUrl = url.slice(0, url.length - 1);
      console.log(newUrl, "newUrl", data, "data", newData, "newData");
      if (props.history?.location?.pathname === "/") {
        props.history.push(newUrl);
      } else {
        props.history.replace(newUrl);
        if (props?.refreshParams) {
          props?.refreshParams(data);
        }
      }
    }
  };

  const renderPlacesData = ({
    getInputProps,
    suggestions,
    getSuggestionItemProps,
    loading,
  }: any) => (
    <React.Fragment>
      <div className="text_field">
        <input
          {...getInputProps({ placeholder: "Where?", className: "line-1" })}
          id="location-input-tag"
          onFocus={() => {
            setInputFocus2(true);
            setInputFocus1(false);
            setInputFocus3(false);
          }}
        />
        <span className="detect_icon_ltr">
          <img src={Location} alt="location" />
        </span>
        {stateData?.selectedMapLocation && inputFocus2 && (
          <span className="detect_icon">
            <img
              src={cross}
              alt="cross"
              onClick={() => {
                setSuggestion("");
                setStateData((prevData: any) => ({
                  ...prevData,
                  selectedMapLocation: "",
                  isMapLocationSelected: false,
                }));
              }}
            />
          </span>
        )}
        {/* {!!errors.selectedMapLocation && <span className="error_msg">{errors.selectedMapLocation}</span>} */}
      </div>
      {suggestions?.length > 0 &&
      stateData?.selectedMapLocation.length >= 3 &&
      inputFocus2 ? (
        <div
          className="custom_autosuggestion location"
          id="autocomplete-dropdown-container"
        >
          <div className="flex_row recent_search auto_loc">
            <div className="flex_col_sm_4">
              {loading && <div>Loading...</div>}

              {suggestions.map((suggestion: any) => {
                const className = "autosuggestion_icon card loc name";
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                    key={suggestion.formattedSuggestion.mainText}
                  >
                    <span>{suggestion.formattedSuggestion.mainText}</span>
                    <span className="name">
                      {suggestion.formattedSuggestion.secondaryText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : !loading &&
        !stateData?.isMapLocationSelected &&
        stateData?.selectedMapLocation.length >= 3 &&
        inputFocus2 &&
        suggestions?.length < 1 ? (
        <div
          style={{ minHeight: "50px" }}
          className="custom_autosuggestion location"
          id="autocomplete-dropdown-container"
        >
          <div className="flex_row recent_search auto_loc">
            <div className="flex_col_sm_4">
              <div className="loc_suggestions">{"No Result Found."}</div>
            </div>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );

  return (
    <div className="home_search">
      <button
        className="modal_srch_close"
        onClick={() => {
          if (props?.handleChangeToggle) {
            props.handleChangeToggle(false);
          }
        }}
      >
        <img src={close} alt="close" />
      </button>
      <form
        className={`search_wrapr ${
          props.history?.location?.pathname === "/"
            ? stateData?.isFirstJobSelectedCount
              ? ""
              : "first_input"
            : ""
        }`}
      >
        <ul>
          <li className="categ_box">
            <div className="text_field" id="text-field-div">
              <input
                type="text"
                ref={searchRef}
                placeholder="What jobs are you after?"
                value={stateData?.searchedJob}
                onChange={handleJobChange}
                onFocus={() => {
                  setInputFocus1(true);
                  setInputFocus2(false);
                  setInputFocus3(false);
                }}
              />
              <div className="border_eff"></div>
              <span className="detect_icon_ltr">
                <img src={Searchicon} alt="search" />
              </span>
              {!!stateData?.searchedJob && inputFocus1 && (
                <span className="detect_icon">
                  <img
                    src={cross}
                    alt="cross"
                    onClick={() => cleanInputData("searchedJob")}
                  />
                </span>
              )}
            </div>
          </li>
          {!stateData?.searchedJob &&
            inputFocus1 &&
            !inputFocus2 &&
            recentJobSearches()}
          {stateData?.searchedJob?.length >= 1 &&
            inputFocus1 &&
            !inputFocus2 &&
            renderJobResult()}
          <li
            ref={locationRef}
            className="loc_box"
            style={{ display: "block" }}
          >
            <div id="location-text-field-div">
              <PlacesAutocomplete
                value={
                  stateData?.selectedMapLocation !== "{}"
                    ? stateData?.selectedMapLocation
                    : ""
                }
                onChange={(city: string) =>
                  setStateData((prevData: any) => ({
                    ...prevData,
                    selectedMapLocation: city,
                    isMapLocationSelected: false,
                  }))
                }
                shouldFetchSuggestions={true}
                onSelect={locationSelectedHandler}
                highlightFirstSuggestion={true}
                searchOptions={{
                  componentRestrictions: { country: "au" },
                  types: ["(cities)"],
                }}
              >
                {renderPlacesData}
              </PlacesAutocomplete>
            </div>
            {(!stateData?.selectedMapLocation ||
              stateData?.selectedMapLocation === "{}") &&
              inputFocus2 && (
                <div
                  className="custom_autosuggestion location"
                  id="current-location-search-div"
                >
                  <a className="location-btn" onClick={getCurrentLocation}>
                    <span className="gps_icon">
                      <img src={icgps} />
                    </span>{" "}
                    Use my current location
                  </a>
                  {stateData?.locationDenied && (
                    <span className="blocked_note">
                      You have blocked your location. To use this, change your
                      location settings in browser.
                    </span>
                  )}
                  <div className="recent_search auto_loc">
                    {console.log({
                      recent: props?.recentLocationData,
                    })}
                    {props?.recentLocationData?.length > 0 ? (
                      <span className="sub_title">Recent searches</span>
                    ) : null}
                    <div className="flex_row">
                      {props?.recentLocationData?.map((item: any) => {
                        return (
                          item?.address?.length > 0 && (
                            <div
                              className="flex_col_sm_4"
                              onClick={() => {
                                setStateData((prevData: any) => ({
                                  ...prevData,
                                  location: item.location,
                                  selectedMapLocation: JSON.parse(item?.address)
                                    ?.mainText, //item.allText?.mainText,
                                  isMapLocationSelected: true,
                                }));
                                setSuggestion(JSON.parse(item?.address));
                              }}
                            >
                              <div className="autosuggestion_icon card loc name">
                                <span>
                                  {JSON.parse(item?.address)?.mainText}
                                </span>
                                <span className="name">
                                  {JSON.parse(item?.address)?.secondaryText}
                                </span>
                              </div>
                            </div>
                          )
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
          </li>
          <li
            className={`date_box ${stateData.startDate ? "date_value" : ""}`}
            style={{ display: "block" }}
          >
            <div
              ref={calenderRef}
              className="custom_date_range"
              id="date-range-div"
            >
              <div className="text_field">
                <span className="detect_icon_ltr calendar"></span>
                <input
                  type="text"
                  id="calender-input"
                  placeholder={
                    stateData?.startDate
                      ? `${stateData?.startDate} - ${stateData?.endDate}`
                      : "When?"
                  }
                  onFocus={() => {
                    setInputFocus3(true);
                    setInputFocus1(false);
                    setInputFocus2(false);
                  }}
                />
                {stateData?.startDate && inputFocus3 && (
                  <span className="detect_icon">
                    <img
                      src={cross}
                      alt="cross"
                      onClick={() => cleanInputData("calender")}
                    />
                  </span>
                )}
              </div>
              {inputFocus3 && (
                <div
                  className="custom_autosuggestion"
                  id="custom-date-range-div"
                >
                  <DateRange
                    onChange={handleCalenderRange}
                    ranges={[calenderRange1]}
                    moveRangeOnFirstSelection={false}
                    rangeColors={["#fee600", "#b5b5b5"]}
                    showDateDisplay={false}
                    showSelectionPreview={true}
                    months={2}
                    showPreview={true}
                    minDate={new Date()}
                    maxDate={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() + 2)
                      )
                    }
                    direction="horizontal"
                    fixedHeight={true}
                  />
                </div>
              )}
            </div>
          </li>
          <div className="search_btn">
            <button
              type="button"
              className="fill_btn btn-effect"
              onClick={bannerSearchClicked}
            >
              <img src={search} alt="search" />
            </button>
          </div>
        </ul>
      </form>
    </div>
  );
};

export default TradieBannerSearch;
