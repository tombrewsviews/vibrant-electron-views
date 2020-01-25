import React from 'react';
import TagCloudRadial from './TagCloudRadial.view.js';

let TagCloudRadialLogic = props => {
  let selected = (value, choice) => {
    if (!value) return false;

    switch (typeof value) {
      case 'string':
        return value === choice;
      case 'object':
        return value[choice];
      default:
        return false;
    }
  };

  let list = props.choices.map(choice => {
    return {
      id: choice,
      text: choice.replace(/-/g, ' '),
      isSelected: selected(props.value, choice),
    };
  });

  return <TagCloudRadial {...props} from={list} />;
};
export default TagCloudRadialLogic;
