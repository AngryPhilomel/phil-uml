export class Canvas {
  public ctx: CanvasRenderingContext2D;
  public canvasElement: HTMLCanvasElement;
  private width: number;
  private height: number;

  constructor(
    private id: string,
  ) {
    this.canvasElement = document.getElementById(this.id) as HTMLCanvasElement;
    this.width = this.canvasElement.width;
    this.height = this.canvasElement.height;
    const ctx = this.canvasElement.getContext("2d");
    if (!ctx) {
      throw Error("Canvas didn`t find");
    }
    this.ctx = ctx;
  }

  public clear () {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}
