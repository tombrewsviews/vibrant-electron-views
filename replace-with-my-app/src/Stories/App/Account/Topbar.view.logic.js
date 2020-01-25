import Topbar from './Topbar.view.js';
import React from 'react';
import { useFlow } from 'useFlow.js';

export default function TopbarLogic(props) {
  let flow = useFlow();
  return (
    <Topbar
      {...props}
      flowDash={flow.has(`/App/Account/Content/Dash`)}
      flowProfile={flow.has(`/App/Account/Content/Profile`)}
      flowChat={flow.has(`/App/Account/Content/Chat`)}
      flowAppointments={flow.has(`/App/Account/Content/Appointments`)}
      flowFinancial={flow.has(`/App/Account/Content/Financial`)}
    />
  );
}
