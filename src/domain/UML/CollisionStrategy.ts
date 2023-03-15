import { Cursor } from "./Cursor";

type SquareParameters = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CircleParameters = {
  x: number;
  y: number;
  radius: number;
};

export interface CollisionStrategy {
  checkCollision(
    cursor: Cursor,
    parameters: SquareParameters | CircleParameters
  ): boolean;
}

export class SquareCollision implements CollisionStrategy {
  public checkCollision(cursor: Cursor, parameters: SquareParameters) {
    const { x, y, width, height } = parameters;
    return (
      this.checkHorizontalCollision(cursor, x, width) &&
      this.checkVerticalCollision(cursor, y, height)
    );
  }
  private checkHorizontalCollision(
    cursor: Cursor,
    x: number,
    width: number,
  ): boolean {
    return cursor.x > x && cursor.x < x + width;
  }

  private checkVerticalCollision(
    cursor: Cursor,
    y: number,
    height: number
  ): boolean {
    return cursor.y > y && cursor.y < y + height;
  }
}

export class CircleCollision implements CollisionStrategy {
  public checkCollision(cursor: Cursor, parameters: CircleParameters) {
    const { x, y, radius } = parameters;
    const radiuses = cursor.radius + radius;
    const length = Math.sqrt(
      Math.pow(cursor.x - x, 2) + Math.pow(cursor.y - y, 2)
    );
    return length < radiuses;
  }
}
