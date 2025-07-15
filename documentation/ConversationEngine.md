# ConversationEngine

`ConversationEngine` loads and manages branching conversations defined in YAML files. It supports `!include` and `!mixin` directives for reusable dialogue fragments.

## Loading Conversations

Use `ConversationEngine.fromYaml` or `ConversationManager.loadDirectory` to load YAML files from disk.

```ts
import { ConversationManager } from 'arcanegames';

const manager = new ConversationManager();
await manager.loadDirectory('./examples/conversations');
const convo = manager.get('intro');
```

## Evaluating Options

Each conversation node contains dialogue lines and options. Conditions and triggers can be registered globally:

```ts
ConversationEngine.registerCondition('hasKey', () => player.hasKey);
ConversationEngine.registerTrigger('giveKey', () => player.giveKey());
```
