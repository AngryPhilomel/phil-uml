import { SquareNode } from "./SquareNode";

export class Connector {
  constructor(private from: SquareNode, private to: SquareNode) {}
  public draw(g: CanvasRenderingContext2D) {
    const {from, to} = this.from.calculateConnectors(this.to)
    g.lineJoin='round';
    g.strokeStyle = "#000";
    g.beginPath();
    g.moveTo(from.x, from.y);
    // g.quadraticCurveTo(to.x + 100, to.y + 100, to.x, to.y);
    g.lineTo(to.x, to.y);
    g.stroke();
  }
}
