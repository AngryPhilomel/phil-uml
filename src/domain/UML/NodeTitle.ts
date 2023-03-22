import { CollisionStrategy, SquareCollision } from "./CollisionStrategy";
import { Cursor } from "./Cursor";
import { Input } from "./Input";
import { AlignCenter, TextRender } from "./TextRender";
import UML from "./UML";
import { Interactive } from "./interfaces";

export class NodeTitle implements Interactive {
  private textRender: TextRender = new TextRender(new AlignCenter());
  private padding: number = 5;
  private leftMargin: number = 0;
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
    const measure = this.textRender.draw(
      g,
      x,
      y,
      width,
      height,
      this.leftMargin,
      this.padding,
      this.text
    );
    this.x = measure.x;
    this.y = measure.y;
    this.width = measure.width;
    this.height = measure.height;
  }

  public pointerUp(cursor: Cursor, hovered: Interactive | null, uml: UML) {}
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
