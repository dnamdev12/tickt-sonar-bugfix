import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import reportWebVitals from './reportWebVitals';

import App from './App';
import ErrorBoundary from '../src/hoc/errorBoundary';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import '../src/assets/scss/common.scss'
import loader from '../src/assets/images/loader.gif';

// added this check to remove console from code (In-Production)
// if (process.env.NODE_ENV !== "development") {
//   console.log = () => { };
// }

const Loader = () => (
  <div className={`loader active`}>
  <figure>
    <img src={loader} alt="loader" />
  </figure>
</div>
)

const app = (
  <React.StrictMode>
    <Suspense fallback={<Loader />}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Suspense>
  </React.StrictMode>
)

ReactDOM.render(app, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
