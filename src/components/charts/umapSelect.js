import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

const UMAPSelect = ({
  embedding,
  ruleNumber,
  neighborDist = 5,
  onChange = () => {},
  width = "700px",
  height = "700px",
  pointSize = 1,
  alpha = 0.2,
} = {}) => {
  const [ canvas, setCanvas ] = useState(null);
  const [ backboard, setBackboard ] = useState(null);

  const $ = (...truths) => method => fn => ({
    [method]: (...args) => truths.every(t => t) ? fn(...args) : undefined,
  });

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
    pointsWithin(range, [ x, y ]) {
      return embedding.filter(
        ({ loc: [ u, v ] }) => (
          Math.abs(x - u) < range && Math.abs(y - v) < range
        ),
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
    dataForRule(ruleNumber) {
      return embedding.find(({ rule }) => rule === ruleNumber);
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
    ...$(backboard)`asUserSpace`(([ u, v ]) => {
      const [ left, right, bottom, top ] = extrema;
      const imageWidth = right - left;
      const imageHeight = top - bottom;
      const userWidth = backboard.width;
      const userHeight = backboard.height;

      return [
        userWidth * ((u - left) / imageWidth),
        userHeight * (1 - ((v - bottom) / imageHeight)),
      ];
    }),
    ...$(backboard)`asImageDistance`((pixels) => {
      const [ left, right ] = extrema;
      const imageWidth = right - left;
      const userWidth = backboard.width;

      return pixels * imageWidth / userWidth;
    }),
    ...$(backboard)`asUserDistance`((units) => {
      const [ left, right ] = extrema;
      const imageWidth = right - left;
      const userWidth = backboard.width;

      return units * userWidth / imageWidth;
    }),
    ...$(backboard)`onCanvasClick`(({ clientX, clientY }) => {
      const { left, top } = backboard.getBoundingClientRect();
      const userClicked = [ clientX - left, clientY - top ];
      const imageClicked = methods.asImageSpace(userClicked);

      methods.onImageClick(imageClicked);
    }),
    onImageClick(loc) {
      const { rule, loc: imageFound } = methods.closestPointTo(loc);
      const radius = methods.asImageDistance(neighborDist);
      const neighborhood = methods.pointsWithin(radius, imageFound);
      const userFound = methods.asUserSpace(imageFound);

      methods.drawSelected(loc);

      onChange({ rule, neighborhood });
    },
    colorFor(t, _alpha = 1) {
      const dandelion = [ 242, 235, 65 ];
      const burgundy = [ 255, 0, 0 ];
      const s = 1 - t;

      const [ R, G, B ] = burgundy.map(
        (val, i) => t * val + s * dandelion[i]
      );

      return `rgb(${R}, ${G}, ${B}, ${_alpha})`;
    },
    ...$(backboard)`clearBackboard`(() => {
      backboard.getContext("2d").clearRect(
        0,
        0,
        backboard.width,
        backboard.height
      );
    }),
    ...$(canvas)`clearCanvas`(() => {
      canvas.getContext("2d").clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }),
    drawPoint([ x, y ], color = "#FFF", size = 1, target = canvas) {
      if (target !== null) {
        const targetContext = target.getContext("2d");

        targetContext.fillStyle = color;
        targetContext.lineWidth = 2;
        targetContext.beginPath();
        targetContext.arc(x, y, size, 0, 2 * Math.PI);
        targetContext.fill();
      }
    },
    ...$(context)`drawCrosshairsAt`(([ x, y ], color = "#FFF", width = 3) => {
      context.strokeStyle = color;
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }),
    ...$(context)`drawCircleAbout`(([ x, y ], color = "#FFF", size = 5) => {
      context.strokeStyle = color;
      context.beginPath();
      context.arc(x, y, size, 0, 2 * Math.PI);
      context.stroke();
    }),
    ...$(backboard)`drawNebula`(() => {
      const maxDiff = Math.min(...embedding.map(({ diff }) => diff));

      embedding.forEach(({ loc, diff }) => {
        methods.drawPoint(
          methods.asUserSpace(loc),
          methods.colorFor(Math.abs(diff) / Math.abs(maxDiff), alpha),
          pointSize,
          backboard,
        );
      });
    }),
    ...$(backboard, canvas)`drawSelected`((loc) => {
      const userLoc = methods.asUserSpace(loc);

      methods.clearCanvas();
      methods.drawCrosshairsAt(userLoc);
      methods.drawCircleAbout(userLoc, "skyblue");
    }),
    ...$(backboard, canvas)`onRuleSelect`((ruleNumber) => {
      const found = methods.dataForRule(ruleNumber);

      if (found) {
        const { loc } = found;

        methods.onImageClick(loc);
      }
    }),
  };

  useEffect(() => methods.onRuleSelect(ruleNumber), [ruleNumber]);
  useEffect(() => {
    methods.clearBackboard();
    methods.drawNebula();
    methods.onRuleSelect(ruleNumber);
  }, [backboard, embedding]);

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
  ruleNumber: PropTypes.number.isRequired,
  neighborDist: PropTypes.number,
  onChange: PropTypes.func,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default UMAPSelect;
