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
  const [done, setDone] = useState(false);

  const [deleted, setDeleted] = useState(false);
  let el: EventTarget | null;
  const swipeHandler = useSwipeable({
    onTap: () => {
      setDone(!done);
      props.onChange(props.id, !done);
    },
    onTouchStartOrOnMouseDown: (e) => {
      if (e.event.target instanceof HTMLElement) {
        el = e.event.target.closest(".item-content");
      }
    },
    onSwiping: (eventData) => {
      if (el instanceof HTMLElement) {
        const deltaX = eventData.deltaX;
        let translate = Math.abs(deltaX) < 100 ? Math.abs(deltaX) : 100;
        if (deltaX < -10) {
          el.style.transform = `translateX(-${translate}px)`;
        } else if (deltaX > 10) {
          el.style.transform = `translateX(${translate}px)`;
        } else {
          el.style.transform = "translateX(0)";
        }
      }
    },
    onSwipedLeft: (eventData) => {
      if (el instanceof HTMLElement) {
        if (eventData.deltaX < -50) {
          setDeleted(true);
          props.onDelete(props.id);
          return;
        }
        el.style.transform = "";
      }
    },
    onSwipedRight: (eventData) => {
      if (el instanceof HTMLElement) {
        if (eventData.deltaX > 50) {
          // TODO Edit item.
        }
        el.style.transform = "";
      }
    }, trackMouse: true
  });

  const className = "item" + (done ? " done" : "") + (deleted ? " deleted" : "");

  return (
    <li id={"item_" + props.id} className={className}>
      <div className="item-content" {...swipeHandler} style={{ touchAction: "pan-y" }}>
        <span className="field order">{props.order}</span>
        <span className="field name" onClick={(e) => e.preventDefault()}>
          {props.name}
        </span>
      </div>
      <div className="trash">
        <span className="cross">❌</span>
      </div>
    </li>
  );
};

export default Item;
