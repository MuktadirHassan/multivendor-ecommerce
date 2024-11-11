import { EventEmitter as NodeEventEmitter } from "events";

export class EventEmitter extends NodeEventEmitter {
  private static instance: EventEmitter;

  private constructor() {
    super();
  }

  public static getInstance(): EventEmitter {
    if (!EventEmitter.instance) {
      EventEmitter.instance = new EventEmitter();
    }
    return EventEmitter.instance;
  }
}
