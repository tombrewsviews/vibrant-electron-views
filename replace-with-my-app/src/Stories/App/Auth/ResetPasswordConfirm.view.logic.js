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
import ResetPasswordConfirm from './ResetPasswordConfirm.view.js';
import React from 'react';

let ITEM = {
  code: '',
  password: '',
};

export default function ResetPasswordConfirmLogic() {
  let [, notify] = useNotifications();
  let auth = useAuth();
  let authEmail = useCaptureItem({ path: 'email' });
  let captureData = useCaptureItemProvider(ITEM, async () => {
    let [next] = captureData;
    if (isInvalid(AUTH.RESET_PASSWORD_CONFIRM, next, notify)) return true;

    try {
      await auth.resetPasswordConfirm({ email: authEmail.value, ...next });
      let res = await auth.signIn({
        email: authEmail.value,
        password: next.password,
      });
      auth.getUserContext(res);
      notify(notifySuccess('Your new password is ready'));
    } catch (error) {
      console.error(error);
      notify(notifyError('Something went wrong'));
    }
  });
  let [, , onSubmit] = captureData;

  async function onClickResendCode() {
    try {
      await auth.resetPassword({ email: authEmail.value });
      notify(notifySuccess(`We sent a new code to ${authEmail.value}`));
    } catch (error) {
      console.error(error);
      notify(notifyError('Something went wrong'));
    }
  }

  return (
    <ItemProvider value={{ email: authEmail.value }}>
      <CaptureItemProvider value={captureData}>
        <ResetPasswordConfirm
          onClickResendCode={onClickResendCode}
          onSubmit={onSubmit}
        />
      </CaptureItemProvider>
    </ItemProvider>
  );
}
