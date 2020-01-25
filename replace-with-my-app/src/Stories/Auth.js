import { Auth } from 'Data/Auth.js';
import get from 'lodash/get';
import gql from 'graphql-tag';
import React from 'react';

export default function AppAuth(props) {
  return (
    <Auth
      getReadyStory={getReadyStory}
      initialState={INITIAL_STATE}
      parseUserContext={parseUserContext}
      queryGetUserContext={queryGetUserContext}
    >
      {props.children}
    </Auth>
  );
}

function getReadyStory(auth) {
  if (auth.permissions.hasDeclined) {
    return '/App/DeclinedInvitation';
  }

  if (auth.permissions.isNewUser) {
    return '/App/Onboarding';
  }

  return '/App/MyAccount';
}

function parseUserContext(userContext) {
  let userId = get(userContext.data, 'user.id');
  let subscriberId = get(userContext.data, 'user.subscriber.id', null);

  return {
    data: { userId, subscriberId },
    permissions: {
      hasDeclined:
        get(userContext.data, 'user.subscriber.status') === 'Declined',
      isNewUser: !get(
        userContext.data,
        'user.subscriber.has_accepted_agreement',
        false
      ),
      isSubscriber: subscriberId !== null,
    },
  };
}

let queryGetUserContext = gql`
  query GetUserContext($id: uuid!) {
    user: users_by_pk(id: $id) {
      id
      subscriber {
        id
        status
        has_accepted_agreement
      }
    }
  }
`;

let INITIAL_STATE = {
  data: {
    userId: null,
    subscriberId: null,
  },
  permissions: {
    isNewUser: false,
    isSubscriber: false,
  },
};
