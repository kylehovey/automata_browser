import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import UMAPImage from '../../images/umap.png';
import UMAPEmbedding from '../../data/embedding.json';

const extrema = UMAPEmbedding.reduce(
  ([ l, r, b, t ], { loc: [ x, y ] }) => [
    x < l ? x : l,
    x > r ? x : r,
    y < b ? y : b,
    y > t ? y : t,
  ],
  [ 1, -1, 1, -1 ].map(sign => sign * Infinity),
);

const UMAPSelect = ({
  onChange = () => {},
  width = "700px",
  height = "700px",
} = {}) => {
  const [ canvas, setCanvas ] = useState(null);

  const methods = {
    metric([ x, y ], [ u, v ]) {
      return Math.sqrt((x - u)**2 + (y - v)**2);
    },
    closestPointTo(loc) {
      return UMAPEmbedding.reduce(
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
      const userWidth = canvas.width;
      const userHeight = canvas.height;

      return [
        left + (x / userWidth) * imageWidth,
        bottom + imageHeight * (1 - y / userHeight),
      ];
    },
    asUserSpace([ u, v ]) {
      const [ left, right, bottom, top ] = extrema;
      const imageWidth = right - left;
      const imageHeight = top - bottom;
      const userWidth = canvas.width;
      const userHeight = canvas.height;

      return [
        userWidth * ((u - left) / imageWidth),
        userHeight * (1 - ((v - bottom) / imageHeight)),
      ];
    },
    onCanvasClick({ clientX, clientY }) {
      const userClicked = [ clientX, clientY ];
      const imageClicked = methods.asImageSpace(userClicked);

      const { rule, loc: imageFound } = methods.closestPointTo(imageClicked);
      const userFound = methods.asUserSpace(imageFound);

      onChange(rule);

      methods.drawPoint(userClicked, "white", 3);
      methods.drawPoint(userFound, "salmon", 3);
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
      const context = canvas.getContext("2d");

      context.fillStyle = "black";
      context.fillRect(0, 0, canvas.width, canvas.height);
    },
    drawPoint([ x, y ], color = "#FFF", size = 1) {
      const context = canvas.getContext("2d");

      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, size, 0, 2 * Math.PI);
      context.fill();
    },
    drawNebula() {
      if (canvas !== null) {
        methods.clearCanvas();

        const maxDiff = Math.min(...UMAPEmbedding.map(({ diff }) => diff));

        UMAPEmbedding.forEach(({ loc, diff }) => {
          methods.drawPoint(
            methods.asUserSpace(loc),
            methods.colorFor(Math.abs(diff) / Math.abs(maxDiff), 0.2),
          );
        });
      }
    },
  };

  useEffect(methods.drawNebula, [canvas]);

  return (
    <canvas
      style={{
        backgroundColor: "black",
        padding: "10px",
      }}
      width={width}
      height={height}
      ref={setCanvas}
      onClick={methods.onCanvasClick}
    />
  );
};

UMAPSelect.propTypes = {
  onChange: PropTypes.func,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default UMAPSelect;
