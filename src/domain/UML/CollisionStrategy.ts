import { Cursor } from "./Cursor";
import { Interactive } from "./interfaces";

export interface CollisionStrategy {
  checkCollision(
    cursor: Cursor,
    x: number,
    y: number,
    width: number,
    height: number
  ): boolean;
}

export class SquareCollision implements CollisionStrategy {
  public checkCollision(
    cursor: Cursor,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    return (
      this.checkHorizontalCollision(cursor, x, y, width, height) &&
      this.checkVerticalCollision(cursor, x, y, width, height)
    );
  }
  private checkHorizontalCollision(
    cursor: Cursor,
    x: number,
    y: number,
    width: number,
    height: number
  ): boolean {
    return cursor.x > x && cursor.x < x + width;
  }

  private checkVerticalCollision(
    cursor: Cursor,
    x: number,
    y: number,
    width: number,
    height: number
  ): boolean {
    return cursor.y > y && cursor.y < y + height;
  }
}
