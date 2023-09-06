/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import { EventEmitter } from 'events';

class GlobalEventAlchemist {
  // A map to store all the event namespaces
  private eventNamespaces: Map<string, EventEmitter> = new Map();

  /**
   * Creates a new event namespace.
   * @param name - The name of the event namespace.
   * @param description - An optional description for the namespace.
   * @returns An EventEmitter object.
   */
  createEventNamespace(name: string, description?: string): EventEmitter {
    // Check if the namespace already exists
    if (this.eventNamespaces.has(name)) {
      throw new Error(`EventNamespace with name: ${name} already exists.`);
    }
    // Create a new EventEmitter
    const eventEmitter = new EventEmitter();
    // Add metadata to the EventEmitter
    Object.defineProperty(eventEmitter, 'eventNamespaceName', {
      value: name,
      enumerable: true,
    });
    Object.defineProperty(eventEmitter, 'eventNamespaceDescription', {
      value: description,
      enumerable: true,
    });
    // Store the EventEmitter in the map
    this.eventNamespaces.set(name, eventEmitter);
    return eventEmitter;
  }

  /**
   * Retrieves an existing event namespace.
   * @param name - The name of the event namespace.
   * @returns An EventEmitter object or undefined.
   */
  getEventNamespace(name: string): EventEmitter | undefined {
    return this.eventNamespaces.get(name);
  }
}

// Singleton instance of EventSystem
export const EventAlchemist = new GlobalEventAlchemist();

/**
 * Interface for classes that will have an 'events' property.
 */
export interface Eventful {
  events: EventEmitter;
}

/**
 * Class Decorator: Adds an 'events' property to the class.
 * @param name - The name of the event namespace.
 * @param description - An optional description for the namespace.
 */
export function EventAlchemy(name: string, description?: string) {
  //  @ eslint-disable-next-line no-explicit-any
  return function (target: any) {
    // Retrieve or create the EventEmitter
    const eventEmitter =
      EventAlchemist.getEventNamespace(name) ||
      EventAlchemist.createEventNamespace(name, description);
    // Add the 'events' property to the class prototype
    Object.defineProperty(target.prototype, 'events', {
      value: eventEmitter,
      enumerable: true,
      writable: true,
    });
  };
}

/**
 * Method Decorator: Makes the method emit an event.
 * @param name - The name of the event to emit.
 * @param callback - An optional callback to modify the result.
 * @param eventArgs - Additional arguments for the event.
 */
export function EventElixer(
  name: string,
  callback?: (result: unknown, ...args: unknown[]) => unknown,
  ...eventArgs: unknown[]
) {
  return function (
    _target: object,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // Store the original method
    const method = descriptor.value;
    // Replace the original method
    descriptor.value = function (...args: unknown[]) {
      // Call the original method
      let result = method.apply(this, args);
      // Modify the result using the callback, if provided
      if (callback) {
        result = callback.call(this, result, ...args);
      }
      // Emit the event
      //@ts-ignore - get eventEmitter from prototype
      const eventEmitter = this.events as EventEmitter;
      if (eventEmitter) {
        eventEmitter.emit(name, result, ...eventArgs, ...args);
      }
    };
    return descriptor;
  };
}
