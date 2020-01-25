import DataAutoCentred from './DataAutoCentred.view.js';
import React from 'react';
import useHoveredManual from 'useHoveredManual.js';

export default function DataAutoCentredLogic(props) {
  let hoveredManual = useHoveredManual();

  return <DataAutoCentred {...props} {...hoveredManual} />;
}
