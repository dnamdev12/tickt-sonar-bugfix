import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import PaymentSetupForm from './paymentSetupForm';

// call `loadStripe` outside of a component's render to avoid recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function ApproveMilestonePayment(props) {
  return (
    <div className="flex_row">
      <div className="flex_col_sm_8">
        <div className="relate">
          <button
            onClick={() => {
              props.backToScreen()
            }}
            className="back"
            style={{ top: '10px' }}></button>
          <span className={`xs_sub_title`}>
            {props?.jobName}
          </span>
          <div className="form_field">
            <span className="sub_title">
              {'Confirm and pay'}
            </span>
          </div>
          <Elements stripe={stripePromise}>
            <PaymentSetupForm
              milestoneAmount={props.milestoneAmount}
              milestoneTotalAmount={props.milestoneTotalAmount}
              isAddnewAccount={props.isAddnewAccount}
              jobName={props.jobName}
              jobId={props.jobId}
              milestoneId={props.milestoneId}
              tradieId={props.tradieId}
              builderId={props.builderId}
              backToScreen={props.backToScreen}
              milestoneNumber={props.milestoneNumber}
              category={props.category}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}

export default ApproveMilestonePayment;
