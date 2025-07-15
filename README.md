# ArcaneGames

ArcaneGames is a lightweight **ESM-first** TypeScript framework for building text-based RPGs.
It provides utilities for managing game state, timers, an event system and a simple command architecture. New modules lay the groundwork for plugins, a story engine and multiplayer support.

## Supported Platforms

ArcaneGames targets **Node.js 18+** on 64-bit Windows and Linux. The optional
`canvas` dependency requires additional native libraries. If you do not intend
to run the canvas demo you can skip optional packages during install.

## Installation

```bash
# install dependencies without optional native modules
npm install --omit=optional

# to include optional packages such as `canvas`
# simply run `npm install`
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

## Plugin Development

Plugins are regular Node modules implementing the `Plugin` interface. If you write plugins in TypeScript, compile them with `tsc` and load the generated `.js` files (for example from `./dist/plugins`). You may also run your game with a transpiler like **ts-node** to import `.ts` plugins directly.

## Documentation

Detailed documentation for each library can be found in the
[documentation](documentation) directory.

## License

ArcaneGames is released under the [MIT License](LICENSE).

## CLI Example

A simple terminal-based demo can be run without any native dependencies:

```bash
# build the library
npm run build

# run the CLI demo with ts-node
npx ts-node examples/game/cli-example.ts
```

## Canvas Movement Example

The optional canvas demo located in `examples/game/canvas-example.ts` requires the `canvas` package and system libraries. Run it only if you have the prerequisites installed.

```bash
npm run build
npx ts-node examples/game/canvas-example.ts
```

Use your arrow keys to move the `@` player character around the map. Walking over a green interactable floor tile toggles its color.
