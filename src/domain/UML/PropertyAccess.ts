import { CollisionStrategy, SquareCollision } from "./CollisionStrategy";
import { Cursor } from "./Cursor";
import { AlignLeft, TextRender } from "./TextRender";
import UML from "./UML";
import { Interactive } from "./interfaces";

export class PropertyAccess implements Interactive {
  private textRender: TextRender = new TextRender(new AlignLeft());
  private padding: number = 5;
  private x: number = 0;
  private y: number = 0;
  public width: number = 0;
  public height: number = 0;
  private leftMargin: number = 10;
  private collisionStrategy: CollisionStrategy = new SquareCollision();
  private text: string;

  constructor(private access: boolean = true) {
    this.text = this.access ? '+' : '-'
  }

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

  public pointerUp(cursor: Cursor, hovered: Interactive | null, uml: UML) {
    this.toggleAccess()
  }
  public pointerDown(cursor: Cursor) {
    
  }
  public drag(cursor: Cursor, ctx: CanvasRenderingContext2D) {}

  private toggleAccess() {
    this.access = !this.access
    this.text = this.access ? '+' : '-'
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
