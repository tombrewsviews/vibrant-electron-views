import { useEffect, useState, useRef } from 'react';
import loadScript from 'load-script2';

export default function useGoogleMapsApi({ key, libraries = '' }) {
  let api = useRef(
    window.google && window.google.maps ? window.google.maps : null
  );
  let [state, setState] = useState(api.current ? 'ready' : 'loading');

  useEffect(() => {
    if (api.current) return;

    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=${libraries}`,
      error => {
        if (error) {
          setState('error');
        } else {
          api.current = window.google.maps;
          setState('ready');
        }
      }
    );
  }, []); // eslint-disable-line
  // we only want to load a single script for the map, therefore, we want to treat this like componentDidMount

  return {
    api: api.current,
    isError: state === 'error',
    isLoading: state === 'loading',
    isReady: state === 'ready',
  };
}
