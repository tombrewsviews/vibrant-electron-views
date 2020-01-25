import InputPhone from './InputPhone.view.js';
import React from 'react';
import useInputPhone from './useInputPhone.js';

export default function InputPhoneLogic(props) {
  let input = useInputPhone(props);
  return <InputPhone {...props} {...input} />;
}
