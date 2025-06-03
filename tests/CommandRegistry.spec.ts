import path from 'path';
import { CommandRegistry } from '../src/commands/CommandRegistry';

describe('CommandRegistry', () => {
  it('should load and execute commands', async () => {
    const registry = new CommandRegistry();
    await registry.loadCommands(path.join(__dirname, '../src/commands'));
    const result = await registry.execute('ping', { args: [] });
    expect(result).toBe('pong');
  });

  it('should reload a command', async () => {
    const registry = new CommandRegistry();
    await registry.loadCommands(path.join(__dirname, '../src/commands'));
    await registry.reload('ping');
    const result = await registry.execute('ping', { args: [] });
    expect(result).toBe('pong');
  });
});
