import { ADD } from 'Data/constants.js';
import { SET, REMOVE, ERROR, OK } from 'Data/constants.js';
import { randomString } from 'utils/random.js';
import arrayToSentence from 'array-to-sentence';
import React, { useContext, useMemo, useReducer } from 'react';

let NotificationsContext = React.createContext({});

function reducer(state, action) {
  switch (action.type) {
    case SET: {
      return [
        ...state,
        { status: action.status, message: action.message, id: action.id },
      ];
    }

    case REMOVE: {
      return state.filter(notification => notification.id !== action.id);
    }

    default: {
      throw new Error(`Action not implemented ${JSON.stringify(action)}`);
    }
  }
}

export function Notifications(props) {
  let [notifications, dispatch] = useReducer(reducer, [
    // comment out if you want test notifications to design it
    // {
    //   id: 1,
    //   message: 'This is a notification',
    //   status: 'OK',
    // },
    // {
    //   id: 2,
    //   message: 'This is a notification error',
    //   status: 'ERROR',
    // },
  ]);

  let context = useMemo(() => {
    function notify({ status = OK, message }, hideAfter = 3200) {
      let id = Math.random();

      dispatch({ status, message, id, type: SET });

      setTimeout(() => {
        dispatch({ status, message, id, type: REMOVE });
      }, hideAfter);

      return message;
    }

    return [notifications, notify];
  }, [notifications]);

  return (
    <NotificationsContext.Provider value={context}>
      {props.children}
    </NotificationsContext.Provider>
  );
}

export let useNotifications = () => useContext(NotificationsContext);

export let notifyInvalid = (fields, list) => ({
  status: ERROR,
  id: randomString(),
  message: createMessage(fields, list),
});

export let notifyError = (message = null) => ({
  status: ERROR,
  id: randomString(),
  message: message || 'Something went wrong. Please, try again.',
});

export let notifySuccess = (message = '') => ({
  message,
  status: OK,
  id: randomString(),
});

function createMessage(fields, list) {
  switch (list) {
    case 'password':
      return 'Please, create a secure password';
    case ADD.ACCEPT_AGREEMENT:
      return `Please provide your ${arrayToSentence(fields, {
        lastSeparator: ' & ',
      })}`;
    default:
      return `Something went wrong. Please check: ${arrayToSentence(fields, {
        lastSeparator: ' & ',
      })}`;
  }
}
