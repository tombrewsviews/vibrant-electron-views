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
import ResetPassword from './ResetPassword.view.js';
import React from 'react';

let ITEM = {
  email: '',
};

export default function ResetPasswordLogic() {
  let [, notify] = useNotifications();
  let auth = useAuth();
  let authEmail = useCaptureItem({ path: 'email' });
  let setFlow = useSetFlow();
  let captureData = useCaptureItemProvider(ITEM, async () => {
    let [next] = captureData;
    if (isInvalid(AUTH.RESET_PASSWORD, next, notify)) return true;

    try {
      authEmail.onChange(next.email);

      await auth.resetPassword(next);
      setFlow('/App/Auth/ResetPasswordConfirm');
    } catch (error) {
      console.error(error);
      notify(notifyError('Something went wrong'));
    }
  });
  let [, , onSubmit] = captureData;

  return (
    <CaptureItemProvider value={captureData}>
      <ResetPassword onSubmit={onSubmit} />
    </CaptureItemProvider>
  );
}
