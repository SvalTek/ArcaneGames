import { CommandRegistry } from '../commands/CommandRegistry';
import { StoryEngine } from '../story/StoryEngine';

export interface Plugin {
  name: string;
  init?(engine: StoryEngine): Promise<void> | void;
  register?(registry: CommandRegistry): Promise<void> | void;
}
