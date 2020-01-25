import '@reach/dialog/styles.css';
import './index.css';
import './version.js';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './Stories/App.view.logic.js';
import { ErrorBoundary } from './utils/ErrorBoundary.js';
import LoadingBar from './Components/LoadingBar.view.logic.js';

// not ideal but...
let error = window.console.error;
window.console.error = (...args) => {
  if (/cannot appear as a descendant of/.test(args[0])) return;

  error(...args);
};

ReactDOM.render(
  <ErrorBoundary>
    <Suspense fallback={<LoadingBar />}>
      <App />
    </Suspense>
  </ErrorBoundary>,
  document.getElementById('root')
);
