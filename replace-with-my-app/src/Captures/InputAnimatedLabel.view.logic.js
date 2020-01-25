import React from 'react';
import InputAnimatedLabel from './InputAnimatedLabel.view.js';
import useCapture from 'useCapture.js';

let InputAnimatedLabelLogic = React.forwardRef((props, ref) => {
  let capture = useCapture(props);

  return (
    <InputAnimatedLabel
      {...props}
      {...capture}
      onChange={props.onChange}
      innerRef={ref}
    />
  );
});

export default InputAnimatedLabelLogic;
