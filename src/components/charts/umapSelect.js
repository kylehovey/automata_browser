import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import UMAPImage from '../../images/umap.png';
import UMAPEmbedding from '../../data/embedding.json';

const UMAPSelect = ({ onChange = () => {} } = {}) => {
  const [ canvas, setCanvas ] = useState(null);
  const [ extrema, setExtrema ] = useState(null);
  const [ imageInitialized, setImageInitialized ] = useState(false);

  const methods = {
    metric([ x, y ], [ u, v ]) {
      return Math.sqrt((x - u)**2 + (y - v)**2);
    },
    closestPointTo(loc) {
      return UMAPEmbedding.reduce(
        (
          { embedding: bestLoc, ...bestRest },
          { embedding: hereLoc, ...hereRest },
        ) => methods.metric(hereLoc, loc) < methods.metric(bestLoc, loc)
          ? { embedding: hereLoc, ...hereRest }
          : { embedding: bestLoc, ...bestRest },
        { embedding: [ Infinity, Infinity ] },
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
    onImageLoad({ target: img }) {
      const context = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      setExtrema(
        UMAPEmbedding.reduce(
          ([ l, r, b, t ], { embedding: [ x, y ] }) => [
            x < l ? x : l,
            x > r ? x : r,
            y < b ? y : b,
            y > t ? y : t,
          ],
          [ 1, -1, 1, -1 ].map(sign => sign * Infinity),
        )
      );

      setImageInitialized(true);
    },
    onCanvasClick({ clientX, clientY }) {
      const { left, top } = canvas.getBoundingClientRect();
      const userClicked = [ clientX - left, clientY - top ];
      const imageClicked = methods.asImageSpace(userClicked);

      const { rule, embedding: imageFound } = methods.closestPointTo(imageClicked);
      const userFound = methods.asUserSpace(imageFound);

      methods.drawPoint(userClicked);
      methods.drawPoint(userFound, "salmon");
    },
    drawPoint([ x, y ], color = "#FFF") {
      const context = canvas.getContext("2d");
      const { left, top } = canvas.getBoundingClientRect();

      context.fillStyle = color;
      context.beginPath();
      context.arc(x - left, y - top, 5, 0, 2 * Math.PI);
      context.fill();
    },
    get imageStyle() {
      return imageInitialized ? { display: "none" } : {};
    },
  };


  /**
   * TODO DEBUG DELETE
   */
  useEffect(() => {
    if (extrema !== null) {
      methods.drawPoint(methods.asUserSpace([
        21.7599,
        7.09447,
      ]), "salmon");
    }
  }, [extrema]);

  return (
    <>
      <canvas ref={setCanvas} onClick={methods.onCanvasClick} />
      <img
        style={methods.imageStyle}
        width="1000px"
        src={UMAPImage}
        onLoad={methods.onImageLoad}
      />
    </>
  );
};

UMAPSelect.propTypes = {
  onChange: PropTypes.func,
};

export default UMAPSelect;
