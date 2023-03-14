import { CollisionStrategy, SquareCollision } from "./CollisionStrategy";
import { Cursor } from "./Cursor";
import UML from "./UML";
import { Interactive } from "./interfaces";

export class NodeTitle implements Interactive {
  private padding: number = 5;
  private x: number = 0;
  private y: number = 0;
  private width: number = 0;
  private height: number = 0;
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
    g.beginPath();
    g.moveTo(
      x,
      y + fontBoundingBoxDescent + fontBoundingBoxAscent + this.padding
    );
    g.lineTo(
      x + width,
      y + fontBoundingBoxDescent + fontBoundingBoxAscent + this.padding
    );
    g.stroke();

    this.x = x + width / 2 - actualBoundingBoxLeft;
    this.y = y;
    this.width = textWidth;
    this.height = fontBoundingBoxDescent + fontBoundingBoxAscent + this.padding;
  }

  public pointerUp(cursor: Cursor, hovered: Interactive | null, uml: UML) {
    const input: HTMLInputElement = document.createElement("input");
    input.value = this.text;
    input.type = "text";
    input.style.fontFamily = "serif";
    input.style.fontSize = "18px";
    input.style.position = "fixed";
    input.style.top = this.y + cursor.dY + "px";
    input.style.left = this.x + cursor.dX + "px";
    input.style.width = this.width + "px";
    input.autofocus = true;
    input.addEventListener("mousemove", (e) => {
      input.focus();
    });
    input.addEventListener("blur", (e) => {
      this.text = (e.target as HTMLInputElement).value;
      input.remove();
    });
    cursor.canvas.parentElement?.prepend(input);
  }
  public pointerDown(cursor: Cursor) {
   
  }
  public drag(cursor: Cursor, ctx: CanvasRenderingContext2D) {}
  public checkCollision(cursor: Cursor, g: CanvasRenderingContext2D) {
    return this.collisionStrategy.checkCollision(
      cursor,
      this.x,
      this.y,
      this.width,
      this.height
    )
      ? this
      : null;
  }
}
