import { CollisionStrategy, SquareCollision } from "./CollisionStrategy";
import { Cursor } from "./Cursor";
import UML from "./UML";
import { Interactive } from "./interfaces";

export class Button implements Interactive {
  private padding: number = 5;
  private x: number = 0;
  private y: number = 0;
  public width: number = 0;
  public height: number = 20;
  private collisionStrategy: CollisionStrategy = new SquareCollision();
  private color = "#00000033";
  constructor(private text: string, private onClick: () => void) {}
  public draw(
    g: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    g.strokeStyle = this.color;
    g.strokeRect(x + 1, y, width - 2, this.height);
    g.fillStyle = "#000";
    g.font = "18px serif";
    g.textBaseline = "hanging";
    g.textAlign = "center";
    g.fillText(this.text, x + width / 2, y + this.padding);

    this.x = x + 1;
    this.y = y;
    this.width = width - 2;
  }

  public pointerUp(cursor: Cursor, hovered: Interactive | null, uml: UML) {
    this.onClick();
  }
  public pointerDown(cursor: Cursor) {}
  public drag(cursor: Cursor, ctx: CanvasRenderingContext2D) {}

  public checkCollision(cursor: Cursor, g: CanvasRenderingContext2D) {
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
