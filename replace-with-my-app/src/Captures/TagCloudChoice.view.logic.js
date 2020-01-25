import React from 'react';
import TagCloudChoice from './TagCloudChoice.view.js';

let TagCloudChoiceLogic = props => {
  let isOther = props.id === 'other';
  return (
    <TagCloudChoice
      {...props}
      isOther={isOther}
      isSelected={props.isSelected || (props.id && props.id === props.selected)}
      onClick={() => props.onClick(props.id)}
    />
  );
};
export default TagCloudChoiceLogic;
