import { useCaptureItem } from 'useData.js';
import Email from './Email.view.js';
import React from 'react';

export default function EmailLogic() {
  let item = useCaptureItem({ path: 'isInvite' });
  return <Email disabled={item.value} />;
}
