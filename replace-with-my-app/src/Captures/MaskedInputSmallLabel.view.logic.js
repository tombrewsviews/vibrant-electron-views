import React from 'react';
import MaskedInputSmallLabel from './MaskedInputSmallLabel.view.js';
import useCapture from 'useCapture.js';

let MaskedInputSmallLabelLogic = React.forwardRef((props, ref) => {
  let capture = useCapture(props);

  return (
    <MaskedInputSmallLabel
      {...props}
      {...capture}
      onChange={props.onChange}
      innerRef={ref}
    />
  );
});

export default MaskedInputSmallLabelLogic;
