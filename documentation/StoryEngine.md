# StoryEngine

`StoryEngine` provides lightweight scene management for branching narratives.
Scenes contain text and choices that lead to other scenes. The engine can
serialize state to resume later.

```ts
import { StoryEngine } from 'arcanegames';

const engine = new StoryEngine();
engine.addScene({
  id: 'start',
  text: 'You stand at a crossroads.',
  choices: [
    { text: 'Go north', next: 'north' },
    { text: 'Go south', next: 'south' },
  ],
});
engine.start('start');
```

Use `choose(index)` to follow a choice and `serialize()` to save progress.
