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

const List = (props: {
  initialItems: any[];
  itemCreate: (id: number, order: number, name: string, done: boolean) => void;
  itemUpdate: (id: number, order: number, name: string, done: boolean) => void;
  itemDelete: (id: number) => void;
}) => {
  const [itemsState, setItemsState] = useState(props.initialItems);

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
      const id = newItems.length
        ? Math.max.apply(
            null,
            newItems.map((item) => item.id)
          ) + 1
        : 0;
      const newItem = {
        id: id,
        name: name,
        order: order,
        deleted: false,
      };
      newItems.unshift(newItem);
      props.itemCreate(id, order, name, false);
      return newItems;
    });
  };

  const itemChanged = (id: number, done: boolean): void => {
    setItemsState((prevItems) => {
      const newItems = [...prevItems];
      const index = newItems.findIndex((item) => item.id === id);
      const item = newItems.find((item) => item.id === id);
      if (done) {
        arraymove(newItems, index, newItems.length);
      } else {
        arraymove(newItems, index, 0);
      }
      props.itemUpdate(item.id, item.order, item.name, done);
      return newItems;
    });
  };

  // Remove an item completely.
  const removeItem = (id: number) => {
    setItemsState((prevItems) => {
      console.log(`Removing item ${id}.`);
      let newItems = [...prevItems];
      const index = newItems.findIndex((item) => item.id === id);
      if (index < 0) {
        console.log(`Item ${id} to be removed was not found.`);
        return prevItems;
      }
      if (!newItems[index].deleted) {
        console.log(`Item ${id} to be removed is not set for deletion.`);
        return prevItems;
      }
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const itemDeleted = (id: number) => {
    setItemsState((prevItems) => {
      console.log(`Item ${id} set for deletion.`);
      let newItems = [...prevItems];
      const item = newItems.find((item) => item.id === id);
      item.deleted = true;
      props.itemDelete(id);
      // Completely remove the item after a small delay,
      // in order to allow more DOM manipulations, animations, etc.
      setTimeout(() => {
        removeItem(id);
      }, 3000);
      return newItems;
    });
  };

  const itemEdit = (id: number) => {
    let editItem;
    setItemsState((prevItems) => {
      let newItems = [...prevItems];
      editItem = newItems.find((item) => item.id === id);
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
              key={item.id}
              id={item.id}
              name={item.name}
              order={item.order}
              filtered={item.filtered}
              done={item.done}
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
