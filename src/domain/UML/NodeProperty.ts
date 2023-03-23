import { Button } from "./Button";
import { CollisionStrategy, SquareCollision } from "./CollisionStrategy";
import { Cursor } from "./Cursor";
import { Input } from "./Input";
import { PropertyAccess } from "./PropertyAccess";
import { SquareNode } from "./SquareNode";
import { AlignLeft, TextRender } from "./TextRender";
import UML from "./UML";
import { Interactive } from "./interfaces";
import { nanoid } from "nanoid";

export class NodeProperty implements Interactive {
  public id: string = nanoid();
  private textRender: TextRender = new TextRender(new AlignLeft());
  private padding: number = 5;
  private x: number = 0;
  private y: number = 0;
  public width: number = 0;
  public height: number = 0;
  private leftMargin: number = 30;
  private collisionStrategy: CollisionStrategy = new SquareCollision();
  public propertyAccess: PropertyAccess;
  private deletePropertyButton;
  constructor(
    private text: string,
    private access: boolean = true,
    private parent: SquareNode
  ) {
    this.propertyAccess = new PropertyAccess(access);
    this.deletePropertyButton = new Button("❌", () => {
      parent.deleteProperty(this.id);
    });
  }

  public draw(
    g: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const measure = this.textRender.draw(
      g,
      x,
      y,
      width,
      height,
      this.leftMargin,
      this.padding,
      this.text
    );
    this.x = measure.x;
    this.y = measure.y;
    this.width = measure.width + 20;
    this.height = measure.height;

    this.propertyAccess.draw(g, x, y, width, height);

    this.deletePropertyButton.draw(g, x + width - 30, y, 20, height);
  }

  public pointerUp(cursor: Cursor, hovered: Interactive | null, uml: UML) {}
  public pointerDown(cursor: Cursor) {
    this.createInput(cursor);
  }
  public drag(cursor: Cursor, ctx: CanvasRenderingContext2D) {}

  public checkCollision(
    cursor: Cursor,
    g: CanvasRenderingContext2D
  ): Interactive | null {
    const access = this.propertyAccess.checkCollision(cursor, g);
    if (access) return this.propertyAccess;
    const deletePropertyButton = this.deletePropertyButton.checkCollision(
      cursor,
      g
    );
    if (deletePropertyButton) return deletePropertyButton;
    return this.collisionStrategy.checkCollision(cursor, {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    })
      ? this
      : null;
  }

  private createInput(cursor: Cursor) {
    const updateText = (text: string) => {
      this.text = text;
      console.log(text);
    };
    new Input().createInput(
      cursor,
      this.x,
      this.y,
      this.width,
      this.height,
      this.text,
      updateText
    );
  }
}
