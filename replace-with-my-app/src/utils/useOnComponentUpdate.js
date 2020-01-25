import { useState, useLayoutEffect } from 'react';

let useOnComponentUpdate = (callback, conditions) => {
  let [didMount, setDidMount] = useState(false);

  useLayoutEffect(() => {
    setDidMount(true);
  }, []);

  useLayoutEffect(() => {
    if (!didMount) return;

    callback();
  }, conditions); // eslint-disable-line
  // we only want to update when conditions has changed
};
export default useOnComponentUpdate;
