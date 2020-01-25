import { useNotifications } from 'utils/useNotifications.js';
import { OK, ERROR } from 'Data/constants.js';
import Notifications from './Notifications.view.js';
import React from 'react';

export default function NotificationsLogic() {
  let [notifications] = useNotifications();
  return notifications.map(n => (
    <Notifications
      key={n.id}
      isError={n.status === ERROR}
      isOk={n.status === OK}
      message={n.message}
    />
  ));
}
