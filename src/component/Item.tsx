import * as React from "react";
import { useState } from "react";
import "./Item.css";
import { useSwipeable } from "react-swipeable";

const Item = (props: {
  onChange: (id: number, arg1: boolean) => void;
  id: number;
  order: number;
  name: string;
  category: string;
  onDelete(id: number): void;
}) => {
  const [state, setState] = useState(false);
  const changeHandler = (): void => {
    setState(!state);
    props.onChange(props.id, !state);
  };

  const swipeHandler = useSwipeable({
    onSwipedLeft: () => {
      props.onDelete(props.id);
    }, trackMouse: true
  });

  return (
    <li className={"item" + (state ? " done" : "")} {...swipeHandler} style={{ touchAction: "pan-left" }}>
      <input
        id={"item_" + props.id}
        type="checkbox"
        checked={state}
        onChange={changeHandler}
      />
      <span className="order">{props.order}</span>
      <label htmlFor={"item_" + props.id}>
        <span>{props.name}</span>
      </label>
    </li>
  );
};

export default Item;
