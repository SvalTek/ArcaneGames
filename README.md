# ArcaneGames

ArcaneGames is a lightweight **ESM-first** TypeScript framework for building text-based RPGs.
It provides utilities for managing game state, timers, an event system and a
simple command architecture. New modules lay the groundwork for plugins, a story engine and multiplayer support.

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
import { ArcaneMemory } from 'arcanegames';

const memory = new ArcaneMemory();
memory.set('location', 'Avalon');
console.log(memory.get('location')); // -> 'Avalon'
```

Commands can be registered and executed using `CommandRegistry`:

```ts
import { CommandRegistry } from 'arcanegames';

const registry = new CommandRegistry();
await registry.loadCommands('./dist/commands');
console.log(await registry.execute('ping', { args: [] }));
```

## Documentation

Detailed documentation for each library can be found in the
[documentation](documentation) directory.

## License

ArcaneGames is released under the [MIT License](LICENSE).

## Canvas Movement Example

A minimal example demonstrating rendering with a Node canvas and arrow-key movement is provided in `examples/game/canvas-example.ts`.

```bash
# build the library
npm run build

# run the example with ts-node
npx ts-node examples/game/canvas-example.ts
```

Use your arrow keys to move the `@` player character around the map. Walking over a green interactable floor tile toggles its color.
