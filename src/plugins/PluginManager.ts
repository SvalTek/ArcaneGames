import fs from 'fs/promises';
import path from 'path';
import { Plugin } from './Plugin';
import { StoryEngine } from '../story/StoryEngine';
import { CommandRegistry } from '../commands/CommandRegistry';

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();

  async loadPlugins(dir: string): Promise<void> {
    const files = await fs.readdir(dir);
    for (const file of files) {
      if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;
      const mod = await import(path.join(dir, file));
      const PluginClass = mod.default || mod.Plugin;
      if (typeof PluginClass === 'function') {
        const plugin: Plugin = new PluginClass();
        this.plugins.set(plugin.name, plugin);
      }
    }
  }

  async init(engine: StoryEngine, registry: CommandRegistry): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.init) await plugin.init(engine);
      if (plugin.register) await plugin.register(registry);
    }
  }

  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  list(): Plugin[] {
    return Array.from(this.plugins.values());
  }
}
