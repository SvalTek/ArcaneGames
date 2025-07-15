import { Command, CommandContext } from '../../src/commands/Command';

export default class Hello extends Command {
  name = 'hello';
  execute(_ctx: CommandContext): string {
    return 'hello';
  }
}
