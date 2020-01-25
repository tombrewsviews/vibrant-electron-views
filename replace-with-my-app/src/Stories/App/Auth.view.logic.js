import { CaptureItemProvider, useCaptureItemProvider } from 'useData.js';
import { notifyError, useNotifications } from 'utils/useNotifications.js';
import { useSetFlow } from 'useFlow.js';
import Auth from './Auth.view.js';
import React, { useLayoutEffect } from 'react';
import qs from 'querystringify';

let ITEM = {
  email: '',
  password: '',
  user: null,
};

export default function AuthLogic() {
  let [, notify] = useNotifications();
  let captureData = useCaptureItemProvider(ITEM);
  let setFlow = useSetFlow();

  useLayoutEffect(() => {
    let { invite } = qs.parse(window.location.search);
    if (invite) {
      try {
        JSON.parse(atob(invite));
        setFlow('/App/Auth/SignUp');
      } catch (error) {
        notify(notifyError(`Please, check your invite code and try again.`));
      }
    }
  }, []); // eslint-disable-line
  // ignore notify and setFlow

  return (
    <CaptureItemProvider value={captureData}>
      <Auth />
    </CaptureItemProvider>
  );
}
