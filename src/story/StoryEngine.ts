import { ArcaneMemory } from '../libs/ArcaneMemory';

export interface Choice {
  text: string;
  next: string;
}

export interface Scene {
  id: string;
  text: string;
  choices: Choice[];
}

export class StoryEngine {
  private memory: ArcaneMemory;
  private scenes = new Map<string, Scene>();
  private current?: string;

  constructor(memory: ArcaneMemory = new ArcaneMemory()) {
    this.memory = memory;
  }

  addScene(scene: Scene): void {
    this.scenes.set(scene.id, scene);
  }

  start(id: string): Scene | undefined {
    this.current = id;
    return this.scenes.get(id);
  }

  choose(index: number): Scene | undefined {
    if (!this.current) return undefined;
    const scene = this.scenes.get(this.current);
    if (!scene) return undefined;
    const choice = scene.choices[index];
    if (!choice) return undefined;
    this.current = choice.next;
    return this.scenes.get(choice.next);
  }

  serialize(): string {
    return JSON.stringify({ scene: this.current, memory: this.memory.serialize() });
  }

  deserialize(json: string): void {
    const data = JSON.parse(json);
    this.current = data.scene;
    this.memory.deserialize(data.memory);
  }
}
