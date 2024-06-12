// src/components/Lines.js
import React, { useEffect, useState } from "react";
import Arrow from "./Arrow";

const Lines = ({ nodes }) => {
  const [arrows, setArrows] = useState([]);

  useEffect(() => {
    const calculateArrows = () => {
      const newArrows = nodes.flatMap((node) =>
        node.children.map((child) => {
          const parentRect = node.ref.current.getBoundingClientRect();
          const childRect = child.ref.current.getBoundingClientRect();

          const startPoint = {
            x: parentRect.left + parentRect.width / 2,
            y: parentRect.top + parentRect.height / 2,
          };
          const endPoint = {
            x: childRect.left + childRect.width / 2,
            y: childRect.top + childRect.height / 2,
          };

          return { startPoint, endPoint };
        })
      );

      setArrows(newArrows);
    };

    calculateArrows();
    window.addEventListener("resize", calculateArrows);

    return () => {
      window.removeEventListener("resize", calculateArrows);
    };
  }, [nodes]);

  return (
    <>
      {arrows.map((arrow, index) => (
        <Arrow
          key={index}
          startPoint={arrow.startPoint}
          endPoint={arrow.endPoint}
        />
      ))}
    </>
  );
};

export default Lines;
