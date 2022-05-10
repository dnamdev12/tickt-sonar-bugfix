import React, { useState, useEffect } from 'react';
// @ts-ignore
import { DateRangePicker } from '../../../../plugins/react-date-range/dist/index';
import '../../../../plugins/react-date-range/dist/styles.css';
import '../../../../plugins/react-date-range/dist/theme/default.css';
import moment from 'moment';
import { setShowToast } from '../../../../redux/common/actions';

interface Proptypes {
    items: any;
    toggleCalenderTime: (data?: any) => void;
}

const default_format = 'YYYY-MM-DD';
const STRING_ERROR = 'Selected data is fully engage';
const ChooseTimings = ({
    toggleCalenderTime,
    items 
}: Proptypes) => {
    const [range, setRange] = useState<{ [index: string]: string | Date }>({
        startDate: '', //new Date(),
        endDate: '',//new Date(),
        key: 'selection',
    });
    const [formattedDates, setFormattedDates] = useState({});
    const [error, setError] = useState('');

    const handleChange = (item: any) => {
        setRange(item.selection);
        handleCheck(item.selection);
    };


    const onMountCallable = () => {
        let count_times: any = {};
        let milestones = items;

        let filteredItems = milestones.filter((item: any) => {
            let to_date = item?.to_date;
            let from_date = item?.from_date;

            if (from_date) {
                count_times[from_date] = 0;
            }

            if (to_date) {
                count_times[to_date] = 0;
            }

            if (Object.keys(item).length && item?.from_date) {
                return item;
            }

            let ifMatch = milestones.find((item_: any) => {
                if (item_.to_date === to_date && from_date === item_.from_date) {
                    return item_;
                }
            })

            return ifMatch
        });


        if (filteredItems?.length) {
            filteredItems.forEach((item: any, index: any) => {
                let to_date = item?.to_date;
                let from_date = item?.from_date;

                let color_index = index;
                if (index > 500) {
                    // make random index from the limit 0 to 500.
                    // if the index is greater than 500.
                    color_index = Math.floor((Math.random() * 500) + 1);
                }

                if (!to_date && from_date) {
                    if (count_times[from_date] > -1) {
                        count_times[from_date]++;
                    }

                    let from_element: any = document.getElementsByClassName(`color_${count_times[from_date]}_${from_date}`);
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
                    let from_element: any = document.getElementsByClassName(`color_${count_times[from_date]}_${from_date}`);
                    if (from_element) {
                        let element_from = null;

                        if (from_element?.length > 1) {
                            if (!from_element[0].parentElement.parentElement.classList.contains('rdrDayPassive')) {
                                element_from = from_element[0];
                            } else {
                                element_from = from_element[1];
                            }
                        } else {
                            element_from = from_element[0];
                        }

                        if (element_from) {
                            element_from.classList.add(`color_${color_index}`)
                        }
                    }

                    let to_element: any = document.getElementsByClassName(`color_${count_times[to_date]}_${to_date}`);
                    if (to_element) {
                        let element_to = null;
                        if (to_element?.length > 1) {
                            if (!to_element[0].parentElement.parentElement.classList.contains('rdrDayPassive')) {
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
    }

    useEffect(() => {
        console.log('Did Mount')
        const interval = setInterval(() => {
            onMountCallable();
         }, 1500);

         return () => {
           console.log(`clearing interval`);
           clearInterval(interval);
         };
    }, [])

    const handleCheck = (item: any) => {
        let from_date = moment(item.startDate).format(default_format);
        let to_date = moment(item.endDate).format(default_format);
        setFormattedDates({ from_date, to_date });
        if (moment(from_date, default_format).isAfter(moment(to_date, default_format))) { // isAfter
            setError('finish date is greater then the start date.');
        } else {
            setError('');
        }
    }



    const checkBeforeExist = (time: any) => {
        let count_times: any = {};
        let catch_boolean: boolean = true;
        let milestoneItems: any = items;

        milestoneItems.forEach((mile: any) => {

            let mile_start = mile.from_date;
            let mile_end = mile.to_date;

            let time_start = time.from_date;
            let time_end = time.to_date;


            if (count_times[mile_start] == undefined) {
                count_times[mile_start] = 1
            } else {
                count_times[mile_start] = count_times[mile_start] + 1;
            }


            if (count_times[mile_end] == undefined) {
                count_times[mile_end] = 1
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
    }

    const handleContinue = () => {
        let moment_start = moment(range.startDate).format('MM-DD-YYYY')
        let moment_end = moment(range.endDate).format('MM-DD-YYYY')
        let timings = {
            from_date: range.startDate !== '' ? moment_start : '',
            to_date: (moment_start === moment_end || range.endDate === '') ? '' : moment_end
        }
  
        let isChecked = checkBeforeExist(timings);
        if (isChecked) {
            toggleCalenderTime(range);
        }
    }

    const checkDisable = () => {
        if (range?.startDate && range?.startDate !== 'Invalid date') {
            return false;
        }
        return true;
    }

    return (
        <div className="custom_container">
            <div className="form_field">
                <div className="flex_row">
                    <div className="flex_col_sm_5">
                        <div className="relate">
                            <button
                                onClick={() => {
                                    toggleCalenderTime();
                                }}
                                style={{ zIndex: 999 }}
                                className="back">
                            </button>
                            <span
                                onClick={() => {
                                    onMountCallable();
                                }}
                                className="title">
                                {'Timing'}
                            </span>
                        </div>
                        <p className="commn_para">
                            {'Select a start and end date, or a due date.'}
                            {/* {"if you tab the back arrow, you lose the `draft`. Can we save it ?"} */}
                            {/* {'Choose the start and finish day of your job'} */}
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
                            fixedHeight={true}
                            minDate={new Date()}
                        />
                    </div>
                    <span className="error_msg mtb-15">{error}</span>
                    <div className="form_field">
                        <button
                            className={`fill_btn full_btn btn-effect ${checkDisable() ? 'disable_btn' : ''}`}
                            onClick={handleContinue}>
                            {'Continue'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChooseTimings;
