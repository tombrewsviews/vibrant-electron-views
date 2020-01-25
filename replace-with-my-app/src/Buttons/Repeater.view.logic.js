import Repeater from './Repeater.view.js';
import React from 'react';

export default function RepeaterLogic(props) {
  let isReminder = !props.text;

  return (
    <Repeater {...props} isRegular={!isReminder} isReminder={isReminder} />
  );
}
