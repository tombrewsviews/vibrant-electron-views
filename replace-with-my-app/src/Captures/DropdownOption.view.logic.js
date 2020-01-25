import { FixedSizeList as List } from 'react-window';
import DropdownOption from './DropdownOption.view.js';
import React from 'react';

let ROW_HEIGHT = 50;

export default function DropdownOptionLogic(props) {
  function Row({ index, style }) {
    let item = props.from[index];
    return (
      <DropdownOption
        {...props}
        {...style}
        isSelected={props.selected === item.id}
        text={item[props.field]}
        onClick={() => props.onClick(item.id)}
      />
    );
  }

  return (
    <List
      height={props.height}
      itemCount={props.from.length}
      itemSize={ROW_HEIGHT}
      width={props.width}
    >
      {Row}
    </List>
  );
}
