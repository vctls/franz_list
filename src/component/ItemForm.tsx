import * as React from "react";
import { useState } from "react";
import "./ItemForm.css";

const ItemForm = (props: {
  onSubmitHandler: (arg0: string, arg1: number) => void;
}) => {
  const [nameState, setNameState] = useState("");
  const [orderState, setOrderState] = useState(0);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    props.onSubmitHandler(nameState, orderState);
  };

  const nameChangeHandler = (e: React.FormEvent<HTMLInputElement>): void => {
    setNameState(e.currentTarget.value);
  };

  const orderChangeHandler = (e: React.FormEvent<HTMLInputElement>): void => {
    setOrderState(parseInt(e.currentTarget.value));
  };

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor="name">
        <input
          id="name"
          type="text"
          value={nameState}
          onChange={nameChangeHandler}
        />
      </label>
      <label htmlFor="order">
        <input
          id="order"
          name="order"
          type="number"
          min="0"
          value={orderState}
          onChange={orderChangeHandler}
        />
      </label>
      <input type="submit" />
    </form>
  );
};

export default ItemForm;
