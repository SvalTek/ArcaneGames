import { WebSocketServer, WebSocket } from 'ws';

export class MultiplayerServer {
  private wss: WebSocketServer;

  constructor(port = 8080) {
    this.wss = new WebSocketServer({ port });
    this.wss.on('connection', ws => {
      ws.on('message', data => {
        this.broadcast(data.toString(), ws);
      });
    });
  }

  broadcast(message: string, sender?: WebSocket): void {
    for (const client of this.wss.clients) {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  close(): void {
    this.wss.close();
  }
}
