import sicCodes from './sicCodes.json';
import CapturePrimaryIndustrySicCode from './CapturePrimaryIndustrySicCode.view.js';
import React from 'react';

export default function CapturePrimaryIndustrySicCodeLogic(props) {
  return <CapturePrimaryIndustrySicCode {...props} from={sicCodes} />;
}
