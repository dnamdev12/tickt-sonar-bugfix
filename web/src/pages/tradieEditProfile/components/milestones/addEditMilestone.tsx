import React, { Component } from 'react';
import moment from 'moment';
import ChooseTimings from './chooseTimings';

interface Props {
    item: any;
    items: any;
    index: any;
    backToScreen: (data?: any,) => void;
}

interface State {
    milestone_name: string,
    isPhotoevidence: boolean,
    from_date: string,
    to_date: string,
    recommended_hours: any
    errors: any;
    order: number;
    toggleAddTimings: boolean,
}

// for error messages
const label: { [index: string]: string } = {
    milestone_name: 'Milestone Name',
    from_date: 'From Date',
    recommended_hours: 'Recommended Hours',
}

const pattern = "^([0-9][0-9]?[0-9]?[0-9]?[0-9]):[0-9][0-9]$";
class AddEditMilestone extends Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            milestone_name: '',
            isPhotoevidence: false,
            from_date: '',
            to_date: '',
            recommended_hours: '',
            order: -1,
            errors: {
                milestone_name: '',
                from_date: '',
                recommended_hours: '',
                pattern_error: ''
            },
            toggleAddTimings: false
        }
    }

    componentDidMount() {
        let props = this.props;
        let props_item: any = props?.item;

        this.setState({
            from_date: props_item?.from_date,
            isPhotoevidence: props_item?.isPhotoevidence,
            milestone_name: props_item?.milestone_name,
            recommended_hours: props_item?.recommended_hours,
            to_date: props_item?.to_date,
            order: props_item?.order,
        })
    }

    handleChange = (name: string, value: any) => {
        let error_clone: any = this.state.errors;


        if (name === "milestone_name") {
            value = (value).trimLeft().replace(/[^a-zA-Z|0-9 ]/g, "")
        }

        if (name === "recommended_hours") {
            value = (value).trimLeft();
        }


        if (['milestone_name', 'from_date', 'recommended_hours'].includes(name)) {
            error_clone[name] = this.isInvalid(name, value)
        }
        this.setState({ ...this.state, [name]: value, errors: error_clone });
    }

    handleContinue = () => {
        let props = this.props;

        let {
            milestone_name,
            isPhotoevidence,
            from_date,
            to_date,
            recommended_hours,
            order
        } = this.state;

        this.props.backToScreen({
            index: props?.index,
            data: {
                milestone_name,
                isPhotoevidence,
                from_date,
                to_date,
                recommended_hours,
                order: order === -1 ? props?.items?.length + 1 : order
            }
        })
    }

    checkHoursVal = (value: any, lable: any, name: any) => {
        if (value?.length) {
            if (value.match(pattern) !== null) {
                let splitItem = value.split(':')[1];
                let IntItem = +splitItem;
                let conditionItem = IntItem % 15 === 0;

                if (!conditionItem) {
                    return 'Time should be in mutiples of 15 like 10:15, 10:30';
                }
            } else {
                return 'Please enter a valid pattern like : 10:15';
            }
        } else {
            return `${label[name]} is required.`
        }
    }

    isInvalid = (name: string, value: string) => {
        switch (name) {
            case 'milestone_name':
                return !value?.length ? `${label[name]} is required.` : value?.length > 50 ? 'Maximum 50 characters are allowed.' : '';
            case 'from_date':
                return !value?.length ? `${label[name]} is required.` : '';
            case 'recommended_hours':
                return this.checkHoursVal(value, label, name);
        }
    }

    checkErrors = () => {
        let {
            from_date,
            milestone_name,
            recommended_hours,
        } = this.state;


        let error_1 = this.isInvalid('milestone_name', milestone_name);
        let error_2 = this.isInvalid('from_date', from_date);
        let error_3 = this.isInvalid('recommended_hours', recommended_hours);

        let errorItems: any = {};
        errorItems['milestone_name'] = error_1;
        errorItems['from_date'] = error_2;
        errorItems['recommended_hours'] = error_3;

        if (!error_1?.length && !error_2?.length && !error_3?.length) {
            return false;
        }
        return true;
    }

    renderTimeWithCustomFormat = (fromDate: any, toDate: any, format: any, formatSet?: any) => {

        if (moment(fromDate, format).isValid() && !moment(toDate, format).isValid()) {
            return `${moment(fromDate, format).format('DD MMM')}`
        }

        if (moment(fromDate, format).isValid() && moment(toDate, format).isValid()) {
            let yearEnd = moment().endOf("year").toISOString();
            let monthEnd = moment(fromDate, format).endOf("month").toISOString();

            let item: any = moment(toDate, format).diff(moment(fromDate, format), 'months', true);
            let item_year: any = moment(toDate, format).diff(moment(fromDate, format), 'years', true);

            let monthDiff = parseInt(item.toString());
            let yearDiff = parseInt(item_year.toString());

            if (yearDiff > 0 || moment(toDate, format).isAfter(yearEnd) || moment(toDate, format).isAfter(yearEnd)) {
                return `${moment(fromDate, format).format(formatSet[1])} - ${moment(toDate, format).format(formatSet[1])}`
            }
            if (monthDiff > 0 || moment(toDate, format).isAfter(monthEnd)) {
                return `${moment(fromDate, format).format(formatSet[0])} - ${moment(toDate, format).format(formatSet[0])}`
            }
            return `${moment(fromDate, format).format(formatSet[0])} - ${moment(toDate, format).format(formatSet[0])}`
        }

        return 'Choose';
    }

    toggleCalenderTime = (data?: any) => {
        this.setState({
            toggleAddTimings: false,
            from_date: data && moment(data?.startDate).isValid() ? moment(data?.startDate).format('MM-DD-YYYY') : '',
            to_date: data && moment(data?.endDate).isValid() ? moment(data?.endDate).format('MM-DD-YYYY') : '',
        })
    }

    render() {
        let { milestone_name, isPhotoevidence, recommended_hours, from_date, to_date, errors } = this.state;
        let from_date_format = from_date;
        let to_date_format = to_date;
        let props = this.props;
        let check_errors = this.checkErrors();

        let props_item = props?.item;
        let props_items = props?.items;
        let props_index = props?.index;

        if (this.state.toggleAddTimings) {
            return (
                <ChooseTimings
                    toggleCalenderTime={this.toggleCalenderTime}
                    items={props_items}
                />
            )
        }

        return (
            <div className="custom_container">
                <div className="form_field">
                    <div className="flex_row">
                        <div className="flex_col_sm_8">
                            <div className="relate">
                                <button
                                    className="back"
                                    style={{ zIndex: 999 }}
                                    onClick={() => {
                                        props.backToScreen();
                                    }}>
                                </button>
                                <span className="title">
                                    {`${props_item == null ? `Milestone ${props_items?.length + 1}` : `Edit Milestone ${props_index + 1}`}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex_row">
                    <div className="flex_col_sm_7">
                        <div className="form_field">
                            <label className="form_label">Milestone name</label>
                            <div className="text_field">
                                <input
                                    type="text"
                                    placeholder="Enter Milestone name"
                                    onChange={(e) => { this.handleChange('milestone_name', e.target.value) }}
                                    value={milestone_name}
                                    name="milestone_name" />
                            </div>
                            <span className="error_msg">{errors?.milestone_name}</span>
                        </div>
                        <div className="form_field">

                            <div className="checkbox_wrap agree_check">
                                <input
                                    onChange={() => { this.handleChange('isPhotoevidence', !isPhotoevidence) }}
                                    checked={isPhotoevidence}
                                    className="filter-type filled-in"
                                    type="checkbox"
                                    id="milestone1" />
                                <label htmlFor="milestone1">
                                    <b>
                                        {'Photo evidence required'}
                                    </b>
                                </label>
                            </div>
                        </div>
                        <div className="form_field">
                            <div className="f_spacebw">
                                <label className="form_label">Duration of milestone (optional)</label>
                                <button
                                    onClick={() => {
                                        this.setState({
                                            toggleAddTimings: true
                                        })
                                    }}
                                    className="fill_btn fill_grey_btn choose_btn">
                                    {this.renderTimeWithCustomFormat(
                                        from_date_format,
                                        to_date_format,
                                        'MM-DD-YYYY',
                                        ['DD MMM', 'DD MM YYYY']
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="form_field">
                            <label className="form_label">Estimated hours (optional)</label>
                            <div className="text_field">
                                <input
                                    onChange={(e) => {
                                        this.setState({ recommended_hours: (e.target.value).trimLeft() }, () => {
                                            let rh_value = this.state.recommended_hours;
                                            let error_item = this.state.errors;
                                            if (!rh_value?.length || rh_value.match(pattern) !== null) {
                                                error_item['pattern_error'] = '';
                                                let splitItem = rh_value.split(':')[1];
                                                let IntItem = +splitItem;
                                                let conditionItem = IntItem % 15 === 0;
                                                if (!conditionItem) {
                                                    error_item['pattern_error'] = 'Time should be in mutiples of 15 like 10:15, 10:30';
                                                }
                                            } else {
                                                error_item['pattern_error'] = 'Please enter a valid pattern like : 10:15';
                                            }
                                            this.setState({ errors: error_item });
                                        });
                                    }}
                                    value={recommended_hours}
                                    autoComplete="off"
                                    type="text"
                                    placeholder="Enter Estimated hours"
                                    name="recommended_hours" />
                            </div>
                            <span className="error_msg">{errors.recommended_hours}</span>
                            <span className="error_msg">{errors.pattern_error}</span>
                        </div>

                        <div className="form_field">
                            <button
                                onClick={this.handleContinue}
                                className={`fill_btn full_btn btn-effect ${check_errors ? 'disable_btn' : ''}`}>
                                {'Continue'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddEditMilestone;