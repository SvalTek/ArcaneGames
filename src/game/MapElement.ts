import cuid from 'cuid';

// --- Renderer Interface ---

export interface MapElementRenderer {
  renderElement(element: MapElement, options?: { scale?: number }): void;
}

// --- Core MapElement Class ---

export abstract class MapElement {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly size: number;
  public readonly symbol: string;
  protected tileColor: string;
  protected tileTexture?: string;
  protected position: { x: number; y: number };
  protected walkable: boolean;
  protected transparent: boolean;
  protected visible: boolean;
  protected interactable: boolean;

  constructor(params: {
    name: string;
    description?: string;
    symbol: string;
    position: { x: number; y: number };
    size?: number;
    color?: string;
    texture?: string;
    walkable?: boolean;
    transparent?: boolean;
    visible?: boolean;
    interactable?: boolean;
  }) {
    this.id = cuid();
    this.name = params.name;
    this.description = params.description ?? '';
    this.symbol = params.symbol;
    this.size = params.size ?? MapElementSize.MEDIUM;
    this.tileColor = params.color ?? 'white';
    this.tileTexture = params.texture;
    this.position = { ...params.position };
    this.walkable = params.walkable ?? false;
    this.transparent = params.transparent ?? false;
    this.visible = params.visible ?? true;
    this.interactable = params.interactable ?? false;
  }

  // --- Getters/Setters ---

  getPosition(): { x: number; y: number } {
    return { ...this.position };
  }
  setPosition(x: number, y: number): void {
    this.position = { x, y };
  }

  isWalkable(): boolean {
    return this.walkable;
  }
  isTransparent(): boolean {
    return this.transparent;
  }
  isVisible(): boolean {
    return this.visible;
  }
  isInteractable(): boolean {
    return this.interactable;
  }
  getTileColor(): string {
    return this.tileColor;
  }
  getTileTexture(): string | undefined {
    return this.tileTexture;
  }

  setTileColor(color: string): void {
    this.tileColor = color;
  }

  // --- State Setters (Guarded) ---

  setVisible(visible: boolean): void {
    if (!this.interactable) throw new Error('Element is not interactable.');
    this.visible = visible;
  }

  setTransparent(transparent: boolean): void {
    if (!this.interactable) throw new Error('Element is not interactable.');
    if (!this.visible) throw new Error('Element is not visible.');
    this.transparent = transparent;
  }

  setWalkable(walkable: boolean): void {
    if (!this.interactable) throw new Error('Element is not interactable.');
    if (!this.visible) throw new Error('Element is not visible.');
    this.walkable = walkable;
  }

  // --- Rendering Delegation ---

  render(renderer: MapElementRenderer, options?: { scale?: number }): void {
    renderer.renderElement(this, options);
  }

  // --- Interaction ---

  interact(): string | boolean | void {
    if (!this.interactable)
      throw new Error(`${this.name} is not interactable.`);
    return this.onInteract();
  }

  protected onInteract(): string | boolean | void {
    return `You interacted with ${this.name}.`;
  }

  protected update(): void {}
}

// --- Element Size Enum ---

export enum MapElementSize {
  SMALL = 16,
  MEDIUM = 24,
  LARGE = 32,
}

// --- Tile Types ---

export class FloorElement extends MapElement {
  constructor(
    x: number,
    y: number,
    color: string = 'gray',
    size: number = MapElementSize.MEDIUM,
  ) {
    super({
      name: 'Floor',
      description: 'A basic floor element.',
      symbol: '.',
      position: { x, y },
      size,
      color,
      walkable: true,
      visible: true,
      transparent: true,
      interactable: false,
    });
  }
}

export class InteractableFloorElement extends FloorElement {
  private readonly defaultColor: string;
  constructor(
    x: number,
    y: number,
    color: string = 'gray',
    public walkedColor: string = 'green',
    size: number = MapElementSize.MEDIUM,
  ) {
    super(x, y, color, size);
    this.defaultColor = color;
    this.walkedColor = walkedColor;
    this.interactable = true;
  }
  protected onInteract(): string {
    const nextColor =
      this.tileColor === this.defaultColor
        ? this.walkedColor
        : this.defaultColor;
    this.setTileColor(nextColor);
    return `You interacted with the floor at (${this.getPosition().x}, ${this.getPosition().y}).`;
  }
}

export class WallElement extends MapElement {
  constructor(
    x: number,
    y: number,
    color: string = 'white',
    size: number = MapElementSize.MEDIUM,
  ) {
    super({
      name: 'Wall',
      description: 'A basic wall element.',
      symbol: '#',
      position: { x, y },
      size,
      color,
      walkable: false,
      visible: true,
      transparent: false,
      interactable: false,
    });
  }
}

export class InteractableWallElement extends WallElement {
  constructor(
    x: number,
    y: number,
    color: string = 'white',
    size: number = MapElementSize.MEDIUM,
  ) {
    super(x, y, color, size);
    this.interactable = true;
  }
  protected onInteract(): string {
    return `You interacted with the wall at (${this.getPosition().x}, ${this.getPosition().y}).`;
  }
}

// --- Renderer Examples ---

export class CanvasMapElementRenderer implements MapElementRenderer {
  constructor(private ctx: CanvasRenderingContext2D) {}
  renderElement(element: MapElement, options?: { scale?: number }) {
    const scale = options?.scale ?? 1;
    if (!element.isVisible()) return;
    this.ctx.font = `${scale * element.size}px monospace`;
    this.ctx.fillStyle = element.getTileColor();
    this.ctx.fillText(
      element.symbol,
      element.getPosition().x * element.size * scale,
      element.getPosition().y * element.size * scale,
    );
  }
}

export class TerminalMapElementRenderer implements MapElementRenderer {
  renderElement(element: MapElement, _options?: { scale?: number }) {
    if (!element.isVisible()) return;
    const { x, y } = element.getPosition();
    console.log(`[${x},${y}] ${element.symbol} (${element.getTileColor()})`);
  }
}
