import React from 'react';
import Dropdown from './Dropdown.view.js';
import useDropdown from 'useDropdown.js';

export default function DropdownLogic(props) {
  let dropdown = useDropdown();
  return (
    <Dropdown
      {...props}
      {...dropdown}
      onClick={args => {
        props.onClick(args);
        dropdown.toggleIsShowing();
      }}
    />
  );
}
