import { useState } from 'react';
import { AuBankAccountElement } from '@stripe/react-stripe-js';

// Custom styling can be passed as options when creating an Element.
const AU_BANK_ACCOUNT_STYLE = {
  base: {
    color: '#161d4a',
    font: 'Neue Haas Grotesk Text Pro Medium',
    fontSize: '14px',
    '::placeholder': {
      color: '#aab7c4'
    },
    ':-webkit-autofill': {
      color: '#32325d',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
    ':-webkit-autofill': {
      color: '#fa755a',
    },
  }
};

const AU_BANK_ACCOUNT_ELEMENT_OPTIONS = {
  style: AU_BANK_ACCOUNT_STYLE,
  disabled: false,
  hideIcon: false,
  iconStyle: "solid", // or "default"
};

export default function BecsForm(props) {
  const [accountName, setAccountName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');

  const handleChange = ({ target: { name, value } }) => {
    if (name === 'accountName') {
      setAccountName(value);
      return;
    }
    if (name === 'accountEmail') {
      setAccountEmail(value);
    }
  }

  return (
    <form onSubmit={(e) => props.onSubmit(e, accountName, accountEmail)}>
      <div className="form-row inline">
        <div className="tagg mb30">
          <label className="form_label">Name</label>
          <div className="text_field">
            <input
              type="text"
              name="accountName"
              placeholder="John Smith"
              required
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="tagg mb30">
          <label className="form_label">Email Address</label>
          <div className="text_field">
            <input
              name="accountEmail"
              type="email"
              placeholder="john.smith@example.com"
              required
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="form-row">
        <label className="form_label">
          Bank Account
          <AuBankAccountElement options={AU_BANK_ACCOUNT_ELEMENT_OPTIONS} />
        </label>
      </div>

      <div className="form_field">
        <div className="checkbox_wrap agree_check mt-15">
          <label>By providing your bank account details, you agree to this Direct Debit Request
            and the </label>
          <a onClick={() => window.open("https://stripe.com/au-becs-dd-service-agreement/legal", "_blank")} rel="noopener" className="link">Direct Debit Request service agreement</a>
          <label> and authorise Stripe Payments Australia Pty Ltd ACN 160 180 343
            Direct Debit User ID number 507156 (“Stripe”) to debit your account
            through the Bulk Electronic Clearing System (BECS) on behalf of
            Rocket Rides (the "Merchant") for any amounts separately
            communicated to you by the Merchant. You certify that you are either
            an account holder or an authorised signatory on the account listed above.</label>
        </div>
      </div>

      <button
        type="submit"
        disabled={props.disabled}
        className={`fill_btn full_btn btn-effect ${props.disabled ? 'disable_btn' : ''}`}
      >{`Confirm payment of ${props.milestoneTotalAmount}`}</button>
    </form>
  )
}