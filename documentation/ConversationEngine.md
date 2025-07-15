# ConversationEngine

`ConversationEngine` loads and manages branching conversations defined in YAML files. It supports `!include` and `!mixin` directives for reusable dialogue fragments.

The engine stores a single `ConversationNode` which contains dialogue lines and
options that the player can choose from. Each option may point to another
conversation, execute a trigger function or be hidden behind a condition.

---

## YAML Structure

Conversations are authored in YAML. The basic structure is:

```yaml
id: intro
participants:
  - hero
  - villager
dialogue:
  - speaker: villager
    text: "Greetings, traveler."
options:
  - text: "Respond politely"
    dialogue:
      - speaker: hero
        text: "Hello there."
      - speaker: villager
        text: "Well met!"
    trigger: onGreet
    nextConversation: farewell
```

Use `!include` to pull in additional dialogue blocks and `!mixin` to merge option
lists from other files. See the examples in `examples/conversations/`.

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

The `evaluateOption` method checks a condition by name and only returns `true`
when the registered function resolves truthy. Triggers run arbitrary code when
an option is selected.

## Building Conversations in Code

For dynamic creation you can use the `ConversationBuilder` helper:

```ts
const convo = ConversationEngine.builder('intro')
  .participants('hero', 'villager')
  .speak('villager', 'Greetings, traveler.')
  .option('Respond politely')
    .speak('hero', 'Hello there.')
    .trigger('onGreet')
    .startConversation('farewell')
  .build();
```

This produces the same structure as the YAML above.
