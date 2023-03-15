import { Cursor } from "./Cursor";
import UML from "./UML";

export interface Interactive {
  pointerUp: (cursor: Cursor, hovered: Interactive | null, uml: UML) => void;
  pointerDown: (cursor: Cursor) => void;
  drag: (cursor: Cursor, ctx: CanvasRenderingContext2D) => void;
  checkCollision: (cursor: Cursor, g: CanvasRenderingContext2D) => Interactive | null;
}
