import InputPassword from './InputPassword.view.js';
import React, { useRef, useReducer } from 'react';

export default function InputPasswordLogic(props) {
  let [isShowing, onClickIsShowing] = useReducer(v => !v, false);
  let input = useRef(null);

  return (
    <InputPassword
      {...props}
      innerRef={input}
      isShowing={isShowing}
      onClickIsShowing={() => {
        onClickIsShowing();
        input.current.focus();
      }}
    />
  );
}
