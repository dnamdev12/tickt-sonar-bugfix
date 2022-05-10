import { useState, useEffect } from "react";
// @ts-ignore
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import moment from "moment";
import { setShowToast } from "../../../redux/common/actions";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

interface Proptypes {
  data: any;
  milestones: any;
  stepCompleted: boolean;
  handleStepComplete: (data: any) => void;
  handleStepBack: () => void;
}

const default_format = "YYYY-MM-DD";
const ChooseTiming = ({
  data,
  milestones,
  stepCompleted,
  handleStepComplete,
  handleStepBack,
}: Proptypes) => {
  let location = useLocation();
  let jobId: any = null;

  if (location.search) {
    let urlParams = new URLSearchParams(location.search);
    jobId = urlParams.get("jobId");
  }

  const setCurrentDateWithoutTime = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  };
  const [range, setRange] = useState<{ [index: string]: any }>({
    startDate: setCurrentDateWithoutTime(), // ''
    endDate: setCurrentDateWithoutTime(),
    key: "selection",
  });
  const [singleDayRange, setSingleDayRange] = useState<number | null>(
    data.isSingleDayJob ? 2 : 1
  );
  const [singleDayModal, setSingleDayModal] = useState<boolean>(false);
  const [formattedDates, setFormattedDates] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (stepCompleted) {
      if (jobId) {
        let startDt = moment(data.from_date, "YYYY-MM-DD").isSameOrAfter(
          moment().format("YYYY-MM-DD")
        )
          ? moment(data.from_date).toDate()
          : "";
        let endDt = moment(data.to_date, "YYYY-MM-DD").isSameOrAfter(
          moment().format("YYYY-MM-DD")
        )
          ? moment(data.to_date).toDate()
          : "";
        if (data.isJobRepublish) {
          if (!startDt) {
            startDt = new Date();
          }
          if (!endDt) {
            endDt = new Date();
          }
        }
        setRange({
          startDate: startDt,
          endDate: endDt,
          key: "selection",
        });
        handleCheck({ startDate: startDt, endDate: endDt });
      } else {
        setRange({
          startDate: data.from_date
            ? moment(data.from_date).toDate()
            : new Date(),
          endDate: data.to_date ? moment(data.to_date).toDate() : "",
          key: "selection",
        });
      }
    }
  }, [data, stepCompleted]);

  useEffect(() => {
    if (singleDayRange === 2) {
      if (!data.isSingleDayJob) {
        setSingleDayModal(true);
      }
    } else if (singleDayRange === 1) {
      handleCheck(range);
    }
  }, [singleDayRange, range]);

  const handleChange = (item: any) => {
    let mile: any = milestones;
    if (mile?.length) {
      let start_selection: any = moment(item.selection.startDate).format(
        "MM-DD-YYYY"
      );
      let end_selection: any = moment(item.selection.endDate).isValid()
        ? moment(item.selection.endDate).format("MM-DD-YYYY")
        : null;
      let item_find: any = false;

      mile.forEach((item_date: any) => {
        let start: any = item_date.from_date;
        let end: any = moment(item_date.to_date).isValid()
          ? item_date.to_date
          : null;

        if (start && end) {
          if (
            moment(start_selection).isAfter(start) ||
            moment(end_selection).isBefore(end)
          ) {
            item_find = true;
          }
        }

        if (start && !end) {
          if (moment(start_selection).isAfter(start)) {
            item_find = true; // true;
          }
        }

        if (start_selection && end_selection && !end) {
          if (
            moment(start).isSameOrAfter(start_selection) &&
            moment(start).isSameOrBefore(end_selection)
          ) {
            item_find = false;
          } else {
            item_find = true;
          }
        }
      });

      if (item_find && !jobId) {
        setShowToast(true, "Please check the milestone dates");
        return;
      }
    }
    setRange(item.selection);
    handleCheck(item.selection);
    console.log(
      _.isEqual(item.selection.startDate, item.selection.endDate),
      "val",
      _.isEqual(item.selection, range),
      singleDayRange
    );
    if (
      (_.isEqual(item.selection.startDate, item.selection.endDate) &&
        singleDayRange === null) ||
      !_.isEqual(item.selection, range)
    ) {
      setSingleDayRange(1);
      return;
    }
    if (
      _.isEqual(item.selection.startDate, item.selection.endDate) &&
      _.isEqual(item.selection, range) &&
      singleDayRange === 1
    ) {
      setSingleDayRange(2);
      return;
    }
    if (
      _.isEqual(item.selection.startDate, item.selection.endDate) &&
      _.isEqual(item.selection, range) &&
      singleDayRange === 2
    )
      return;
    if (singleDayRange === 1 || singleDayRange === 2) setSingleDayRange(null);
  };

  const handleCheck = (item: any) => {
    let from_date = moment(item.startDate).format(default_format);
    let to_date = moment(item.endDate).format(default_format);
    setFormattedDates({ from_date, to_date });
    if (
      moment(from_date, default_format).isAfter(moment(to_date, default_format))
    ) {
      // isAfter
      setError("finish date is greater then the start date.");
    } else {
      setError("");
    }
  };

  const handleContinue = () => {
    handleStepComplete({
      ...formattedDates,
      ...(singleDayRange === 2
        ? { isSingleDayJob: true }
        : { isSingleDayJob: false }),
    });
  };

  const checkDisable = () => {
    if (range?.startDate && range?.startDate !== "Invalid date") {
      return false;
    }
    return true;
  };

  return (
    <div className="app_wrapper">
      <div className="section_wrapper">
        <div className="custom_container">
          <Dialog
            open={singleDayModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Are you sure you want to create single day job?"}
            </DialogTitle>
            <DialogActions>
              <Button
                onClick={() => {
                  setSingleDayModal(false);
                }}
                color="primary"
              >
                {"Yes"}
              </Button>
              <Button
                onClick={() => {
                  setSingleDayModal(false);
                  setSingleDayRange(1);
                }}
                color="primary"
                autoFocus
              >
                {"No"}
              </Button>
            </DialogActions>
          </Dialog>

          <div className="form_field">
            <div className="flex_row">
              <div className="flex_col_sm_5">
                <div className="relate">
                  <button className="back" onClick={handleStepBack}></button>
                  <span className="title">Timing</span>
                </div>
                <p className="commn_para">
                  {"Choose the start and finish day of your job"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex_row">
            <div className="flex_col_sm_8">
              <div className="form_field">
                <DateRangePicker
                  ranges={[range]}
                  onChange={handleChange}
                  months={2}
                  direction="horizontal"
                  moveRangeOnFirstSelection={false}
                  rangeColors={["#fee600", "#b5b5b5"]}
                  showDateDisplay={false}
                  showSelectionPreview={true}
                  showPreview={true}
                  minDate={new Date()}
                  maxDate={moment().add(2, "years").toDate()}
                  fixedHeight={true}
                />
              </div>
              <span className="error_msg mtb-15">{error}</span>
              <div className="form_field">
                <button
                  className={`fill_btn full_btn btn-effect ${
                    checkDisable() ? "disable_btn" : ""
                  }`}
                  onClick={handleContinue}
                >
                  {"Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseTiming;
