# ArcaneGames

ArcaneGames is a lightweight TypeScript framework for building text-based RPGs.
It provides utilities for managing game state, timers, an event system and a
simple command architecture.

## Installation

```bash
npm install
```

## Building & Testing

```bash
# compile TypeScript to ./dist
npm run build

# run unit tests
npm test

# format and lint source
npm run format
npm run lint
```

## Usage Example

```ts
import { ArcaneMemory } from './dist/libs/ArcaneMemory';

const memory = new ArcaneMemory();
memory.set('location', 'Avalon');
console.log(memory.get('location')); // -> 'Avalon'
```

Commands can be registered and executed using `CommandRegistry`:

```ts
import { CommandRegistry } from './dist/commands/CommandRegistry';

const registry = new CommandRegistry();
await registry.loadCommands('./dist/commands');
console.log(await registry.execute('ping', { args: [] }));
```

## Documentation

Detailed documentation for each library can be found in the
[documentation](documentation) directory.

## License

ArcaneGames is released under the [MIT License](LICENSE).
