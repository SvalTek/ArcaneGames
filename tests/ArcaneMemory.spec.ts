jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');
import { ArcaneMemory } from "../src/libs/ArcaneMemory";
import { describe, expect, it } from "@jest/globals";

describe("ArcaneMemory - Basic Functionality", () => {
    const store = new ArcaneMemory();

    beforeEach(() => {
        store.clear();
        jest.clearAllTimers();
    });

    it("should have an empty initial state", () => {
        const entries = store.getAllEntries();
        expect(entries).toMatchObject({});
    });

    it("should have a key-value pair after setting", () => {
        store.set('someKey', 'someValue');
        expect(store.getAllKeys()).toContain('someKey');
        expect(store.get('someKey')).toBe('someValue');
    });

    it("set event should be called when setting a key-value pair", () => {
        const mockCallback = jest.fn();
        store.events.on('set', mockCallback);

        store.set("someKey", "someValue");
        expect(mockCallback).toHaveBeenCalledWith('someKey', 'someValue', undefined);
    });

    it("should not have a key-value pair after deleting", () => {
        store.delete('someKey');
        expect(store.getAllKeys()).toHaveLength(0);
    });

    it("should not have any key-value pairs after clearing", () => {
        store.set('key1', 'value1');
        store.set('key2', 'value2');
        store.clear();
        expect(store.getAllKeys()).toHaveLength(0);
    });

    it("should handle concurrent operations", async () => {
        const promiseSet = store.set('concurrentKey', 'value', 1);
        const promiseGet = store.get('concurrentKey');
        await Promise.all([promiseSet, promiseGet]);
        expect(store.get('concurrentKey')).toBe('value');
    });

    it("should throw an error for invalid key types", () => {
        expect(() => {
            // @ts-ignore
            store.set(123, 'someValue');
        }).toThrow('Invalid key type');
    });


    it("should expire keys after the set time", () => {
        store.set('expiringKey', 'expiringValue', 1); // 1 second expiry
        expect(store.get('expiringKey')).toBe('expiringValue');

        jest.advanceTimersByTime(1000); // Advance time by 1 second
        expect(store.get('expiringKey')).toBeUndefined(); // Should have expired
    });

    it("delete event should be called when deleting a key-value pair", () => {
        const mockCallback = jest.fn();
        store.events.on('deleted', mockCallback);

        store.set("someKey", "someValue");
        store.delete("someKey");
        expect(mockCallback).toHaveBeenCalledWith("someKey", "someValue", undefined);
    });

    it("clear event should be called when clearing the store", () => {
        const mockCallback = jest.fn();
        store.events.on('cleared', mockCallback);

        store.clear();
        expect(mockCallback).toHaveBeenCalled();
    });

    it("should handle special characters in key names", () => {
        const specialKey = "!@#$%^&*()_+";
        const value = "specialValue";
        store.set(specialKey, value);

        expect(store.get(specialKey)).toBe(value);
    });


    it("should maintain data integrity under rapid operations", async () => {
        const asyncSet = (key: string, value: any) => Promise.resolve(store.set(key, value));

        const operations: Promise<void>[] = [];

        for (let i = 0; i < 100; i++) {
            operations.push(asyncSet(`key${i}`, `value${i}`));
        }

        await Promise.all(operations);

        expect(store.getAllKeys()).toHaveLength(100);
    });

    it('should serialize and deserialize the memory', () => {
        const key = 'spellbook';
        const value = {
            spell: 'Fireball',
            manaCost: 10
        };

        store.set(key, value, 60); // Set an expiration time of 60 seconds
        const timerInfo = store.getTimerInfo(key);
        const serializedData = store.serialize();
        expect(serializedData).toEqual(JSON.stringify({
            store: { [key]: value },
            timers: { [key]: timerInfo }
        }));


        // Clear and reset memory
        store.clear();
        expect(store.getAllEntries()).toMatchObject({});
        store.deserialize(serializedData);

        // Check if the data got restored
        const retrievedValue = store.get<typeof value>(key);
        expect(retrievedValue).toEqual(value);
        // Check if the timerInfo got restored
        const retrievedTimerInfo = store.getTimerInfo(key);
        expect(retrievedTimerInfo).toEqual(timerInfo);
    });

    it("should maintain timer integrity after serialization and deserialization", () => {
        const key = "timedKey";
        const value = "timedValue";
        store.set(key, value, 60); // 60 seconds expiry

        const serializedData = store.serialize();
        store.clear();
        store.deserialize(serializedData);

        const timerInfoBefore = store.getTimerInfo(key) as any;
        jest.advanceTimersByTime(30000); // Advance half the time
        store.get(key); // Trigger timer update

        const timerInfoAfter = store.getTimerInfo(key) as any;
        expect(timerInfoAfter.timeRemaining).toBe(30); // Should have decreased by 30 seconds
    });
});

describe("ArcaneMemory - getSelectedKeys", () => {
    const store = new ArcaneMemory();

    beforeEach(() => {
        store.clear();
        jest.clearAllTimers();
    });


    it("should select keys and values based on the provided keys", () => {
        // Set some key-value pairs in the store
        store.set('key1', 'value1');
        store.set('key2', 'value2');
        store.set('key3', 'value3');

        // Define the keys to select
        const selectedKeys = ['key1', 'key3'];

        // Use getSelectedKeys to select the keys and values
        const selectedData = store.getSelectedKeys(selectedKeys);

        // Check if the selected data matches the expected result
        expect(selectedData).toEqual({ 'key1': 'value1', 'key3': 'value3' });
    });

    it("should gracefully handle missing keys", () => {
        // Set some key-value pairs in the store
        store.set('key1', 'value1');
        store.set('key3', 'value3');

        // Define some keys, including one that doesn't exist
        const selectedKeys = ['key1', 'key2', 'key3'];

        // Use getSelectedKeys to select the keys and values
        const selectedData = store.getSelectedKeys(selectedKeys);

        // Check if the selected data includes only existing keys
        expect(selectedData).toEqual({ 'key1': 'value1', 'key3': 'value3' });
    });

    it("should handle an empty selection", () => {
        // Set some key-value pairs in the store
        store.set('key1', 'value1');
        store.set('key2', 'value2');

        // Define an empty array of keys to select
        const selectedKeys: string[] = [];

        // Use getSelectedKeys to select the keys and values
        const selectedData = store.getSelectedKeys(selectedKeys);

        // Check if the selected data is empty as expected
        expect(selectedData).toEqual({});
    });
});

describe("ArcaneMemory - isContextMatch", () => {
    const store = new ArcaneMemory();

    beforeEach(() => {
        store.clear();
        jest.clearAllTimers();
    });

    it("should return true if the context is a match", () => {
        const context = { location: "Avalon" };
        const entry = { location: "Avalon", level: 1 };

        expect(store.isContextMatch(context, entry)).toBe(true);
    });
});


describe("ArcaneMemory - selectEntriesByContext", () => {
    const store = new ArcaneMemory();

    beforeEach(() => {
        store.clear();
        jest.clearAllTimers();
    });

    it("should return true if the context is a match", () => {
        store.set("ava", { location: "Avalon", level: 1 });
        store.set("location", "Avalon")
        const context = { location: "Avalon" };

        expect(store.selectEntriesByContext(context)).toEqual({ ava: { location: "Avalon", level: 1 }, location: "Avalon" });
    });
   
});