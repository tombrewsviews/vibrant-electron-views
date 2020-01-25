import React, { useContext, useEffect, useReducer } from 'react';
import useToolsDesignData from 'useToolsDesignData.js';

export function Selected(props) {
  let [designData, setDesignData] = useToolsDesignData('Selected');
  let value = useReducer(
    reducer,
    designData || {
      subscriberDependentId: null,
    }
  );

  useEffect(() => setDesignData(value[0]), [value]); // eslint-disable-line
  // ignore setDesignData

  return (
    <SelectedContext.Provider value={value}>
      {props.children}
    </SelectedContext.Provider>
  );
}
Selected.defaultProps = {};

let SelectedContext = React.createContext([{}, () => {}]);
export let useSelected = () => useContext(SelectedContext);

let reducer = (state, selection) => ({ ...state, ...selection });
