import InputNoLabel from './InputNoLabel.view.js';
import React from 'react';
import useCapture from 'useCapture.js';

let InputNoLabelLogic = React.forwardRef((props, ref) => {
  let capture = useCapture(props);
  return <InputNoLabel {...props} {...capture} innerRef={ref} />;
});
export default InputNoLabelLogic;
