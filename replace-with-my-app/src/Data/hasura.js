import set from 'lodash/set';

export let _eq = (path, value) => set({}, path, { _eq: value });
export let _ilike = (path, value) => set({}, path, { _ilike: value });
export let _wilike = (path, value) => _ilike(path, `%${value}%`);

let _join = (op, rargs) => {
  let args = (Array.isArray(rargs[0]) ? rargs[0] : rargs).filter(Boolean);
  return args.length > 1 ? { [op]: args } : args[0];
};

export let _or = (...args) => _join('_or', args);
export let _and = (...args) => _join('_and', args);

export let _in = (path, value) => set({}, path, { _in: value });
