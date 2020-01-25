import { AUTH } from 'Data/constants.js';
import {
  CaptureItemProvider,
  useCaptureItem,
  useCaptureItemProvider,
} from 'useData.js';
import { isInvalid } from 'utils/graphQlHelpers.js';
import { notifyError, useNotifications } from 'utils/useNotifications.js';
import { useAuth } from 'Data/Auth.js';
import { useSetFlow } from 'useFlow.js';
import SignUp from './SignUp.view.js';
import React, { useMemo, useEffect } from 'react';
import qs from 'querystringify';

let ITEM = {
  isInvite: false,
  email: '',
  password: '',
  first_name: '',
  last_name: '',
};

export default function SignUpLogic() {
  let [, notify] = useNotifications();
  let auth = useAuth();
  let authEmail = useCaptureItem({ path: 'email' });
  let authPassword = useCaptureItem({ path: 'password' });
  let setFlow = useSetFlow();

  let initialItem = useMemo(() => {
    let { invite } = qs.parse(window.location.search);
    try {
      let { email = '', first_name = '', last_name = '' } = JSON.parse(
        atob(invite)
      );
      authEmail.onChange(email);
      return {
        isInvite: true,
        email,
        first_name,
        last_name,
        password: '',
      };
    } catch (error) {}
    return ITEM;
  }, []); // eslint-disable-line
  // run once

  useEffect(() => {
    if (!initialItem.email) return;

    let cancel = false;

    (async () => {
      let userExists = await auth.userExists(initialItem.email);
      if (cancel || !userExists) return;

      authEmail.onChange(initialItem.email);
      window.history.pushState(null, null, '/');
      setFlow('/App/Auth/SignIn');
    })();

    return () => (cancel = true);
  }, [auth, initialItem, setFlow]); // eslint-disable-line
  // ignore authEmail

  let captureData = useCaptureItemProvider(initialItem, async () => {
    let [next] = captureData;
    if (isInvalid(AUTH.SIGNUP, next, notify)) return true;

    try {
      authEmail.onChange(next.email);
      authPassword.onChange(next.password);
      await auth.signUp(next);
      // clear out invite
      window.history.pushState(null, null, '/');
      setFlow('/App/Auth/SignUpConfirm');
    } catch (error) {
      console.error(error);
      notify(notifyError('Something went wrong. Please, try again.'));
    }
  });
  let [, , onSubmit] = captureData;

  return (
    <CaptureItemProvider value={captureData}>
      <SignUp onSubmit={onSubmit} />
    </CaptureItemProvider>
  );
}
