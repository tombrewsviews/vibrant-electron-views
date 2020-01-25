import { css, keyframes } from 'emotion';
import LoadingBar from './LoadingBar.view.js';
import React, { useEffect, useState } from 'react';

let animationNameLong = keyframes`
  0% {left: -35%;right: 100%} 
  60% {left: 100%;right: -90%}
  100% {left: 100%;right: -90%}
`;

let animationNameShort = keyframes`
  0% {left: -200%;right: 100%} 
  60% {left: 107%;right: -8%}
  100% {left: 107%;right: -8%}
`;

export default function LoadingBarLogic(props) {
  let [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancel = false;

    setTimeout(() => {
      if (cancel) return;

      setIsLoading(true);
    }, props.delay);

    return () => (cancel = true);
  }, []); // eslint-disable-line
  // we don't need to react to any change

  return isLoading ? (
    <LoadingBar
      {...props}
      wrapper={css({
        backgroundClip: 'padding-box',
      })}
      short={css({
        animation: `${animationNameShort} 1s 0.55s cubic-bezier(0.165, 0.84, 0.44, 1) infinite`,
        animationFillMode: 'onwards',
        backgroundClip: 'padding-box',
        willChange: 'left, right',
      })}
      long={css({
        animation: `${animationNameLong} 1s 0 cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite`,
        animationFillMode: 'onwards',
        backgroundClip: 'padding-box',
        willChange: 'left, right',
      })}
    />
  ) : (
    <div style={{ height: props.height, width: props.width }} />
  );
}
LoadingBarLogic.defaultProps = {
  delay: 500,
};
