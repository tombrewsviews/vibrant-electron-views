import { useCaptureItem } from 'useData.js';
import LastName from './LastName.view.js';
import React from 'react';

export default function LastNameLogic() {
  let item = useCaptureItem({ path: 'isInvite' });
  return <LastName disabled={item.value} />;
}
