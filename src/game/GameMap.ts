import { MapElement } from './MapElement';

export class GameMap {
  private elements: MapElement[] = [];
  constructor(
    public width: number,
    public height: number,
  ) {}

  addElement(element: MapElement): void {
    this.elements.push(element);
  }

  getElements(): MapElement[] {
    return [...this.elements];
  }

  getElementAt(x: number, y: number): MapElement | undefined {
    return this.elements.find((el) => {
      const pos = el.getPosition();
      return pos.x === x && pos.y === y;
    });
  }

  isWalkable(x: number, y: number): boolean {
    const element = this.getElementAt(x, y);
    if (!element) return true;
    return element.isWalkable();
  }
}
