import React from 'react';
import SignatureText from './SignatureText.view.js';

let SignatureTextLogic = props => {
  return (
    <SignatureText
      {...props}
      isParagraph={props.type === 'PARAGRAPH'}
      isTitle={props.type === 'TITLE'}
    />
  );
};

export default SignatureTextLogic;
