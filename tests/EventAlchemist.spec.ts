import { EventAlchemist, EventAlchemy, EventElixer, Eventful } from '../src/libs/EventAlchemist';
import { EventEmitter } from 'events';

// Mock class that uses the EventAlchemy decorator
interface TestClass extends Eventful { }

@EventAlchemy("test")
class TestClass {
  @EventElixer("test", function (result, ...args) { return result }, "test event")
  testEvent(numA: number, numB: number) {
    return numA + numB;
  }
}

describe('EventAlchemist', () => {
    let testInstance: TestClass;

    beforeEach(() => {
        testInstance = new TestClass();
    });

    it('should create a new event namespace', () => {
        const eventEmitter = EventAlchemist.createEventNamespace('testEvent');
        expect(eventEmitter).toBeInstanceOf(EventEmitter);
    });

    it('should retrieve an existing event namespace', () => {
        const eventEmitter = EventAlchemist.getEventNamespace('testEvent');
        expect(eventEmitter).toBeInstanceOf(EventEmitter);
    });

    it('should not allow creating duplicate event namespaces', () => {
        expect(() => EventAlchemist.createEventNamespace('testEvent')).toThrowError();
    });

    it('should add events property to a class', () => {
        expect(testInstance.events).toBeInstanceOf(EventEmitter);
    });

    it('should emit an event when myMethod is called', () => {
        const spy = jest.spyOn(testInstance.events, 'emit');
        testInstance.testEvent(1, 2);
        expect(spy).toHaveBeenCalled();
    });
});
