import React from 'react';
import StatNumber from './StatNumber.view.js';

export default function StatNumberLogic(props) {
  let len = `${props.text}`.length;
  let fontSize = len < 6 ? 46 : len < 9 ? 36 : 26;
  return <StatNumber {...props} fontSize={fontSize} />;
}
