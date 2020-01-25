import { useState } from 'react';

export default function useHoveredManual() {
  let [isHoveredManual, setIsHoveredManual] = useState(false);

  return {
    isHoveredManual,
    onMouseEnter: () => setIsHoveredManual(true),
    onMouseLeave: () => setIsHoveredManual(false),
  };
}
