import Item from "./Item";
import { useState } from "react";
import "./List.css";
import ItemForm from "./ItemForm";
import { useHotkeys } from "react-hotkeys-hook";

function arraymove(arr: any[], fromIndex: number, toIndex: number) {
  let element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

const itemArray: any[] = [];
let key: number, name: string, category: string, order: number, done: boolean;

for (let i: number = 0; i < 10; i++) {
  key = i;
  order = i;
  done = false;
  name = (Math.random() + 1).toString(36).substring(7);
  category = (Math.random() + 1).toString(36).substring(7);
  itemArray.push({ key, name, done, category, order });
}

const List = () => {
  const [itemsState, setItemsState] = useState(itemArray);
  const [currentItem, setCurrentItem] = useState<undefined | number>(0);

  useHotkeys(
    "down",
    () => {
      setCurrentItem((prevIndex) => {
        if (prevIndex === undefined || prevIndex === itemsState.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
    },
    [itemsState]
  );

  useHotkeys(
    "up",
    () => {
      setCurrentItem((prevIndex) => {
        if (prevIndex === undefined || prevIndex === 0) {
          return itemsState.length - 1;
        }
        return prevIndex - 1;
      });
    },
    [itemsState]
  );

  useHotkeys(
    "space",
    () => {
      if (currentItem !== undefined) {
        toggleDone(itemsState[currentItem].key);
      }
    },
    [itemsState, currentItem]
  );

  const addItem = (name: string, order: number): void => {
    setItemsState((prevItems) => {
      let newItems = [...prevItems];
      let newItem = {
        key: newItems.length,
        name: name,
        category: "TODO",
        order: order,
      };
      newItems.unshift(newItem);
      return newItems;
    });
  };

  const toggleDone = (id: number): void => {
    console.log("toggleDone");
    setItemsState((prevItems) => {
      console.log("setItemsState")
      let newItems = [...prevItems];
      let index = newItems.findIndex((item) => item.key === id);
      // We have to copy the object, or it messes up with React "deep comparation"
      // of state variables
      newItems[index] = {...newItems[index]};
      newItems[index].done = !newItems[index].done;
      if (newItems[index].done) {
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
        {itemsState.map((item, index) => {
          return (
            <Item
              key={item.key}
              highlighted={index === currentItem}
              id={item.key}
              done={item.done}
              name={item.name}
              category={item.category}
              order={item.order}
              toggleDone={toggleDone}
              onDelete={itemDeleted}
              onMouseEnter={() => {
                setCurrentItem(index);
              }}
              onEdit={itemEdit}
            ></Item>
          );
        })}
      </ol>
    </main>
  );
};

export default List;
