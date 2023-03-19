import { CollisionStrategy, SquareCollision } from "./CollisionStrategy";
import { Cursor } from "./Cursor";
import UML from "./UML";
import { Interactive } from "./interfaces";

export class PropertyAccess implements Interactive {
  private padding: number = 5;
  private x: number = 0;
  private y: number = 0;
  public width: number = 0;
  public height: number = 0;
  private leftMargin: number = 10;
  private collisionStrategy: CollisionStrategy = new SquareCollision();
  
  constructor(private access: boolean = true) {}

  public draw(
    g: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    g.fillStyle = "#000";
    g.font = "18px serif";
    g.textBaseline = "hanging";
    g.textAlign = "left";
    g.fillText(this.access ? '+' : '-' , x + this.leftMargin , y);

    const {
      fontBoundingBoxDescent,
      fontBoundingBoxAscent,
      actualBoundingBoxLeft,
      width: textWidth,
    } = g.measureText('+');

    this.x = x + this.leftMargin;
    this.y = y;
    this.width = textWidth;
    this.height = fontBoundingBoxDescent + fontBoundingBoxAscent + this.padding;
  }

  public pointerUp(cursor: Cursor, hovered: Interactive | null, uml: UML) {
    this.toggleAccess()
  }
  public pointerDown(cursor: Cursor) {
    
  }
  public drag(cursor: Cursor, ctx: CanvasRenderingContext2D) {}

  private toggleAccess() {
    this.access = !this.access
  }

  public checkCollision(cursor: Cursor, g: CanvasRenderingContext2D): Interactive | null {
    return this.collisionStrategy.checkCollision(cursor, {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    })
      ? this
      : null;
  }
}
