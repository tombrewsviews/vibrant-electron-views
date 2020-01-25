import { useEffect, useState } from 'react';
import codes from './inputPhoneCodes.json';
import get from 'lodash/get';

export let DEFAULT_PHONE = '+1';

export default function useInputPhone(props) {
  let value = get(props, 'value', '');
  let [valueCode, onChangeValueCode] = useState(() => {
    let maybeCode = codes.find(item => value.startsWith(item.id));
    return maybeCode ? maybeCode.id : DEFAULT_PHONE;
  });
  let [valueNumber, onChangeValueNumber] = useState(() =>
    value.replace(valueCode, '')
  );

  useEffect(() => {
    if (!valueNumber) return;

    if (props.onChange) {
      props.onChange(`${valueCode}${valueNumber.replace(/\D/g, '')}`);
    }
  }, [valueCode, valueNumber]); // eslint-disable-line
  // ignore props.onChange

  return {
    codes,
    onChangeValueCode,
    onChangeValueNumber,
    valueCode,
    valueNumber,
  };
}
