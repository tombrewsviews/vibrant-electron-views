import { useEffect } from 'react';
import Mousetrap from 'mousetrap';

let useMousetrap = ({ keys, onPress, type }) => {
  useEffect(() => {
    Mousetrap.bind(
      keys.split(' '),
      () => {
        onPress();
        return false;
      },
      type
    );

    return () => {
      Mousetrap.unbind(keys.split(' '), type);
    };
  }, [keys, type, onPress]);
};
export default useMousetrap;
