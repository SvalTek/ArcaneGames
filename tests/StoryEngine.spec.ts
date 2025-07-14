import { StoryEngine, Scene } from '../src/story/StoryEngine';

describe('StoryEngine', () => {
  it('should advance between scenes', () => {
    const engine = new StoryEngine();
    const a: Scene = { id: 'a', text: 'A', choices: [{ text: 'toB', next: 'b' }] };
    const b: Scene = { id: 'b', text: 'B', choices: [] };
    engine.addScene(a);
    engine.addScene(b);

    expect(engine.start('a')).toEqual(a);
    expect(engine.choose(0)).toEqual(b);
  });
});
