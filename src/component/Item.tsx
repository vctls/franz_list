import React, { useState } from "react";
// For some reason, importing MouseEvent as a component results in runtime
// errors on clicks. Using React.MouseEvent solves it.
import "./Item.css";
import { useSwipeable } from "react-swipeable";
import GestureHandler from "../util/GestureHandler";

const Item = (props: {
  onChange: (id: number, arg1: boolean) => void;
  id: number;
  order: number;
  name: string;
  filtered: boolean;
  done: boolean;
  onDelete(id: number): void;
  onEdit(id: number): void;
}) => {
  const [done, setDone] = useState(props.done);
  const [deleted, setDeleted] = useState(false);
  const [editing, setEditing] = useState(false);

  const gestureHandler = GestureHandler.getInstance();

  const swipeHandler = useSwipeable({
    onTap: gestureHandler.onTap(setDone, done, props),
    onTouchStartOrOnMouseDown: gestureHandler.touchStart,
    onSwiping: gestureHandler.swiping,
    onTouchEndOrOnMouseUp: gestureHandler.touchEnd(
      props,
      setDeleted,
      setEditing
    ),
    trackMouse: true,
  });

  const className =
    "item" +
    (done ? " done" : "") +
    (deleted ? " deleted" : "") +
    (editing ? " editing" : "") +
    (props.filtered ? " filtered" : "");
  const mouseOverHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget;
    target.focus();
  };

  // FIXME Item content is placed in a child div of the li just so we can use
  //  sibling divs for edition and deletion hinting. This makes attribute
  //  handling messy. Find a cleaner way to do this.

  const tabIndex = deleted || editing ? -1 : 0;

  function deleteHandler() {
    setDeleted(true);
    props.onDelete(props.id);
  }

  function editHandler() {
    setEditing(true);
    props.onEdit(props.id);
    props.onDelete(props.id);
  }

  const mouseOutHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget;
    target.blur();
  }

  return (
    <li id={"item_" + props.id} className={className}>
      <div
        tabIndex={tabIndex}
        id={"item-content_" + props.id}
        role="button"
        onMouseOverCapture={mouseOverHandler}
        onMouseOutCapture={mouseOutHandler}
        onKeyUp={gestureHandler.keyUp(
          setDone,
          setDeleted,
          setEditing,
          done,
          props
        )}
        className="item-content"
        {...swipeHandler}
        style={{ touchAction: "pan-y" }}
      >
        {
          // TODO Change order behaviour before displaying the order field again.
        }
        <span className="field order" style={{ display: "none" }}>
          {props.order}
        </span>
        <span className="field name">{props.name}</span>
      </div>
      <div className="visual edit">
        <span className="icon memo">📝</span>
        <div className="button-edit" role="button" onClick={editHandler}></div>
      </div>
      <div className="visual trash">
        <span className="icon cross">❌</span>
        <div
          className="button-delete"
          role="button"
          onClick={deleteHandler}
        ></div>
      </div>
    </li>
  );
};

export default Item;
