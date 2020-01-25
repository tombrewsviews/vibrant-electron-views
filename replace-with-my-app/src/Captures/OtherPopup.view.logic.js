import React, { useRef, useState } from 'react';
import OtherPopup from './OtherPopup.view.js';
import { textInput } from 'Data/validators.js';
import { toCapitalCase } from 'utils/toCapitalCase.js';

let OtherPopupLogic = props => {
  let [value, onChange] = useState('');

  let [customList, amendCustomList] = useState([]);
  let isValid = customList.length > 0 || textInput(value);

  let input = useRef(null);

  let onAddAnother = () => {
    amendCustomList([...customList, toCapitalCase(value)]);
    onChange('');
    input.current.focus();
  };

  let clearValue = () => {
    onChange('');
  };

  let clearList = () => {
    amendCustomList([]);
  };

  let onSubmit = () => {
    props.onAddCustom([...customList, value].filter(Boolean));
    props.close();
    clearValue();
    clearList();
  };

  return (
    <OtherPopup
      {...props}
      customList={customList}
      input={input}
      isValid={isValid}
      onAddAnother={onAddAnother}
      onChange={onChange}
      onSubmit={onSubmit}
      value={value}
    />
  );
};

export default OtherPopupLogic;
