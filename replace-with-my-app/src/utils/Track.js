import amplitude from 'amplitude-js';
import React, { useContext, useEffect } from 'react';

export let TrackContext = React.createContext(() => {});

export let useTrack = () => useContext(TrackContext);

function track(event, data) {
  if (process.env.REACT_APP_ENV !== 'production') return;

  if (event === 'identify') {
    let identify = Object.entries(data).reduce(
      (identify, [key, value]) => identify.set(key, value),
      new amplitude.Identify()
    );
    amplitude.getInstance().identify(identify);
  } else {
    amplitude.getInstance().logEvent(event, data);
  }
}

export let Track = props => {
  useEffect(() => {
    if (process.env.REACT_APP_ENV !== 'production') return;

    let amplitudeInstance = amplitude.getInstance();

    amplitudeInstance.init(process.env.REACT_APP_AMPLITUDE_KEY, null, {
      includeReferrer: true,
      includeUtm: true,
      saveEvents: true,
    });

    amplitudeInstance.setVersionName(
      `${process.env.REACT_APP_VERSION}-${process.env.REACT_APP_ENV}`
    );
  }, []);

  return (
    <TrackContext.Provider value={track}>
      {props.children}
    </TrackContext.Provider>
  );
};
