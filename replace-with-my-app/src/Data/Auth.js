import { useFlow, useSetFlow } from '../useFlow.js';
import AmplifyAuth from '@aws-amplify/auth';
import isBefore from 'date-fns/isBefore';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import qs from 'querystringify';
import useLazyQuery from 'Data/useLazyQuery.js';
import useToolsDesignData from '../useToolsDesignData';

export function Auth(props) {
  if (process.env.NODE_ENV === 'development') {
    if (!props.queryGetUserContext) {
      throw new Error(`Missing "queryGetUserContext" in Auth`);
    }
    if (typeof props.parseUserContext !== 'function') {
      throw new Error(`Missing "parseUserContext" function in Auth`);
    }
  }

  let flow = useFlow();
  let setFlow = useSetFlow();
  // TODO rework the relation between the graphql client and the auth module
  // I put a client above the Auth and one right next to the MyAccount so we can
  // remove the cache when the user logs out because of how the graphql clients
  // get stacked through context but even though it's achieving the goal of
  // removing the cached data after sign in, this isn't ideal long term
  // because the user query from here stays there until the page is closed
  // not much can be done with it but ideally we'd make it less obvious
  // one way would be to use a new client here https://formidable.com/open-source/urql/docs/urql-outside-react/
  // or to use fetch directly, let's explore options
  let [userContext, executeQueryGetUserContext] = useLazyQuery({
    query: props.queryGetUserContext,
    requestPolicy: 'network-only',
  });

  let [designData, setDesignData] = useToolsDesignData('Auth');
  let [state, setState] = useState(designData || props.initialState);
  useEffect(() => setDesignData(state), [state]); // eslint-disable-line
  // ignore setDesignData
  let isRefreshToken = useRef(false);

  let authContext = useMemo(
    () => {
      async function getUserContext(user) {
        let shouldSetFlow = true;
        // prevent auth from hijacking Tools state
        if (process.env.NODE_ENV === 'development') {
          if (
            process.env.REACT_APP_VIEWS_TOOLS &&
            !flow.has(props.getSignInStory(state)) &&
            !flow.has(props.getResetPasswordConfirmStory(state)) &&
            !flow.has(props.getSignupConfirmStory(state))
          ) {
            shouldSetFlow = false;
          }
        }
        if (shouldSetFlow) {
          setFlow(props.getLoadingStory(state));
        }

        if (process.env.NODE_ENV === 'development') {
          if (!user) {
            try {
              user = await AmplifyAuth.currentAuthenticatedUser();
            } catch (error) {
              console.error(error);
            }
          }
        }

        if (!user) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              'You need to login/signup with a valid user. See cognitoUsers in sample-data/make.js or make your own and attach your cognito_id and details to that list.'
            );
          }
          await authContext.signOut();
          return;
        }

        let payload = JSON.parse(
          user.signInUserSession.idToken.payload['https://hasura.io/jwt/claims']
        );
        executeQueryGetUserContext({
          variables: { id: payload['x-hasura-user-id'] },
        });
      }

      let signIn = ({ email, password }) => AmplifyAuth.signIn(email, password);
      let signInNewPasswordRequired = ({ user, password }) =>
        AmplifyAuth.completeNewPassword(user, password);

      let signUp = ({ email, password, first_name, last_name }) =>
        AmplifyAuth.signUp({
          username: email,
          password,
          attributes: {
            email,
            family_name: last_name,
            name: first_name,
          },
        });
      let signUpConfirm = ({ email, code }) =>
        AmplifyAuth.confirmSignUp(email, code);
      let signUpConfirmResendCode = ({ email }) =>
        AmplifyAuth.resendSignUp(email);

      // TODO FIXME clean up on local!
      async function userExists(email) {
        try {
          await AmplifyAuth.confirmSignUp(email, '000000', {
            // If set to False, the API will throw an AliasExistsException error if the phone number/email used already exists as an alias with a different user
            forceAliasCreation: false,
          });
          return true;
        } catch (error) {
          switch (error.code) {
            case 'UserNotFoundException':
            case 'ResourceNotFoundException':
              return false;
            case 'NotAuthorizedException':
            case 'AliasExistsException': // Email alias already exists
            case 'CodeMismatchException':
            case 'ExpiredCodeException':
            default:
              return true;
          }
        }
      }

      async function signOut() {
        await AmplifyAuth.signOut();
        setFlow(props.getSignInStory(state));
        setState(props.initialState);
        if (process.env.NODE_ENV === 'development') {
          if (process.env.REACT_APP_VIEWS_TOOLS) {
            sessionStorage.clear();
          }
        }
      }

      let resetPassword = ({ email }) => AmplifyAuth.forgotPassword(email);
      let resetPasswordConfirm = ({ email, code, password }) =>
        AmplifyAuth.forgotPasswordSubmit(email, code, password);

      async function changePassword({ old_password, new_password }) {
        let user = await AmplifyAuth.currentAuthenticatedUser();
        return await AmplifyAuth.changePassword(
          user,
          old_password,
          new_password
        );
      }

      async function refreshToken() {
        let res = await new Promise(async (resolve, reject) => {
          try {
            let cognitoUser = await AmplifyAuth.currentAuthenticatedUser();
            let currentSession = await AmplifyAuth.currentSession();
            cognitoUser.refreshSession(
              currentSession.refreshToken,
              (err, session) => (err ? reject(err) : resolve(session))
            );
          } catch (error) {
            reject(error);
          }
        });

        isRefreshToken.current = true;
        executeQueryGetUserContext({ variables: { id: state.data.userId } });
        return res;
      }

      return {
        ...state,
        changePassword,
        getUserContext,
        signIn,
        signInNewPasswordRequired,
        signUp,
        signUpConfirm,
        signUpConfirmResendCode,
        signOut,
        resetPassword,
        resetPasswordConfirm,
        refreshToken,
        userExists,
      };
    },
    [state, userContext, flow] // eslint-disable-line
  ); // ignore getUserContext and setFlow

  // check for login on start
  useEffect(() => {
    (async () => {
      try {
        let user = await AmplifyAuth.currentAuthenticatedUser();
        if (
          isBefore(
            user.signInUserSession.idToken.payload.exp * 1000,
            Date.now()
          )
        ) {
          throw new Error('Session expired');
        }
        authContext.getUserContext(user);
      } catch (error) {
        let { invite } = qs.parse(window.location.search);
        // TODO FIXME cleaner way to prevent redirect
        if (!invite) {
          setFlow(props.getSignInStory(state));
        }
      }
    })();
  }, []); // eslint-disable-line
  // only run once

  // parse the user context when it changes
  useEffect(() => {
    if (userContext.fetching || !userContext.data) return;

    if (userContext.error || !userContext.data.user) {
      authContext.signOut();
      return;
    }

    try {
      setState(props.parseUserContext(userContext));
    } catch (error) {
      authContext.signOut();
    }
  }, [userContext]); // eslint-disable-line
  // ignore authContext

  // react to the state changing
  useEffect(() => {
    if (!state.data.userId) return;

    // leaving this commented out for now because it was creating a weird
    // inconsistency with production when the flow changing was causing the
    // story to be reset
    //
    //     // prevent auth from hijacking Tools state
    //     if (process.env.NODE_ENV === 'development') {
    //       if (
    //         process.env.REACT_APP_VIEWS_TOOLS &&
    //         !flow.has(props.getLoadingStory(state))
    //       ) {
    //         isRefreshToken.current = false;
    //         return;
    //       }
    //     }

    if (!isRefreshToken.current) {
      setFlow(props.getReadyStory(state));
    }
    isRefreshToken.current = false;
  }, [state.data.userId /* , flow*/]); // eslint-disable-line
  // props.getReadyStory, setFlow

  return (
    <AuthContext.Provider value={authContext}>
      {props.children}
    </AuthContext.Provider>
  );
}
Auth.defaultProps = {
  initialState: {
    data: { userId: null },
    permissions: {},
  },
  getLoadingStory: () => '/App/Loading',
  getSignInStory: () => '/App/Auth/SignIn',
  getResetPasswordConfirmStory: () => '/App/Auth/ResetPasswordConfirm',
  getSignupConfirmStory: () => '/App/Auth/SignUpConfirm',
  getReadyStory: () => '/App/MyAccount',
};

let AuthContext = React.createContext([{}, () => {}]);
export let useAuth = () => useContext(AuthContext);
export let useUserId = () => useAuth().data.userId;
