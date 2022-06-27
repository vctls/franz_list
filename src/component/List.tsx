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
  let key: number, name: string, category: string, order: number;

  for (let i: number = 0; i < 10; i++) {
    key = i;
    order = i;
    name = (Math.random() + 1).toString(36).substring(7);
    category = (Math.random() + 1).toString(36).substring(7);
    itemArray.push({ key, name, category, order });
  }

  return itemArray;
};

const List = () => {
  const [itemsState, setItemsState] = useState(getInitialArray());
  
  // Delegated form state
  const [nameState, setNameState] = useState("");
  const [orderState, setOrderState] = useState(0);

  const submitHandler = (e: FormEvent): void => {
    e.preventDefault();
    addItem(nameState, orderState);
  };

  const nameChangeHandler = (e: React.FormEvent<HTMLInputElement>): void => {
    setNameState(e.currentTarget.value);
  };
  
  const orderChangeHandler = (e: React.FormEvent<HTMLInputElement>): void => {
    setOrderState(parseInt(e.currentTarget.value));
  };

  const addItem = (name: string, order: number): void => {
    setItemsState((prevItems) => {
      const newItems = [...prevItems];
      newItems.unshift({
        key: newItems.length,
        name: name,
        category: "TODO",
        order: order,
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
      let index = newItems.findIndex((item) => item.key === id);
      // TODO Only mark item for deletion. Do not remove it from the array,
      //  so it can be manipulated further, or re-added to the list.
      //newItems.splice(index, 1);
      console.log(index);
      return newItems;
    });
  };

  const itemEdit = (id: number) => {
    let editItem;
    setItemsState((prevItems) => {
      let newItems = [...prevItems];
      editItem = newItems.find((item) => item.key === id);
      // TODO Only mark item for deletion. Do not remove it from the array,
      //  so it can be manipulated further, or re-added to the list.
      //newItems.splice(index, 1);
      setNameState(editItem.name);
      setOrderState(editItem.order);
      return newItems;
    });
    document.getElementById("name")?.focus();
  };
  
  // Filter items that contain the string in the name field.
  const filteredItems = itemsState.filter((item) => item.name.includes(nameState))
  
  return (
    <main>
      <ItemForm
        name={nameState}
        order={orderState}
        nameChangeHandler={nameChangeHandler}
        orderChangeHandler={orderChangeHandler}
        submitHandler={submitHandler}
      ></ItemForm>
      <ol id="list">
        {filteredItems.map((item) => {
          return (
            <Item
              key={item.key}
              id={item.key}
              name={item.name}
              category={item.category}
              order={item.order}
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
