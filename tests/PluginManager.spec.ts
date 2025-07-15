import path from 'path';
import { PluginManager } from '../src/plugins/PluginManager';
import { CommandRegistry } from '../src/commands/CommandRegistry';
import { StoryEngine } from '../src/story/StoryEngine';

describe('PluginManager', () => {
  it('loads plugins and registers commands', async () => {
    const manager = new PluginManager();
    const pluginDir = path.join(__dirname, 'tmp-plugin');
    await manager.loadPlugins(pluginDir);
    const engine = new StoryEngine();
    const registry = new CommandRegistry();
    await manager.init(engine, registry);

    const result = await registry.execute('hello', { args: [] });
    expect(result).toBe('hello');
  });
});
