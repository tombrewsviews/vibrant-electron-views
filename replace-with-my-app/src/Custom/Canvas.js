// @view
import React from 'react';

let Canvas = React.forwardRef((props, ref) => {
  let { isShown, width, height } = props;

  return (
    <canvas
      style={{ display: isShown ? 'block' : 'none' }}
      width={width}
      height={height}
      ref={ref}
    />
  );
});

export default Canvas;
