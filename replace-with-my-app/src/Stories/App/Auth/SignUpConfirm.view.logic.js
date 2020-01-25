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
import { useSetFlow } from 'useFlow.js';
import SignUpConfirm from './SignUpConfirm.view.js';
import React from 'react';

let ITEM = {
  code: '',
};

export default function SignUpConfirmLogic() {
  let [, notify] = useNotifications();
  let auth = useAuth();
  let authEmail = useCaptureItem({ path: 'email' });
  let authPassword = useCaptureItem({ path: 'password' });
  let setFlow = useSetFlow();

  let captureData = useCaptureItemProvider(ITEM, async () => {
    let [next] = captureData;
    if (isInvalid(AUTH.SIGNUP_CONFIRM, next, notify)) return true;

    try {
      await auth.signUpConfirm({ email: authEmail.value, ...next });
    } catch (error) {
      return notify(notifyError('Please, verify your details'));
    }
    try {
      let res = await auth.signIn({
        email: authEmail.value,
        password: authPassword.value,
      });
      if (res.challengeName) {
        setFlow('/App/Auth/SignIn');
        return;
      }
      auth.getUserContext(res);
    } catch (error) {
      setFlow('/App/Auth/SignIn');
    }
  });
  let [, , onSubmit] = captureData;

  async function onClickResendCode() {
    try {
      await auth.signUpConfirmResendCode({ email: authEmail.value });
      notify(notifySuccess(`A new code it's way to ${authEmail.value}`));
    } catch (error) {
      console.error(error);
      notify(notifyError('Please, verify your details'));
    }
  }

  return (
    <ItemProvider value={{ email: authEmail.value }}>
      <CaptureItemProvider value={captureData}>
        <SignUpConfirm
          onClickResendCode={onClickResendCode}
          onSubmit={onSubmit}
        />
      </CaptureItemProvider>
    </ItemProvider>
  );
}
