import { Flow, useSetFlow } from '../useFlow.js';
import { Track } from 'utils/Track.js';
import { Notifications } from 'utils/useNotifications.js';
import { useOnError } from 'utils/ErrorBoundary.js';
import { WellnessApi } from 'Data/WellnessApi.js';
import App from './App.view.js';
import Auth from './Auth.js';
import React from 'react';
import useTrackFlow from 'utils/useTrackFlow.js';

function AppLogic() {
  let setFlow = useSetFlow();
  useOnError(() => setFlow('/App/RuntimeError'));
  useTrackFlow();

  return <App />;
}

export default function AppLogicWithFlow() {
  return (
    <Track>
      <Flow>
        <Notifications>
          <WellnessApi role="subscriber">
            <Auth>
              <AppLogic />
            </Auth>
          </WellnessApi>
        </Notifications>
      </Flow>
    </Track>
  );
}
