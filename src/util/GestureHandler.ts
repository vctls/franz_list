import { SwipeEventData } from "react-swipeable";
import React from "react";
import { HandledEvents } from "react-swipeable/es/types";

/**
 * Aggregates the different touch and mouse events.
 */
class GestureHandler {
  private static instance: GestureHandler;

  private constructor() {}

  public static getInstance(): GestureHandler {
    if (!GestureHandler.instance) {
      GestureHandler.instance = new GestureHandler();
    }
    return GestureHandler.instance;
  }

  eventType: string = "";

  // Keep the target element at a higher scope than the handlers
  // since actions need information from multiple handlers to work correctly.
  el: EventTarget | null = null;

  // Number of pixels beyond which the translation triggers an event.
  actionTreshold: number = 50;

  public swiping = (eventData: SwipeEventData) => {
    if (this.el instanceof HTMLElement) {
      const deltaX = eventData.deltaX;
      let translate = Math.abs(deltaX) < 100 ? Math.abs(deltaX) : 100;

      if (deltaX < -10) {
        this.el.style.transform = `translateX(-${translate}px)`;
      } else if (deltaX > 10) {
        this.el.style.transform = `translateX(${translate}px)`;
      } else {
        this.el.style.transform = "translateX(0)";
      }

      // Information about actions is stored in the item for further
      // action in the final handler.
      this.el.dataset.shouldDelete = (deltaX < -this.actionTreshold).toString();
      this.el.dataset.shouldEdit = (deltaX > this.actionTreshold).toString();
    }
  };

  public touchEnd =
    (
      props: {
        onChange: (id: number, arg1: boolean) => void;
        id: number;
        order: number;
        name: string;
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
      if (this.el instanceof HTMLElement) {
        if (this.el.dataset.shouldDelete === "true") {
          props.onDelete(props.id);
          setDeleted(true);
          return;
        }
        if (this.el.dataset.shouldEdit === "true") {
          // Send edition command then delete the item.
          // No need for a fancier etdition method for the moment.
          props.onEdit(props.id);
          props.onDelete(props.id);
          setEditing(true);
          return;
        }
        this.el.style.transform = "";
      }
    };

  /**
   * Focuses an element on the list relative to the index of the element that
   * received the event.
   *
   * @param e
   * @param offset
   */
  private static focus(e: React.KeyboardEvent<HTMLDivElement>, offset: number) {
    const list = document.querySelectorAll("#list .item-content[tabindex='0']");
    const index = Array.prototype.indexOf.call(list, e.currentTarget);
    console.log(list);
    console.log(index);
    const toFocus = list[index + offset];
    if (toFocus instanceof HTMLElement) {
      toFocus.focus();
    }
  }

  public keyUp =
    (
      setDone: (value: ((prevState: boolean) => boolean) | boolean) => void,
      setDeleted: (value: ((prevState: boolean) => boolean) | boolean) => void,
      setEditing: (value: ((prevState: boolean) => boolean) | boolean) => void,
      done: boolean,
      props: {
        onChange: (id: number, arg1: boolean) => void;
        id: number;
        order: number;
        name: string;
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
          GestureHandler.focus(e, 1);
          break;
        case "ArrowUp":
          GestureHandler.focus(e, -1);
          break;
        case "Space":
          setDone(!done);
          props.onChange(props.id, !done);
          break;
        case "ArrowLeft":
          setDeleted(true);
          props.onDelete(props.id);
          break;
        case "ArrowRight":
          setEditing(true);
          props.onEdit(props.id);
          break;
      }
    };

  public touchStart = (e: { event: HandledEvents }) => {
    if (e.event.target instanceof HTMLElement) {
      this.el = e.event.target.closest(".item-content");
    }
  };

  public onTap =
    (
      setDone: (value: ((prevState: boolean) => boolean) | boolean) => void,
      done: boolean,
      props: {
        onChange: (id: number, arg1: boolean) => void;
        id: number;
        order: number;
        name: string;
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
      if (this.eventType === "" || e.event.type === this.eventType) {
        this.eventType = e.event.type;
        setDone(!done);
        props.onChange(props.id, !done);
      }
    };
}

export default GestureHandler;
