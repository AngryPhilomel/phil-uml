import { CollisionStrategy, SquareCollision } from "./CollisionStrategy";
import { Cursor } from "./Cursor";
import { Input } from "./Input";
import { PropertyAccess } from "./PropertyAccess";
import UML from "./UML";
import { Interactive } from "./interfaces";

export class NodeProperty implements Interactive {
  private padding: number = 5;
  private x: number = 0;
  private y: number = 0;
  public width: number = 0;
  public height: number = 0;
  private leftMargin: number = 30;
  private collisionStrategy: CollisionStrategy = new SquareCollision();
  public propertyAccess: PropertyAccess;
  constructor(private text: string, private access: boolean = true) {
    this.propertyAccess = new PropertyAccess(access);
  }

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
    g.fillText(this.text, x + this.leftMargin, y + this.padding);

    const {
      fontBoundingBoxDescent,
      fontBoundingBoxAscent,
      actualBoundingBoxLeft,
      width: textWidth,
    } = g.measureText(this.text);

    this.propertyAccess.draw(g, x, y + this.padding, width, height);

    this.x = x + this.leftMargin;
    this.y = y;
    this.width = textWidth;
    this.height = fontBoundingBoxDescent + fontBoundingBoxAscent + this.padding;
  }

  public pointerUp(cursor: Cursor, hovered: Interactive | null, uml: UML) {}
  public pointerDown(cursor: Cursor) {
    this.createInput(cursor);
  }
  public drag(cursor: Cursor, ctx: CanvasRenderingContext2D) {}

  public checkCollision(
    cursor: Cursor,
    g: CanvasRenderingContext2D
  ): Interactive | null {
    const access = this.propertyAccess.checkCollision(cursor, g);
    if (access) return this.propertyAccess;
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
