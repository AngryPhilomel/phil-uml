import { SquareNode } from "./SquareNode";
import { Point } from "./shared-types";

export class Connector {
  constructor(private from: SquareNode, private to: SquareNode) {}
  public draw(g: CanvasRenderingContext2D) {
    const points = this.from.calculateConnectors(this.to);
    this.drawLine(g, points)
    const lastPoint = points[points.length - 1];
    const beforeLastPoint = points[points.length - 2];
    this.drawHeadlen(g, lastPoint, beforeLastPoint)
  }

  private drawLine(g: CanvasRenderingContext2D, points: Point[]) {
    g.lineJoin = "round";
    g.strokeStyle = "#000";
    g.beginPath();
    points.forEach((point: Point, index) => {
      g.lineTo(point.x, point.y);
    });
    g.stroke();
  }

  private drawHeadlen(g: CanvasRenderingContext2D, lastPoint: Point, beforeLastPoint: Point) {
    const headlen = 10;
    const dx = lastPoint.x - beforeLastPoint.x;
    const dy = lastPoint.y - beforeLastPoint.y;
    const angle = Math.atan2(dy, dx);
    g.lineTo(
      lastPoint.x - headlen * Math.cos(angle - Math.PI / 6),
      lastPoint.y - headlen * Math.sin(angle - Math.PI / 6)
    );
    g.moveTo(lastPoint.x, lastPoint.y);
    g.lineTo(
      lastPoint.x - headlen * Math.cos(angle + Math.PI / 6),
      lastPoint.y - headlen * Math.sin(angle + Math.PI / 6)
    );
    g.stroke();
  }
}
