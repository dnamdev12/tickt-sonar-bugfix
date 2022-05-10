import React, { useEffect, useState } from 'react';
import Select from 'react-select';

interface Proptypes {
  data: any;
  stepCompleted: Boolean;
  handleStepComplete: (data: any) => void;
  handleStepBack: () => void;
}
// "Per hour" and "Fixed price"
const Payment = ({ data, stepCompleted, handleStepComplete, handleStepBack }: Proptypes) => {

  const [paymentDetails, setPaymentDetails] = useState<{ [index: string]: string }>({ pay_type: 'Per hour', amount: '' });
  const [errors, setErrors] = useState({ pay_type: '', amount: '' });
  const [continueClicked, setContinueClicked] = useState(false);
  const [localChanges, setLocationChanges] = useState(false);
  const [reactSelect, setReactSelect] = useState({ value: "Per hour", label: "Per Hour" });

  const [checkType, setCheckType] = useState('1');

  useEffect(() => {
    if (stepCompleted && !localChanges) {
      setPaymentDetails({
        pay_type: data.pay_type || 'Fixed price',
        amount: data.amount
      });

      if (data.quoteJob == '0') {
        if (data.pay_type === 'Per hour') {
          setReactSelect({ value: 'Per hour', label: 'Per Hour' });
        } else {
          setReactSelect({ value: 'Fixed price', label: 'Fixed Price' });
        }
        setCheckType('1');
      } else {
        setCheckType('2');
      }

      setLocationChanges(true);
    }
  }, [stepCompleted, data]);

  // for error messages
  const label: { [index: string]: string } = {
    pay_type: 'Pay Type',
    amount: 'Price',
  }

  const checkDecimal = (name: string, value: string) => {
    let split_values = value.split('.');
    console.log({
      split_values
    })
    if (split_values.length) {
      let first: any = split_values[0];
      let last: any = split_values[1];

      if (last && last?.length > 2) {
        return 'Price field must have maximum 2 digits after decimal';
      }

      if (first && first?.length > 6) {
        return 'Price field must have 6 or less digits before decimal';
      }

      let value_: number = +value;
      if (value_ !== 0 && value_ < 10) {
        return 'Minimum amount value is 10.'
      }
      return ''

    } else {
      return '';
    }
  }
  const isInvalid = (name: string, value: string) => {
    switch (name) {
      case 'pay_type':
        return !value.length ? `${label[name]} is required.` : '';
      case 'amount':
        return !value.length || +value < 1 ? `${label[name]} is required.` : checkDecimal(name, value);
    }
  }

  const handleChange = (value: string, name: string) => {

    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [name]: isInvalid(name, value),
    }));

    setPaymentDetails((prevDetails) => {
      return ({
        ...prevDetails,
        [name]: value,
      })
    })
  };

  const handleContinue = (e: any) => {
    e.preventDefault();
    let hasErrors;

    if (!continueClicked) {
      setContinueClicked(true);


      if (checkType == '2') {
        handleStepComplete({
          quoteJob: '1'
        });
        return
      }

      hasErrors = Object.keys(paymentDetails).reduce((prevError, name) => {
        const hasError = !!isInvalid(name, paymentDetails[name]);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: isInvalid(name, paymentDetails[name]),
        }));
        return hasError || prevError;
      }, false);
    }

    if (!hasErrors) {
      let paymentdt = {
        ...paymentDetails,
        quoteJob: '0'
      };
      console.log({ paymentdt })
      handleStepComplete(paymentdt);

    } else {
      setContinueClicked(false);
    }
  };

  const checkErrors = () => {

    if (checkType == '2') {
      return false;
    }
    let value_1 = paymentDetails['pay_type'];
    let value_2 = paymentDetails['amount'];
    if (value_1 && value_2) {
      let error_1 = isInvalid('pay_type', paymentDetails['pay_type']);
      let error_2 = isInvalid('amount', paymentDetails['amount']);
      if (!error_1?.length && !error_2?.length) {
        return false;
      }
    }
    return true;
  }

  const priceOptions = [
    { value: 'Per hour', label: 'Per Hour' },
    { value: 'Fixed price', label: 'Fixed Price' },
  ];


  const { amount } = paymentDetails;
  return (

    <div className="app_wrapper">
      <div className="section_wrapper">
        <div className="custom_container">
          <div className="form_field">
            <div className="flex_row">
              <div className="flex_col_sm_5">
                <div className="relate">
                  <button className="back" onClick={handleStepBack}></button>
                  <span className="title">Job type</span>
                </div>
              </div>
            </div>
          </div>

          {/* {'CR Change'} */}
          <div className="form_field">
            <div className="checkbox_wrap agree_check">
              <input
                onChange={() => {
                    checkType !== '1' ? setCheckType('1') : setCheckType('0')
                }}
                checked={checkType === '1' ? true : false}
                className="filter-type filled-in"
                type="checkbox"
                id="milestone1" />
              <label htmlFor="milestone1">
              <span className="ft_bold">
                  {'I have a budget'}
                  </span>
                <div className="sub-title">
                  How would you like to pay for it?
                </div>
              </label>
            </div>
          </div>

          <div className="flex_row" style={{ paddingLeft: '35px' }}>
            <div className="flex_col_sm_5">
              <div className="flex_row">
                <div className="flex_col_sm_5">
                  <div className="form_field">
                    <div className="text_field">
                      <input
                        type="number"
                        placeholder="Price"
                        name="Price"
                        className="detect_input_ltr"
                        min="10"
                        step=".01"
                        required
                        value={Number(amount) ? amount : ''}
                        readOnly={checkType === '2' ? true : false}
                        onChange={({ target: { value } }) => handleChange(value, 'amount')}
                      />
                      <span className="detect_icon_ltr dollar">$</span>
                    </div>
                    <span className="error_msg mtb-15">{errors?.amount}</span>
                  </div>
                </div>
                <div className="flex_col_sm_5">
                  <div className="form_field">
                    <div className="text_field">
                      <Select
                        className="select_menu"
                        value={reactSelect}
                        options={priceOptions}
                        isDisabled={checkType === '2' ? true : false}
                        onChange={(item: any) => {
                          setReactSelect(item);
                          handleChange(item?.value, 'pay_type')
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
            <div className="form_field">
              <div className="checkbox_wrap agree_check">
                <input
                  onChange={() => {
                    if (checkType !== '2') {
                      setCheckType('2')
                    } else {
                      setCheckType('0')
                    }
                    setPaymentDetails({ pay_type: 'Per hour', amount: '' })
                    setErrors({ pay_type: '', amount: '' });
                  }}
                  checked={checkType === '2' ? true : false}
                  className="filter-type filled-in"
                  type="checkbox"
                  id="milestone2" />
                <label htmlFor="milestone2">
                  <span className="ft_bold">
                  {'I need a quote'}
                  </span>
                  <div className="sub-title">
                    Find a quote that suits your budget
                  </div>
                </label>
              </div>
            </div>
          

          <div className="form_field">
            <button
              className={`fill_btn full_btn btn-effect ${checkErrors() ? 'disable_btn' : ''}`}
              onClick={handleContinue}>Continue</button>
          </div>
        </div>
      </div>

    </div >
  )
}

export default Payment
