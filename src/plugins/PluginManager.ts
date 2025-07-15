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
      const fullPath = path.join(dir, file);
      try {
        const mod = await import(fullPath);
        const PluginClass = mod.default || mod.Plugin;
        if (typeof PluginClass === 'function') {
          const plugin: Plugin = new PluginClass();
          this.plugins.set(plugin.name, plugin);
        }
      } catch (err: any) {
        if (file.endsWith('.ts') && err?.code === 'ERR_UNKNOWN_FILE_EXTENSION') {
          console.warn(
            `PluginManager: unable to load TypeScript plugin "${file}". Compile it to JavaScript or run with a TypeScript loader such as ts-node.`
          );
          continue;
        }
        throw err;
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
