import { Cursor } from "./Cursor";
import { Bottom, ConnectorPoint, Left, Right, Top } from "./ConnectorPoint";
import { Point } from "./shared-types";
import UML from "./UML";
import { Interactive } from "./interfaces";
import { NodeTitle } from "./NodeTitle";
import { CollisionStrategy, SquareCollision } from "./CollisionStrategy";
import { NodeRow } from "./NodeRow";
import { Button } from "./Button";
import { nanoid } from "nanoid";

export class SquareNode implements Interactive {
  public id: string;
  private initColor: string = "blue";
  private title: NodeTitle = new NodeTitle("Title");
  private deleteButton: Button = new Button("❌", () =>
    this.parent.deleteNode(this.id)
  );
  private properties: NodeRow[] = [new NodeRow("property", false, false, this)];
  private addPropertyButton: Button = new Button("✚", () =>
    this.addNewProperty()
  );
  private methods: NodeRow[] = [new NodeRow("method", true, true, this)];
  private addMethodButton: Button = new Button("✚", () => this.addNewMethod());
  private dragX: number = 0;
  private dragY: number = 0;
  private padding: number = 50;
  private connectorPadding: number = 100;
  private rowHeight: number = 21;
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
    private color: string,
    private parent: UML
  ) {
    this.id = nanoid();
    this.initColor = color;
  }

  public draw(g: CanvasRenderingContext2D) {
    let x = this.x;
    let y = this.y;
    this.updateSize();
    this.drawNode(g);
    this.title.draw(g, x, y, this.width, this.height);
    y = y + this.title.height;
    this.drawSeparator(g, x, y, this.width);
    this.properties.forEach((property) => {
      property.draw(g, x, y, this.width, this.height);
      y = y + this.rowHeight;
    });
    this.addPropertyButton.draw(g, x, y, this.width, this.height);
    y = y + this.rowHeight;
    this.drawSeparator(g, x, y, this.width);
    this.methods.forEach((methods) => {
      methods.draw(g, x, y, this.width, this.height);
      y = y + this.rowHeight;
    });
    this.addMethodButton.draw(g, x, y, this.width, this.height);
  }

  private drawSeparator(
    g: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number
  ) {
    g.strokeStyle = this.color;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + width, y);
    g.stroke();
  }

  private updateSize() {
    this.height =
      this.title.height +
      this.rowHeight * (this.properties.length + this.methods.length) +
      this.addPropertyButton.height +
      this.addMethodButton.height;
    this.width =
      Math.max(
        this.title.width,
        ...this.properties.map((p) => p.width),
        ...this.methods.map((m) => m.width)
      ) + this.padding;
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
      this.deleteButton.draw(
        g,
        this.x + this.width - 20,
        this.y,
        20,
        this.height
      );
      const deleteButton = this.deleteButton.checkCollision(cursor, g);
      if (deleteButton) return deleteButton;

      const connector = this.checkConnectorPointsCollisions(cursor, g);
      if (connector) return connector;
      const title = this.checkTitleCollision(cursor, g);
      if (title) return title;
      const property = this.checkPropertiesCollision(cursor, g);
      if (property) return property;
      const method = this.checkMethodsCollision(cursor, g);
      if (method) return method;
      const addPropertyButton = this.addPropertyButton.checkCollision(
        cursor,
        g
      );
      if (addPropertyButton) return addPropertyButton;
      const addMethodButton = this.addMethodButton.checkCollision(cursor, g);
      if (addMethodButton) return addMethodButton;

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

  private checkPropertiesCollision(
    cursor: Cursor,
    g: CanvasRenderingContext2D
  ): Interactive | null {
    return this.checkRowCollision(cursor, g, this.properties);
  }

  private checkMethodsCollision(
    cursor: Cursor,
    g: CanvasRenderingContext2D
  ): Interactive | null {
    return this.checkRowCollision(cursor, g, this.methods);
  }

  private checkRowCollision(
    cursor: Cursor,
    g: CanvasRenderingContext2D,
    rows: NodeRow[]
  ) {
    return rows
      .map((row) => {
        return row.checkCollision(cursor, g);
      })
      .filter((coll) => coll)[0];
  }

  public deleteProperty(id: string) {
    this.properties = this.properties.filter((property) => {
      return property.id !== id;
    });
  }

  public deleteMethod(id: string) {
    this.methods = this.methods.filter((method) => {
      return method.id !== id;
    });
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

  private addNewProperty() {
    this.properties.push(new NodeRow("property", true, false, this));
  }

  private addNewMethod() {
    this.methods.push(new NodeRow("method", true, true, this));
  }

  public connectToTop(): Point[] {
    const x = this.x + this.width / 2;
    const y = this.y;
    return [
      { x, y },
      { x, y: y - this.connectorPadding },
    ];
  }

  public connectToBottom(): Point[] {
    const x = this.x + this.width / 2;
    const y = this.y + this.height;
    return [
      { x, y },
      { x, y: y + this.connectorPadding },
    ];
  }

  public connectToLeft(): Point[] {
    const x = this.x;
    const y = this.y + this.height / 2;
    return [
      { x, y },
      { x: x - this.connectorPadding, y },
    ];
  }

  public connectToRight(): Point[] {
    const x = this.x + this.width;
    const y = this.y + this.height / 2;
    return [
      { x, y },
      { x: x + this.connectorPadding, y },
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
