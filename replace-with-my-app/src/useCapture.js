import useFocusedManual from './useFocusedManual.js';

export default function useCapture(props) {
  let focusedManual = useFocusedManual();

  function onKeyUp(event) {
    if (event.key === 'Enter' && typeof props.onSubmit === 'function') {
      props.onSubmit();
    }
  }

  function onChange(event) {
    props.onChange(event.target.value);
  }

  return { ...focusedManual, onKeyUp, onChange };
}
