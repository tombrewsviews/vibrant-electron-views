import InputPhoneLabel from './InputPhoneLabel.view.js';
import React from 'react';
import useFocusedManual from 'useFocusedManual.js';
import useInputPhone from './useInputPhone.js';

export default function InputPhoneLabelLogic(props) {
  let input = useInputPhone(props);
  let focusedManual = useFocusedManual();
  return <InputPhoneLabel {...props} {...input} {...focusedManual} />;
}
