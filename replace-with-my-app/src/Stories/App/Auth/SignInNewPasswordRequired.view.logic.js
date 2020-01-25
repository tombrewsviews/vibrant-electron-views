import { AUTH } from 'Data/constants.js';
import {
  CaptureItemProvider,
  ItemProvider,
  useCaptureItem,
  useCaptureItemProvider,
} from 'useData.js';
import { isInvalid } from 'utils/graphQlHelpers.js';
import {
  notifyError,
  notifySuccess,
  useNotifications,
} from 'utils/useNotifications.js';
import { useAuth } from 'Data/Auth.js';
import SignInNewPasswordRequired from './SignInNewPasswordRequired.view.js';
import React from 'react';

let ITEM = {
  password: '',
};

export default function SignInNewPasswordRequiredLogic() {
  let [, notify] = useNotifications();
  let auth = useAuth();
  let authEmail = useCaptureItem({ path: 'email' });
  let authUser = useCaptureItem({ path: 'user' });
  let captureData = useCaptureItemProvider(ITEM, async () => {
    let [next] = captureData;
    if (isInvalid(AUTH.SIGNIN_NEW_PASSWORD_REQUIRED, next, notify)) return true;

    try {
      auth.getUserContext(
        await auth.signInNewPasswordRequired({
          user: authUser.value,
          password: next.password,
        })
      );
      notify(notifySuccess('Your new password is ready'));
    } catch (error) {
      console.error(error);
      notify(notifyError('Something went wrong. Please, try again.'));
    }
  });
  let [, , onSubmit] = captureData;

  return (
    <ItemProvider value={{ email: authEmail.value }}>
      <CaptureItemProvider value={captureData}>
        <SignInNewPasswordRequired onSubmit={onSubmit} />
      </CaptureItemProvider>
    </ItemProvider>
  );
}
