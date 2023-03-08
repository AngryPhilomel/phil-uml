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
    private dragX: number = 0,
    private dragY: number = 0,
    private padding: number = 20
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

  public connectToTop(): Point[] {
    const x = this.x + this.width / 2;
    const y = this.y;
    return [
      { x, y },
      { x, y: y - this.padding },
    ];
  }

  public connectToBottom(): Point[] {
    const x = this.x + this.width / 2;
    const y = this.y + this.height;
    return [
      { x, y },
      { x, y: y + this.padding },
    ];
  }

  public connectToLeft(): Point[] {
    const x = this.x;
    const y = this.y + this.height / 2;
    return [
      { x, y },
      { x: x - this.padding, y },
    ];
  }

  public connectToRight(): Point[] {
    const x = this.x + this.width;
    const y = this.y + this.height / 2;
    return [
      { x, y },
      { x: x + this.padding, y },
    ];
  }

  public calculateConnectors(other: SquareNode): Point[] {
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
  ): Point[] {
    if (y > this.y + height) {
      return [...other.connectToTop(), ...this.connectToBottom().reverse()];
    }
    if (y + this.height < this.y) {
      return [...other.connectToBottom(), ...this.connectToTop().reverse()];
    }
    if (x < this.x) {
      return [...other.connectToRight(), ...this.connectToLeft().reverse()];
    }
    return [...other.connectToLeft(), ...this.connectToRight().reverse()];
  }
}
