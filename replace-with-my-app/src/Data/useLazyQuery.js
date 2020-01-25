import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'urql';

export default function useLazyQuery(options) {
  let [queryOptions, setQueryOptions] = useState(null);

  // let queryOptions = useMemo(() => (), [options, variables])

  let [response, executeQuery] = useQuery({
    ...options,
    variables: queryOptions && queryOptions.variables,
    pause: true,
  });

  useEffect(() => {
    if (!queryOptions) return;
    executeQuery(queryOptions);
  }, [queryOptions]); // eslint-disable-line
  // ignore executeQuery

  return useMemo(() => [response, setQueryOptions], [response]);
}
