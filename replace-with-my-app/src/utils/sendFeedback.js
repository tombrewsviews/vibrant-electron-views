import fetch from 'utils/useFetch.js';

export default function sendFeedback({
  name = 'Not Available',
  email = 'not@available.com',
  message,
}) {
  if (!message) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('No message provided');
    }
    return;
  }

  fetch(process.env.REACT_APP_FEEDBACK_API, {
    method: 'POST',
    headers: {
      Authorization: process.env.REACT_APP_FEEDBACK_API_AUTH,
    },
    json: {
      app: process.env.REACT_APP_NAME,
      name,
      email,
      message,
    },
  });
  // we don't care about the response
}
