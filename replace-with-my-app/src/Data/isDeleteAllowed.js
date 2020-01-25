import has from 'lodash/has';
import get from 'lodash/get';

export default function makeIsDeleteAllowed(entity, relations) {
  if (process.env.NODE_ENV === 'development') {
    if (!entity || typeof entity !== 'string') {
      throw new Error(
        `makeIsDeleteAllowed is missing the entity as a first parameter, it should be a string`
      );
    }

    if (!Array.isArray(relations)) {
      throw new Error(
        `makeIsDeleteAllowed is missing the relations list as a second parameter`
      );
    }
  }

  let dependencies = relations.map(
    item => `${entity}.${item}_aggregate.aggregate.count`
  );

  function isDeleteAllowed(data) {
    let item = get(data, entity, null);
    if (!item) return false;

    return dependencies.every(item => {
      if (process.env.NODE_ENV === 'development') {
        if (!has(data, item)) {
          throw new Error(
            `isDeleteAllowed "${item}" is missing from the item query's result. Did you forget to add "deleteAllowedQueryBits" to it? Eg:

  query get_provider_location($id: uuid!) {
    provider_location: provider_locations_by_pk(id: $id) {
      id
      website
      \${deleteAllowedQueryBits}
    }
  }`
          );
        }
      }

      return get(data, item, null) === 0;
    });
  }

  let deleteAllowedQueryBits = relations
    .map(item => `${item}_aggregate { aggregate { count } }`)
    .join('\n');

  return [isDeleteAllowed, deleteAllowedQueryBits];
}
