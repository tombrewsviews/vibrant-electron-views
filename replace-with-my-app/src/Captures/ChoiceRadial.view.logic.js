import ChoiceRadial from './ChoiceRadial.view.js';
import React from 'react';
let ChoiceRadialLogic = props => (
  <ChoiceRadial
    {...props}
    isSelected={props.isSelected || (props.id && props.id === props.selected)}
    onClick={() => {
      props.onClick(props.id);
    }}
  />
);

export default ChoiceRadialLogic;
