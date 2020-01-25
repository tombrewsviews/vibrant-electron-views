import { useState } from 'react';

export default function useFocusedManual() {
  let [isFocusedManual, setIsFocusedManual] = useState(false);

  return {
    isFocusedManual,
    onFocus: () => setIsFocusedManual(true),
    onBlur: () => setIsFocusedManual(false),
  };
}
