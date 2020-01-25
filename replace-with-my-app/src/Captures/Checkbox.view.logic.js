import Checkbox from './Checkbox.view.js';
import React from 'react';

export default function CheckboxLogic(props) {
  return (
    <Checkbox
      {...props}
      onClick={() => {
        props.onClick(!props.isSelected);
      }}
    />
  );
}
