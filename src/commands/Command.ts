export interface CommandContext {
  args: string[];
}

export abstract class Command {
  category?: string;
  abstract name: string;
  abstract execute(ctx: CommandContext): Promise<unknown> | unknown;
}
