import ButtonIcon from './ButtonIcon.view.js';
import React from 'react';
import { useFlow } from 'useFlow.js';

export default function ButtonIconLogic(props) {
  let flow = useFlow();
  return (
    <ButtonIcon
      {...props}
      isSelected={props.isSelected || flow.has(props.onClickId)}
    />
  );
}
