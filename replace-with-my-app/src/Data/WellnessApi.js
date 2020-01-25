import * as fromData from '../useData.js';
// import { cacheExchange } from '@urql/exchange-graphcache';
import { captureError } from 'utils/ErrorBoundary.js';
import {
  createClient,
  dedupExchange,
  fetchExchange,
  cacheExchange,
  Provider,
} from 'urql';
import { pipe, tap } from 'wonka';
import { useSetFlow } from 'useFlow.js';
import Auth from '@aws-amplify/auth';
// import makeMutationInsertSoftDeleteHandler from './makeMutationInsertSoftDeleteHandler.js';
import React, { useMemo } from 'react';

// let devtoolsExchange = null;
// if (process.env.NODE_ENV === 'development') {
//   devtoolsExchange = require('@urql/devtools').devtoolsExchange;
// }

function isErrorThatForcesSignIn(error) {
  switch (error.extensions && error.extensions.code) {
    case 'access-denied':
    case 'jwt-invalid-claims':
      return true;
    default:
      return false;
  }
}

function makeClient({ setFlow }) {
  function forceSignIn() {
    Auth.signOut();
    setFlow('/App/Auth/SignIn');
  }

  let errorExchange = ({ forward }) => ops$ => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        // if the OperationResult has an error send a request to sentry
        if (error) {
          // the error is a CombinedError with networkError and graphqlErrors properties
          captureError(error, error.graphQLErrors);
          if (error.graphQLErrors.some(isErrorThatForcesSignIn)) {
            forceSignIn();
          }
        }
      })
    );
  };

  return createClient({
    url: process.env.REACT_APP_API,
    // TODO there's a problem with @url/exchange-graphcache and this setting
    // so I've disabled the cache for now and resorted to this instead
    // which gives us semi-updated queries
    requestPolicy: 'cache-and-network', // if we see weird stuff, use 'network-only'
    fetch: async (url, options) => {
      let headers = { ...options.headers };
      try {
        let user = await Auth.currentAuthenticatedUser();
        headers.Authorization = `Bearer ${user.signInUserSession.accessToken.jwtToken}`;
        headers['x-hasura-role'] = 'subscriber';
      } catch (error) {
        captureError(error);
        forceSignIn();
        headers['x-hasura-role'] = 'public';
      }
      return fetch(url, { ...options, headers });
    },
    exchanges: [dedupExchange, cacheExchange, errorExchange, fetchExchange],
    // exchanges: [
    //   dedupExchange,
    //   // devtoolsExchange,
    //   // Replace the default cacheExchange with the new one
    //   cacheExchange({
    //     keys: {
    //       company_users: data =>
    //         `${data.company_id}:${data.user_id}:${data.role}`,
    //       subscriber_group_plan_contributions: data =>
    //         `${data.company_id}:${data.plan_id}`,
    //       subscribers_aggregate: () => null,
    //       subscribers_aggregate_fields: () => null,
    //       subscriber_dependents_aggregate: () => null,
    //       subscriber_dependents_aggregate_fields: () => null,
    //       professional_locations_aggregate: () => null,
    //       professional_locations_aggregate_fields: () => null,
    //       provider_locations_aggregate: () => null,
    //       provider_locations_aggregate_fields: () => null,
    //       professional_locations: () => null,
    //       // data => `${data.professional_id}:${data.provider_location_id}`
    //       tags: data => data.name,
    //       VerifyResponse: () => null,
    //       procedure_tags: () => null,
    //     },
    //     updates: {
    //       Mutation: {
    //         ...makeMutationInsertSoftDeleteHandler('companies'),
    //         ...makeMutationInsertSoftDeleteHandler('company_users'),
    //         ...makeMutationInsertSoftDeleteHandler('professionals'),
    //         ...makeMutationInsertSoftDeleteHandler('provider_locations'),
    //         ...makeMutationInsertSoftDeleteHandler('subscribers'),
    //       },
    //     },
    //   }),
    //   fetchExchange,
    // ].filter(Boolean),
  });
}

export function WellnessApi(props) {
  let setFlow = useSetFlow();
  let client = useMemo(() => makeClient({ setFlow }), []); // eslint-disable-line
  // ignore setFlow

  return <Provider value={client}>{props.children}</Provider>;
}

export let ItemProvider = fromData.ItemProvider;
export let useItem = fromData.useItem;
export let setField = fromData.setField;
export let reset = fromData.reset;
export let CaptureItemProvider = fromData.CaptureItemProvider;
export let useCaptureItem = fromData.useCaptureItem;
export let useCaptureItemProvider = fromData.useCaptureItemProvider;
