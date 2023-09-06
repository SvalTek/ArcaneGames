export type ChronoWardenInfo = {
    /** The initial time in seconds. Useful for resetting the timer and differentiating from remaining time. */
    initialTime: number;
    /** The remaining time in seconds. */
    timeRemaining: number;
    /** When the timer was last updated (epoch timestamp). */
    lastUpdated: number;
    /** When the timer was created (epoch timestamp). */
    created: number;
};


/**
 * ChronoWarden
 * A simple passive timer class.
 * 
 * @param remainingTime - The remaining time in seconds.
 * @param initialTime? - [Optional] The initial time in seconds. Useful for resetting the timer and can be different
 * from the remaining time based on the use-case (e.g., resuming a timer, preemptive time reduction, or bonus time).
 * @param lastUpdated? - [Optional] Unix timestamp when the timer was last updated.
 * @param created? - [Optional] Unix timestamp when the timer was created.
 */
export class ChronoWarden {
    private timer: ChronoWardenInfo;

    constructor(remainingTime: number, initialTime?: number, lastUpdated?: number, created?: number) {
        this.timer = {
            timeRemaining: remainingTime,
            initialTime: initialTime || remainingTime,
            lastUpdated: lastUpdated || Date.now(),
            created: created || Date.now()
        };
    }

    /**
     * @returns The remaining time in seconds.
     * @example
     * ```ts
     * const remainingTime = timer.get();
     * ```
    */
    get(): number {
        this.timer.timeRemaining -= (Date.now() - this.timer.lastUpdated) / 1000;
        this.timer.lastUpdated = Date.now();
        return this.timer.timeRemaining;
    }

    /**
     * Sets the timer.
     * @param time - The time in seconds.
     * @example
     * ```ts
     * timer.set(60);
     * ```
    */
    set(time: number): void {
        this.timer.timeRemaining = time;
        this.timer.lastUpdated = Date.now();
    }

    /**
     * Resets the timer.
     * Sets the remaining time to the initial time of the timer.
     * @example
     * ```ts
     * timer.reset();
     * ```
    */
    reset(): void {
        this.timer.timeRemaining = this.timer.initialTime;
        this.timer.lastUpdated = Date.now();
    }

    /**
     * @returns The timer state.
     * @example
     * ```ts
     * const state = timer.getState();
     * ```
    */
    getState(): ChronoWardenInfo {
        return this.timer;
    }
}