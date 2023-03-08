import styles from "./canvas-view.module.css";
import { useUML } from "@/hooks/useUML.hook";

export const CanvasView = () => {
  const { addNewNode } = useUML('uml')
  return (
    <div className={styles["canvas-view"]}>
      <button onClick={addNewNode}>Add new node</button>
      <canvas
        className={styles["canvas-view__canvas"]}
        id={"uml"}
        width={500}
        height={500}
      ></canvas>
    </div>
  );
};
