import React, { useRef } from 'react';
import MaskedInput from './MaskedInput.view.js';
import useMaskedInput from '@viewstools/use-masked-input';

let MASKS = {
  date: {
    mask: [/[0-1]/, /\d/, '/', /[0-3]/, /\d/, '/', /[1-2]/, /\d/, /\d/, /\d/],
    guide: true,
  },
  phone: {
    mask: [
      '(',
      /\d/,
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
    guide: true,
  },
  fein: {
    mask: [/\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    guide: true,
  },
  twoDigits: {
    mask: [/\d/, /\d/],
    guide: false,
  },
  threeDigits: {
    mask: [/\d/, /\d/, /\d/],
    guide: true,
  },
  fourDigits: {
    mask: [/\d/, /\d/, /\d/, /\d/],
    guide: true,
  },
  fiveDigits: {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/],
    guide: true,
  },
  sixDigits: {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    guide: true,
  },
  nineDigits: {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    guide: true,
  },
  tenDigits: {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    guide: true,
  },
};

let MaskedInputLogic = props => {
  let input = useRef(null);

  if (process.env.NODE_ENV === 'development' && !(props.mask in MASKS)) {
    throw new Error(
      `${props.mask} isn't a valid mask. Choose from ${Object.keys(MASKS)}`
    );
  }

  let onChange = useMaskedInput({
    input,
    ...MASKS[props.mask],
    onChange: event => props.onChange(event.target.value),
    initialValue: props.initialValue,
  });

  return (
    <MaskedInput
      {...props}
      innerRef={input}
      onChange={onChange}
      onKeyUp={event => {
        if (event.key === 'Enter' && typeof props.onSubmit === 'function') {
          props.onSubmit();
        }
      }}
      onSubmit={props.onSubmit}
    />
  );
};
MaskedInputLogic.defaultProps = {
  mask: 'phone',
  initialValue: '',
};

export default MaskedInputLogic;
