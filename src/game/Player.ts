import { MapElement, MapElementSize } from './MapElement';

export class Player extends MapElement {
  constructor(x: number, y: number, color: string = 'yellow') {
    super({
      name: 'Player',
      description: 'The player character.',
      symbol: '@',
      position: { x, y },
      color,
      walkable: false,
      visible: true,
      transparent: false,
      interactable: false,
      size: MapElementSize.MEDIUM,
    });
  }
}
