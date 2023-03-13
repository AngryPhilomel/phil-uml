import { Cursor } from "./Cursor";
import { SquareNode } from "./SquareNode";
import UML from "./UML";
import { Interactive } from "./interfaces";
import { Point } from "./shared-types";

export class ConnectorPoint implements Interactive {
  private color: string = "#0000FF55";
  private radius: number = 5;
  private x: number = 0;
  private y: number = 0;

  constructor(
    private calculateStrategy: CalculateStrategy,
    private parent: SquareNode
  ) {}

  private hover() {
    this.color = "#0000FFFF";
  }

  private unhover() {
    this.color = "#0000FF33";
  }

  public drag(cursor: Cursor, g: CanvasRenderingContext2D) {
    g.strokeStyle = "#000";
    g.moveTo(this.x, this.y);
    g.lineTo(cursor.x, cursor.y);
    g.stroke();
  }

  public pointerDown(cursor: Cursor) {
    return;
  }

  public pointerUp(cursor: Cursor, hover: Interactive | null, uml: UML) {
    if (hover === null) return;
    if (hover instanceof ConnectorPoint) {
      uml.addNewConnector(this.parent, hover.parent);
      return;
    }
    if (hover instanceof SquareNode) {
      uml.addNewConnector(this.parent, hover as SquareNode);
    }
    return;
  }

  public draw(
    g: CanvasRenderingContext2D,
    parentx: number,
    parenty: number,
    parentwidth: number,
    parentheight: number
  ) {
    const { x, y } = this.calculateStrategy.calculate(
      parentx,
      parenty,
      parentwidth,
      parentheight
    );
    this.x = x;
    this.y = y;
    g.strokeStyle = this.color;
    g.fillStyle = this.color;
    g.beginPath();
    g.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    g.fill();
    g.closePath();
  }

  public checkCollision(cursor: Cursor): Interactive | null {
    const radiuses = cursor.radius + this.radius;
    const length = Math.sqrt(
      Math.pow(cursor.x - this.x, 2) + Math.pow(cursor.y - this.y, 2)
    );
    if (length < radiuses) {
      this.hover();
      return this;
    } else {
      this.unhover();
      return null;
    }
  }
}

interface CalculateStrategy {
  calculate(x: number, y: number, width: number, height: number): Point;
}

export class Top implements CalculateStrategy {
  calculate(x: number, y: number, width: number, height: number) {
    return { x: x + width / 2, y: y };
  }
}

export class Bottom implements CalculateStrategy {
  calculate(x: number, y: number, width: number, height: number) {
    return { x: x + width / 2, y: y + height };
  }
}

export class Left implements CalculateStrategy {
  calculate(x: number, y: number, width: number, height: number) {
    return { x: x, y: y + height / 2 };
  }
}

export class Right implements CalculateStrategy {
  calculate(x: number, y: number, width: number, height: number) {
    return { x: x + width, y: y + height / 2 };
  }
}
