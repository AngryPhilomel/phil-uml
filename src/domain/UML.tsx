import { Canvas } from "./Canvas";
import { Connector } from "./Connector";
import { Cursor } from "./Cursor";
import { SquareNode } from "./SquareNode";

export default class UML {
  private canvas: Canvas;
  private cursor: Cursor;

  private nodes: SquareNode[] = [
    new SquareNode(50, 50, 50, 50, "#00FF00"),
    new SquareNode(150, 50, 50, 50, "#FF0000"),
    new SquareNode(150, 150, 50, 50, "#FF00FF"),
    new SquareNode(50, 150, 50, 50, "#00FFFF"),
  ];

  private connectors: Connector[] = [
    new Connector(this.nodes[0], this.nodes[1]),
    new Connector(this.nodes[1], this.nodes[2]),
    new Connector(this.nodes[2], this.nodes[3]),
    new Connector(this.nodes[3], this.nodes[0]),
  ]

  private hovered: SquareNode | null = null;
  private clicked: boolean = false;

  constructor(private id: string) {
    this.canvas = new Canvas(this.id);
    this.cursor = new Cursor(this.canvas.canvasElement);

    this.canvas.canvasElement.addEventListener("pointerdown", (e) => {
      this.clicked = true;
      this.hovered?.setDragPoint(this.cursor);
    });
    this.canvas.canvasElement.addEventListener("pointerup", (e) => {
      this.clicked = false;
    });
    this.canvas.canvasElement.addEventListener("click", (e) => {
      console.log(this.hovered);
    });

    window.requestAnimationFrame(() => this.animate());
  }

  private animate() {
    this.canvas.clear();

    this.nodes.forEach((node) => {
      node.draw(this.canvas.ctx);
      if (this.clicked) {
        this.hovered?.drag(this.cursor);
        return;
      }
      if (!this.hovered?.checkCollision(this.cursor)) {
        this.hovered?.unhover()
        this.hovered = null;
      }
      
      if (node.checkCollision(this.cursor)) {
        this.hovered = node;
        this.hovered?.hover()
      }
    });
    this.connectors.forEach((connector) => {
      connector.draw(this.canvas.ctx);
    })

    this.cursor?.draw(this.canvas.ctx);

    window.requestAnimationFrame(() => this.animate());
  }

  public addNewNode() {
    this.nodes.push(new SquareNode(0, 0, 50, 50, this.getRandomColor()));
    console.log(this.nodes);
  }

  private getRandomColor(): string {
    return `#${this.getRandomHexDigit()}${this.getRandomHexDigit()}${this.getRandomHexDigit()}`;
  }

  private getRandomHexDigit(): string {
    const digit = Math.floor(Math.random() * (255 - 0) + 0).toString(16)
    return digit.length < 2 ? '0' + digit : digit ;
  }
}
