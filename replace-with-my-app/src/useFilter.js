import { useState } from 'react';
import useDebounce from './utils/useDebounce.js';

export default function useFilter(initialValue = '') {
  let [valueFilter, onChangeFilter] = useState(initialValue);
  let filter = useDebounce(valueFilter, 500);

  return {
    filter,
    onChangeFilter,
    valueFilter,
  };
}
