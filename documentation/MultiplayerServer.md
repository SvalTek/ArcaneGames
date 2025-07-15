# MultiplayerServer

The `MultiplayerServer` class provides a simple WebSocket broadcast server for
real-time multiplayer features.

```ts
import { MultiplayerServer } from 'arcanegames';

const server = new MultiplayerServer(8080);
// messages received from any client are broadcast to all others
```

Use `close()` to shut down the server when finished.
