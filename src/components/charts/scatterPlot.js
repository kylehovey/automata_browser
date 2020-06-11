import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
  MarkSeries,
} from 'react-vis';

const ScatterPlot = ({ data }) => {
  const methods = {
    get formattedData() {
      return data.map(([ x, y ]) => ({ x, y }));
    },
  };

  return (
    <XYPlot width={400} height={400}>
      <XAxis />
      <YAxis />
      <HorizontalGridLines />
      <VerticalGridLines />
      <MarkSeries
        data={methods.formattedData}
        stroke="white"
        opacity={0.5}
      />
    </XYPlot>
  );
};

ScatterPlot.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.number)
  ).isRequired,
};

export default ScatterPlot;
