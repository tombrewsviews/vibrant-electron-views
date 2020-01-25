import * as Sentry from '@sentry/browser';
import React, { useContext } from 'react';
import useOnComponentUpdate from './useOnComponentUpdate.js';
import filterSensitiveData from './filterSensitiveData.js';

// uncomment this line to enable Sentry in dev mode
let DISABLE_SENTRY = process.env.NODE_ENV === 'development';

let Context = React.createContext(false);

export let useErrorBoundary = () => useContext(Context);

export let useOnError = callback => {
  let error = useErrorBoundary();

  useOnComponentUpdate(() => {
    if (error) {
      callback();
    }
  }, [error]);
};

export function captureError(error, rawInfo = {}) {
  requestAnimationFrame(() => {
    let info = Object.keys(rawInfo).length > 0 && filterSensitiveData(rawInfo);
    if (DISABLE_SENTRY) {
      console.error(error);
      console.log(info);
      return;
    }

    if (info) {
      info.embedUrl = {
        domain: document.domain,
        origin: document.location.origin,
        // removed it's throwing this issue https://sentry.io/organizations/greyfinch/issues/1161172413/?project=1392628&query=is%3Aunresolved
        // parent: window.parent.location.origin,
      };

      Sentry.withScope(scope => {
        Object.keys(info).forEach(key => scope.setExtra(key, info[key]));
        Sentry.captureException(error);
      });
    } else {
      Sentry.captureException(error);
    }
  });
}

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  componentDidMount() {
    // uncomment this line to enable Sentry in dev mode
    if (DISABLE_SENTRY) return;

    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_KEY,
      environment: process.env.REACT_APP_ENV,
      release: process.env.REACT_APP_SENTRY_RELEASE,
    });
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error: true });

    captureError(error, errorInfo);
  }

  render() {
    return (
      <Context.Provider value={this.state.error}>
        {this.props.children}
      </Context.Provider>
    );
  }
}
