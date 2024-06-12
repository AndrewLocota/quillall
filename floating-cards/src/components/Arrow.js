// src/components/Arrow.js
import React from "react";
import styled from "styled-components";
import {
  calculateDeltas,
  calculateCanvasDimensions,
  calculateControlPoints,
} from "../utils/arrow-utils";

const Line = styled.svg.attrs(({ $xTranslate, $yTranslate }) => ({
  style: { transform: `translate(${$xTranslate}px, ${$yTranslate}px)` },
}))`
  pointer-events: none;
  z-index: 0; /* Ensure this is below node contents but visible */
  position: absolute;
  left: 0;
  top: 0;
`;

const Arrow = ({ startPoint, endPoint, scale, config }) => {
  const defaultConfig = {
    arrowColor: "black",
    strokeWidth: 2,
  };

  const currentConfig = {
    ...defaultConfig,
    ...config,
  };

  const { arrowColor, strokeWidth } = currentConfig;

  const scaledStartPoint = {
    x: startPoint.x * scale,
    y: startPoint.y * scale,
  };
  const scaledEndPoint = {
    x: endPoint.x * scale,
    y: endPoint.y * scale,
  };

  const { absDx, absDy, dx, dy } = calculateDeltas(
    scaledStartPoint,
    scaledEndPoint
  );
  const boundingBoxElementsBuffer = strokeWidth;
  const { p1, p2, p3, p4, boundingBoxBuffer } = calculateControlPoints({
    boundingBoxElementsBuffer,
    dx,
    dy,
    absDx,
    absDy,
  });

  const { canvasWidth, canvasHeight } = calculateCanvasDimensions({
    absDx,
    absDy,
    boundingBoxBuffer,
  });

  const canvasXOffset =
    Math.min(scaledStartPoint.x, scaledEndPoint.x) -
    boundingBoxBuffer.horizontal;
  const canvasYOffset =
    Math.min(scaledStartPoint.y, scaledEndPoint.y) - boundingBoxBuffer.vertical;

  const curvedLinePath = `
    M ${p1.x} ${p1.y}
    C ${p2.x} ${p2.y},
    ${p3.x} ${p3.y},
    ${p4.x} ${p4.y}`;

  return (
    <Line
      width={canvasWidth}
      height={canvasHeight}
      $xTranslate={canvasXOffset}
      $yTranslate={canvasYOffset}
    >
      <path
        d={curvedLinePath}
        stroke={arrowColor}
        strokeWidth={
          strokeWidth / scale
        } /* Adjust stroke width based on scale */
        fill="none"
      />
    </Line>
  );
};

export default Arrow;
