import Auth from '@aws-amplify/auth';
import Storage from '@aws-amplify/storage';

export default function maybeSetupAmplifyDevEnv() {
  if (process.env.NODE_ENV !== 'development') return;
  if (!/localhost/.test(process.env.REACT_APP_API)) return;
  // Auth
  let SESSION_KEY = '__fake_cognito_signInUserSession';
  let signInUserSession = null;
  try {
    signInUserSession = JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch (error) {}

  async function refreshSession(_, callback) {
    let id = JSON.parse(
      signInUserSession.idToken.payload['https://hasura.io/jwt/claims']
    )['x-hasura-user-id'];
    callback(false, await getSignInUserSession({ id }));
  }

  let gql = i => i[0];

  let GET_DEV_USER = gql`
    query GetDevUser($email: String, $id: uuid) {
      users(where: { _or: { email: { _eq: $email }, id: { _eq: $id } } }) {
        id
        cognito_id
        company_users {
          company_id
          role
        }
      }
    }
  `;

  let SIGNUP_DEV_USER = gql`
    mutation SignupDevUser($object: users_insert_input!) {
      insert_users(objects: [$object]) {
        returning {
          id
          cognito_id
          email
          profile {
            first_name
            last_name
          }
        }
      }
    }
  `;

  Auth.currentAuthenticatedUser = async () => {
    if (signInUserSession) {
      return { signInUserSession, refreshSession };
    }
    throw new Error('No signInUserSession');
  };

  Auth.currentSession = async () => ({ refreshToken: true });

  function fail(code) {
    let err = new Error(code);
    err.code = code;
    throw err;
  }
  function challenge(challengeName) {
    return { challengeName };
  }

  async function getSignInUserSession({ email, id }) {
    let res = await fetch(process.env.REACT_APP_API, {
      method: 'POST',
      headers: {
        'x-hasura-admin-secret': process.env.REACT_APP_API_KEY,
      },
      body: JSON.stringify({
        query: GET_DEV_USER,
        variables: { email, id },
      }),
    });
    let { data, error } = await res.json();

    if (error) {
      throw error;
    }

    let user = data.users[0];
    let payload = {
      sub: user.cognito_id,
      'https://hasura.io/jwt/claims': JSON.stringify({
        'x-hasura-user-id': user.id,
      }),
    };

    let jwtfn = await import('jwt-function');
    let iat = Math.round(Date.now() / 1000) - 100;
    let getToken = payload => {
      return {
        payload,
        jwtToken: jwtfn.sign(
          payload,
          process.env.REACT_APP_API_KEY_SECRET_DEV_MODE,
          {
            iat,
            exp: iat + 10000000,
          }
        ),
      };
    };

    signInUserSession = {
      idToken: getToken(payload),
      accessToken: getToken({
        sub: user.cognito_id,
      }),
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(signInUserSession));

    return { signInUserSession };
  }

  Auth.signIn = async (email, _password, runEmailCheck = true) => {
    if (runEmailCheck) {
      // https://aws-amplify.github.io/docs/js/authentication#sign-in
      if (/new_password_required/i.test(email)) {
        return challenge('NEW_PASSWORD_REQUIRED');
      } else if (/sms_mfa/i.test(email)) {
        return challenge('SMS_MFA');
      } else if (/software_token_mfa/i.test(email)) {
        return challenge('SOFTWARE_TOKEN_MFA');
      } else if (/mfa_setup/i.test(email)) {
        return challenge('MFA_SETUP');
      } else if (/user_not_confirmed/i.test(email)) {
        fail('UserNotConfirmedException');
      } else if (/password_reset_required/i.test(email)) {
        fail('PasswordResetRequiredException');
      } else if (/not_authorized/i.test(email)) {
        fail('NotAuthorizedException');
      } else if (/user_not_found/i.test(email) || email.trim() === '') {
        fail('UserNotFoundException');
      }
    }

    return await getSignInUserSession({ email });
  };

  Auth.completeNewPassword = (email, password) =>
    Auth.signIn(email, password, false);

  Auth.signOut = async () => {
    signInUserSession = null;
    localStorage.removeItem('amplify-authenticator-authState');
    sessionStorage.removeItem(SESSION_KEY);
  };

  Auth.signUp = async ({
    attributes: { email, family_name: last_name, name: first_name },
  }) => {
    let { default: uuid } = await import('uuid/v4');
    let res = await fetch(process.env.REACT_APP_API, {
      method: 'POST',
      headers: {
        'x-hasura-admin-secret': process.env.REACT_APP_API_KEY,
      },
      body: JSON.stringify({
        query: SIGNUP_DEV_USER,
        variables: {
          object: {
            cognito_id: uuid(),
            email,
            profile: { data: { last_name, first_name } },
          },
        },
      }),
    });
    let { data, errors } = await res.json();

    if (errors) {
      throw new Error(errors.map(item => item.message).join(', '));
    }
    return data;
  };

  Auth.confirmSignUp = async (email, code) => {
    //TODO FIXME: current handling of user exists will take cognito_id as a "exiting user" but cognito_id is never set on local
    //if you want your user to be treated as existing manually set cognito_id to something non null in the db
    // this is only relevant when clicking and testing /?invite links
    if (code === '000000') {
      let res = await fetch(process.env.REACT_APP_API, {
        method: 'POST',
        headers: {
          'x-hasura-admin-secret': process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify({
          query: GET_DEV_USER,
          variables: { email },
        }),
      });
      let { data, error } = await res.json();

      if (error) {
        throw error;
      }

      let user = data.users[0];
      if (user && !user.cognito_id) {
        return fail('UserNotFoundException');
      }
      return !!user;
    } else {
      return true;
    }
  };
  Auth.resendSignUp = async () => true;
  Auth.forgotPassword = async () => true;
  Auth.forgotPasswordSubmit = async () => true;
  Auth.changePassword = async (_, old_password, new_password) => {
    if (old_password === new_password) {
      throw new Error('Same passwords');
    }
    return true;
  };

  Auth.verifiedContact = () =>
    Promise.resolve({
      verified: {
        email: true,
      },
    });

  // Storage
  Storage.put = async fileName => ({ key: `mock:${fileName}` });

  Storage.get = async fileName => `https://s3.com/mock:${fileName}`;
}
