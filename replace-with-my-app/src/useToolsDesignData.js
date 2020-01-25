export default function useToolsDesignData(dataKey) {
  let key = `__views__tools__${dataKey}`;

  let state = null;
  if (process.env.REACT_APP_VIEWS_TOOLS) {
    state = JSON.parse(sessionStorage.getItem(key));
  }

  function setState(next) {
    if (process.env.REACT_APP_VIEWS_TOOLS) {
      sessionStorage.setItem(key, JSON.stringify(next));
    }
  }
  return [state, setState];
}
