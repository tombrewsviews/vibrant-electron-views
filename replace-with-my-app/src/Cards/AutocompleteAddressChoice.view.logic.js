import AutocompleteAddressChoice from './AutocompleteAddressChoice.view.js';
import React from 'react';

let AutocompleteAddressChoiceLogic = props => (
  <AutocompleteAddressChoice
    {...props}
    isSelected={props.selected === props.place_id}
    onClick={() => props.onClick(props.place_id)}
  />
);
export default AutocompleteAddressChoiceLogic;
