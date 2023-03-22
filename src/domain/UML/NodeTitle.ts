import { CollisionStrategy, SquareCollision } from "./CollisionStrategy";
import { Cursor } from "./Cursor";
import { Input } from "./Input";
import UML from "./UML";
import { Interactive } from "./interfaces";

export class NodeTitle implements Interactive {
  private padding: number = 5;
  private x: number = 0;
  private y: number = 0;
  public width: number = 0;
  public height: number = 0;
  private collisionStrategy: CollisionStrategy = new SquareCollision();
  constructor(private text: string) {}

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
    g.textAlign = "center";
    g.fillText(this.text, x + width / 2, y + this.padding);

    const {
      fontBoundingBoxDescent,
      fontBoundingBoxAscent,
      actualBoundingBoxLeft,
      width: textWidth,
    } = g.measureText(this.text);

    this.x = x + width / 2 - actualBoundingBoxLeft;
    this.y = y;
    this.width = textWidth;
    this.height = fontBoundingBoxDescent + fontBoundingBoxAscent + this.padding;
  }

  public pointerUp(cursor: Cursor, hovered: Interactive | null, uml: UML) {
  }
  public pointerDown(cursor: Cursor) {
    this.createInput(cursor);
  }
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

  private createInput(cursor: Cursor) {
    const updateText = (text: string) => {
      this.text = text;
      console.log(text);
    };
    new Input().createInput(
      cursor,
      this.x,
      this.y,
      this.width,
      this.height,
      this.text,
      updateText
    );
  }
}
