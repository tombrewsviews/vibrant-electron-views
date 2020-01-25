import { useCaptureItem } from 'useData.js';
import FirstName from './FirstName.view.js';
import React from 'react';

export default function FirstNameLogic() {
  let item = useCaptureItem({ path: 'isInvite' });
  return <FirstName disabled={item.value} />;
}
