import React, { useState, useEffect } from "react";
import Constants,{ MoEConstants }  from "../../utils/constants";
// @ts-ignore
import PlacesAutocomplete from "react-places-autocomplete";
// @ts-ignore
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import Searchicon from "../../assets/images/main-search.png";
import search from "../../assets/images/ic-search.png";
import Location from "../../assets/images/ic-location.png";
import cross from "../../assets/images/close-black.png";
import icgps from "../../assets/images/ic-gps.png";
import residential from "../../assets/images/ic-residential.png";
import close from "../../assets/images/icon-close-1.png";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getSearchJobList,
  getRecentSearchList,
  postHomeSearchData,
  getRecentLocationList,
} from "../../redux/homeSearch/actions";
import { isHandleChanges } from "../../redux/jobs/actions";
// @ts-ignore
import { useDetectClickOutside } from "react-detect-click-outside";
import moment from "moment";
import Geocode from "react-geocode";
import { setShowToast } from "../../redux/common/actions";
import { deleteRecentSearch } from "../../redux/homeSearch/actions";

import { renderTimeWithCustomFormat } from "../../utils/common";
import { moengage, mixPanel } from "../../services/analyticsTools";

Geocode.setApiKey(Constants.SocialAuth.GOOGLE_GEOCODE_KEY);
Geocode.setLanguage("en");

interface PropsType {
  history: any;
  location?: any;
  bannerData: any;
  selectedItem: any;
  selectedTrade: any;
  current_address: any;
  getTitleInfo: any;
  searchText: any;
  stateData: any;
  addressText: any;
  selectedAddress: any;
  isHandleChanges: (item: any) => void;
  localChanges: boolean;
  searchJobListData: Array<object>;
  recentSearchJobData: Array<object>;
  homeSearchJobData: Array<object>;
  setBannerData: (data: any) => void;
  getSearchJobList: (data: any) => void;
  postHomeSearchData: (data: any) => void;
  handleChangeToggle?: (data: any) => void;
  getRecentSearchList?: () => void;
  getRecentLocationList: () => void;
  localInfo: any;
  recentLocationData: Array<any>;
  tradeListData: Array<any>;
  showOnlyTradeName: boolean;
}

const example_calender = { startDate: "", endDate: "", key: "selection1" };

export function useStateFromProp(initialValue: any) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => setValue(initialValue), [initialValue]);

  return [value, setValue];
}

const BannerSearch = (props: PropsType) => {

  const {
    isHandleChanges,
    getRecentSearchList,
    getRecentLocationList,
  } = props;

  const [checkOnChange, setOnChange] = useState(false);
  const [showOnlyTradeName, setShowOnlyTradeName] = useState(false);

  const [locationStatus, setLocationStatus] = useState(null);
  const [stateData, setStateData] = useState<any>(null);
  const [searchText, setSearchText] = useState("");
  const [addressText, setAddressText] = useState<any>(null);
  const [recentLocation, setRecentLocation] = useState<any>([]); // recentLocation
  const [selectedAddress, setSelectedAddress] = useState({});
  const [enableCurrentLocation, setCurrentLocations] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [selectedTrade, setSelectedTrade] = useState({});

  const [inputFocus1, setInputFocus1] = useState<boolean>(false);
  const [inputFocus2, setInputFocus2] = useState<boolean>(false);
  const [inputFocus3, setInputFocus3] = useState<boolean>(false);

  const [calenderRange1, setCalenderRange1] = useState<any>(example_calender);

  const [suggestionSelected, setSuggestion] = useState({});

  const handleOnOutsideSearch = () => {
    setOnChange(false);
    setInputFocus1(false);
  };
  const handleOnOutsideLocation = () => setInputFocus2(false);
  const handleOnOutsideCalender = () => setInputFocus3(false);

  const searchRef = useDetectClickOutside({
    onTriggered: handleOnOutsideSearch,
  });
  const locationRef = useDetectClickOutside({
    onTriggered: () => {
      handleOnOutsideLocation();
    },
  });

  const calenderRef = useDetectClickOutside({
    onTriggered: handleOnOutsideCalender,
  });

  const [sortBy, setSortBy] = useState(0);

  const handleCalenderRange = (item: any) => {
    setCalenderRange1(item.selection1);
    console.log({
      localInfo: props.localInfo,
    });
    props.getTitleInfo({
      ...props.localInfo,
      from_date: moment(item.selection1?.startDate).format("YYYY-MM-DD"),
      to_date: moment(item.selection1?.endDate).format("YYYY-MM-DD"),
    });
  };

  const [checkRender, setRender] = useState(false);

  useEffect(() => {
    console.log({ selectedAddress }, "!!@");
  }, [selectedAddress]);

  useEffect(() => {
    let state = props.location.state;
    let local_info: any = props.localInfo;

    if (!searchText?.length && !checkRender) {
      setSearchText(state.name);
      setStateData({
        createdAt: null,
        image: null,
        name: state?.name,
        specializationsId: state?.specializations,
        trade_name: state?.name,
        _id: state?.tradeId,
      });

      if (state.calender && Object.keys(state.calender).length) {
        setCalenderRange1(state.calender);
      }

      if (state?.location && state?.location?.coordinates?.length) {
        let coordinates = state.location.coordinates;
        let valueItem = {
          lat: coordinates[1],
          lng: coordinates[0],
        };
        setSelectedAddress(valueItem);
      }

      if (state?.address) {
        setAddressText(state.address);
      }
      setRender(true);
    }
    // doingLocalChanges
    // when this option true it the props will set.
    if (Object.keys(local_info).length && !local_info?.doingLocalChanges) {
      if (searchText?.length !== local_info?.name) {
        if (local_info?.sortBy) {
          setSortBy(local_info?.sortBy);
        }

        if (!local_info?.isTradeName) {
          setSearchText(local_info.name);
        } else {
          setSearchText("");
        }

        setStateData({
          createdAt: null,
          image: null,
          name: local_info?.name,
          specializationsId: local_info?.specializationId,
          trade_name: null,
          _id: local_info?.tradeId,
        });
      }
    }
  }, [props]);

  useEffect(() => {
    if ((!addressText || !addressText?.length) && inputFocus2) {
      setSelectedAddress({});
      setSelectedTrade({});
    }

    if (!addressText?.length) {
      fetchItemsSearchWithLocation(1);
    }
  }, [addressText]);

  useEffect(() => {
    fetchItemsSearchWithLocation();
    setShowOnlyTradeName(props.showOnlyTradeName);
  }, []);

  const fetchItemsSearchWithLocation = (fetch?: any) => {
    if (getRecentSearchList && fetch !== 1) {
      getRecentSearchList();
    }
    if (getRecentLocationList) {
      getRecentLocationList();
    }
  };


  const updateGetTitleInfo = () => {
    props?.getTitleInfo({
      ...props?.localInfo,
      doingLocalChanges: true,
    });
  };

  useEffect(() => {
    updateGetTitleInfo();
    if (searchText?.length > 2) {
      props.getSearchJobList(searchText);
    }
    if (!searchText?.length) {
      setSelectedTrade({});
    }
  }, [searchText]);

  useEffect(() => {}, [selectedAddress]);


  const checkIfExist = (_id: any) => {
    if (selectedTrade) {
      let isLength = Object.keys(selectedTrade).length;
      if (isLength) {
        let item: any = selectedTrade;
        if (item?._id === _id) {
          return true;
        }
      }
    }
    return false;
  };

  const cleanRecentSearch = async (event: any, recentSearchId: string) => {
    event.stopPropagation();
    const data = {
      id: recentSearchId,
      status: 0,
    };
    const res = await deleteRecentSearch(data);
    if (res.success) {
      if (getRecentSearchList) {
        getRecentSearchList();
      }
    }
  };

  const recentJobSearches = () => {
    let props_Clone: any = props;
    let tradeListData = props_Clone.tradeListData;
    return (
      <>
        <div className="custom_autosuggestion" id="recent-job-search-div">
          {props?.recentSearchJobData?.length ? (
            <React.Fragment>
              <span className="sub_title">Recent searches</span>
              <div className="flex_row recent_search">
                {props.recentSearchJobData?.length > 0 &&
                  props.recentSearchJobData?.slice(0, 2).map((item: any) => {
                    return (
                      <div
                        className="flex_col_sm_3"
                        onClick={() => {
                          setItemSearch({
                            createdAt: item?.createdAt,
                            image: item.image,
                            name: item.name,
                            specializationsId: [item.specializationsId],
                            trade_name: item.trade_name,
                            _id: item._id,
                          });
                          setSelectedTrade({});
                        }}
                      >
                        <div className="card ico_txt_wrap">
                          <figure className="ico">
                            <img src={item?.image || residential} alt="icon" />
                          </figure>
                          <div className="f_column">
                            <span>{item.name}</span>
                            <span className="name">{item.trade_name}</span>
                          </div>
                          <span
                            className="remove_card"
                            onClick={(event) => {
                              cleanRecentSearch(event, item.recentSearchId);
                            }}
                          >
                            <img src={close} alt="remove" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </React.Fragment>
          ) : null}

          <div className="select_sphere recent_search">
            <span className="sub_title">{"Categories"}</span>
            <ul>
              {tradeListData?.map(
                ({
                  _id,
                  trade_name,
                  selected_url,
                  specialisations,
                }: {
                  _id: string;
                  trade_name: string;
                  selected_url: string;
                  specialisations: [];
                }) => (
                  <li
                    onClick={() => {
                      let item_spec: any = specialisations;
                      if (item_spec?.length) {
                        let getItem = item_spec[0];
                        if (getItem) {
                          setStateData({
                            image: selected_url,
                            name: getItem?.name,
                            specializationsId: specialisations.map(
                              (sp: any) => sp._id
                            ),
                            trade_name: trade_name,
                            _id: _id,
                          });
                          setSearchText(trade_name);
                        }
                        setShowOnlyTradeName(true);
                        setSelectedTrade({
                          _id,
                          trade_name,
                          selected_url,
                          specialisations,
                        });
                      }
                    }}
                    className={checkIfExist(_id) ? "active" : ""}
                  >
                    <figure>
                      <img src={selected_url} alt="" />
                    </figure>
                    <span className="name">{trade_name}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </>
    );
  };

  const renderJobResult = () => {
    if (props?.searchJobListData?.length) {
      return (
        <div
          className="custom_autosuggestion"
          id="fetched-custom-job-category-div"
        >
          <div className="recent_search">
            <ul className="drop_data">
              {props.searchJobListData?.map((item: any) => {
                return (
                  <li
                    onClick={() => {
                      setItemSearch(item);
                    }}
                  >
                    <figure className="category">
                      <img
                        src={item.image ? item.image : residential}
                        alt="icon"
                      />
                    </figure>
                    <div className="details">
                      <span className="name">{item.name || ""}</span>
                      <span className="prof">{item.trade_name || ""}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    }
    return null;
  };

  const onError = (status: string, clearSuggestions: Function) => {
    console.log("Google Maps API returned error with status: ", status);
    clearSuggestions();
  };

  const validateForm = () => {
    return true;
  };

  const setItemSearch = (item: any) => {
    setStateData(item);
    setSelectedTrade({});
    setSearchText(item?.name || "");
  };

  const bannerSearchClicked = () => {
    let selected_address: any = selectedAddress;
    let selected_item: any = props?.selectedItem;
    let props_trade: any = selected_item?.selectedTrade;
    let local_info: any = props?.localInfo;

    let suggestion_selected: any = local_info?.suggestionSelected;

    if (suggestion_selected) {
      suggestion_selected = JSON.stringify(local_info?.suggestionSelected);
    }

    if (suggestionSelected && Object.keys(suggestionSelected).length) {
      if (
        JSON.stringify(local_info?.suggestionSelected) !==
        JSON.stringify(suggestionSelected)
      ) {
        suggestion_selected = JSON.stringify(suggestionSelected);
      }
    }

    let tradeId: any = null;
    let specializationId: any = null;

    if (!local_info?.doingLocalChanges) {
      tradeId = Array.isArray(local_info?.tradeId)
        ? local_info?.tradeId
        : [local_info?.tradeId];
      specializationId = Array.isArray(local_info?.specializationId)
        ? local_info?.specializationId
        : [local_info?.specializationId];
    } else {
      if (Object.keys(stateData).length) {
        tradeId = Array.isArray(stateData._id)
          ? stateData._id
          : [stateData._id];
        specializationId = Array.isArray(stateData.specializationsId)
          ? stateData.specializationsId
          : [stateData.specializationsId];
      }
    }

    if (!stateData?._id && !props_trade?._id) {
      setShowToast(true, "Please enter the valid search text");
      return;
    }

    if (validateForm()) {
      let data: any = {
        page: 1,
        isFiltered: true,
        tradeId: tradeId,
        specializationId: specializationId,
      };

      if (!tradeId?.length) {
        setShowToast(true, "Please enter the valid search text");
        return;
      }

      if (!specializationId?.length) {
        delete data.specializationId;
      }

      if (sortBy > 0) {
        data["sortBy"] = sortBy;
      }

      if (Object.keys(selectedAddress).length) {
        data["location"] = {
          coordinates: [
            parseFloat(selected_address?.lng),
            parseFloat(selected_address?.lat),
          ],
        };

        if (suggestion_selected) {
          if (addressText) {
            data["address"] = suggestion_selected;
          }
        }
      } else {
        delete data.location;
      }

      if (moment(calenderRange1?.startDate).isValid()) {
        data["from_date"] = moment(calenderRange1?.startDate).format(
          "YYYY-MM-DD"
        );
      } else {
        delete data.from_date;
      }

      if (moment(calenderRange1?.endDate).isValid()) {
        data["to_date"] = moment(calenderRange1?.endDate).format("YYYY-MM-DD");
      } else {
        delete data.to_date;
      }

      if (sortBy === 2) {
        if (Object.keys(selected_address)?.length) {
          data["location"] = {
            coordinates: [
              parseFloat(selected_address?.lng),
              parseFloat(selected_address?.lat),
            ],
          };
        }
        if (suggestion_selected) {
          if (addressText) {
            let case_1 =
              typeof suggestion_selected == "string"
                ? suggestion_selected
                : JSON.stringify(suggestion_selected);
            data["address"] = addressText && suggestion_selected ? case_1 : "";
          }
        }
      }

      props.getTitleInfo({
        name: searchText,
        isTradeName: false,
        count: 0,
        tradeId: data.tradeId,
        specializationId: data.specializationId,
        location: data.location,
        from_date: data?.from_date,
        to_date: data?.to_date,
        doingLocalChanges: true,
        address: data?.address,
        suggestionSelected: suggestion_selected
          ? JSON.parse(suggestion_selected)
          : null,
      });
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
    }
  };

  const filterFromAddress = (response: any) => {
    let city,
      state,
      country = null;
    for (let i = 0; i < response.results[0].address_components.length; i++) {
      for (
        let j = 0;
        j < response.results[0].address_components[i].types.length;
        j++
      ) {
        switch (response.results[0].address_components[i].types[j]) {
          case "locality":
            city = response.results[0].address_components[i].long_name;
            break;
          case "administrative_area_level_1":
            state = response.results[0].address_components[i].long_name;
            break;
          case "country":
            country = response.results[0].address_components[i].long_name;
            break;
        }
      }
    }
    return { city, state, country: country.toLowerCase() };
  };

  const getCurrentLocation = async () => {
    let itemToggle: any = await navigator?.permissions?.query({
      name: "geolocation",
    });
    setLocationStatus(itemToggle.state);
    let local_position: any = localStorage.getItem("position");
    let position: any = JSON.parse(local_position);

    if (position?.length) {
      let lng = position[0].toString();
      let lat = position[1].toString();
      let response: any = await Geocode.fromLatLng(lat, lng);
      const { country } = filterFromAddress(response);

      if (response && ["australia", "au"].includes(country)) {
        if (
          response?.results &&
          Array.isArray(response.results) &&
          response?.results?.length
        ) {
          const address = response.results[0].formatted_address;
          setSelectedAddress({ lat, lng });
          setAddressText(address);
          setInputFocus2(true);
          setInputFocus1(false);
          setInputFocus3(false);
          setCurrentLocations(true);
        }
      } else {
        if (itemToggle?.state !== "denied") {
          setShowToast(
            true,
            "Uh Oh! We don't provide service currently in your location"
          );
        }
      }
    }
  };

  const checkPlaceholder = (calenderRange1: any) => {
    let fromDate: any = calenderRange1?.startDate;
    let toDate: any = calenderRange1?.endDate;
    let result = renderTimeWithCustomFormat(
      fromDate,
      toDate,
      "",
      ["DD MMM", "DD MMM YYYY"],
      "When?"
    );

    if (!result) {
      return "When?";
    }

    return result;
  };

  let state_data: any = stateData;
  let length_spec = 0;
  if (
    state_data?.specializationsId?.length &&
    Array.isArray(state_data?.specializationsId)
  ) {
    length_spec = state_data?.specializationsId?.length;
  }

  let custom_name = searchText;
  if (!checkOnChange) {
    if (length_spec > 1 && custom_name?.length) {
      custom_name = `${custom_name} +${length_spec - 1}`;
    }
  }

  return (
    <div className="home_search">
      <button
        onClick={() => {
          if (props?.handleChangeToggle) {
            props.handleChangeToggle(false);
          }
        }}
        className="modal_srch_close"
      >
        <img src={close} alt="close" />
      </button>
      <form className="search_wrapr">
        <ul>
          <li className="categ_box">
            <div className="text_field" id="text-field-div">
              <input
                type="text"
                ref={searchRef}
                placeholder="What jobs are you after?"
                value={showOnlyTradeName ? searchText : custom_name}
                onChange={(e) => {
                  isHandleChanges(true);
                  setOnChange(true);
                  setSearchText(e.target.value.trimLeft());
                }}
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
              {searchText?.length && inputFocus1 ? (
                <span className="detect_icon">
                  <img
                    src={cross}
                    alt="cross"
                    onClick={() => {
                      // clear here
                      setStateData({});
                      setSelectedTrade({});
                      isHandleChanges(true);
                      setSearchText("");
                      setOnChange(false);
                    }}
                  />
                </span>
              ) : null}
            </div>
            {!!errors.searchedJob && (
              <span className="error_msg">{errors.searchedJob}</span>
            )}
          </li>
          {!searchText?.length && inputFocus1 ? recentJobSearches() : null}
          {searchText?.length > 2 && inputFocus1 ? renderJobResult() : null}

          {/* {'location search start here!'} */}
          <li className="loc_box">
            <div id="location-text-field-div">
              <div>
                <PlacesAutocomplete
                  value={addressText}
                  searchOptions={{
                    componentRestrictions: {
                      country: "au",
                    },
                    types: ["(cities)"],
                  }}
                  shouldFetchSuggestions={addressText?.length > 2}
                  onChange={(item: any) => {
                    setAddressText(item);
                  }}
                  onSelect={async (
                    address: string,
                    placeId?: any,
                    suggestion?: any
                  ) => {
                    let selected_address: any = address;
                    if (address.indexOf(",")) {
                      selected_address = address.split(",")[0];
                    }

                    setSuggestion(suggestion?.formattedSuggestion);
                    setAddressText(suggestion?.formattedSuggestion?.mainText);
                    let response = await Geocode.fromAddress(address);
                    if (response?.results?.length) {
                      const { lat, lng } =
                        response.results[0].geometry.location;
                      setSelectedAddress({ lat, lng });
                      setInputFocus2(false);
                    }
                  }}
                  highlightFirstSuggestion={true}
                  onError={onError}
                  debounce={0}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }: any) => (
                    <div>
                      <div className={`text_field`}>
                        <input
                          {...getInputProps({
                            placeholder: "Where?",
                            className: "line-1",
                          })}
                          id="location-input-tag"
                          autoComplete="off"
                          ref={locationRef}
                          onFocus={() => {
                            setInputFocus2(true);
                            setInputFocus1(false);
                            setInputFocus3(false);
                          }}
                        />
                        <span className="detect_icon_ltr">
                          <img src={Location} alt="location" />
                        </span>
                        {inputFocus2 && addressText?.length > 2 ? (
                          <span className="detect_icon">
                            <img
                              src={cross}
                              alt="cross"
                              onClick={() => {
                                setAddressText("");
                                setSelectedAddress({});
                              }}
                            />
                          </span>
                        ) : null}
                      </div>
                      {suggestions?.length &&
                      inputFocus2 &&
                      addressText?.length ? (
                        <div
                          className="custom_autosuggestion location"
                          id="autocomplete-dropdown-container"
                        >
                          <div className="flex_row recent_search auto_loc">
                            <div className="flex_col_sm_4">
                              {!!errors.selectedMapLocation && (
                                <span className="error_msg">
                                  {errors.selectedMapLocation}
                                </span>
                              )}
                              {loading && <div>Loading...</div>}
                              {suggestions.map((suggestion: any) => {
                                const className =
                                  "autosuggestion_icon card loc name";
                                const style = suggestion.active
                                  ? {
                                      backgroundColor: "#fafafa",
                                      cursor: "pointer",
                                    }
                                  : {
                                      backgroundColor: "#ffffff",
                                      cursor: "pointer",
                                    };
                                return (
                                  <div
                                    {...getSuggestionItemProps(suggestion, {
                                      className,
                                      style,
                                    })}
                                  >
                                    <span>
                                      {suggestion.formattedSuggestion.mainText}
                                    </span>
                                    <span className="name">
                                      {
                                        suggestion.formattedSuggestion
                                          .secondaryText
                                      }
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : null}
                      {inputFocus2 &&
                      !suggestions?.length &&
                      !Object.keys(selectedAddress).length ? (
                        <div
                          style={{ minHeight: "50px" }}
                          className="custom_autosuggestion location"
                          id="autocomplete-dropdown-container"
                        >
                          <div className="flex_row recent_search auto_loc">
                            <div className="flex_col_sm_4">
                              <div className="loc_suggestions">
                                {"No Result Found."}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>
            </div>
            {!!errors.selectedMapLocation && (
              <span className="error_msg">{errors.selectedMapLocation}</span>
            )}
          </li>

          {/* {'location search end here!'} */}
          {!addressText?.length && inputFocus2 ? (
            <div
              className="custom_autosuggestion location"
              id="current-location-search-div"
            >
              <span className="location-btn" onClick={getCurrentLocation}>
                <span className="gps_icon">
                  <img src={icgps} alt="" />
                </span>{" "}
                Use my current location
              </span>
              {locationStatus === "denied" && (
                <span className="blocked_note">
                  You have blocked your location. To use this, change your
                  location settings in browser.
                </span>
              )}
              {props?.recentLocationData?.length > 0 && (
                <span className="sub_title">{"Recent searches"}</span>
              )}
              <div className="flex_row recent_search auto_loc">
                {props?.recentLocationData?.map((item: any) => {
                  return (
                    item?.address?.length > 0 && (
                      <div
                        className="flex_col_sm_4"
                        onClick={() => {
                          setAddressText(JSON.parse(item?.address)?.mainText);
                          setSelectedAddress({
                            lat: item?.location?.coordinates[1],
                            lng: item?.location?.coordinates[0],
                          });
                          setSuggestion(JSON.parse(item?.address));
                        }}
                      >
                        <div className="autosuggestion_icon card loc name">
                          <span>{JSON.parse(item?.address)?.mainText}</span>
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
          ) : null}
          <li
            className={`date_box ${
              calenderRange1?.startDate ? "date_value" : ""
            }`}
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
                  placeholder={checkPlaceholder(calenderRange1)}
                  onFocus={() => {
                    setInputFocus3(true);
                    setInputFocus1(false);
                    setInputFocus2(false);
                  }}
                />
                {calenderRange1?.startDate && inputFocus3 && (
                  <span className="detect_icon">
                    <img
                      src={cross}
                      alt="cross"
                      onClick={() => {
                        setCalenderRange1({
                          startDate: "",
                          endDate: "",
                          key: "selection1",
                        });
                        console.log({ localInfo: props.localInfo });
                        props.getTitleInfo({
                          ...props.localInfo,
                          from_date: "",
                          to_date: "",
                        });
                      }}
                    />
                  </span>
                )}
              </div>
              {/* {inputFocus3 && */}
              {inputFocus3 ? (
                <div
                  className="custom_autosuggestion"
                  id="custom-date-range-div"
                >
                  <DateRange
                    onChange={handleCalenderRange}
                    ranges={
                      !moment(calenderRange1?.startDate).isValid()
                        ? [
                            {
                              startDate: new Date(),
                              endDate: new Date(),
                              key: "selection1",
                            },
                          ]
                        : [calenderRange1]
                    }
                    moveRangeOnFirstSelection={false}
                    rangeColors={["#fee600", "#b5b5b5"]}
                    showDateDisplay={false}
                    showSelectionPreview={true}
                    months={2}
                    showPreview={true}
                    minDate={new Date()}
                    maxDate={moment().add(2, "years").toDate()}
                    direction="horizontal"
                    fixedHeight={true}
                  />
                </div>
              ) : null}
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

const mapStateToProps = (state: any) => {
  return {
    searchJobListData: state.homeSearch.searchJobListData,
    recentSearchJobData: state.homeSearch.recentSearchJobData,
    homeSearchJobData: state.homeSearch.homeSearchJobData,
    tradeListData: state.auth.tradeListData,
    localChanges: state.jobs.localChanges,
    recentLocationData: state.homeSearch.recentLocationData,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getSearchJobList,
      getRecentSearchList,
      postHomeSearchData,
      isHandleChanges,
      getRecentLocationList,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(BannerSearch);

/**
!loading &&
addressText?.length > 2 &&
!suggestions?.length &&
!enableCurrentLocation &&
!Object.keys(selectedAddress).length
**/
