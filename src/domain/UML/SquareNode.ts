import { Cursor } from "./Cursor";
import { Bottom, ConnectorPoint, Left, Right, Top } from "./ConnectorPoint";
import { Point } from "./shared-types";
import UML from "./UML";
import { Interactive } from "./interfaces";
import { NodeTitle } from "./NodeTitle";

export class SquareNode implements Interactive {
  private id: string;
  private initColor: string = "blue";
  private title: NodeTitle = new NodeTitle("Title");
  private dragX: number = 0;
  private dragY: number = 0;
  private padding: number = 100;
  private connectorTop: ConnectorPoint = new ConnectorPoint(new Top(), this);
  private connectorBottom: ConnectorPoint = new ConnectorPoint(
    new Bottom(),
    this
  );
  private connectorLeft: ConnectorPoint = new ConnectorPoint(new Left(), this);
  private connectorRight: ConnectorPoint = new ConnectorPoint(
    new Right(),
    this
  );
  constructor(
    private x: number,
    private y: number,
    private width: number,
    private height: number,
    private color: string
  ) {
    this.id = Date.now().toString();
    this.initColor = color;
  }

  public draw(g: CanvasRenderingContext2D) {
    this.drawNode(g);
    this.title.draw(g, this.x, this.y, this.width, this.height);
    this.drawConnectorPoints(g);
  }

  public drawNode(g: CanvasRenderingContext2D) {
    g.lineWidth = 3;
    g.fillStyle = "#FFFFFF";
    g.strokeStyle = this.color;
    g.strokeRect(this.x, this.y, this.width, this.height);
    g.fillRect(this.x, this.y, this.width, this.height);
  }

  private drawConnectorPoints(g: CanvasRenderingContext2D) {
    [
      this.connectorTop,
      this.connectorBottom,
      this.connectorRight,
      this.connectorLeft,
    ].map((connectorPoint) => {
      connectorPoint.draw(g, this.x, this.y, this.width, this.height);
    });
  }

  public checkCollision(cursor: Cursor): Interactive | null {
    if (
      this.checkHorizontalCollision(cursor) &&
      this.checkVerticalCollision(cursor)
    ) {
      const connector = this.checkConnectorCollisions(cursor);
      if (connector) {
        return connector;
      }
      this.hover();
      return this;
    } else {
      this.unhover();
      return null;
    }
  }

  private checkConnectorCollisions(cursor: Cursor): ConnectorPoint | null {
    return [
      this.connectorBottom,
      this.connectorTop,
      this.connectorRight,
      this.connectorLeft,
    ].filter((connector) => {
      return connector.checkCollision(cursor);
    })[0];
  }

  private hover() {
    this.color = "blue";
  }

  private unhover() {
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

  public pointerDown(cursor: Cursor) {
    this.dragX = cursor.x - this.x;
    this.dragY = cursor.y - this.y;
  }

  public pointerUp(cursor: Cursor, hover: Interactive | null, uml: UML) {
    return;
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
