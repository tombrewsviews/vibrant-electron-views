import ChoiceToggle from './ChoiceToggle.view.js';
import React from 'react';

let ChoiceToggleLogic = props => (
  <ChoiceToggle
    {...props}
    isSelected={props.isSelected || (props.id && props.id === props.selected)}
    onClick={() => props.onClick(props.id)}
  />
);

export default ChoiceToggleLogic;
