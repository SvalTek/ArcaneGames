import fs from 'fs/promises';
import path from 'path';
import YAML from 'yaml';

export type DialogueLine = {
  speaker: string;
  text: string;
};

export type ConversationOption = {
  text: string;
  dialogue: DialogueLine[];
  condition?: string;
  trigger?: string;
  nextConversation?: string;
};

export type ConversationNode = {
  id: string;
  participants: string[];
  dialogue: DialogueLine[];
  options: ConversationOption[];
};

export type TriggerFunction = () => void;
export type ConditionFunction = () => boolean;

/**
 * Recursively processes a YAML string and expands custom !include and !mixin directives.
 * Returns a flattened YAML string with includes expanded inline.
 * Adds circular include detection by keeping a Set of included paths.
 */
export async function preprocessYamlIncludes(
  yamlText: string,
  basePath: string,
  visited: Set<string> = new Set(),
): Promise<string> {
  const includePattern = /^\s*[^#\n]*!(include|mixin)\s+(.*)$/gm;
  let match: RegExpExecArray | null;

  while ((match = includePattern.exec(yamlText)) !== null) {
    const fullMatch = match[0];
    const includePath = match[2].trim().replace(/^['"]|['"]$/g, '');
    const fullIncludePath = path.join(basePath, includePath);

    // CIRCULAR INCLUDE DETECTION
    if (visited.has(fullIncludePath)) {
      yamlText = yamlText.replace(
        fullMatch,
        `# Circular include detected and skipped: ${includePath}`,
      );
      includePattern.lastIndex = 0;
      continue;
    }
    visited.add(fullIncludePath);

    let includedContent: string;
    try {
      includedContent = await fs.readFile(fullIncludePath, 'utf-8');
    } catch (err: unknown) {
      includedContent = `# Failed to include: ${includePath}`;
    }

    includedContent = await preprocessYamlIncludes(
      includedContent,
      basePath,
      visited,
    );

    const indent = fullMatch.match(/^\s*/)?.[0] ?? '';
    const indentedContent = includedContent
      .split('\n')
      .map((line) => (line.trim() === '' ? '' : indent + line))
      .join('\n');

    yamlText = yamlText.replace(fullMatch, indentedContent);
    includePattern.lastIndex = 0; // reset regex after replacement
  }
  return yamlText;
}

export class ConversationEngine {
  static triggers: Record<string, TriggerFunction> = {};
  static conditions: Record<string, ConditionFunction> = {};

  private conversation: ConversationNode | null = null;

  constructor(conversation?: ConversationNode) {
    if (conversation) this.conversation = conversation;
  }

  static registerTrigger(name: string, fn: TriggerFunction) {
    this.triggers[name] = fn;
  }

  static registerCondition(name: string, fn: ConditionFunction) {
    this.conditions[name] = fn;
  }

  static builder(id: string): ConversationBuilder {
    return new ConversationBuilder(id);
  }

  static async fromYaml(
    file: string,
    basePath = './examples/conversations',
  ): Promise<ConversationNode> {
    const fpath = path.join(basePath, file);
    const text = await fs.readFile(fpath, 'utf-8');
    const preprocessed = await preprocessYamlIncludes(text, basePath);
    const data = YAML.parse(preprocessed) as {
      id: string;
      participants?: string[];
      dialogue?: DialogueLine[];
      options?: Array<{
        text: string;
        dialogue?: DialogueLine[];
        condition?: string;
        trigger?: string;
        nextConversation?: string;
      }>;
    };

    const convo: ConversationNode = {
      id: data.id,
      participants: data.participants ?? [],
      dialogue: data.dialogue ?? [],
      options: (data.options ?? []).map((opt) => ({
        text: opt.text,
        dialogue: opt.dialogue ?? [],
        condition: opt.condition,
        trigger: opt.trigger,
        nextConversation: opt.nextConversation,
      })),
    };

    return convo;
  }

  setConversation(convo: ConversationNode) {
    this.conversation = convo;
  }

  getCurrent(): ConversationNode | null {
    return this.conversation;
  }

  evaluateOption(option: ConversationOption): boolean {
    if (!option.condition) return true;
    const cond = ConversationEngine.conditions[option.condition];
    return cond ? cond() : false;
  }

  triggerOption(option: ConversationOption) {
    if (option.trigger) {
      const fn = ConversationEngine.triggers[option.trigger];
      if (fn) fn();
    }
  }
}

export class ConversationBuilder {
  private context: ConversationNode;
  private currentOption: ConversationOption | null = null;

  constructor(id: string) {
    this.context = {
      id,
      participants: [],
      dialogue: [],
      options: [],
    };
  }

  participants(...names: string[]): this {
    this.context.participants = names;
    return this;
  }

  speak(speaker: string, text: string): this {
    if (this.currentOption) {
      this.currentOption.dialogue.push({ speaker, text });
    } else {
      this.context.dialogue.push({ speaker, text });
    }
    return this;
  }

  option(text: string): this {
    const opt: ConversationOption = {
      text,
      dialogue: [],
    };
    this.context.options.push(opt);
    this.currentOption = opt;
    return this;
  }

  trigger(name: string): this {
    if (!this.currentOption) throw new Error('No option active');
    this.currentOption.trigger = name;
    return this;
  }

  condition(name: string): this {
    if (!this.currentOption) throw new Error('No option active');
    this.currentOption.condition = name;
    return this;
  }

  startConversation(nextId: string): this {
    if (!this.currentOption) throw new Error('No option active');
    this.currentOption.nextConversation = nextId;
    return this;
  }

  build(): ConversationNode {
    return this.context;
  }
}

export class ConversationManager {
  private conversations: Map<string, ConversationNode> = new Map();

  async loadDirectory(dir: string): Promise<void> {
    const files = await fs.readdir(dir);
    for (const file of files) {
      if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;
      const convo = await ConversationEngine.fromYaml(file, dir);
      this.conversations.set(convo.id, convo);
    }
  }

  async loadFile(
    file: string,
    basePath = './examples/conversations',
  ): Promise<ConversationNode> {
    const convo = await ConversationEngine.fromYaml(file, basePath);
    this.conversations.set(convo.id, convo);
    return convo;
  }

  get(id: string): ConversationNode | undefined {
    return this.conversations.get(id);
  }
}
