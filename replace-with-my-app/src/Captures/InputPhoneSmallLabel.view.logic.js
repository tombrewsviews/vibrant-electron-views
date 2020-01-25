import InputPhoneSmallLabel from './InputPhoneSmallLabel.view.js';
import React from 'react';
import useInputPhone from './useInputPhone.js';

export default function InputPhoneSmallLabelLogic(props) {
  let input = useInputPhone(props);
  return <InputPhoneSmallLabel {...props} {...input} />;
}
