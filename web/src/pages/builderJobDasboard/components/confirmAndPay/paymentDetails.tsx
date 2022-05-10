import React, { useEffect, useState } from 'react'
import cardValidator from "card-validator";
import moment from 'moment';
import { addNewCard, updateCard } from '../../../../redux/jobs/actions'
import { moengage, mixPanel } from '../../../../services/analyticsTools';
import { MoEConstants } from '../../../../utils/constants';

const defaultValues = {
    cardId: 'xxx',
    number: '',
    cardholderName: '',
    date: '',
    cvv: '',
    fetched: false
}

const PaymentDetails = (props: any) => {
    const { editItem } = props;
    const [stateData, setStateData] = useState(defaultValues);
    const [isChange, setUpdateChange] = useState(false);
    const [force, forceUpdate] = useState({});
    const [errors, setErrors] = useState({
        number: '',
        cardholderName: '',
        date: '',
        cvv: '',
        cardType: '',
    });

    useEffect(() => {
        if (editItem) {
            setStateData(editItem);
        }
    }, [editItem])

    useEffect(() => {
        console.log({ isChange })
        if (Array.isArray(force)) {
            forceUpdate({})
        } else {
            forceUpdate([])
        }
    }, [isChange])

    const handleCheck = () => {
        if (
            !stateData?.number?.length ||
            !stateData?.date?.length ||
            !stateData?.cardholderName.length ||
            !stateData?.cvv?.length
        ) {
            return true
        }

        return false;
    }

    const handleContinue = async () => {
        let splitItem: any = [];
        if (stateData?.date?.length) {
            splitItem = stateData?.date.split('/');
        }

        let data: any = {
            "number": stateData?.number,
            "exp_month": splitItem[0],
            "exp_year": `20${splitItem[1]}`,
            "cvc": stateData?.cvv,
            "name": stateData?.cardholderName
        }

        if (!stateData?.fetched) {
            let result = await addNewCard(data);
            if (result?.success) {
                moengage.moE_SendEvent(MoEConstants.ADDED_PAYMENT_DETAILS, { timeStamp: moengage.getCurrentTimeStamp() });
                mixPanel.mixP_SendEvent(MoEConstants.ADDED_PAYMENT_DETAILS, { timeStamp: moengage.getCurrentTimeStamp() });
                props.backToScreen();
            }
        } else {
            if (stateData?.cardId) {
                data['cardId'] = stateData?.cardId;
                delete data.cvc;
                delete data.number;
            }
            let result = await updateCard(data);
            if (result?.success) {
                // props.setDetials(stateData)
                props.backToScreen();
            }
        }
    }

    const checkIsValid = ({ name, value }: any) => {
        if (name === 'name') {
            if (!value.length) {
                return 'Account Name is required';
            } else {
                if (value.length > 50) {
                    return 'Maximum 50 characters are allowed';
                }
            }
        }

        if (name === 'cardholderName') {
            if (!value.length) {
                return 'Cardholder Name is required';
            } else {
                if (value.length > 50) {
                    return 'Maximum 50 characters are allowed';
                }
            }
        }

        if (name === 'date') {
            if (!value.length) {
                return 'Expiration Date is required';
            } else {
                console.log({
                    check: checkValidExpiration(value),
                    value
                })
                if (!checkValidExpiration(value)) {
                    return `Please add a valid Expiration Date`;
                }
            }
        }

        if (name === 'number') {
            console.log({
                name,
                value,
                isValid: cardValidator.number(value).isValid
            })
            if (!value.length) {
                return 'Card Number is required';
            } else {
                if (!cardValidator.number(value).isValid) {
                    return 'Please enter a valid Card Number'
                }
            }
        }

        if (name === 'cvv') {
            if (!value.length) {
                return 'CVV/CVC is required';
            } else {
                if (value?.length > 3) {
                    return 'Maximum 3 characters are allowed';
                }
            }
        }

        return ''

    }

    const setErrorsOnChange = ({ name, value }: any) => {
        setErrors((prev: any) => ({
            ...prev,
            [name]: checkIsValid({ name, value }) //value.length > 50 ? 'Maximum 50 characters are allowed.' : '',
        }));
    }


    const checkValidExpiration = (date: any) => {
        let currentDate = moment().format('MM/YY');
        if ((date).match('^(0[1-9]|1[0-2])\/?([0-9]{2})$')) {
            if (moment(date, 'MM/YY').isSameOrAfter(moment(currentDate, 'MM/YY'))) {
                return true;
            }
        }
        return false;
    }

    let isTrue = Object.values(stateData).includes('');
    let isErrors: any = false;
    let isError = handleCheck();

    let errorValues = Object.values(errors);
    if (errorValues?.length) {
        let isHave = errorValues.find((item: any) => item !== '');
        if (isHave) {
            isErrors = true;
        }
    }

    return (
        <div className="flex_row">
            <div className="flex_col_sm_8">
                <div className="relate">
                    <button className="back" onClick={() => { props.backToScreen() }}></button>
                    <span className="xs_sub_title">{props?.jobName}</span>
                    <>
                        <div className="edit_delete">
                        </div>
                    </>
                </div>
                <span className="sub_title">Payment Details</span>
                <p className="commn_para">Enter your bank account details</p>

                <div className="form_field">
                    <label className="form_label">
                        {'Card Number'}
                    </label>
                    <div className="text_field">
                        {stateData?.fetched ?
                            <input
                                type="text"
                                placeholder="Enter Card Number"
                                name="account_number"
                                value={`XXXX XXXX XXXX ${stateData?.number}`}
                                onChange={(e: any) => {
                                    setStateData((prev: any) => ({ ...prev, number: e.target.value }));
                                    setErrorsOnChange({ name: 'number', value: e.target.value });
                                }}
                                style={{ border: '1px solid #dfe5ef', padding: '14px 18px', backgroundColor: '#dfe5ef70' }}
                                maxLength={10}
                                readOnly={true}
                            />
                            :
                            <input
                                type="number"
                                placeholder="Enter Card Number"
                                name="account_number"
                                value={stateData?.number}
                                onChange={(e: any) => {
                                    setStateData((prev: any) => ({ ...prev, number: e.target.value }));
                                    setErrorsOnChange({ name: 'number', value: e.target.value });
                                }}
                                maxLength={10}
                                readOnly={false}
                            />
                        }


                    </div>
                    <span className="error_msg">{errors.number}</span>
                </div>

                <div className="form_field">
                    <label className="form_label">
                        {'Cardholder Name'}
                    </label>
                    <div className="text_field">
                        <input
                            type="text"
                            placeholder="Enter Cardholder Name"
                            name="cardholder_name"
                            value={stateData?.cardholderName}
                            onChange={(e: any) => {
                                setStateData((prev: any) => ({ ...prev, cardholderName: (e.target.value).trimLeft() }));
                                setErrorsOnChange({ name: 'cardholderName', value: e.target.value });
                                if (stateData?.fetched) {
                                    if (editItem?.cardholderName !== stateData?.cardholderName) {
                                        setUpdateChange(() => true);
                                    } else {
                                        setUpdateChange(() => false);
                                    }
                                }
                            }}
                            // maxLength={50}
                            readOnly={false}
                        />
                    </div>
                    <span className="error_msg">
                        {errors.cardholderName}
                    </span>
                </div>

                <div className="flex_row">
                    <div className="flex_col_sm_6">
                        <div className="form_field">
                            <label className="form_label">
                                {'Expiration Date'}
                            </label>
                            <div className="text_field">
                                <input
                                    type="text"
                                    placeholder="Enter Expiration Date"
                                    name="bsb_number"
                                    value={stateData?.date}
                                    onChange={(e: any) => {
                                        setStateData((prev: any) => ({ ...prev, date: (e.target.value).trimLeft() }))
                                        setErrorsOnChange({ name: 'date', value: e.target.value });
                                        if (stateData?.fetched) {
                                            if (editItem?.date !== stateData?.date) {
                                                setUpdateChange(() => true);
                                            } else {
                                                setUpdateChange(() => false);
                                            }
                                        }
                                    }}
                                    maxLength={7}
                                    readOnly={false}
                                />
                            </div>
                            <span className="error_msg">
                                {errors.date}
                            </span>
                        </div>
                    </div>
                    <div className="flex_col_sm_6">
                        <div className="form_field">
                            <label className="form_label">
                                {'CVV/CVC'}
                            </label>
                            <div className="text_field">
                                {stateData?.fetched ?
                                    <input
                                        type="text"
                                        placeholder="Enter CVV/CVC"
                                        name="bsb_number"
                                        value={'XXX'}
                                        onChange={(e: any) => {
                                            setStateData((prev: any) => ({ ...prev, cvv: e.target.value }));
                                            setErrorsOnChange({ name: 'cvv', value: e.target.value });
                                        }}
                                        maxLength={3}
                                        style={{ border: '1px solid #dfe5ef', padding: '14px 18px', backgroundColor: '#dfe5ef70' }}
                                        readOnly={true}
                                    />
                                    :
                                    <input
                                        type="number"
                                        placeholder="Enter CVV/CVC"
                                        name="bsb_number"
                                        value={stateData?.cvv}
                                        onChange={(e: any) => {
                                            setStateData((prev: any) => ({ ...prev, cvv: e.target.value }));
                                            setErrorsOnChange({ name: 'cvv', value: e.target.value });
                                        }}
                                        maxLength={3}
                                        readOnly={false}
                                    />
                                }
                            </div>
                            <span className="error_msg">{errors.cvv}</span>
                        </div>
                    </div>
                </div>
                {stateData?.fetched ? (
                    <button
                        onClick={() => { handleContinue() }}
                        className={`fill_btn full_btn btn-effect ${!isTrue && !isError && !isErrors && isChange ? '' : 'disable_btn'}`}>
                        {!props?.hideExtra ? 'Continue' : 'Update Card'}
                    </button>
                ) : (
                    <button
                        onClick={() => { handleContinue() }}
                        className={`fill_btn full_btn btn-effect ${!isTrue && !isError && !isErrors ? '' : 'disable_btn'}`}>
                        {!props?.hideExtra ? 'Continue' : 'Save Card'}
                    </button>
                )}
            </div>
        </div >
    )
}

export default PaymentDetails;