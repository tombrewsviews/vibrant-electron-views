import React from 'react';
import MaskedInputLabel from './MaskedInputLabel.view.js';
import useCapture from 'useCapture.js';

let MaskedInputLabelLogic = React.forwardRef((props, ref) => {
  let capture = useCapture(props);

  return (
    <MaskedInputLabel
      {...props}
      {...capture}
      onChange={props.onChange}
      innerRef={ref}
    />
  );
});

export default MaskedInputLabelLogic;
