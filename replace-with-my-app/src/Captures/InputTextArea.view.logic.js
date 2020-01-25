import InputTextArea from './InputTextArea.view.js';
import React from 'react';

let InputTextAreaLogic = props => (
  <InputTextArea
    {...props}
    onKeyUp={event => {
      if (event.key === 'Enter' && typeof props.onSubmit === 'function') {
        props.onSubmit();
      }
    }}
    onChange={event => props.onChange(event.target.value)}
  />
);

export default InputTextAreaLogic;
