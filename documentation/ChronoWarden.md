# ChronoWarden: Guardian of Temporal Threads ⏳✨

`ChronoWarden` is a simple timer class that tracks the time elapsed since its creation. It's specifically designed to be totaly passive, meaning that it doesn't use any timers or intervals. Instead, it updates its internal state on demand, when the `get` method is called.

Why?, Because it's simple and Efficient. It's also very useful for tracking time in a game loop, where you don't want to use a timer or interval.

## Table of Contents

- [ChronoWarden: Guardian of Temporal Threads ⏳✨](#chronowarden-guardian-of-temporal-threads-)
  - [Table of Contents](#table-of-contents)
  - [Introduction 🌟](#introduction-)
    - [Behold the Guardian](#behold-the-guardian)
  - [Summoning the Guardian 📜✨](#summoning-the-guardian-)
    - [Initializing the Guardian](#initializing-the-guardian)
  - [Reading the Threads ⏳](#reading-the-threads-)
    - [Unraveling Time](#unraveling-time)
  - [Manipulating Time 🕰](#manipulating-time-)
    - [Adjusting the Hourglass](#adjusting-the-hourglass)
  - [Resets and Renewals 🔄](#resets-and-renewals-)
    - [Restoring the Flow](#restoring-the-flow)
  - [Guardian's State 📚](#guardians-state-)
    - [Insights into the Sentinel](#insights-into-the-sentinel)
  - [Contribute 🌌](#contribute-)

---

## Introduction 🌟

### Behold the Guardian
The `ChronoWarden` is not a mere timer; it's a sentinel entrusted with the very essence of time. With its arcane knowledge, it tracks the moments, the ticks, and the heartbeats of the digital realm.

---

## Summoning the Guardian 📜✨

### Initializing the Guardian
Summon the guardian by invoking the constructor. It's a simple ritual, yet profound in its implications.

```typescript
const timeGuardian = new ChronoWarden(3600); // One hour of vigilance
```

You can also ressurect the guardian from its ashes by invoking it with some or all of its previous state.
```typescript
const timeGuardian = new ChronoWarden(1800, 3600, Date.now() - 1800, Date.now() - 3600); // Half an hour remains, half an hour has passed, last updated half an hour ago, created an hour ago
```

---

## Reading the Threads ⏳

### Unraveling Time
Gaze upon the threads of time with the `get` method. It will reveal the seconds left in the hour.

```typescript
const remainingTime = timeGuardian.get();
```

---

## Manipulating Time 🕰

### Adjusting the Hourglass
The guardian grants you the power to alter time itself. Use the `set` method to command the hourglass.

```typescript
timeGuardian.set(1800); // Half an hour remains
```

---

## Resets and Renewals 🔄

### Restoring the Flow
When the need arises to turn back the clock, invoke the `reset` ritual. It restores the guardian's vigilance to its original duration.

```typescript
timeGuardian.reset(); // Time flows anew
```

---

## Guardian's State 📚

### Insights into the Sentinel
Should you seek to peer into the guardian's mind, call upon the `getState` method. It will unveil the secrets of time, revealing the initial time, the remaining time, the last update, and the moment of its creation.

```typescript
const guardianState = timeGuardian.getState();
```

---

## Contribute 🌌

As you unravel the threads of time with the `ChronoWarden`, remember that your insights can enhance this chronicle. Contribute, share your wisdom, and together we shall master the art of temporal guardianship!