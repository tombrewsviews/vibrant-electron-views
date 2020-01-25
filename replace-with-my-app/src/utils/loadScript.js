import load from 'load-script2';

let queue = new Map();

export default function loadScript(url) {
  if (!queue.has(url)) {
    queue.set(url, load(url));
  }
  return queue.get(url);
}
