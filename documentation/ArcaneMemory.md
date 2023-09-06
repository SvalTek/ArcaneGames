# ArcaneMemory: The Spellbook for Text-Based RPGs 📜✨

`ArcaneMemory` is not merely a store; it's an arcane vault crafted for your text-based RPG odysseys. It handles everything from the ephemeral to the eternal, allowing you to store complex contexts, establish timers, and manipulate events with near-magical precision.

## Table of Contents

1. [Initialization](#initialization)
2. [Basic Usage](#basic-usage)
3. [Advanced Manipulations](#advanced-manipulations)
4. [Time-Bound Magic](#time-bound-magic)
5. [Serialization & Deserialization](#serialization--deserialization)
6. [Eldritch Filters](#eldritch-filters)
7. [Contribute](#contribute)

---

## Initialization 🌌

Summon your arcane vault by invoking the constructor.

```typescript
const arcaneMemory = new ArcaneMemory();
```

---

## Basic Usage 🗝

### Storing a Spell

Store your spells—or data, if you prefer the mundane term—using the `set` method.

```typescript
arcaneMemory.set('fireball', { damage: 40, manaCost: 10 });
```

### Retrieving a Spell

Need that fireball for a tough battle? Use the `get` method.

```typescript
const fireball = arcaneMemory.get<string>('fireball');
```

### Ensuring the Spell Exists

Confirm your arsenal using the `has` method.

```typescript
if (arcaneMemory.has('fireball')) {
  // Cast away!
}
```

### Forget an Incantation

Use `delete` to remove a spell you no longer need.

```typescript
arcaneMemory.delete('fireball');
```

---

## Advanced Manipulations 📚

### Store Multiple Spells

Who keeps just one spell? Use `setMultiple` to store multiple incantations.

```typescript
arcaneMemory.setMultiple({ 'heal': { power: 30 }, 'shield': { defense: 50 } });
```

---

## Time-Bound Magic ⌛

### Temporal Spells

Cast spells that last only a short while using the `set` method's timer.

```typescript
arcaneMemory.set('invisibility', true, 3600); // Lasts an hour
```

### Query the Sands of Time

Curious about how much longer your invisibility will last? `getTimerInfo` reveals it.

```typescript
const timerInfo = arcaneMemory.getTimerInfo('invisibility');
```

---

## Serialization & Deserialization 📦

### Serialize Your Vault

Pack up your magical vault for travel.

```typescript
const vaultString = arcaneMemory.serialize();
```

### Open an Old Vault

Unpack a previous state of your magical realm.

```typescript
arcaneMemory.deserialize(vaultString);
```

---

## Mastery of the Vault 🗝📜

#### Retrieve Selected Keys

Handpick the keys that interest you.

```typescript
const importantKeys = arcaneMemory.getSelectedKeys(['fireball', 'heal']);
```

#### Viewing All Keys

Need to know every spell in your vault? Use `getAllKeys`.

```typescript
const allKeys = arcaneMemory.getAllKeys();
```

#### Viewing All Values

Sometimes, you just need the details, not the names. `getAllValues` is your charm.

```typescript
const allValues = arcaneMemory.getAllValues();
```

#### Viewing All Entries

Get the full picture with `getAllEntries`.

```typescript
const allEntries = arcaneMemory.getAllEntries();
```

---

## Eldritch Filters 🌠

### Finding the Right Incantations

Sometimes you don't need all your spells, just the right ones.

#### Filtering by Keys

Only want spells that include 'fire'? Use `selectKeys`.

```typescript
const fireSpells = arcaneMemory.selectKeys(key => key.includes('fire'));
```

#### Filtering by Values

Or perhaps you're only interested in healing spells. Use `selectValues`.

```typescript
const healingSpells = arcaneMemory.selectValues(spell => spell.heal !== undefined);
```

#### Comprehensive Filtering

When you need precision, `selectEntries` is your best bet.

```typescript
const combatSpells = arcaneMemory.selectEntries(spell => spell.damage !== undefined);
```

### Navigating the Mystical

#### Finding the Next Key

Stumbled upon 'fireball' and wondering what comes next? Use `selectNextKey`.

```typescript
const nextSpell = arcaneMemory.selectNextKey('fireball');
```

#### Finding the Previous Key

Curious what spell preceded 'heal'? Use `selectPreviousKey`.

```typescript
const prevSpell = arcaneMemory.selectPreviousKey('heal');
```

### Contextual Magic 🌌

#### Check Context Match

Is your spell compatible with your current battle? Use `isContextMatch`.

```typescript
const match = arcaneMemory.isContextMatch({ situation: 'combat' }, fireball);
```

#### Select by Context

In the middle of a quest? Filter your spells using `selectEntriesByContext`.

```typescript
const questSpells = arcaneMemory.selectEntriesByContext({ quest: 'The Forgotten Code' });
```

---

## Contribute 🌌

Should you decipher more arcane secrets, feel free to scribe them into this spellbook. Open issues, send PRs, and expand the arcane!