import gql from 'graphql-tag';

export default function makeMutationInsertSoftDeleteHandler(entity) {
  // TODO we need a fuzzy type of query finder
  // I think we can base it off the name of the query + the type,
  // eg list_provider_locations + provider_locations
  // that way the query can be anything as long as it follows the pattern and we
  // can re-enable filters through the query's where

  // query list_${entity}($limit: Int) {
  //   ${entity}(limit: $limit) {
  let query = gql`
  query list_${entity} {
    ${entity} {
      id
    }
  }`;
  // let variables = { limit: 1000 };

  let insertKey = `insert_${entity}`;
  let updateKey = `update_${entity}`;

  return {
    [insertKey]: (result, args, cache, info) => {
      console.log('result', result, args, cache, info);
      cache.updateQuery({ query /*, variables*/ }, data => {
        let items = result[insertKey].returning.map(item => ({
          __typename: item.__typename,
          id: item.id,
        }));

        return data === null
          ? {
              __typename: 'Query',
              [entity]: items,
            }
          : {
              ...data,
              [entity]: [...data[entity], ...items],
            };
      });
    },
    [updateKey]: (result, args, cache, info) => {
      if (!args._set.deleted_at) return;

      let ids = new Set(result[updateKey].returning.map(item => item.id));

      cache.updateQuery({ query /*, variables*/ }, data => ({
        ...data,
        [entity]: data[entity].filter(item => !ids.has(item.id)),
      }));
    },
  };
}
