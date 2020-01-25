import ImageCapture from './ImageCapture.view.js';
import React, { useEffect, useState } from 'react';
import compressImage from 'browser-image-compression';

let MAX_FILE_SIZE = 10485760;
// 10485760  = 10MB (1MB is 1024x1024)

let ImageCaptureLogic = props => {
  // TODO see if we need to pass the file (or value) to the view as the
  // input's value to keep it controlled
  let [state, setState] = useState({
    hasError: false,
    preview: null,
    value: props.value,
    isPDF: false,
  });

  let onChange = async event => {
    let value = event.target.files[0];
    // we can use value.name if we need the file name
    // either for validation or for the repeaters
    if (!value) {
      return;
    }

    let isPDF = value.type.includes('pdf');

    if (!isPDF) {
      try {
        value = await compressImage(value, { maxSizeMB: 1 });
      } catch (error) {
        console.error(error);
      }
    }
    if (value.size > MAX_FILE_SIZE) {
      setState({ hasError: true, isPDF: false, value, preview: null });
      return;
    }
    setState({ isPDF, value, preview: null, hasError: false });

    if (typeof props.onChange === 'function') {
      props.onChange(value);
    }
  };

  useEffect(() => {
    if (!state.value || state.isPDF) return;

    let reader = new FileReader();
    reader.onloadend = () =>
      setState(state => ({ ...state, preview: reader.result }));
    reader.readAsDataURL(state.value);
  }, [state.value, state.isPDF]);

  return (
    <ImageCapture
      {...props}
      {...state}
      value={props.value}
      onChange={onChange}
    />
  );
};

export default ImageCaptureLogic;
