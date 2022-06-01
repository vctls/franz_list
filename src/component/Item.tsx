import * as React from "react";
import { useState } from "react";
import "./Item.css";
import { useSwipeable } from "react-swipeable";

// Keep track of the type of event to prevent double taps with mixed events.
let eventType: string = "";

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
  const deleteTreshold = -50;

  const swipeHandler = useSwipeable({
    onTap: (e) => {
      if (eventType === "" || e.event.type === eventType) {
        eventType = e.event.type;
        setDone(!done);
        props.onChange(props.id, !done);
      }
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
        el.dataset.shouldDelete = "false";
        if (deltaX < -10) {
          el.style.transform = `translateX(-${translate}px)`;
        } else if (deltaX > 10) {
          el.style.transform = `translateX(${translate}px)`;
        } else {
          el.style.transform = "translateX(0)";
        }
        if (deltaX < deleteTreshold) {
          el.dataset.shouldDelete = "true";
        }
      }
    },

    onTouchEndOrOnMouseUp: () => {
      // When the swipe doesn't end on the original element
      // and there is no subsequent action, transform is not reset.
      // Check that an action was taken before resetting transform.
      // Problem: the action is probably not applied at this point.
      // Instead, check if the element has moved beyond action treshold.

      if (el instanceof HTMLElement) {
        const shouldDelete = el.dataset.shouldDelete;
        if (shouldDelete === "true") {
          props.onDelete(props.id);
          setDeleted(true);
          return;
        }
        el.style.transform = "";
      }
    },
    trackMouse: true
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
