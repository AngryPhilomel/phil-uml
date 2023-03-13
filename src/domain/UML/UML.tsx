import { Canvas } from "./Canvas";
import { Connector } from "./Connector";
import { Cursor } from "./Cursor";
import { SquareNode } from "./SquareNode";
import { Interactive } from "./interfaces";

export default class UML {
  private canvas: Canvas;
  private cursor: Cursor;

  private nodes: SquareNode[] = [
    new SquareNode(50, 50, 100, 50, "#00FF00"),
    new SquareNode(250, 50, 100, 50, "#FF0000"),
    new SquareNode(250, 250, 100, 100, "#FF00FF"),
    new SquareNode(50, 150, 50, 50, "#00FFFF"),
  ];

  private connectors: Connector[] = [
    new Connector(this.nodes[0], this.nodes[1]),
    new Connector(this.nodes[1], this.nodes[2]),
    new Connector(this.nodes[2], this.nodes[3]),
    new Connector(this.nodes[3], this.nodes[0]),
  ];

  private hovered: Interactive | null = null;
  private active: Interactive | null = null;

  constructor(private id: string) {
    this.canvas = new Canvas(this.id);
    this.cursor = new Cursor(this.canvas.canvasElement);

    this.canvas.canvasElement.addEventListener("pointerdown", (e) => {
      this.active = this.hovered;
      this.hovered?.pointerDown(this.cursor);
    });
    this.canvas.canvasElement.addEventListener("pointermove", (e) => {
      // console.log(this.hovered);
    });
    this.canvas.canvasElement.addEventListener("pointerup", (e) => {
      this.active?.pointerUp(this.cursor, this.hovered, this);
      this.active = null;
    });
    this.canvas.canvasElement.addEventListener("click", (e) => {
      // console.log(this.hovered);
    });

    window.requestAnimationFrame(() => this.animate());
  }

  private animate() {
    this.canvas.clear();

    this.nodes.forEach((node) => {
      node.draw(this.canvas.ctx);
      this.connectors.forEach((connector) => {
        connector.draw(this.canvas.ctx);
      });
      this.active?.drag(this.cursor, this.canvas.ctx)
      this.hovered = node.checkCollision(this.cursor) || this.hovered;
      if (!this.hovered?.checkCollision(this.cursor)) {
        this.hovered = null;
      }
    });
    

    this.cursor?.draw(this.canvas.ctx);

    window.requestAnimationFrame(() => this.animate());
  }

  public addNewNode() {
    this.nodes.push(new SquareNode(0, 0, 50, 50, this.getRandomColor()));
    console.log(this.nodes);
  }

  public addNewConnector(from:SquareNode, to:SquareNode) {
    if (from === to) return;
    this.connectors.push(new Connector(from, to))
  }

  private getRandomColor(): string {
    return `#${this.getRandomHexDigit()}${this.getRandomHexDigit()}${this.getRandomHexDigit()}`;
  }

  private getRandomHexDigit(): string {
    const digit = Math.floor(Math.random() * (255 - 0) + 0).toString(16);
    return digit.length < 2 ? "0" + digit : digit;
  }
}
