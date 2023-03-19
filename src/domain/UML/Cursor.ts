export class Cursor {
    public x: number = 0;
    public y: number = 0;
    public dX: number = 0;
    public dY: number = 0;
    public radius: number = 5;
    constructor(public canvas: HTMLCanvasElement) {
        this.canvas.addEventListener('mousemove', (e) => {
            this.x = e.offsetX;
            this.y = e.offsetY;
            this.dX = e.clientX - e.offsetX;
            this.dY = e.clientY - e.offsetY;
        })
    }
    
    public draw (g: CanvasRenderingContext2D) {
        g.lineWidth = 1;
        g.strokeStyle = '#000000';
        g.beginPath();
        g.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        g.stroke();
      }
}