export class Cursor {
    public x: number = 0;
    public y: number = 0;
    private width: number = 5;
    private height: number = 5;
    private color: string = 'yellow';
    constructor(private canvas: HTMLCanvasElement) {
        this.canvas.addEventListener('mousemove', (e) => {
            this.x = e.offsetX;
            this.y = e.offsetY;
        })
    }
    
    public draw (g: CanvasRenderingContext2D) {
        g.lineWidth = 1;
        g.strokeStyle = '#000000';
        g.beginPath();
        g.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        g.stroke();
      }
}