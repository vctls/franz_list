import * as React from "react";
import "./ItemForm.css";

const ItemForm = (props: {
  name: string;
  order: number;
  nameChangeHandler: (e: React.FormEvent<HTMLInputElement>) => void;
  orderChangeHandler: (e: React.FormEvent<HTMLInputElement>) => void;
  submitHandler: (e: React.FormEvent) => void;
}) => {
  return (
    <form onSubmit={props.submitHandler}>
      <label htmlFor="name">
        Name&nbsp;
        <input
          id="name"
          type="text"
          value={props.name}
          onChange={props.nameChangeHandler}
        />
      </label>
      <label htmlFor="order">
        Order&nbsp;
        <input
          id="order"
          name="order"
          type="number"
          min="0"
          value={props.order}
          onChange={props.orderChangeHandler}
        />
      </label>
      <input type="submit" value="add" />
    </form>
  );
};

export default ItemForm;
