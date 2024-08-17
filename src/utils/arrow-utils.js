// src/utils/arrow-utils.js
export const calculateDeltas = (startPoint, endPoint) => {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  return {
    dx,
    dy,
    absDx: Math.abs(dx),
    absDy: Math.abs(dy),
  };
};

export const calculateCanvasDimensions = ({
  absDx,
  absDy,
  boundingBoxBuffer,
}) => {
  return {
    canvasWidth: absDx + boundingBoxBuffer.horizontal * 2,
    canvasHeight: absDy + boundingBoxBuffer.vertical * 2,
  };
};

export const calculateControlPoints = ({
  boundingBoxElementsBuffer,
  dx,
  dy,
  absDx,
  absDy,
}) => {
  const boundingBoxBuffer = {
    horizontal: boundingBoxElementsBuffer + absDx / 10,
    vertical: boundingBoxElementsBuffer + absDy / 10,
  };

  const p1 = { x: boundingBoxBuffer.horizontal, y: boundingBoxBuffer.vertical };
  const p4 = {
    x: boundingBoxBuffer.horizontal + absDx,
    y: boundingBoxBuffer.vertical + absDy,
  };

  const curve = absDx < absDy ? absDx / 2 : absDy / 2;
  const p2 = { x: p1.x, y: p1.y + curve * (dy / absDy) };
  const p3 = { x: p4.x, y: p4.y - curve * (dy / absDy) };

  return { p1, p2, p3, p4, boundingBoxBuffer };
};
