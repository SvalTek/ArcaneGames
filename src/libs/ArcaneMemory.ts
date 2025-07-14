import { EventEmitter } from 'events';
import { ChronoWarden, ChronoWardenInfo } from './ChronoWarden';

export interface ArcaneMemoryEvents extends EventEmitter {
  on(event: 'created', listener: () => void): this;
  on(
    event: 'set',
    listener: (
      key: string,
      value: unknown,
      timerInfo: ChronoWardenInfo,
    ) => void,
  ): this;
  on(
    event: 'get',
    listener: (
      key: string,
      value: unknown,
      timerInfo: ChronoWardenInfo,
    ) => void,
  ): this;
  on(
    event: 'deleted',
    listener: (
      key: string,
      value: unknown,
      timerInfo: ChronoWardenInfo,
    ) => void,
  ): this;
  on(event: 'cleared', listener: () => void): this;
  on(
    event: 'setMultiple',
    listener: (data: {
      [key: string]: unknown;
      timerInfo: { [key: string]: ChronoWardenInfo };
    }) => void,
  ): this;
  on(
    event: 'serialized',
    listener: (
      objStore: { [key: string]: unknown },
      timerInfo: { [key: string]: ChronoWardenInfo },
    ) => void,
  ): this;
  on(
    event: 'deserialized',
    listener: (
      objStore: { [key: string]: unknown },
      timerInfo: { [key: string]: ChronoWardenInfo },
      jsonStr: string,
    ) => void,
  ): this;
}

/**
 * ArcaneMemory serves as a key-value store with additional utility methods.
 */
export class ArcaneMemory {
  private store: Map<string, unknown>;
  private timers: Map<string, ChronoWarden>;
  public events: ArcaneMemoryEvents;

  constructor() {
    this.events = new EventEmitter();
    this.store = new Map();
    this.timers = new Map();

    this.events.emit('created');
  }

  /**
   * Retrieves a value from the data store by its unique key identifier.
   * Additionally, updates or resets the timer associated with the key if it exists.
   * @param key - A unique string identifier used to retrieve the value.
   * @param resetExpireInSec - [Optional] Specifies a new expiration time in seconds.
   * If supplied, the associated timer will be reset to this new expiration duration.
   * @throws {Error} Throws an error if the key is not of type 'string'.
   * @returns The value associated with the key, or `undefined` if the key does not exist or
   * its associated timer has expired.
   * @emits 'get' event, with the key, value, and timer state as arguments, when a value is successfully retrieved.
   */
  get<T>(key: string, resetExpireInSec?: number): T | undefined {
    if (typeof key !== 'string') throw new Error('Invalid key type');

    const value = this.store.get(key) as T | undefined;
    const timer = this.timers.get(key);

    if (timer) {
      const remainingTime = timer.get(); // Always update the timer
      if (remainingTime <= 0) {
        this.store.delete(key);
        this.timers.delete(key);
        return undefined;
      }
      if (resetExpireInSec !== undefined) {
        timer.set(resetExpireInSec);
      }
    }

    if (value !== undefined) {
      this.events.emit('get', key, value, timer?.getState());
    }

    return value;
  }

  /**
   * Stores or updates a key-value pair within the data store. If the `expireInSec` parameter is
   * provided, a timer will either be created or updated for the specified key.
   * @param key - A unique string identifier to associate with the value.
   * @param value - The value to be stored in association with the provided key.
   * @param expireInSec - [Optional] Specifies a new expiration time for the key in seconds.
   * If a timer already exists for the key, it will be reset to this new value.
   * @throws {Error} Throws an error if the key is not of type 'string'.
   * @emits 'set' event with the key, value, and current timer state as arguments when a value is successfully set.
   * @returns {void}
   */
  set<T>(key: string, value: T, expireInSec?: number): void {
    if (typeof key !== 'string') throw new Error('Invalid key type');

    let timerInfo = this.timers.get(key);
    if (expireInSec) {
      if (timerInfo) {
        timerInfo.set(expireInSec);
      } else {
        timerInfo = new ChronoWarden(expireInSec);
      }
      this.timers.set(key, timerInfo);
    }

    this.store.set(key, value);
    this.events.emit('set', key, value, timerInfo?.getState());
  }

  /**
   * Determines the presence of a specific key within the store.
   *
   * @param key - The unique string identifier to search for.
   * @returns {boolean} Returns `true` if the key exists in the store, `false` otherwise.
   */
  has(key: string): boolean {
    return this.store.has(key);
  }

  /**
   * Extinguishes a key-value pair from the data store, also removing any associated timer.
   *
   * @param key - The unique string identifier of the key-value pair to be deleted.
   * @throws {Error} Throws an error if the key is not of type 'string'.
   * @emits 'deleted' event with the key, value, and current timer state as arguments after successful deletion.
   * @returns {void}
   */
  delete(key: string): void {
    const existingTimerInfo = this.timers.get(key);
    if (existingTimerInfo) {
      this.timers.delete(key);
    }
    const value = this.store.get(key);
    this.store.delete(key);

    this.events.emit('deleted', key, value, existingTimerInfo?.getState());
  }

  /**
   * Annihilates all key-value pairs from the data store, resetting it to an empty state.
   * All timers are also cleared in the process.
   *
   * @emits 'cleared' event when the store is successfully cleared.
   * @returns {void}
   */
  clear(): void {
    this.store.clear();
    this.timers.clear();
    this.events.emit('cleared');
  }

  /**
   * Sets multiple key-value pairs in the store.
   * @param data - An object containing the key-value pairs to set.
   * @param updateTimers - [Optional] If true, the associated timers will be updated. (Defaults to false)
   * @remarks This method is not recommended for large stores.
   * @see {@link ArcaneMemory#set}
   */
  setMultiple(data: Record<string, unknown>, updateTimers = false): void {
    const timerInfo: { [key: string]: ChronoWardenInfo } = {};
    Object.entries(data).forEach(([key, value]) => {
      if (typeof key !== 'string') throw new Error('Invalid key type');
      this.store.set(key, value);
      const timer = this.timers.get(key);
      if (timer) {
        timerInfo[key] = timer.getState();
        if (updateTimers) {
          timer.get(); // get() always updates the timer
        }
      }
    });

    this.events.emit('setMultiple', { ...data, timerInfo });
  }

  /**
   * Returns the state of any timer associated with the given key.
   * @param key - The key to use.
   * @returns The state of the timer associated with the key.
   * @see {@link ChronoWarden#getState}
   */
  getTimerInfo(key: string): ChronoWardenInfo | undefined {
    return this.timers.get(key)?.getState();
  }

  /**
   * Serializes the store into a JSON string.
   * @returns A JSON string representation of the store.
   */
  serialize(): string {
    const obj: Record<string, unknown> = {};
    const timerInfo: { [key: string]: ChronoWardenInfo } = {};

    // Serialize the store
    for (const [key, value] of this.store.entries()) {
      obj[key] = value;
    }

    // Serialize the timers
    for (const [key, value] of this.timers.entries()) {
      timerInfo[key] = value.getState();
    }

    this.events.emit('serialized', obj, timerInfo);

    return JSON.stringify({ store: obj, timers: timerInfo });
  }

  /**
   * Deserializes the store from a JSON string.
   * @param jsonStr - The JSON string representation of the store.
   */
  deserialize(jsonStr: string): void {
    const parsed = JSON.parse(jsonStr);
    const objStore: Record<string, unknown> = parsed.store;
    const timerInfo: { [key: string]: ChronoWardenInfo } = parsed.timers;

    // Restore the store
    this.store.clear();
    for (const [key, value] of Object.entries(objStore)) {
      this.store.set(key, value);
    }

    // Restore the timers
    this.timers.clear();
    for (const [key, value] of Object.entries(timerInfo)) {
      const timer = new ChronoWarden(
        value.timeRemaining,
        value.initialTime,
        value.lastUpdated,
        value.created,
      );
      this.timers.set(key, timer);
    }

    this.events.emit('deserialized', objStore, timerInfo, jsonStr);
  }

  /**
   * Retrieves selected keys from the store. (Updates timers by default)
   * @param keys - An array of keys to retrieve.
   * @param updateTimers - [Optional] If true, the associated timers will be updated. (Defaults to true)
   * @returns An object containing the selected key-value pairs.
   */
  getSelectedKeys(
    keys: string[],
    updateTimers = true,
  ): Record<string, unknown> {
    const entries: [string, unknown][] = [];
    for (const key of keys) {
      const value = this.store.get(key);
      if (value !== undefined) {
        const timer = this.timers.get(key);
        if (timer && updateTimers) {
          timer.get();
        }
        entries.push([key, value]);
      }
    }
    return Object.fromEntries(entries);
  }

  /**
   * Retrieves all keys from the store. (Does not update timers by default)
   * @param updateTimers - [Optional] If true, updates all timers. (Defaults to false)
   * @returns An array containing all keys in the store.
   * @remarks This method is not recommended for large stores.
   * @see {@link ArcaneMemory#selectKeys}
   */
  getAllKeys(updateTimers = false): string[] {
    if (updateTimers) {
      this.timers.forEach((timer, _key) => timer.get());
    }
    return Array.from(this.store.keys());
  }

  /**
   * Retrieves all values from the store. (Does not update timers by default)
   * @param updateTimers - [Optional] If true, updates all timers. (Defaults to false)
   * @returns An array containing all values in the store.
   * @remarks This method is not recommended for large stores.
   * @see {@link ArcaneMemory#selectValues}
   */
  getAllValues(updateTimers = false): unknown[] {
    if (updateTimers) {
      this.timers.forEach((timer, _key) => timer.get());
    }
    return Array.from(this.store.values());
  }

  /**
   * Retrieves all key-value pairs from the store. (Does not update timers by default)
   * @param updateTimers - [Optional] If true, the associated timers will be updated. (Defaults to false)
   * @returns An object containing all key-value pairs in the store.
   * @remarks This method is not recommended for large stores.
   * @see {@link ArcaneMemory#serialize}
   * @see {@link ArcaneMemory#getSelectedKeys}
   * @see {@link ArcaneMemory#getAllKeys}
   * @see {@link ArcaneMemory#getAllValues}
   */
  getAllEntries(updateTimers = false): Record<string, unknown> {
    const allEntries: Record<string, unknown> = {};
    for (const [key, value] of this.store.entries()) {
      const timer = this.timers.get(key);
      if (timer && updateTimers) {
        timer.get(); // Update the timer
      }
      allEntries[key] = value;
    }
    return allEntries;
  }

  /**
   * Retrieves multiple keys from the store.
   * @param keys - An array of keys to retrieve.
   * @param updateTimers - [Optional] If true, associated timers will be updated. (Defaults to true)
   * @returns An object containing the found key-value pairs.
   */
  getMultiple(keys: string[], updateTimers = true): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    for (const key of keys) {
      const value = this.store.get(key);
      if (value !== undefined) {
        const timer = this.timers.get(key);
        if (timer && updateTimers) {
          timer.get();
        }
        data[key] = value;
      }
    }
    return data;
  }

  /**
   * Select keys based on a filter function.
   * @param filter - The filter function to use.
   * @param updateTimers - [Optional] If true, the associated timers will be updated. (Defaults to true)
   * @returns An array containing the selected key-value pairs.
   */
  selectKeys(
    filter: (key: string, value: unknown) => boolean,
    updateTimers = true,
  ): string[] {
    const selectedKeys: string[] = [];
    for (const [key, value] of this.store.entries()) {
      if (filter(key, value)) {
        const timer = this.timers.get(key);
        if (timer && updateTimers) {
          timer.get(); // Update the timer
        }
        selectedKeys.push(key);
      }
    }
    return selectedKeys;
  }

  /**
   * Select values based on a filter function.
   * @param filter - The filter function to use.
   * @param updateTimers - [Optional] If true, the associated timers will be updated. (Defaults to true)
   * @returns An array containing the selected values.
   * @see {@link ArcaneMemory#selectKeys}
   */
  selectValues(
    filter: (key: string, value: unknown) => boolean,
    updateTimers = true,
  ): unknown[] {
    const selectedValues: unknown[] = [];
    for (const [key, value] of this.store.entries()) {
      if (filter(key, value)) {
        const timer = this.timers.get(key);
        if (timer && updateTimers) {
          timer.get(); // Update the timer
        }
        selectedValues.push(value);
      }
    }
    return selectedValues;
  }

  /**
   * Select key-value pairs based on a filter function.
   * @param filter - The filter function to use.
   * @param updateTimers - [Optional] If true, the associated timers will be updated. (Defaults to true)
   * @returns An object containing the selected key-value pairs.
   * @see {@link ArcaneMemory#selectKeys}
   * @see {@link ArcaneMemory#selectValues}
   */
  selectEntries(
    filter: (key: string, value: unknown) => boolean,
    updateTimers = true,
  ): Record<string, unknown> {
    const selectedData: Record<string, unknown> = {};
    for (const [key, value] of this.store.entries()) {
      if (filter(key, value)) {
        const timer = this.timers.get(key);
        if (timer && updateTimers) {
          timer.get(); // Update the timer
        }
        selectedData[key] = value;
      }
    }
    return selectedData;
  }

  /**
   * given a key, returns the next key in the store.
   * @param key - The key to use.
   * @returns The next key in the store.
   * @see {@link ArcaneMemory#selectPreviousKey}
   * @see {@link ArcaneMemory#selectKeys}
   */
  selectNextKey(key: string): string | undefined {
    const keys = Array.from(this.store.keys());
    const index = keys.indexOf(key);
    if (index === -1) return undefined;
    return keys[index + 1];
  }

  /**
   * given a key, returns the previous key in the store.
   * @param key - The key to use.
   * @returns The previous key in the store.
   * @see {@link ArcaneMemory#selectNextKey}
   * @see {@link ArcaneMemory#selectKeys}
   */
  selectPreviousKey(key: string): string | undefined {
    const keys = Array.from(this.store.keys());
    const index = keys.indexOf(key);
    if (index === -1) return undefined;
    return keys[index - 1];
  }

  /**
   * matches a context object against a value.
   * @param context - The context object to use.
   * @param value - The value to use.
   * @returns True if the context matches the value, false otherwise.
   */
  isContextMatch(
    context: Record<string, unknown>,
    memoryValue: unknown,
  ): boolean {
    if (typeof memoryValue !== 'object' || memoryValue === null) {
      return false;
    }
    const entry = memoryValue as Record<string, unknown>;
    return Object.entries(context).every(
      ([key, value]) => entry[key] === value,
    );
  }

  /**
   * selects entries based on a context object.
   * @param context - The context object to use.
   */
  selectEntriesByContext(
    context: Record<string, unknown>,
  ): Record<string, unknown> {
    return this.selectEntries((key, value) =>
      this.isContextMatch(context, value),
    );
  }
}
