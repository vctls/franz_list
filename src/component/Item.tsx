import * as React from "react";
import { useState } from "react";
import "./Item.css";

const Item = (props: {
  onChange: (arg0: any, arg1: boolean) => void;
  id: string;
  order: number;
  name: string;
  category: string;
}) => {
  const [state, setState] = useState(false);
  const changeHandler = (): void => {
    setState(!state);
    props.onChange(props.id, !state);
  };

  return (
    <li className={"item" + (state ? " done" : "")}>
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
