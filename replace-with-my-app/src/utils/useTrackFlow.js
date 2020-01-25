import difference from './difference.js';
import { useEffect, useRef } from 'react';
import { useFlow } from '../useFlow.js';
import { useTrack } from './Track.js';

let useTrackFlow = () => {
  let track = useTrack();

  let flow = useFlow();
  let prevFlow = useRef(null);

  useEffect(() => {
    if (prevFlow.current) {
      track('flow', { diff: [...difference(prevFlow.current, flow)] });
    }

    prevFlow.current = flow;
  }, [flow]); // eslint-disable-line
  // track will not change and therefore does not need to be a dependency
};
export default useTrackFlow;
