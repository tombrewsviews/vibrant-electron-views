import React, { useState } from 'react';
import TagCloud from './TagCloud.view.js';

let useModal = (startsVisible = false) => {
  let [isShowing, setIsShowing] = useState(startsVisible);

  return {
    isShowing,
    close: () => setIsShowing(false),
    open: () => setIsShowing(true),
  };
};

let TagCloudLogic = props => {
  let modal = useModal();

  let list = props.choices.map(choice => {
    return {
      id: choice,
      text: choice.replace(/-/g, ' '),
      isSelected: props.value && props.value[choice],
    };
  });

  return <TagCloud {...props} {...modal} from={list} />;
};
export default TagCloudLogic;
