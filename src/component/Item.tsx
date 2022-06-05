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
  category: string;
  onDelete(id: number): void;
  onEdit(id: number): void;
}) => {
  const [done, setDone] = useState(false);
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
