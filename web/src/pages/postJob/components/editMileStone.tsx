import React, { Component } from 'react';
import moment from 'moment';

interface Props {
    data: any;
    stepCompleted: boolean;
    editMileStone: any;
    editMilestoneTiming: any;
    handleStepComplete: (data: any) => void;
    addTimeToMileStone: (data: any, index: any, skip?: any) => void;
    handleStepForward: (data: any) => void;
    newMileStoneScreen: (data: any) => void;
    handleStepMileStone: (data: any, index: any) => void;
    handleStepBack: () => void;
    milestones: any;
}

interface State {
    milestone_name: string,
    isPhotoevidence: boolean,
    from_date: string,
    to_date: string,
    recommended_hours: any
    errors: any;
}

// for error messages
const label: { [index: string]: string } = {
    milestone_name: 'Milestone Name',
    from_date: 'From Date',
    recommended_hours: 'Recommended Hours',
}

const pattern = "^([0-9][0-9]?[0-9]?[0-9]?[0-9]):[0-9][0-9]$";
export default class EditMilestone extends Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            milestone_name: '',
            isPhotoevidence: true,
            from_date: '',
            to_date: '',
            recommended_hours: '',
            errors: {
                milestone_name: '',
                from_date: '',
                recommended_hours: '',
                pattern_error: ''
            }
        }
    }

    checkIsDateValid = (milestones: any, time: any) => {
        const { editMileStone } = this.props;
        let checkIsValid: any = true;
        let isSkip: any = true;

        let filterMilestone: any = [];

        if (milestones.length > 1) {
            filterMilestone = milestones.filter((mile_item: any, index: any) => index !== editMileStone);
            filterMilestone.forEach((mile: any) => {
                let validStart = moment(mile.from_date).isValid();
                let validEnd = moment(mile.to_date).isValid();

                let validStartInput = moment(time.from_date).isValid();
                let validEndInput = moment(time.to_date).isValid();

                if (validStart && validEnd) {
                    if (validStartInput && validEndInput) {
                        if (moment(time.from_date).isSameOrAfter(mile.from_date) && (moment(time.to_date).isSameOrBefore(mile.to_date) ||
                            moment(time.to_date).isSameOrAfter(mile.from_date))
                        ) {
                            checkIsValid = false;
                            isSkip = false;
                        }
                    }

                    if (validStartInput && !validEndInput) {
                        if (
                            moment(time.from_date).isSameOrAfter(mile.from_date) &&
                            moment(time.from_date).isSameOrBefore(mile.to_date)) {
                            checkIsValid = false;
                            isSkip = false;
                        }
                    }
                }

                if (validStart && validStartInput && !validEnd) {
                    if (moment(time.from_date).isSame(mile.from_date) || moment(time.to_date).isSame(mile.from_date)) {
                        checkIsValid = false;
                        isSkip = false;
                    }
                }

                if (validEnd && validEndInput) {
                    if (moment(time.to_date).isSame(mile.to_date)) {
                        checkIsValid = false;
                        isSkip = false;
                    }
                }

            });
        }
        return { checkIsValid, skip: isSkip };
    }

    componentDidMount() {
        const { editMileStone, milestones, editMilestoneTiming } = this.props;
        let item = milestones[editMileStone];

        if (item && Object.keys(item).length) {
            let { milestone_name, isPhotoevidence, from_date, to_date, recommended_hours } = item;

            let isValid: any = null;
            let isSkip: any = null;

            if (editMilestoneTiming && Object.keys(editMilestoneTiming).length) {
                const { checkIsValid, skip } = this.checkIsDateValid(milestones, editMilestoneTiming);
                isValid = checkIsValid;
                isSkip = skip;

                if (isValid) {
                    if ('from_date' in editMilestoneTiming) {
                        from_date = editMilestoneTiming?.from_date;
                    }
                    if ('to_date' in editMilestoneTiming) {
                        to_date = editMilestoneTiming?.to_date;
                    }
                }
            }

            this.setState({
                from_date: from_date,
                isPhotoevidence: isPhotoevidence === undefined ? false : isPhotoevidence,
                milestone_name: milestone_name,
                recommended_hours: recommended_hours,
                to_date: to_date,
            }, () => {
                if (isValid !== null) {
                    this.props.addTimeToMileStone(
                        { from_date, to_date },
                        editMileStone,
                        isSkip
                    )
                }
            })
        }
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
        this.setItems();
        this.props.handleStepForward(6);
    }


    setItems = () => {
        const {  handleStepMileStone, editMileStone } = this.props;
        let { milestone_name, from_date, to_date, isPhotoevidence, recommended_hours } = this.state;
        let milestone_index = editMileStone;
        handleStepMileStone({
            "milestone_name": milestone_name,
            "isPhotoevidence": isPhotoevidence,
            "from_date": from_date, // milestones[milestone_index]?.from_date || '',
            "to_date": to_date, //milestones[milestone_index]?.to_date || '',
            "recommended_hours": recommended_hours
        }, milestone_index);
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
                return !value.length ? `${label[name]} is required.` : value.length > 50 ? 'Maximum 50 characters are allowed.' : '';
            case 'from_date':
                return !value.length ? `${label[name]} is required.` : '';
            case 'recommended_hours':
                return this.checkHoursVal(value, label, name);
        }
    }

    checkErrors = () => {
        let { milestone_name, recommended_hours, errors: { pattern_error } } = this.state;
        if (milestone_name?.length) {
            let errorItems: any = {};
            let error_1 = this.isInvalid('milestone_name', milestone_name);
            let error_3 = this.isInvalid('recommended_hours', recommended_hours);
            errorItems['milestone_name'] = error_1;


            if (milestone_name?.length) {
                errorItems['milestone_name'] = error_1;
            }

            if (recommended_hours?.length && error_3?.length) {
                errorItems['recommended_hours'] = error_3;
            }

            if (JSON.stringify(this.state.errors) !== JSON.stringify(errorItems)) {
                this.setState({ errors: errorItems })
            }

            if (!error_1?.length && (recommended_hours?.length === 0 || !pattern_error?.length)) {
                return false;
            }
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

    render() {
        const { handleStepForward, editMileStone } = this.props;
        let { milestone_name, isPhotoevidence, recommended_hours, from_date, to_date, errors } = this.state;
        let from_date_format = from_date;
        let to_date_format = to_date;

        let check_errors = this.checkErrors();

        return (
            <div className="app_wrapper">
                <div className="section_wrapper">
                    <div className="custom_container">
                        <div className="form_field">
                            <div className="flex_row">
                                <div className="flex_col_sm_5">
                                    <div className="relate">
                                        <button
                                            className="back"
                                            onClick={() => { handleStepForward(6) }}>
                                        </button>
                                        <span className="title">
                                            {`Edit Milestone ${editMileStone + 1}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex_row">
                            <div className="flex_col_sm_5">
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
                                            onClick={() => { handleStepForward(8) }}
                                            className="fill_btn fill_grey_btn choose_btn">
                                            {this.renderTimeWithCustomFormat(
                                                from_date_format,
                                                to_date_format,
                                                'MM-DD-YYYY',
                                                ['DD MMM', 'DD MMM YYYY']
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
                                                            error_item['pattern_error'] = 'Time should be in multiples of 15 like 10:15, 10:30';
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
                                    <span className="error_msg">{recommended_hours?.length === 0 ? '' : errors.recommended_hours}</span>
                                    <span className="error_msg">{recommended_hours?.length === 0 ? '' : errors.pattern_error}</span>
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
                </div>

            </div>
        )
    }
}