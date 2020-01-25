import { captureError } from 'utils/ErrorBoundary.js';
import ky, { HTTPError, TimeoutError } from 'ky';

let defaultDataParser = res => res.json();

function measure(name) {
  let t0 = performance.now();
  return function getTime() {
    let t1 = performance.now();
    let time = t1 - t0;

    if (process.env.NODE_ENV === 'development') {
      console.debug('measure time', name, time);
    }
    return time;
  };
}

let TIME_THRESHOLD = 2500;

export default async function internalFetch(
  url,
  options,
  parseData = defaultDataParser
) {
  let getTime = measure(`fetch ${url}`);

  try {
    let data = await parseData(ky(url, options));
    let time = getTime();

    if (time > TIME_THRESHOLD) {
      captureError(new Error('Request took too long'), {
        type: 'fetch/too-long',
        url,
        options,
        response: { data },
        time,
      });
    }
    return { error: false, data };
  } catch (error) {
    let report = { type: 'fetch/error', url, options, time: getTime() };

    if (error instanceof HTTPError) {
      report.type = `${report.type}-response`;
      report.response = { status: error.response.status };

      try {
        report.response.data = await error.response.text();

        if (process.env.NODE_ENV === 'development') {
          console.error(report.response.data);
        }
      } catch (error) {}
    } else if (error instanceof TimeoutError) {
      report.type = `${report.type}-timeout`;
    }

    captureError(error, report);

    return { error, data: null };
  }
}
