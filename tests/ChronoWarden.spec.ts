// Import the ChronoWarden class
import { ChronoWarden } from '../src/libs/ChronoWarden';

// Test suite for ChronoWarden
describe('ChronoWarden', () => {
    jest.useFakeTimers(); // Using fake timers to control time

    it('should initialize with the same initial and remaining time', () => {
        const timer = new ChronoWarden(300); // Creating a timer with 300 seconds
        const state = timer.getState();
        expect(state.initialTime).toEqual(state.timeRemaining);
    });

    it('should decrease remaining time when using the get() method', () => {
        const timer = new ChronoWarden(3600); // Creating a timer with 1 hour
        const initialTime = timer.get();
        jest.advanceTimersByTime(1000); // Advancing time by 1 second
        let remainingTime = timer.get();
        expect(initialTime).toBe(remainingTime + 1); // Expect remaining time to be 1 second less than initial time
        jest.advanceTimersByTime(60000); // Advancing time by 1 minute
        remainingTime = timer.get();
        expect(initialTime).toBe(remainingTime + 61); // Expect remaining time to be 1 minute and 1 second less than initial time
    });

    // Test case 3: Checking if reset() method restores initial time
    it('should reset the timer to the initial time', () => {
        const timer = new ChronoWarden(600); // Creating a timer with 10 minutes
        jest.advanceTimersByTime(300); // Advancing time by 5 minutes
        timer.get(); // get method is called to update the timer's state
        timer.reset(); // Resetting the timer
        const state = timer.getState();
        expect(state.timeRemaining).toEqual(state.initialTime); // Expect remaining time to be equal to initial time after reset
    });

    it('should set the timer to the specified time', () => {
        const timer = new ChronoWarden(1200); // Creating a timer with 20 minutes
        jest.advanceTimersByTime(300); // Advancing time by 5 minutes
        timer.set(900); // Setting the timer to 15 minutes
        const time = timer.get();
        expect(time).toBe(900); // Expect remaining time to be 15 minutes
    });
});
