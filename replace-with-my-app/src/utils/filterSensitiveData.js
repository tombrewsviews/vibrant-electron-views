import isObject from 'lodash/isObject.js';

let VISIBLE_PADDING = 3; // characters

// src https://github.com/rcjpisani/redactyl.js/blob/master/src/index.js
function makeRedact({ properties, text }) {
  let regex = new RegExp(`(${properties.join('|')})`, 'i');

  return function redact(json) {
    if (!isObject(json)) {
      throw new TypeError('A valid JSON object must be specified');
    }

    let redacted = JSON.parse(JSON.stringify(json));

    Object.entries(redacted).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.filter(isObject).forEach((item, index) => {
          redacted[key][index] = redact(item);
        });
      } else if (isObject(value)) {
        redacted[key] = redact(value);
      } else if (regex.test(key)) {
        redacted[key] = text;
      } else if (typeof value === 'string' && regex.test(value)) {
        // this catches values like https://site.com/?token=1321321
        let match = value.match(regex)[1];
        redacted[key] = `${value.slice(
          0,
          value.indexOf(match) + match.length + VISIBLE_PADDING
        )}${text}`;
      }
    });

    return redacted;
  };
}

export default makeRedact({
  properties: [
    // from lib
    'apikey',
    'api-key',
    'api_key',
    'pass',
    'password',
    'secret',
    'x-api-key',
  ],
  text: '[...]',
});
