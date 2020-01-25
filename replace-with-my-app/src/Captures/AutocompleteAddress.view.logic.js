import AutocompleteAddress from './AutocompleteAddress.view.js';
import mapPlaceToAddress from 'utils/mapPlaceToAddress.js';
import React, { useEffect, useState } from 'react';
import useDebounce from 'utils/useDebounce.js';
import useGoogleMapsPlacesAutocomplete from 'utils/useGoogleMapsPlacesAutoComplete.js';

let AutocompleteAddressLogic = props => {
  let [address, setAddress] = useState(props.value);
  let [isShowingSuggestions, setIsShowingSuggestions] = useState(false);
  let [selected, setSelected] = useState(null);
  // we use a debounced value to query for addresses so we don't hammer the service
  let stableAddress = useDebounce(address, 500);

  let autocomplete = useGoogleMapsPlacesAutocomplete({
    address: stableAddress,
    key: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    autocompleteOptions: {
      types: ['address'],
      componentRestrictions: { country: 'us' },
    },
  });

  // autocomplete.results stores the previous stableAddress' value when stableAddress === ''
  if (!stableAddress) autocomplete.results = [];
  // update the top selected value when the list changes
  useEffect(() => {
    if (!autocomplete.isReady) return;
    setSelected(
      autocomplete.results.length > 0 ? autocomplete.results[0].place_id : null
    );
  }, [autocomplete.results, autocomplete.isReady]);

  // update the address as it changes
  useEffect(() => {
    if (typeof props.onChange === 'function') {
      props.onChange(stableAddress);
    }
  }, [stableAddress]); // eslint-disable-line
  // props.onChange is unlikely to change as a value, so it is unnecessary to account for it

  useEffect(() => {
    setAddress(props.value);
  }, [props.value]);

  let chooseAddress = async placeId => {
    if (typeof props.onChooseAddress === 'function') {
      // get the actual address because the one before doesn't have all the components
      let place = await autocomplete.getAddressForPlaceId(placeId);
      props.onChooseAddress(mapPlaceToAddress(place), props.id);
    }
    // setTimeout is necessary so that onSubmit is null on first enter in
    // input component
    setTimeout(() => {
      setIsShowingSuggestions(false);
    }, 100);
  };

  let chooseSelectedAddress = () => selected && chooseAddress(selected);

  let onChange = value => {
    setAddress(value);
    setIsShowingSuggestions(!!value);
  };

  // keyboard navigation up and down
  let prevSuggestion = () => {
    let index = autocomplete.results.findIndex(
      item => item.place_id === selected
    );
    let prevIndex = index === 0 ? autocomplete.results.length - 1 : index - 1;
    setSelected(autocomplete.results[prevIndex].place_id);
  };

  let nextSuggestion = () => {
    let index = autocomplete.results.findIndex(
      item => item.place_id === selected
    );
    let nextIndex = index === autocomplete.results.length - 1 ? 0 : index + 1;
    setSelected(autocomplete.results[nextIndex].place_id);
  };

  let closeSuggestions = () => {
    setTimeout(() => {
      setIsShowingSuggestions(false);
    }, 250);
  };

  // It appears that Chrome now ignores autocomplete="off" unless it is on th
  // <form autocomplete="off"> tag.
  // https://stackoverflow.com/a/16130452/1562732
  return (
    <form autoComplete="off" onSubmit={event => event.preventDefault()}>
      <AutocompleteAddress
        {...props}
        closeSuggestions={closeSuggestions}
        chooseAddress={chooseAddress}
        chooseSelectedAddress={chooseSelectedAddress}
        from={autocomplete.results}
        isShowingSuggestions={isShowingSuggestions}
        nextSuggestion={nextSuggestion}
        prevSuggestion={prevSuggestion}
        onBlur={closeSuggestions}
        onChange={onChange}
        onSubmit={isShowingSuggestions ? null : props.onSubmit}
        selected={selected}
        value={address}
      />
    </form>
  );
};
AutocompleteAddressLogic.defaultProps = {
  value: '',
  id: '',
};
export default AutocompleteAddressLogic;
