import { useEffect, useState } from 'react';
import useGoogleMapsApi from './useGoogleMapsApi.js';

function geocodeByPlaceId(maps, placeId) {
  return new Promise((resolve, reject) => {
    let geocoder = new maps.api.Geocoder();
    geocoder.geocode({ placeId }, (results, status) => {
      if (status === maps.api.GeocoderStatus.OK) {
        resolve(results[0]);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error(
            'useGoogleMapsPlacesAutocomplete#geocodeByPlaceId',
            status
          );
        }

        reject(status);
      }
    });
  });
}

// these calls are expensive, let's keep an internal cache
let addresses = new Map();
let places = new Map();

export default function useGoogleMapsPlacesAutocomplete({
  address,
  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest
  autocompleteOptions = {},
  key,
}) {
  let maps = useGoogleMapsApi({ key, libraries: 'places' });
  let [state, setState] = useState({
    status: 'loading',
    results: [],
  });

  useEffect(() => {
    if (!maps.isReady || !address) return;

    if (addresses.has(address)) {
      setState({ status: 'ready', results: addresses.get(address) });
      return;
    }

    setState({ status: 'loading', results: [] });

    let service = new maps.api.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input: address,
        ...autocompleteOptions,
      },
      (results, status) => {
        // TODO Do we need to handle other statuses?
        // https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesServiceStatus
        if (status === maps.api.places.PlacesServiceStatus.OK) {
          addresses.set(address, results);

          setState({
            status: 'ready',
            results,
          });
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.error('useGoogleMapsPlacesAutocomplete', status);
          }

          setState({ status: 'error', results: [] });
        }
      }
    );
  }, [address, maps.isReady]); // eslint-disable-line
  // we are assigning the value of service as a side effect, so we don't want to insert it as a dependency

  async function getAddressForPlaceId(placeId) {
    if (!maps.isReady) return null;

    if (!places.has(placeId)) {
      try {
        places.set(placeId, await geocodeByPlaceId(maps, placeId));
      } catch (error) {
        places.set(placeId, null);
      }
    }

    return places.get(placeId);
  }

  return {
    isError: state.status === 'error',
    isLoading: state.status === 'loading',
    isReady: state.status === 'ready',
    results: state.results,
    getAddressForPlaceId,
  };
}
