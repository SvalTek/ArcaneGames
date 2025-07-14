import fs from 'fs/promises';
import path from 'path';
import { Command, CommandContext } from './Command';

interface LoadedCommand {
  instance: Command;
  file: string;
}

export class CommandRegistry {
  private commands: Map<string, LoadedCommand> = new Map();

  async loadCommands(rootDir: string): Promise<void> {
    const categories = await fs.readdir(rootDir);
    for (const category of categories) {
      const catPath = path.join(rootDir, category);
      const stat = await fs.stat(catPath);
      if (!stat.isDirectory()) continue;
      const files = await fs.readdir(catPath);
      for (const file of files) {
        if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;
        await this.loadCommand(path.join(catPath, file), category);
      }
    }
  }

  async loadCommand(filePath: string, category?: string): Promise<void> {
    const relative =
      './' + path.relative(__dirname, filePath).replace(/\\/g, '/');
    const mod = await import(relative);
    const CommandClass = mod.default;
    if (typeof CommandClass !== 'function') {
      return;
    }
    const instance: Command = new CommandClass();
    instance.category = category;
    this.commands.set(instance.name, { instance, file: filePath });
  }

  get(name: string): Command | undefined {
    return this.commands.get(name)?.instance;
  }

  async reload(name: string): Promise<void> {
    const cmd = this.commands.get(name);
    if (cmd) {
      await this.loadCommand(cmd.file, cmd.instance.category);
    }
  }

  async execute(name: string, ctx: CommandContext): Promise<unknown> {
    const command = this.get(name);
    if (!command) throw new Error(`Unknown command: ${name}`);
    return command.execute(ctx);
  }

  list(): Command[] {
    return Array.from(this.commands.values()).map((c) => c.instance);
  }
}
