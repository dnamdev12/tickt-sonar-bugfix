import React, { useEffect, useState } from "react";
import moment from "moment";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Modal from "@material-ui/core/Modal";
import { renderTimeWithCustomFormat } from "../../../../utils/common";
import { setShowToast } from "../../../../redux/common/actions";

// @ts-ignore
import { DateRangePicker } from "../../../../plugins/react-date-range/dist/index";
import "../../../../plugins/react-date-range/dist/styles.css";
import "../../../../plugins/react-date-range/dist/theme/default.css";

// for error messages
const label: { [index: string]: string } = {
  name: "Milestone Name",
  duration: "From Date",
  recommended: "Recommended Hours",
};

const pattern = "^([0-9][0-9]?[0-9]?[0-9]?[0-9]):[0-5][0-9]$";
const STRING_ERROR = "Selected data is fully engage";
const AddEditMile = (props: any) => {
  const { resetItems, item } = props;
  const [stateData, setStateData] = useState({
    name: "",
    isPhoto: false,
    duration: "",
    recommended: "",
    status: -1,
    order: -1,
  });
  const [errors, setErrors] = useState<any>({
    name: "",
    duration: "",
    hours: "",
    pattern_error: "",
  });
  const [toggleCalender, setToggleCalender] = useState(false);

  const [changesFor, setChangesFor] = useState({
    name: false,
    isPhoto: false,
    duration: false,
    recommended: false,
  });

  const [toggleItem, setToggleItem] = useState(false);

  const [calenderItems, setCalender] = useState<any>({
    startDate: "", //new Date(),
    endDate: "", //new Date(),
    key: "selection",
  });

  const toggleCal = () => {
    setToggleCalender((prev: any) => !prev);
  };

  const checkHoursVal = (value: any, lable: any, name: any) => {
    if (value?.length) {
      if (value.match(pattern) !== null) {
        if (!(+value.split(":")[1] % 15 === 0)) {
          return "Time should be in mutiples of 15 like 10:15, 10:30";
        }
        return "";
      } else {
        return "Please enter a valid pattern like : 10:15";
      }
    }
    return "";
  };

  const isInvalid = (name: string, value: string) => {
    switch (name) {
      case "name":
        return !value.length
          ? `${label[name]} is required.`
          : value.length > 50
          ? "Maximum 50 characters are allowed."
          : "";
      case "duration":
        return "";
      case "recommended":
        return checkHoursVal(value, label, name);
    }
  };

  const handleChange = (name: any, value: any) => {
    let error_clone: any = {};

    if (name === "name") {
      value = value.trimLeft().replace(/[^a-zA-Z|0-9 ]/g, "");
    }

    if (name === "recommended") {
      value = value.trimLeft();
    }

    if (["name", "recommended"].includes(name)) {
      if (isInvalid(name, value)) {
        error_clone[name] = isInvalid(name, value);
      }
    }

    setStateData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
    setErrors(error_clone);
  };

  const onMountCallable = () => {
    let count_times: any = {};
    let milestones = props.milestones;
    let filteredItems = milestones.filter((item: any) => {
      let toDate = item?.toDate;
      let fromDate = item?.fromDate;

      if (fromDate) {
        let from_format = moment(fromDate).format("MM-DD-YYYY");
        item["from_date"] = from_format;
        count_times[from_format] = 0;
      }

      if (toDate) {
        let to_format = moment(toDate).format("MM-DD-YYYY");
        item["to_date"] = to_format;
        count_times[to_format] = 0;
      }

      if (Object.keys(item).length) {
        return item;
      }
    });

    console.log({ filteredItems, count_times });

    if (filteredItems?.length) {
      filteredItems.forEach((item: any, index: any) => {
        let to_date = item?.to_date;
        let from_date = item?.from_date;
        let color_index = index;
        if (index > 500) {
          color_index = Math.floor(Math.random() * 500 + 1);
        }

        if (!to_date && from_date) {
          if (count_times[from_date] > -1) {
            count_times[from_date]++;
          }

          let from_element: any = document.getElementsByClassName(
            `color_${count_times[from_date]}_${from_date}`
          );
          if (from_element) {
            let element_from = from_element[0];
            if (from_element?.length > 1) {
              element_from = from_element[1];
            }

            if (element_from) {
              element_from.classList.add(`color_${color_index}`);
            }
          }
        }

        if (to_date && from_date) {
          if (count_times[from_date] > -1) {
            count_times[from_date]++;
          }

          if (count_times[to_date] > -1) {
            count_times[to_date]++;
          }

          // let colorbyIndex = randomColors[index];
          let from_element: any = document.getElementsByClassName(
            `color_${count_times[from_date]}_${from_date}`
          );
          if (from_element) {
            let element_from = null;

            if (from_element?.length > 1) {
              if (
                !from_element[0].parentElement.parentElement.classList.contains(
                  "rdrDayPassive"
                )
              ) {
                element_from = from_element[0];
              } else {
                element_from = from_element[1];
              }
            } else {
              element_from = from_element[0];
            }

            if (element_from) {
              element_from.classList.add(`color_${color_index}`);
            }
          }

          let to_element: any = document.getElementsByClassName(
            `color_${count_times[to_date]}_${to_date}`
          );
          if (to_element) {
            let element_to = null;
            if (to_element?.length > 1) {
              if (
                !to_element[0].parentElement.parentElement.classList.contains(
                  "rdrDayPassive"
                )
              ) {
                element_to = to_element[0];
              } else {
                element_to = to_element[1];
              }
            } else {
              element_to = to_element[0];
            }
            if (element_to) {
              element_to.classList.add(`color_${color_index}`);
            }
          }
        }
      });
    }
  };

  useEffect(() => {
    const { milestones, editMile } = props;
    if (editMile > -1) {
      let editItem: any = milestones[editMile];
      if (editItem) {
        setStateData((prev: any) => ({
          order: editItem?.order ? editItem?.order : -1,
          name: editItem.milestoneName,
          isPhoto: editItem.isPhotoevidence,
          duration: renderTimeWithCustomFormat(
            editItem.fromDate,
            editItem.toDate,
            "",
            ["DD MMM", "DD MMM YY"]
          ),
          recommended: editItem?.recommendedHours,
          status: editItem?.status,
        }));

        setCalender({
          startDate: moment(editItem?.fromDate).isValid()
            ? moment(editItem?.fromDate).toDate()
            : "",
          endDate: moment(editItem?.toDate).isValid()
            ? moment(editItem?.toDate).toDate()
            : "",
          key: "selection",
        });
      }
    }

    const interval = setInterval(() => {
      onMountCallable();
    }, 2000);

    return () => {
      console.log(`clearing interval`);
      clearInterval(interval);
    };
  }, []);

  const checkIfChange = () => {
    let renderDuration: any = renderTimeWithCustomFormat(
      calenderItems.startDate,
      calenderItems.endDate,
      "",
      ["DD MMM", "DD MMM YY"],
      "Choose"
    );

    if (
      !stateData?.name?.length &&
      !stateData?.isPhoto &&
      renderDuration === "Choose" &&
      !stateData?.recommended?.length
    ) {
      return false;
    }
    return true;
  };

  const checkBeforeExist = (time: any, milestones_?: any) => {
    let count_times: any = {};
    let catch_boolean: boolean = true;
    let milestoneItems: any = props?.milestones;

    milestoneItems.forEach((mile: any) => {
      let mile_start = mile.from_date;
      let mile_end = mile.to_date;

      let time_start = moment(time.fromDate).isValid()
        ? moment(time.fromDate).format("MM-DD-YYYY")
        : "";
      let time_end = moment(time.toDate).isValid()
        ? moment(time.toDate).format("MM-DD-YYYY")
        : "";

      if (count_times[mile_start] == undefined) {
        count_times[mile_start] = 1;
      } else {
        count_times[mile_start] = count_times[mile_start] + 1;
      }

      if (count_times[mile_end] == undefined) {
        count_times[mile_end] = 1;
      } else {
        count_times[mile_end] = count_times[mile_end] + 1;
      }

      if (count_times[mile_start] === 4) {
        if (mile_start == time_start || mile_start == time_end) {
          setShowToast(true, STRING_ERROR);
          catch_boolean = false;
        }
      } else {
        if (count_times[time_start] === 4) {
          setShowToast(true, STRING_ERROR);
          catch_boolean = false;
        }
      }

      if (count_times[mile_end] === 4) {
        if (mile_end == time_start || mile_end == time_end) {
          setShowToast(true, STRING_ERROR);
          catch_boolean = false;
        }
      } else {
        if (count_times[time_end] === 4) {
          setShowToast(true, STRING_ERROR);
          catch_boolean = false;
        }
      }
    });

    return catch_boolean;
  };

  const handleCalender = (date: any) => {
    let time = {
      fromDate: date.selection.startDate,
      toDate: date.selection.endDate,
    };
    console.log({ selection: date.selection });
    let index = props?.milestones?.length;

    let isChecked = checkBeforeExist(time);
    if (isChecked) {
      addTimeToMileStone(time, index);
    }
    // setCalender(date.selection);
  };

  const addTimeToMileStone = (time: any, index: any, skip?: any) => {
    let checkIsValid: any = true;
    if (!checkIsValid) {
      setShowToast(true, "Please add unique date");
      return;
    }

    setCalender({
      startDate: moment(time.fromDate).toDate(),
      endDate: moment(time.toDate).toDate(),
      key: "selection",
    });
  };

  // before render check
  const { name, isPhoto, recommended } = stateData;
  let check_errors = false;
  let renderDuration: any = renderTimeWithCustomFormat(
    calenderItems.startDate,
    calenderItems.endDate,
    "",
    ["DD MMM", "DD MMM YYYY", true],
    "Choose"
  );

  if (
    !name?.length ||
    (recommended?.length > 0 && errors.recommended?.length)
  ) {
    check_errors = true;
  }

  let ItemCal: any = calenderItems;
  if (!moment(calenderItems?.startDate).isValid()) {
    ItemCal = { startDate: new Date(), endDate: "", key: "selection" };
  }

  let min_date: any = moment(item?.fromDate).isValid()
    ? moment(item?.fromDate).toDate()
    : new Date();
  let max_date: any = moment().add(2, "years").toDate();
  return (
    <div className="flex_row">
      <div className="flex_col_sm_12">
        <Dialog
          open={toggleItem}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            className="xs_alert_dialog_title"
          >
            {"Heads Up"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {"If you go back, you will lose all your changes."}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setToggleItem((prev: any) => !prev);
              }}
              color="primary"
            >
              {"Yes"}
            </Button>
            <Button
              onClick={() => {
                setToggleItem((prev: any) => !prev);
                resetItems();
              }}
              color="primary"
              autoFocus
            >
              {"No"}
            </Button>
          </DialogActions>
        </Dialog>

        <Modal
          className="custom_modal "
          open={toggleCalender}
          onClose={() => {
            toggleCal();
          }}
          aria-labelledby="calender-active-modal-title"
          aria-describedby="calender-active-modal-title"
        >
          <div
            style={{
              padding: "12px 20px 0px",
            }}
            className="item-modal-ctm custom_wh portfolio_preview "
          >
            {console.log({ jobDetail: props.jobDetail })}
            <DateRangePicker
              ranges={[ItemCal]}
              onChange={(date: any) => {
                handleCalender(date);
                setChangesFor((prev: any) => ({ ...prev, duration: true }));
              }}
              months={2}
              direction="horizontal"
              moveRangeOnFirstSelection={false}
              rangeColors={["#fee600", "#b5b5b5"]}
              showDateDisplay={false}
              showSelectionPreview={true}
              showPreview={true}
              minDate={min_date}
              maxDate={max_date}
              fixedHeight={true}
            />
          </div>
        </Modal>

        <div className="form_field">
          <div className="flex_row">
            <div className="flex_col_sm_7">
              <div className="relate">
                <button
                  onClick={() => {
                    if (checkIfChange()) {
                      setToggleItem((prev: any) => !prev);
                      return;
                    }
                    resetItems();
                  }}
                  className="back"
                ></button>
                <span className="title">{item?.jobName || ""}</span>
              </div>
              <p className="sub_title">
                {`${props.editMile === "" ? "" : "Edit "}`}
                {`${
                  props.editMile === "" && props?.isSame
                    ? `Milestones ${props?.milestones?.length + 1}`
                    : props.editMile !== "" &&
                      props.editMile > -1 &&
                      props?.isSame
                    ? `Milestones ${props.editMile + 1}`
                    : props.editMile !== "" &&
                      props.editMile > -1 &&
                      !props?.isSame
                    ? `Milestone ${props.editMile + 1}`
                    : props.editMile === "" && !props?.isSame
                    ? `Milestone ${props?.milestones?.length + 1}`
                    : null
                }`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex_row">
          <div className="flex_col_sm_7">
            <div className="form_field">
              <label className="form_label">{"Milestone Name"}</label>
              <div className="text_field">
                <input
                  type="text"
                  placeholder="Enter Milestone Name"
                  onChange={(e: any) => {
                    handleChange("name", e.target.value);
                    setChangesFor((prev: any) => ({ ...prev, name: true }));
                  }}
                  value={name}
                  name="milestone_name"
                />
              </div>
              <span className="error_msg">{errors?.name}</span>
            </div>
            <div className="form_field">
              <div className="checkbox_wrap agree_check">
                <input
                  onChange={() => {
                    setStateData((prev: any) => ({
                      ...prev,
                      isPhoto: !prev.isPhoto,
                    }));
                    setChangesFor((prev: any) => ({ ...prev, isPhoto: true }));
                  }}
                  checked={isPhoto}
                  className="filter-type filled-in"
                  type="checkbox"
                  id="milestone1"
                />
                <label htmlFor="milestone1">
                  <b>{"Photo evidence required"}</b>
                </label>
              </div>
            </div>
            <div className="form_field">
              <div className="f_spacebw">
                <label className="form_label">
                  {"Duration of milestone (optional)"}
                </label>
                <button
                  onClick={() => {
                    toggleCal();
                  }}
                  className="fill_btn fill_grey_btn choose_btn"
                >
                  {renderDuration}
                </button>
              </div>
            </div>
            <div className="form_field">
              <label className="form_label">
                {"Estimated Hours (optional)"}
              </label>
              <div className="text_field">
                <input
                  onChange={(e) => {
                    handleChange("recommended", e.target.value);
                    setChangesFor((prev: any) => ({
                      ...prev,
                      recommended: true,
                    }));
                  }}
                  autoComplete="off"
                  value={recommended}
                  type="text"
                  placeholder="Enter Estimated Hours"
                  name="recommended_hours"
                />
              </div>
              <span className="error_msg">{errors.recommended}</span>
              {/* <span className="error_msg">{errors.pattern_error}</span> */}
            </div>

            <div className="form_field">
              <button
                onClick={() => {
                  let description: any = "";
                  if (Object.values(changesFor).includes(true)) {
                    // description = `This job has Milestones change request with changes in ${changesFor?.name ? 'Milestone Name, ' : ''}${changesFor?.isPhoto ? 'Photo evidence required, ' : ''}${changesFor?.duration ? 'Duration of Milestone, ' : ''}${changesFor?.recommended ? 'Recommended Hours ' : ''}.`;
                    description = `${stateData.name} details are updated.`;
                  }

                  if (props.editMile !== "") {
                    // edit
                    if (props?.addNewMile) {
                      props?.addNewMile({
                        milestoneName: stateData.name,
                        isPhotoevidence: stateData.isPhoto,
                        order: stateData.order,
                        index: props.editMile,
                        status: stateData.status,
                        recommendedHours: stateData.recommended,
                        fromDate: calenderItems.startDate,
                        toDate: calenderItems.endDate,
                        description: description,
                      });
                    }
                  } else {
                    // add
                    if (props?.addNewMile) {
                      props?.addNewMile({
                        milestoneName: stateData.name,
                        isPhotoevidence: stateData.isPhoto,
                        status: -1,
                        order: props?.milestones?.length + 1,
                        recommendedHours: stateData.recommended,
                        fromDate: calenderItems.startDate,
                        toDate: calenderItems.endDate,
                        description: description,
                      });
                    }
                  }
                  props.resetItems();
                }}
                className={`fill_btn full_btn btn-effect ${
                  check_errors ? "disable_btn" : ""
                }`}
              >
                {"Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditMile;
