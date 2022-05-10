import { useState, useEffect } from "react";
import Constants from "../../utils/constants";
import { setShowToast } from "../../redux/common/actions";
import { getSearchParamsData } from "../../utils/common";
import Menu from "@material-ui/core/Menu";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import NumberFormat from "react-number-format";

import filterUnselected from "../../assets/images/ic-filter-unselected.png";
import filterSelected from "../../assets/images/ic-filter-selected.png";
import cancel from "../../assets/images/ic-cancel.png";
import spherePlaceholder from "../../assets/images/ic_categories_placeholder.svg";

const SearchResultFilters = (props: any) => {
  const [errors, setErrors] = useState<any>({});
  const [priceAnchorEl, setPriceAnchorEl] = useState(null);
  const [sortingAnchorEl, setSortingAnchorEl] = useState(null);

  const [sortByFilter, setSortByFilter] = useState<any>({
    sortByFilterClicked: false,
    showResultsButtonClicked: false,
    tradeId: [],
    jobTypes: [],
    specializationId: [],
    allSpecializationClicked: false,
  });

  const [sortByPrice, setSortByPrice] = useState<any>({
    priceFilterClicked: false,
    payTypeClicked: false,
    pay_type: "Per hour",
    budget: [2100, 5100],
    showBudgetPerHour: [2100, 5100],
    showBudgetFixed: [2100, 5100],
    showResultClicked: false,
  });

  const [sortBySorting, setSortBySorting] = useState<any>({
    sortBySorting: false,
    sortBy: 0,
  });

  useEffect(() => {
    props.getJobTypeList();
    props.callTradeList();
    const paramsList = getSearchParamsData(props?.history?.location);
    if (paramsList) {
      if (
        paramsList.isFilterOn === "isFilterOn" &&
        (paramsList.tradeId?.length || paramsList.jobTypes?.length)
      ) {
        setSortByFilter((prevData: any) => ({
          ...prevData,
          tradeId: paramsList.tradeId ? paramsList.tradeId : [],
          jobTypes: paramsList.jobTypes ? paramsList.jobTypes : [],
          specializationId: paramsList.specializationId
            ? paramsList.specializationId
            : [],
          showResultsButtonClicked: true,
        }));
      }
      if (
        paramsList.min_budget &&
        paramsList.max_budget &&
        paramsList.pay_type
      ) {
        const newBudget = [paramsList.min_budget, paramsList.max_budget];
        setSortByPrice((prevData: any) => ({
          ...prevData,
          pay_type: paramsList.pay_type,
          budget: newBudget,
          showResultClicked: true,
        }));
      }
      if (paramsList.sortBy) {
        setSortBySorting((prevData: any) => ({
          ...prevData,
          sortBy: paramsList.sortBy,
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (props.cleanFiltersData) {
      setSortByFilter((prevData: any) => ({
        ...prevData,
        tradeId: [],
        jobTypes: [],
        specializationId: [],
        allSpecializationClicked: false,
        showResultsButtonClicked: false,
        sortByFilterClicked: false,
      }));
      setSortByPrice((prevData: any) => ({
        ...prevData,
        pay_type: "Per hour",
        showResultClicked: false,
      }));
      setSortBySorting((prevData: any) => ({ ...prevData, sortBy: 0 }));
    }
  }, [props.cleanFiltersData]);

  const sortByPriceClick = (event: any) => {
    setPriceAnchorEl(event.currentTarget);
    setSortByPrice((prevData: any) => ({
      ...prevData,
      priceFilterClicked: true,
    }));
  };

  const sortByPriceClose = () => {
    setPriceAnchorEl(null);
    setSortByPrice((prevData: any) => ({
      ...prevData,
      priceFilterClicked: false,
    }));
    delete errors.maxBudget;
  };

  const sortByFilterClick = () => {
    setSortByFilter((prevData: any) => ({
      ...prevData,
      sortByFilterClicked: true,
    }));
  };

  const sortByFilterClose = () => {
    setSortByFilter((prevData: any) => ({
      ...prevData,
      sortByFilterClicked: false,
    }));
  };

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

  const showResultsByAllFilter = (
    item?: any,
    isPriceFilterClicked?: boolean
  ) => {
    if (item === "callViewNearByJobApi") {
      props.searchByFilter("callViewNearByJobApi");
      return;
    }
    const data = {
      ...(sortByFilter.tradeId?.length && { tradeId: sortByFilter.tradeId }),
      ...(sortByFilter.jobTypes?.length && { jobTypes: sortByFilter.jobTypes }),
      ...(sortByFilter.specializationId?.length && {
        specializationId: sortByFilter.specializationId,
      }),
      ...((sortByPrice.showResultClicked || isPriceFilterClicked) &&
        sortByPrice.budget[0] >= 0 &&
        sortByPrice.budget[1] >= 0 && { pay_type: sortByPrice.pay_type }),
      ...((sortByPrice.showResultClicked || isPriceFilterClicked) &&
        sortByPrice.budget[0] >= 0 &&
        sortByPrice.budget[1] >= 0 && {
          min_budget: Number(sortByPrice.budget[0]),
        }),
      ...((sortByPrice.showResultClicked || isPriceFilterClicked) &&
        sortByPrice.budget[0] >= 0 &&
        sortByPrice.budget[1] >= 0 && {
          max_budget: Number(sortByPrice.budget[1]),
        }),
      ...(item?.sortBy && { sortBy: Number(item?.sortBy) }),
    };
    if (sortByPrice.budget[1] === 0) {
      setSortByPrice((prevData: any) => ({
        ...prevData,
        showResultClicked: false,
      }));
    }
    props.searchByFilter(data);
  };

  const showResultsByFilter1 = () => {
    if (sortByFilter.jobTypes.length || sortByFilter.tradeId.length) {
      sortByFilterClose();
      setSortByFilter((prevData: any) => ({
        ...prevData,
        showResultsButtonClicked: true,
      }));
      showResultsByAllFilter();
    } else {
      sortByFilterClose();
      setSortByFilter((prevData: any) => ({
        ...prevData,
        tradeId: [],
        jobTypes: [],
        specializationId: [],
        allSpecializationClicked: false,
        showResultsButtonClicked: false,
        sortByFilterClicked: false,
      }));
      setSortByPrice((prevData: any) => ({
        ...prevData,
        pay_type: "Fixed price",
      }));
      setSortBySorting((prevData: any) => ({ ...prevData, sortBy: 0 }));
      showResultsByAllFilter("callViewNearByJobApi");
    }
  };

  const showResultsByBudget = (e: any) => {
    e.preventDefault();
    setSortByPrice((prevData: any) => ({
      ...prevData,
      showResultClicked: true,
    }));
    sortByPriceClose();
    showResultsByAllFilter("", true);
  };

  const sortByButtonClicked = (num: number) => {
    const item = {
      sortBy: num,
    };
    setSortBySorting((prevData: any) => ({ ...prevData, sortBy: num }));
    sortBySortingClose();
    showResultsByAllFilter(item);
  };

  const setSameOnClick = () => {
    const item = {
      sortBy: 400, //sending 400 e.g, to delete sortBy from query param ==> by passing to parent component
    };
    setSortBySorting((prevData: any) => ({ ...prevData, sortBy: 0 }));
    sortBySortingClose();
    showResultsByAllFilter(item);
  };

  const sortOnClick = (num: number) => {
    if (sortBySorting.sortBy == num) {
      setSameOnClick();
    }
  };

  const sortOnChange = (num: number) => {
    if (sortBySorting.sortBy !== num) {
      sortByButtonClicked(num);
    }
  };

  const handleSliderChange = (newValue: any) => {
    console.log("newValue: ", newValue);
    if (sortByPrice.pay_type === "Per hour") {
      setSortByPrice((prevData: any) => ({
        ...prevData,
        budget: newValue,
        showBudgetPerHour: newValue,
      }));
    } else {
      setSortByPrice((prevData: any) => ({
        ...prevData,
        budget: newValue,
        showBudgetFixed: newValue,
      }));
    }
  };

  const filterChangeHandler = (id: any, name: string) => {
    if (name === "jobTypes") {
      if (sortByFilter.jobTypes[0] == id) {
        setSortByFilter((prevData: any) => ({ ...prevData, jobTypes: [] }));
      } else {
        setSortByFilter((prevData: any) => ({ ...prevData, jobTypes: [id] }));
      }
    } else if (name === "specializationId") {
      setSortByFilter((prevData: any) => {
        var newData = [...prevData.specializationId];
        if (sortByFilter.allSpecializationClicked) {
          newData = [];
        }
        const itemIndex = newData.indexOf(id);
        if (newData.indexOf(id) < 0) {
          newData.push(id);
        } else {
          newData.splice(itemIndex, 1);
        }
        return {
          ...prevData,
          specializationId: newData,
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
          allSpecializationClicked: false,
        }));
      }
    } else if (name == "All Clicked") {
      if (sortByFilter.allSpecializationClicked) {
        setSortByFilter((prevData: any) => ({
          ...prevData,
          allSpecializationClicked: false,
          specializationId: [],
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
        tradeId: [],
        jobTypes: [],
        specializationId: [],
      }));
    }
  };

  const specializationList = props.tradeListData.find(
    ({ _id }: { _id: string }) => _id === sortByFilter.tradeId[0]
  )?.specialisations;

  useEffect(() => {
    if (specializationList?.length) {
      const newSpecialization = specializationList.map(
        ({ _id }: { _id: string }) => {
          return _id;
        }
      );
      setSortByFilter((prevData: any) => ({
        ...prevData,
        specializationId: newSpecialization,
        allSpecializationClicked: true,
      }));
    }
  }, [specializationList]);

  return (
    <div className="filters_wrapr">
      <ul className="filters_row">
        <li>
          <a
            onClick={sortByFilterClick}
            className={sortByFilter.showResultsButtonClicked ? "active" : ""}
          >
            <img
              src={
                sortByFilter.showResultsButtonClicked
                  ? filterSelected
                  : filterUnselected
              }
              alt="filter"
            />
            Filter
          </a>
        </li>
        <li>
          <a
            className={sortByPrice.showResultClicked ? "active" : ""}
            onClick={sortByPriceClick}
          >
            Price
          </a>
        </li>
        <li>
          <a
            className={sortBySorting.sortBy ? "active" : ""}
            onClick={sortBySortingClick}
          >
            Sorting
          </a>
        </li>
      </ul>
      {/* filter 1 modal box */}
      {sortByFilter.sortByFilterClicked && (
        <Modal
          className="custom_modal"
          open={sortByFilter.sortByFilterClicked}
          onClose={sortByFilterClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div
            className="custom_wh filter_modal"
            data-aos="zoom-in"
            data-aos-delay="30"
            data-aos-duration="1000"
          >
            <div className="heading">
              <span className="sub_title">Filter</span>
              <button className="close_btn" onClick={sortByFilterClose}>
                <img src={cancel} alt="cancel" />
              </button>
            </div>

            <div className="inner_wrap">
              <div className="form_field">
                <span className="xs_sub_title">Categories</span>
              </div>
              <div className="select_sphere">
                <ul>
                  {props.tradeListData?.map(
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
                    }) => {
                      const active = sortByFilter.tradeId[0] === _id;
                      return (
                        <li
                          key={_id}
                          className={active ? "active" : ""}
                          onClick={() => filterChangeHandler(_id, "categories")}
                        >
                          <figure>
                            <img
                              src={
                                selected_url ? selected_url : spherePlaceholder
                              }
                            />
                          </figure>
                          <span className="name">{trade_name}</span>
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
              <div className="form_field">
                <span className="xs_sub_title">Job types</span>
              </div>
              <ul className="job_categories">
                {props.jobTypeListData?.map(
                  ({
                    _id,
                    name,
                    image,
                  }: {
                    _id: string;
                    name: string;
                    image: string;
                  }) => {
                    const active = sortByFilter.jobTypes[0] == _id;
                    return (
                      <li
                        className={`${active ? "active" : ""}`}
                        key={_id}
                        onClick={() => filterChangeHandler(_id, "jobTypes")}
                      >
                        <figure className="type_icon">
                          <img src={image} alt="" />
                        </figure>
                        <span className="name">{name}</span>
                      </li>
                    );
                  }
                )}
              </ul>
              <div className="form_field">
                <span className="xs_sub_title">Specialisation</span>
              </div>
              <div className="tags_wrap">
                <ul>
                  {specializationList?.length > 0 && (
                    <li
                      className={
                        sortByFilter.allSpecializationClicked ? "selected" : ""
                      }
                      onClick={() =>
                        filterChangeHandler(specializationList, "All Clicked")
                      }
                    >
                      All
                    </li>
                  )}
                  {specializationList?.map(
                    ({ _id, name }: { _id: string; name: string }) => {
                      const active =
                        sortByFilter.specializationId?.indexOf(_id) >= 0;
                      return (
                        <li
                          key={_id}
                          className={
                            active && !sortByFilter.allSpecializationClicked
                              ? "selected"
                              : ""
                          }
                          onClick={() =>
                            filterChangeHandler(_id, "specializationId")
                          }
                        >
                          {name}
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            </div>
            <div className="filter_btn">
              <a
                className="link"
                onClick={() => filterChangeHandler("Clear All", "Clear All")}
              >
                Clear All
              </a>
              <button
                className="fill_btn full_btn btn-effect"
                onClick={showResultsByFilter1}
              >
                Show Results
              </button>
            </div>
          </div>
        </Modal>
      )}
      {/* price filter box */}
      {sortByPrice.priceFilterClicked && (
        <Menu
          className="fsp_modal range"
          id="simple-menu"
          anchorEl={priceAnchorEl}
          keepMounted
          open={Boolean(priceAnchorEl)}
          onClose={sortByPriceClose}
        >
          <span className="close_btn" onClick={sortByPriceClose}>
            <img src={cancel} alt="cancel" />
          </span>
          <span className="sub_title">Maximum budget</span>
          <div className="form_field">
            <div className="radio_wrap agree_check">
              <input
                className="filter-type filled-in"
                name="pay_type"
                type="radio"
                id="perHour"
                checked={sortByPrice.pay_type === "Per hour" ? true : false}
                onClick={() =>
                  setSortByPrice((prevData: any) => ({
                    ...prevData,
                    pay_type: "Per hour",
                    budget: [2100, 5100],
                    showBudgetPerHour: [2100, 5100],
                  }))
                }
              />
              <label htmlFor="perHour">Per hour</label>
            </div>
            <div className="radio_wrap agree_check">
              <input
                className="filter-type filled-in"
                name="pay_type"
                type="radio"
                id="fixed"
                checked={sortByPrice.pay_type === "Fixed price" ? true : false}
                onClick={() =>
                  setSortByPrice((prevData: any) => ({
                    ...prevData,
                    pay_type: "Fixed price",
                    budget: [2100, 5100],
                    showBudgetFixed: [2100, 5100],
                  }))
                }
              />
              <label htmlFor="fixed">Fixed price</label>
            </div>
          </div>
          <div className="form_field">
            <span className="per_day">
              <NumberFormat
                value={sortByPrice.budget[0]}
                className="foo"
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
              />
              <NumberFormat
                value={sortByPrice.budget[1]}
                className="foo"
                displayType={"text"}
                thousandSeparator={true}
                prefix={" - $"}
                suffix={sortByPrice.budget[1] === 10000 ? "+" : ""}
              />
            </span>
            <Typography id="range-slider" gutterBottom></Typography>
            <Slider
              min={0}
              max={10000}
              step={100}
              value={
                sortByPrice.pay_type === "Per hour"
                  ? sortByPrice.showBudgetPerHour
                  : sortByPrice.showBudgetFixed
              }
              onChange={handleSliderChange}
              aria-labelledby="range-slider"
            />
          </div>
          <div className="f_spacebw">
            <a className="link" onClick={showResultsByBudget}>
              Show results
            </a>
          </div>
        </Menu>
      )}
      {/* sorting filter box */}
      {sortBySorting.sortBySorting && (
        <Menu
          className="fsp_modal range"
          anchorEl={sortingAnchorEl}
          keepMounted
          open={Boolean(sortingAnchorEl)}
          onClose={sortBySortingClose}
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
              onClick={() => {
                sortOnClick(1);
              }}
              onChange={() => {
                sortOnChange(1);
              }}
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
              onClick={() => {
                sortOnClick(2);
              }}
              onChange={() => {
                sortOnChange(2);
              }}
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
              onClick={() => {
                sortOnClick(3);
              }}
              onChange={() => {
                sortOnChange(3);
              }}
            />
            <label htmlFor="mostJob">Most jobs completed</label>
          </div>
        </Menu>
      )}
    </div>
  );
};

export default SearchResultFilters;
