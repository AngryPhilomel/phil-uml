import { Cursor } from "./Cursor";

export class Input {
  public createInput(
    cursor: Cursor,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    updateText: (text: string) => void
  ) {
    const input: HTMLInputElement = document.createElement("input");
    input.value = text;
    input.type = "text";
    input.style.top = y + cursor.dY + "px";
    input.style.left = x + cursor.dX + "px";
    input.style.width = width + "px";
    input.style.minWidth = width + "px";
    input.autofocus = true;
    input.addEventListener("mousemove", (e) => {
      input.focus();
    });
    input.addEventListener("input", (e) => {
      input.style.width = (e.target as HTMLInputElement).value.length + "ch";
    });
    input.addEventListener("blur", (e) => {
      const text = (e.target as HTMLInputElement).value;
      if (text.length > 0) {
        updateText(text);
      }
      input.remove();
    });
    cursor.canvas.parentElement?.prepend(input);
  }
}
