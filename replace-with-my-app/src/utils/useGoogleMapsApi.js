import { useEffect, useState, useRef } from 'react';
import loadScript from './loadScript.js';

export default function useGoogleMapsApi({ key, libraries = '' }) {
  let api = useRef(
    window.google && window.google.maps ? window.google.maps : null
  );
  let [state, setState] = useState(api.current ? 'ready' : 'loading');

  useEffect(() => {
    if (api.current) return;

    let cancel = false;

    (async () => {
      try {
        await loadScript(
          `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=${libraries}`
        );
        if (cancel) return;

        api.current = window.google.maps;
        setState('ready');
      } catch (error) {
        if (cancel) return;

        setState('error');
      }
    })();

    return () => (cancel = true);
  }, []); // eslint-disable-line

  return {
    api: api.current,
    isError: state === 'error',
    isLoading: state === 'loading',
    isReady: state === 'ready',
  };
}
