import path from 'path';
import { Plugin } from '../../src/plugins/Plugin';
import { CommandRegistry } from '../../src/commands/CommandRegistry';
import { StoryEngine } from '../../src/story/StoryEngine';

export default class ExamplePlugin implements Plugin {
  name = 'example';
  async register(registry: CommandRegistry): Promise<void> {
    await registry.loadCommand(path.join(__dirname, 'Hello.ts'));
  }
  async init(_engine: StoryEngine): Promise<void> {
    // no-op
  }
}
