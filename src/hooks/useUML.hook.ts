import UML from "@/domain/UML/UML";
import { useEffect, useRef } from "react";

export const useUML = (id: string) => {
  const canvasRef = useRef<UML>();
  useEffect(() => {
    if (canvasRef.current) return;
    canvasRef.current = new UML(id);
  }, [id]);

  const addNewNode = () => {
    canvasRef.current?.addNewNode();
  };

  return { addNewNode };
};
