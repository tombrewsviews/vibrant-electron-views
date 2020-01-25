export let randomString = () =>
  Math.random()
    .toString(36)
    .substr(7);
