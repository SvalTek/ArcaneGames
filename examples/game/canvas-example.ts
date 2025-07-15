import { createCanvas } from 'canvas';
import readline from 'readline';
import {
  CanvasMapElementRenderer,
  FloorElement,
  InteractableFloorElement,
  GameMap,
  Player,
  WallElement,
} from '../../dist/main.js';

// Canvas setup
const TILE_SIZE = 24;
const canvas = createCanvas(20 * TILE_SIZE, 10 * TILE_SIZE);
const ctx = canvas.getContext('2d');
const renderer = new CanvasMapElementRenderer(ctx);

// Simple map
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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const el of map.getElements()) {
    el.render(renderer, { scale: 1 });
  }
}

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
    console.log(canvas.toString());
  }
}

draw();
console.log(canvas.toString());

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (_str, key) => {
  if (key.name === 'up') movePlayer(0, -1);
  if (key.name === 'down') movePlayer(0, 1);
  if (key.name === 'left') movePlayer(-1, 0);
  if (key.name === 'right') movePlayer(1, 0);
  if (key.name === 'c' && key.ctrl) process.exit();
});
