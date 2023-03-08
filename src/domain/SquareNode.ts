import { Cursor } from "./Cursor";
import { Point } from "./shared-types";

export class SquareNode {
  private id: string;
  constructor(
    private x: number,
    private y: number,
    private width: number,
    private height: number,
    private color: string,
    private initColor: string = color,
    private dragX = 0,
    private dragY = 0
  ) {
    this.id = Date.now().toString();
  }

  public draw(g: CanvasRenderingContext2D) {
    g.lineWidth = 3;
    g.fillStyle = "#FFFFFF";
    g.strokeStyle = this.color;
    g.strokeRect(this.x, this.y, this.width, this.height);
    g.fillRect(this.x, this.y, this.width, this.height);
  }

  public checkCollision(cursor: Cursor): boolean {
    if (
      this.checkHorizontalCollision(cursor) &&
      this.checkVerticalCollision(cursor)
    ) {
      return true;
    } else {
      return false;
    }
  }

  public hover() {
    this.color = "blue";
  }

  public unhover() {
    this.color = this.initColor;
  }

  private checkHorizontalCollision(cursor: Cursor): boolean {
    return cursor.x > this.x && cursor.x < this.x + this.width;
  }

  private checkVerticalCollision(cursor: Cursor): boolean {
    return cursor.y > this.y && cursor.y < this.y + this.height;
  }

  public drag(cursor: Cursor) {
    this.x = cursor.x - this.dragX;
    this.y = cursor.y - this.dragY;
  }

  public setDragPoint(cursor: Cursor) {
    this.dragX = cursor.x - this.x;
    this.dragY = cursor.y - this.y;
  }

  public connectToTop(): Point {
    return { x: this.x + this.width / 2, y: this.y };
  }

  public connectToBottom(): Point {
    return { x: this.x + this.width / 2, y: this.y + this.height };
  }

  public connectToLeft(): Point {
    return { x: this.x, y: this.y + this.height / 2 };
  }

  public connectToRight(): Point {
    return { x: this.x + this.width, y: this.y + this.height / 2 };
  }

  public calculateConnectors(other: SquareNode): { from: Point; to: Point } {
    return other.calculatePositions(
      this.x,
      this.y,
      this.width,
      this.height,
      this
    );
  }

  public calculatePositions(
    x: number,
    y: number,
    width: number,
    height: number,
    other: SquareNode
  ): { from: Point; to: Point } {
    if (y > this.y + height) {
      return { from: other.connectToTop(), to: this.connectToBottom() };
    }
    if (y + this.height < this.y) {
      return { from: other.connectToBottom(), to: this.connectToTop() };
    }
    if (x < this.x) {
      return { from: other.connectToRight(), to: this.connectToLeft() };
    }
    return { from: other.connectToLeft(), to: this.connectToRight() };
  }
}
