import Item from "./Item";
import * as React from "react";
import { FormEvent, useState } from "react";
import "./List.css";
import ItemForm from "./ItemForm";

function arraymove(arr: any[], fromIndex: number, toIndex: number) {
  let element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

const getInitialArray = () => {
  const itemArray: any[] = [];
  let key: number,
    deleted = false,
    name: string,
    order: number;

  for (let i: number = 0; i < 10; i++) {
    key = i;
    order = i;
    name = [
      "Don Sanche",
      "Christus",
      "Te Deum",
      "An die Künstler",
      "La terre",
      "Les aquilons",
      "Les flots",
      "Les astres",
      "Nicht gezagt",
      "Saatengrün",
    ][i];
    itemArray.push({ key, name, order, deleted });
  }

  return itemArray;
};

const List = () => {
  const [itemsState, setItemsState] = useState(getInitialArray());

  // Delegated form state
  let [nameState, setNameState] = useState("");
  const [orderState, setOrderState] = useState(0);

  const submitHandler = (e: FormEvent): void => {
    e.preventDefault();

    // Prevent adding item with empty name.
    if (nameState === "") {
      return;
    }

    // Prevent exact duplicates.
    const found = itemsState.find(
      (item) => item.name === nameState && item.deleted === false
    );
    if (!found) {
      addItem(nameState, orderState);
      // Clear the form after successful add.
      clearHandler();
      // Immediately re-focus name field to keep adding elements.
      document.getElementById("name")?.focus();
    }
  };
  
  /**
   * Using setName does not trigger change
   * @param value
   */
  function filter(value: string) {
    setItemsState((prevItems) => {
      const newItems = [...prevItems];
      newItems.forEach(
        (item) =>
          (item.filtered = !item.name
            .toLowerCase()
            .includes(value.toLowerCase()))
      );
      return newItems;
    });
  }

  const nameChangeHandler = (e: React.FormEvent<HTMLInputElement>): void => {
    const value = e.currentTarget.value;
    setNameState(value);
    filter(value);
  };

  const clearHandler = () => {
    setNameState("");
    setOrderState(0);
    filter("");
  };

  const orderChangeHandler = (e: React.FormEvent<HTMLInputElement>): void => {
    setOrderState(parseInt(e.currentTarget.value));
  };

  const addItem = (name: string, order: number): void => {
    setItemsState((prevItems) => {
      const newItems = [...prevItems];
      // TODO Items should probably have a prototype.
      newItems.unshift({
        key: newItems.length,
        name: name,
        order: order,
        deleted: false,
      });
      return newItems;
    });
  };

  const itemChanged = (id: number, done: boolean): void => {
    setItemsState((prevItems) => {
      let newItems = [...prevItems];
      let index = newItems.findIndex((item) => item.key === id);
      if (done) {
        arraymove(newItems, index, newItems.length);
      } else {
        arraymove(newItems, index, 0);
      }
      return newItems;
    });
  };

  const itemDeleted = (id: number) => {
    setItemsState((prevItems) => {
      let newItems = [...prevItems];
      const item = newItems.find((item) => item.key === id);
      item.deleted = true;
      return newItems;
    });
  };

  const itemEdit = (id: number) => {
    let editItem;
    setItemsState((prevItems) => {
      let newItems = [...prevItems];
      editItem = newItems.find((item) => item.key === id);
      setNameState(editItem.name);
      setOrderState(editItem.order);
      filter(editItem.name);
      return newItems;
    });
    document.getElementById("name")?.focus();
  };

  return (
    <main>
      <ItemForm
        name={nameState}
        order={orderState}
        nameChangeHandler={nameChangeHandler}
        orderChangeHandler={orderChangeHandler}
        submitHandler={submitHandler}
        clearHandler={clearHandler}
      ></ItemForm>
      <ol id="list">
        {itemsState.map((item) => {
          return (
            <Item
              key={item.key}
              id={item.key}
              name={item.name}
              order={item.order}
              filtered={item.filtered}
              onChange={itemChanged}
              onDelete={itemDeleted}
              onEdit={itemEdit}
            ></Item>
          );
        })}
      </ol>
    </main>
  );
};

export default List;
