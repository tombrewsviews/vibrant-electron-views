import BackRepeater from './BackRepeater.view.js';
import React from 'react';

export default function BackRepeaterLogic(props) {
  console.log(props.text, 'hasValue', !!props.text && props.text !== '');
  return (
    <BackRepeater {...props} hasValue={!!props.text && props.text !== ''} />
  );
}
