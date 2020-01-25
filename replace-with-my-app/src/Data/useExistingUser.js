import { useItem, useCaptureItem, setField } from '../useData.js';
import { useMemo } from 'react';
import get from 'lodash/get';

export let NEW_USER = {
  id: '',
  email: '',
  phone_number: '',
  profile: {
    first_name: '',
    last_name: '',
  },
};

let NEW_USER_ID = 'NEW_USER_ID';

export function useExistingUser() {
  let data = useItem();
  let [item, dispatch] = useCaptureItem();
  let users = get(data, 'users', []);

  let existingUsers = useMemo(() => {
    return [
      {
        id: NEW_USER_ID,
        text: 'Create a new user',
      },
      ...users.map(user => {
        let roles = [
          user.subscriber && 'subscriber',
          user.professional && 'professional',
          get(user, 'company_users[0].company_id') && 'user',
        ].filter(Boolean);

        return {
          id: user.id,
          text: [
            get(user, 'profile.last_name'),
            get(user, 'profile.first_name'),
            get(user, 'email'),
            roles.length > 0 && `(${roles.join(', ')})`,
          ]
            .filter(Boolean)
            .join(' '),
        };
      }),
    ];
  }, [users]);

  let selected = item.useExistingUser ? item.user.id : NEW_USER_ID;

  function onClick(id) {
    dispatch(setField('useExistingUser', id !== NEW_USER_ID));
    dispatch(setField('user', users.find(u => u.id === id) || NEW_USER));
  }

  return { selected, onClick, from: existingUsers };
}
