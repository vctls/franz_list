import * as React from "react";
import { useState } from "react";
import "./Item.css";
import { useSwipeable } from "react-swipeable";

let eventType: string = "";

const Item = (props: {
  toggleDone: (id: number) => void;
  onMouseEnter: () => void;
  id: number;
  done: boolean;
  highlighted: boolean;
  order: number;
  name: string;
  category: string;
  onDelete(id: number): void;
  onEdit(id: number): void;
}) => {
  const [deleted, setDeleted] = useState(false);
  const [editing, setEditing] = useState(false);

  // Keep the target element at a higher scope than the handlers
  // since actions need information from multiple handlers to work correctly.
  let el: EventTarget | null;

  // Number of pixels beyond which the translation triggers an event.
  const actionTreshold = 50;

  const swipeHandler = useSwipeable({
    onTap: (e) => {
      // Only register left click.
      if (e.event instanceof MouseEvent) {
        if (e.event.button !== 0) {
          return;
        }
      }

      // Keep track of the type of event to prevent double taps with mixed events.
      if (eventType === "" || e.event.type === eventType) {
        eventType = e.event.type;
        props.toggleDone(props.id);
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

        // Information about actions is stored in the item for further
        // action in the final handler.
        el.dataset.shouldDelete = "false";
        el.dataset.shouldEdit = "false";

        if (deltaX < -10) {
          el.style.transform = `translateX(-${translate}px)`;
        } else if (deltaX > 10) {
          el.style.transform = `translateX(${translate}px)`;
        } else {
          el.style.transform = "translateX(0)";
        }
        if (deltaX < -actionTreshold) {
          el.dataset.shouldDelete = "true";
        }
        if (deltaX > actionTreshold) {
          el.dataset.shouldEdit = "true";
        }
      }
    },

    onTouchEndOrOnMouseUp: () => {
      // When the swipe doesn't end on the original element
      // and there is no subsequent action, transform is not reset.
      // Check that an action was taken before resetting transform.
      // Problem: the action is probably not applied at this point.
      // Instead, check if the element has moved beyond action treshold.
      // This seems to be more reliable than "swiped" events.
      if (el instanceof HTMLElement) {
        if (el.dataset.shouldDelete === "true") {
          props.onDelete(props.id);
          setDeleted(true);
          return;
        }
        if (el.dataset.shouldEdit === "true") {
          // Send edition command then delete the item.
          // No need for a fancier etdition method for the moment.
          props.onEdit(props.id);
          props.onDelete(props.id);
          setEditing(true);
          return;
        }
        el.style.transform = "";
      }
    },
    trackMouse: true
  });

  const className = "item" + (props.done ? " done" : "")
    + (deleted ? " deleted" : "")
    + (editing ? " editing" : "");

  return (
    <li
      id={"item_" + props.id}
      className={className}
      onMouseEnter={props.onMouseEnter}
    >
      <div
        tabIndex={0}
        role="button"
        className={`item-content ${
          props.highlighted ? "item-highlighted" : ""
        }`}
        {...swipeHandler}
        style={{ touchAction: "pan-y" }}
      >
        <span className="field order">{props.order}</span>
        <span className="field name" onClick={(e) => e.preventDefault()}>
          {props.name}
        </span>
      </div>
      <div className="trash">
        <span className="cross">❌</span>
      </div>
      <div className="edit">
        <span className="memo">📝</span>
      </div>
    </li>
  );
};

export default Item;
