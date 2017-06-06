import { linkEvent } from 'inferno';

const tileContent = {
  0: '',
  1: '💣',
};

function handleClick(props, event) {
  props.onTileClick(props.pos, event);
}

export function shouldUpdate(lastProps, nextProps) {
  return (
    lastProps.value !== nextProps.value
  );
}

export default function MinefieldBuilderTile(props) {
  const { value } = props;
  return (
    <div
      className="tile"
      onMouseDown={linkEvent(props, handleClick)}
      noNormalize
    >
      <span>{tileContent[value]}</span>
    </div>
  );
}