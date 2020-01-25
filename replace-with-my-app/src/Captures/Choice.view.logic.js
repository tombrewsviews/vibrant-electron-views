import Choice from './Choice.view.js';
import React from 'react';

let ChoiceLogic = props => (
  <Choice
    {...props}
    isSelected={props.isSelected || (props.id && props.id === props.selected)}
    onClick={() => props.onClick(props.id)}
  />
);

export default ChoiceLogic;
