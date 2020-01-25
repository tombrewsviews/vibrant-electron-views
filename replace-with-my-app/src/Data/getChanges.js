import { _and, _eq, _in } from './hasura.js';
import differenceWith from 'lodash/differenceWith';
import intersectionWith from 'lodash/intersectionWith';
import pick from 'lodash/pick';

function getDiff(a, b, key, fields) {
  let compare = (ai, bi) => ai[key] === bi[key];

  return {
    insert: differenceWith(b, a, compare),
    update: intersectionWith(b, a, (ai, bi) => {
      if (ai[key] !== bi[key]) return false;
      return fields.some(key => ai[key] !== bi[key]);
    }),
    delete: differenceWith(a, b, compare),
  };
}

export default function getChanges({
  prev,
  next,
  pick: fields = ['id'],
  entity,
}) {
  let [key, ...rest] = fields;
  let diff = getDiff(prev, next, key, fields);

  let insert = diff.insert.map(item => ({
    [entity.key]: entity.value,
    ...pick(item, rest),
  }));

  let update = diff.update.map(item => [item[key], pick(item, rest)]);

  let _delete = _and(
    _eq(entity.key, entity.value),
    _and(
      _in(
        key,
        diff.delete.map(item => item[key])
      )
    )
  );

  return [insert, _delete || {}, update];
}
