import { AUTH } from 'Data/constants.js';
import {
  CaptureItemProvider,
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
import SignIn from './SignIn.view.js';
import React, { useMemo } from 'react';

let ITEM = {
  email: '',
  password: '',
};

export default function SignInLogic() {
  let [, notify] = useNotifications();
  let auth = useAuth();
  let setFlow = useSetFlow();
  let authEmail = useCaptureItem({ path: 'email' });
  let authPassword = useCaptureItem({ path: 'password' });
  let authUser = useCaptureItem({ path: 'user' });
  let initialItem = useMemo(() => {
    let initial = { ...ITEM };
    if (authEmail.value) {
      initial.email = authEmail.value;
    }
    return initial;
  }, []); // eslint-disable-line
  // once off

  let captureData = useCaptureItemProvider(initialItem, async () => {
    let [next] = captureData;
    if (isInvalid(AUTH.SIGNIN, next, notify)) return true;
    try {
      authEmail.onChange(next.email);

      let res = await auth.signIn(next);
      // https://aws-amplify.github.io/docs/js/authentication#sign-in
      switch (res.challengeName) {
        case 'MFA_SETUP':
        case 'SMS_MFA':
        case 'SOFTWARE_TOKEN_MFA': {
          notify(
            notifyError(`Multi-factor authentication isn't supported yet`)
          );
          return;
        }

        case 'NEW_PASSWORD_REQUIRED': {
          authUser.onChange(res);
          setFlow('/App/Auth/SignInNewPasswordRequired');
          notify(notifySuccess(`Please, set a new password before logging in`));
          return;
        }

        default: {
          auth.getUserContext(res);
          return;
        }
      }
      // TODO logic to confirm signup if needed
      // either here or on Data/Auth
    } catch (error) {
      switch (error.code) {
        case 'UserNotConfirmedException': {
          authPassword.onChange(next.password);
          notify(notifySuccess('Please, confirm your account'));
          setFlow('/App/Auth/SignUpConfirm');
          return;
        }

        case 'PasswordResetRequiredException': {
          notify(
            notifySuccess(`Please, reset your password before logging in`)
          );
          setFlow('/App/Auth/ResetPassword');
          return;
        }

        default: {
          return notify(notifyError('Please, verify your credentials'));
        }
      }
    }
  });
  let [, , onSubmit] = captureData;
  return (
    <CaptureItemProvider value={captureData}>
      <SignIn onSubmit={onSubmit} />
    </CaptureItemProvider>
  );
}
