import { Cursor } from "./Cursor";
import { Bottom, ConnectorPoint, Left, Right, Top } from "./ConnectorPoint";
import { Point } from "./shared-types";
import UML from "./UML";
import { Interactive } from "./interfaces";
import { NodeTitle } from "./NodeTitle";
import { CollisionStrategy, SquareCollision } from "./CollisionStrategy";

export class SquareNode implements Interactive {
  private id: string;
  private initColor: string = "blue";
  private title: NodeTitle = new NodeTitle("Title");
  private dragX: number = 0;
  private dragY: number = 0;
  private padding: number = 100;
  private collisionStrategy: CollisionStrategy = new SquareCollision();
  private connectorPoints: { [direction: string]: ConnectorPoint } = {
    top: new ConnectorPoint(new Top(), this),
    bottom: new ConnectorPoint(new Bottom(), this),
    left: new ConnectorPoint(new Left(), this),
    right: new ConnectorPoint(new Right(), this),
  };
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
  }

  public drawNode(g: CanvasRenderingContext2D) {
    g.lineWidth = 3;
    g.fillStyle = "#FFFFFF";
    g.strokeStyle = this.color;
    g.strokeRect(this.x, this.y, this.width, this.height);
    g.fillRect(this.x, this.y, this.width, this.height);
  }

  private drawConnectorPoints(g: CanvasRenderingContext2D) {
    Object.values(this.connectorPoints).map((connectorPoint) => {
      connectorPoint.draw(g, this.x, this.y, this.width, this.height);
    });
  }

  public checkCollision(
    cursor: Cursor,
    g: CanvasRenderingContext2D
  ): Interactive | null {
    if (
      this.collisionStrategy.checkCollision(cursor, {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
      })
    ) {
      this.drawConnectorPoints(g);

      const connector = this.checkConnectorPointsCollisions(cursor, g);
      if (connector) return connector;

      const title = this.checkTitleCollision(cursor, g);
      if (title) return title;
      this.hover();
      return this;
    } else {
      this.unhover();
      return null;
    }
  }

  private checkConnectorPointsCollisions(
    cursor: Cursor,
    g: CanvasRenderingContext2D
  ): ConnectorPoint | null {
    return Object.values(this.connectorPoints).filter((connector) => {
      return connector.checkCollision(cursor, g);
    })[0];
  }

  private checkTitleCollision(
    cursor: Cursor,
    g: CanvasRenderingContext2D
  ): NodeTitle | null {
    return this.title.checkCollision(cursor, g);
  }
  private hover() {
    this.color = "blue";
  }

  private unhover() {
    this.color = this.initColor;
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
