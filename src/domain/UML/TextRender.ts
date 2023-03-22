import { type } from "os";

export class TextRender {
  constructor(private textRenderStrategy: TextRenderStrategy) {}
  public draw(
    g: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    leftMargin: number,
    padding: number,
    text: string
  ) {
    g.fillStyle = "#000";
    g.font = "18px serif";
    g.textBaseline = "hanging";
    g.textAlign = this.textRenderStrategy.textAlign;
    g.fillText(
      text,
      this.textRenderStrategy.calculateX(x, width, leftMargin),
      y + padding
    );

    const {
      fontBoundingBoxDescent,
      fontBoundingBoxAscent,
      actualBoundingBoxLeft,
      width: textWidth,
    } = g.measureText(text);

    return {
      x: this.textRenderStrategy.calculateMeasureX(
        x,
        width,
        leftMargin,
        actualBoundingBoxLeft
      ),
      y: y,
      width: textWidth,
      height: fontBoundingBoxDescent + fontBoundingBoxAscent + padding,
    };
  }
}

type TexrAlign = "left" | "center";

interface TextRenderStrategy {
  textAlign: TexrAlign;
  calculateX: (x: number, width: number, leftMargin: number) => number;
  calculateMeasureX: (
    x: number,
    width: number,
    leftMargin: number,
    actualBoundingBoxLeft: number
  ) => number;
}

export class AlignLeft implements TextRenderStrategy {
  public textAlign: TexrAlign = "left";
  public calculateX(x: number, width: number, leftMargin: number) {
    return x + leftMargin;
  }
  public calculateMeasureX(
    x: number,
    width: number,
    leftMargin: number,
    actualBoundingBoxLeft: number
  ) {
    return x + leftMargin;
  }
}

export class AlignCenter implements TextRenderStrategy {
  public textAlign: TexrAlign = "center";
  public calculateX(x: number, width: number, leftMargin: number) {
    return x + width / 2;
  }
  public calculateMeasureX(
    x: number,
    width: number,
    leftMargin: number,
    actualBoundingBoxLeft: number
  ) {
    return x + width / 2 - actualBoundingBoxLeft;
  }
}
