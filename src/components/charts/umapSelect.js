import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

const UMAPSelect = ({
  embedding,
  onChange = () => {},
  width = "700px",
  height = "700px",
} = {}) => {
  const [ canvas, setCanvas ] = useState(null);
  const [ backboard, setBackboard ] = useState(null);

  const context = canvas && canvas.getContext("2d");
  const extrema = useMemo(() => embedding.reduce(
    ([ l, r, b, t ], { loc: [ x, y ] }) => [
      x < l ? x : l,
      x > r ? x : r,
      y < b ? y : b,
      y > t ? y : t,
    ],
    [ 1, -1, 1, -1 ].map(sign => sign * Infinity),
  ), [embedding]);

  const methods = {
    metric([ x, y ], [ u, v ]) {
      return Math.sqrt((x - u)**2 + (y - v)**2);
    },
    pointsWithin(range, loc) {
      return embedding.filter(
        ({ loc: hereLoc, ...rest }) => methods.metric(hereLoc, loc) < range,
      );
    },
    closestPointTo(loc) {
      return embedding.reduce(
        (
          { loc: bestLoc, ...bestRest },
          { loc: hereLoc, ...hereRest },
        ) => methods.metric(hereLoc, loc) < methods.metric(bestLoc, loc)
          ? { loc: hereLoc, ...hereRest }
          : { loc: bestLoc, ...bestRest },
        { loc: [ Infinity, Infinity ] },
      );
    },
    asImageSpace([ x, y ]) {
      const [ left, right, bottom, top ] = extrema;
      const imageWidth = right - left;
      const imageHeight = top - bottom;
      const userWidth = backboard.width;
      const userHeight = backboard.height;

      return [
        left + (x / userWidth) * imageWidth,
        bottom + imageHeight * (1 - y / userHeight),
      ];
    },
    asUserSpace([ u, v ]) {
      const [ left, right, bottom, top ] = extrema;
      const imageWidth = right - left;
      const imageHeight = top - bottom;
      const userWidth = backboard.width;
      const userHeight = backboard.height;

      return [
        userWidth * ((u - left) / imageWidth),
        userHeight * (1 - ((v - bottom) / imageHeight)),
      ];
    },
    asImageDistance(pixels) {
      const [ left, right ] = extrema;
      const imageWidth = right - left;
      const userWidth = backboard.width;

      return pixels * imageWidth / userWidth;
    },
    asUserDistance(units) {
      const [ left, right ] = extrema;
      const imageWidth = right - left;
      const userWidth = backboard.width;

      return units * userWidth / imageWidth;
    },
    onCanvasClick({ clientX, clientY }) {
      const { left, top } = backboard.getBoundingClientRect();
      const userClicked = [ clientX - top, clientY - left ];
      const imageClicked = methods.asImageSpace(userClicked);

      const { rule, loc: imageFound } = methods.closestPointTo(imageClicked);
      const radius = methods.asImageDistance(5);
      console.log({ radius });
      console.log(methods.pointsWithin(radius, imageFound));
      const userFound = methods.asUserSpace(imageFound);

      onChange(rule);

      methods.clearCanvas();
      methods.drawCrosshairsAt(userFound);
      methods.drawCircleAbout(userFound, "skyblue");
    },
    colorFor(t, alpha=1) {
      const dandelion = [ 242, 235, 65 ];
      const burgundy = [ 255, 0, 0 ];
      const s = 1 - t;

      const [ R, G, B ] = burgundy.map(
        (val, i) => t * val + s * dandelion[i]
      );

      return `rgb(${R}, ${G}, ${B}, ${alpha})`;
    },
    clearCanvas() {
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    },
    drawPoint([ x, y ], color = "#FFF", size = 1, target = canvas) {
      const targetContext = target.getContext("2d");

      targetContext.fillStyle = color;
      targetContext.lineWidth = 2;
      targetContext.beginPath();
      targetContext.arc(x, y, size, 0, 2 * Math.PI);
      targetContext.fill();
    },
    drawCrosshairsAt([ x, y ], color = "#FFF", width = 3) {
      context.strokeStyle = color;
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    },
    drawCircleAbout([ x, y ], color = "#FFF", size = 5) {
      context.strokeStyle = color;
      context.beginPath();
      context.arc(x, y, size, 0, 2 * Math.PI);
      context.stroke();
    },
    drawNebula() {
      if (backboard !== null) {
        const maxDiff = Math.min(...embedding.map(({ diff }) => diff));

        embedding.forEach(({ loc, diff }) => {
          methods.drawPoint(
            methods.asUserSpace(loc),
            methods.colorFor(Math.abs(diff) / Math.abs(maxDiff), 0.2),
            1,
            backboard,
          );
        });
      }
    },
  };

  useEffect(methods.drawNebula, [backboard]);

  return (
    <div style={{ padding: "10px", position: "relative" }}>
      <canvas
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
        width={width}
        height={height}
        ref={setCanvas}
        onClick={methods.onCanvasClick}
      />
      <canvas
        style={{ backgroundColor: "black", position: "absolute", top: 0, left: 0, zIndex: 0 }}
        width={width}
        height={height}
        ref={setBackboard}
      />
    </div>
  );
};

UMAPSelect.propTypes = {
  embedding: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default UMAPSelect;
