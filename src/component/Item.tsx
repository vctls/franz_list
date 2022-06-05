import React, { useState } from "react";
// For some reason, importing MouseEvent as a component results in runtime
// errors on clicks. Using React.MouseEvent solves it.
import "./Item.css";
import { SwipeEventData, useSwipeable } from "react-swipeable";
import { HandledEvents } from "react-swipeable/es/types";

let eventType: string = "";

// Keep the target element at a higher scope than the handlers
// since actions need information from multiple handlers to work correctly.
let el: EventTarget | null;

// Number of pixels beyond which the translation triggers an event.
const actionTreshold = 50;

const swipingHandler = (eventData: SwipeEventData) => {
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
};

const touchEndHandler =
  (
    props: {
      onChange: (id: number, arg1: boolean) => void;
      id: number;
      order: number;
      name: string;
      category: string;
      onDelete(id: number): void;
      onEdit(id: number): void;
    },
    setDeleted: (value: ((prevState: boolean) => boolean) | boolean) => void,
    setEditing: (value: ((prevState: boolean) => boolean) | boolean) => void
  ) =>
  () => {
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
  };

/**
 * Focuses an element on the list relative to the index of the element that
 * received the event.
 *
 * @param e
 * @param offset
 */
function focus(e: React.KeyboardEvent<HTMLDivElement>, offset: number) {
  const lis = document.querySelectorAll("#list .item-content[tabindex='0']");
  const index = Array.prototype.indexOf.call(lis, e.currentTarget);
  console.log(lis);
  console.log(index);
  const toFocus = lis[index + offset];
  if (toFocus instanceof HTMLElement) {
    toFocus.focus();
  }
}

const keyUpHandler =
  (
    setDone: (value: ((prevState: boolean) => boolean) | boolean) => void,
    done: boolean,
    props: {
      onChange: (id: number, arg1: boolean) => void;
      id: number;
      order: number;
      name: string;
      category: string;
      onDelete(id: number): void;
      onEdit(id: number): void;
    }
  ) =>
  (e: React.KeyboardEvent<HTMLDivElement>) => {
    // The previousSibling property can get an element for which there is no
    // css selector, but since the order of actually focusable items cannot be
    // guaranteed, using that would require iterating over all previous items.
    switch (e.code) {
      case "ArrowDown":
        focus(e, 1);
        break;
      case "ArrowUp":
        focus(e, -1);
        break;
      case "Space":
        setDone(!done);
        props.onChange(props.id, !done);
        break;
    }
  };

const touchStartHandler = (e: { event: HandledEvents }) => {
  if (e.event.target instanceof HTMLElement) {
    el = e.event.target.closest(".item-content");
  }
};

const onTapHandler =
  (
    setDone: (value: ((prevState: boolean) => boolean) | boolean) => void,
    done: boolean,
    props: {
      onChange: (id: number, arg1: boolean) => void;
      id: number;
      order: number;
      name: string;
      category: string;
      onDelete(id: number): void;
      onEdit(id: number): void;
    }
  ) =>
  (e: { event: HandledEvents }) => {
    // Only register left click.
    if (e.event instanceof MouseEvent) {
      if (e.event.button !== 0) {
        return;
      }
    }

    // Keep track of the type of event to prevent double taps with mixed events.
    if (eventType === "" || e.event.type === eventType) {
      eventType = e.event.type;
      setDone(!done);
      props.onChange(props.id, !done);
    }
  };

const Item = (props: {
  onChange: (id: number, arg1: boolean) => void;
  id: number;
  order: number;
  name: string;
  category: string;
  onDelete(id: number): void;
  onEdit(id: number): void;
}) => {
  const [done, setDone] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [editing, setEditing] = useState(false);

  const swipeHandler = useSwipeable({
    onTap: onTapHandler(setDone, done, props),
    onTouchStartOrOnMouseDown: touchStartHandler,
    onSwiping: swipingHandler,
    onTouchEndOrOnMouseUp: touchEndHandler(props, setDeleted, setEditing),
    trackMouse: true,
  });

  const className =
    "item" +
    (done ? " done" : "") +
    (deleted ? " deleted" : "") +
    (editing ? " editing" : "");

  const onDivMouseOverCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget;
    target.focus();
  };

  // FIXME Item content is placed in a child div of the li just so we can use
  //  sibling divs for edition and deletion hinting. This makes attribute
  //  handling messy. Find a cleaner way to do this.

  const tabIndex = deleted || editing ? -1 : 0;
  
  return (
    <li id={"item_" + props.id} className={className}>
      <div
        tabIndex={tabIndex}
        id={"item-content_" + props.id}
        role="button"
        onMouseOverCapture={onDivMouseOverCapture}
        onKeyUp={keyUpHandler(setDone, done, props)}
        className="item-content"
        {...swipeHandler}
        style={{ touchAction: "pan-y" }}
      >
        <span className="field order">{props.order}</span>
        <span className="field name">{props.name}</span>
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
