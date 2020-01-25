import Input from './Input.view.js';
import React from 'react';
import useCapture from 'useCapture.js';

let InputLogic = React.forwardRef((props, ref) => {
  let { onKeyUp, onChange } = useCapture(props);
  return (
    <Input {...props} onKeyUp={onKeyUp} onChange={onChange} innerRef={ref} />
  );
});

export default InputLogic;
