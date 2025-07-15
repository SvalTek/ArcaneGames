# PluginManager

`PluginManager` loads plugins from a directory and initializes them with the
`StoryEngine` and `CommandRegistry`. Plugins can register commands or modify the
story at runtime.

```ts
import { PluginManager, CommandRegistry, StoryEngine } from 'arcanegames';

const plugins = new PluginManager();
await plugins.loadPlugins('./dist/plugins');

const engine = new StoryEngine();
const registry = new CommandRegistry();
await plugins.init(engine, registry);
```

## TypeScript Plugins

`PluginManager` expects compiled JavaScript modules. If your plugins are written in TypeScript, run the TypeScript compiler first and load the resulting `.js` files (e.g. from `./dist/plugins`). Alternatively, execute your project with a transpiler such as **ts-node** so `.ts` files can be imported directly.
