import { Command, CommandContext } from '../Command';

export default class Ping extends Command {
  name = 'ping';

  execute(_ctx: CommandContext): string {
    return 'pong';
  }
}
