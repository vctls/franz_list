import Item from "./Item";
import * as React from "react";
import { useState } from "react";
import "./List.css";
import ItemForm from "./ItemForm";

function arraymove(arr: any[], fromIndex: number, toIndex: number) {
  let element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

const itemArray: any[] = [];
let key: number, name: string, category: string, order: number;

for (let i: number = 0; i < 10; i++) {
  key = i;
  order = i;
  name = (Math.random() + 1).toString(36).substring(7);
  category = (Math.random() + 1).toString(36).substring(7);
  itemArray.push({ key, name, category, order });
}

const List = () => {
  const [itemsState, setItemsState] = useState(itemArray);

  const addItem = (name: string, order: number): void => {
    setItemsState((prevItems) => {
      let newItems = [...prevItems];
      let newItem = {
        key: newItems.length,
        name: name,
        category: "TODO",
        order: order
      };
      newItems.unshift(newItem);
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
    // TODO Set form fields to item values.
  }

  return (
    <main>
      <ItemForm onSubmitHandler={addItem}></ItemForm>
      <ol id="list">
        {itemsState.map((item) => {
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
