import { useReducer, useRef } from 'react';
import useOnClickOutside from 'use-onclickoutside';

export default function useDropdown() {
  let [isShowing, toggleIsShowing] = useReducer(s => !s, false);
  let dropdownRef = useRef();

  useOnClickOutside(dropdownRef, () => {
    if (isShowing) {
      toggleIsShowing();
    }
  });

  return { isShowing, toggleIsShowing, dropdownRef };
}
