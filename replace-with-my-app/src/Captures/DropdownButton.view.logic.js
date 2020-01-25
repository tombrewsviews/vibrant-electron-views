import DropdownButton from './DropdownButton.view.js';
import React from 'react';
import get from 'lodash/get';

export default function DropdownButtonLogic(props) {
  let selected = props.from.find(item => props.selected === item.id);
  return (
    <DropdownButton
      {...props}
      text={get(selected, `${props.field}`, 'Select')}
    />
  );
}
DropdownButtonLogic.defaultProps = {
  from: [],
};
