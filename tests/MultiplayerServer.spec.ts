import WebSocket from 'ws';
import { MultiplayerServer } from '../src/multiplayer/MultiplayerServer';

describe('MultiplayerServer', () => {
  it('broadcasts messages between clients', done => {
    const server = new MultiplayerServer(12345);
    const clientA = new WebSocket('ws://localhost:12345');
    const clientB = new WebSocket('ws://localhost:12345');

    clientB.on('message', data => {
      expect(data.toString()).toBe('hi');
      clientA.close();
      clientB.close();
      server.close();
      done();
    });

    clientA.on('open', () => {
      clientB.on('open', () => {
        clientA.send('hi');
      });
    });
  });
});
