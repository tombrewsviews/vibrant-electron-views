// @view
import useMousetrap from './use-mousetrap.js';

let Shortcut = props => {
  useMousetrap({ keys: props.keys, type: props.type, onPress: props.onPress });
  return null;
};
export default Shortcut;
