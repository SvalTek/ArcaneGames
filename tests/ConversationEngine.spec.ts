import { ConversationEngine, ConversationManager } from '../src/libs/ConversationEngine';
import path from 'path';

describe('ConversationEngine', () => {
  it('loads a conversation from YAML with includes', async () => {
    const convo = await ConversationEngine.fromYaml('intro.yaml', path.join(__dirname, '../examples/conversations'));
    expect(convo.id).toBe('intro');
    expect(convo.dialogue[0].text).toBe('Greetings, traveler.');
    expect(convo.options[0].dialogue[1].text).toBe('Well met!');
  });
});

describe('ConversationManager', () => {
  it('loads conversations from a directory', async () => {
    const manager = new ConversationManager();
    await manager.loadDirectory(path.join(__dirname, '../examples/conversations'));
    expect(manager.get('intro')).toBeDefined();
    expect(manager.get('farewell')).toBeDefined();
  });
});
