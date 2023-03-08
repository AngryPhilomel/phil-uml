import UML from "@/domain/UML";
import { useEffect, useRef } from "react";

export const useUML = (id: string) => {
  const canvasRef = useRef<UML>();
  useEffect(() => {
    canvasRef.current = new UML(id);
  });

  const addNewNode = () => {
    canvasRef.current?.addNewNode();
  };

  return { addNewNode };
};
