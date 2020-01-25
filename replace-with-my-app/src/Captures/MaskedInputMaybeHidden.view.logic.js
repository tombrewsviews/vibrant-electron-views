import React, { useRef, useState } from 'react';
import MaskedInputMaybeHidden from './MaskedInputMaybeHidden.view.js';
import useMaskedInput from '@viewstools/use-masked-input';

let MASKS = {
  ssn: {
    mask: [/\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    guide: true,
  },
};

let MaskedInputMaybeHiddenLogic = props => {
  let input = useRef(null);
  let [isShowingValue, setIsShowingValue] = useState(true);

  if (process.env.NODE_ENV === 'development' && !(props.mask in MASKS)) {
    throw new Error(
      `${props.mask} isn't a valid mask. Choose from ${Object.keys(MASKS)}`
    );
  }

  let mask = MASKS[props.mask];
  let onChange = useMaskedInput({
    input,
    ...mask,
    guide: mask.guide && isShowingValue,
    onChange: event => props.onChange(event.target.value),
    initialValue: props.initialValue,
  });

  return (
    <MaskedInputMaybeHidden
      {...props}
      innerRef={input}
      isShowingValue={isShowingValue}
      onChange={onChange}
      onKeyUp={event => {
        if (event.key === 'Enter' && typeof props.onSubmit === 'function') {
          props.onSubmit();
        }
      }}
      onSubmit={props.onSubmit}
      toggleShowingValue={() => {
        setIsShowingValue(!isShowingValue);
        input.current.focus();
      }}
      type={isShowingValue ? 'text' : 'password'}
    />
  );
};
MaskedInputMaybeHiddenLogic.defaultProps = {
  mask: 'ssn',
  initialValue: '',
};

export default MaskedInputMaybeHiddenLogic;
