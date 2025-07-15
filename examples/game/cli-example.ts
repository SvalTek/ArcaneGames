import readline from 'readline';
import {
  TerminalMapElementRenderer,
  FloorElement,
  InteractableFloorElement,
  GameMap,
  Player,
  WallElement,
} from '../../dist/main.js';

const map = new GameMap(20, 10);
for (let x = 0; x < 20; x++) {
  for (let y = 0; y < 10; y++) {
    if (x === 0 || y === 0 || x === 19 || y === 9) {
      map.addElement(new WallElement(x, y));
    } else if (y === 5 && x > 2 && x < 17) {
      map.addElement(new WallElement(x, y));
    } else {
      const floor = new InteractableFloorElement(x, y, 'gray', 'lightgreen');
      map.addElement(floor);
    }
  }
}

const player = new Player(1, 1);
map.addElement(player);

const renderer = new TerminalMapElementRenderer();

function draw() {
  console.clear();
  for (const el of map.getElements()) {
    el.render(renderer);
  }
}

draw();

function movePlayer(dx: number, dy: number) {
  const pos = player.getPosition();
  const targetX = pos.x + dx;
  const targetY = pos.y + dy;
  if (map.isWalkable(targetX, targetY)) {
    const floor = map.getElementAt(targetX, targetY);
    if (floor && floor instanceof InteractableFloorElement) {
      floor.interact();
    }
    player.setPosition(targetX, targetY);
    draw();
  }
}

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);
process.stdin.on('keypress', (_str, key) => {
  if (key.name === 'up') movePlayer(0, -1);
  if (key.name === 'down') movePlayer(0, 1);
  if (key.name === 'left') movePlayer(-1, 0);
  if (key.name === 'right') movePlayer(1, 0);
  if (key.name === 'c' && key.ctrl) process.exit();
});
