import SubMenu from './SubMenu.view.js';
import React from 'react';
import { useFlow } from 'useFlow.js';

export default function SubMenuLogic(props) {
  let flow = useFlow();
  return (
    <SubMenu
      {...props}
      flowMe={flow.has(`/App/Account/Content/Appointments/Content/Me`)}
      flowOthers={flow.has(`/App/Account/Content/Appointments/Content/Others`)}
    />
  );
}
