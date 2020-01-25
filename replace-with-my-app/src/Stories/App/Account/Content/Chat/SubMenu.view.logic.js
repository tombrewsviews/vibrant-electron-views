import SubMenu from './SubMenu.view.js';
import React from 'react';
import { useFlow } from 'useFlow.js';

export default function SubMenuLogic(props) {
  let flow = useFlow();
  return (
    <SubMenu
      {...props}
      flowAllLocations={flow.has(
        `/App/Account/Content/Chat/Content/AllLocations`
      )}
      flowRecentLocation={flow.has(
        `/App/Account/Content/Chat/Content/RecentLocation`
      )}
    />
  );
}
