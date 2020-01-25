import Data from './Data.view.js';
import React from 'react';
import useHoveredManual from 'useHoveredManual.js';

export default function DataLogic(props) {
  let hoveredManual = useHoveredManual();

  return <Data {...props} {...hoveredManual} />;
}
