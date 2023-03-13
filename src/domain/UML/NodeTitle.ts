export class NodeTitle {
    private padding: number = 5
    constructor(private text: string) {

    }

    public draw(g: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
        g.fillStyle = "#000"
        g.font = "18px serif";
        g.textBaseline = "hanging";
        g.textAlign = "center";
        g.fillText(this.text, x + width/2, y + this.padding);
        
        const {fontBoundingBoxDescent, fontBoundingBoxAscent} = g.measureText(this.text)
        g.beginPath()
        g.moveTo(x, y + fontBoundingBoxDescent + fontBoundingBoxAscent + this.padding)
        g.lineTo(x + width, y + fontBoundingBoxDescent + fontBoundingBoxAscent + this.padding)
        g.stroke()
      }
}