import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  XYPlot,
  XAxis,
  YAxis,
  LineSeries,
  HorizontalGridLines,
  VerticalGridLines,
} from 'react-vis';

import { RuleReport } from '../../types/data';

const asVis = (data) => data.map((y, x) => ({ x, y }));
const asKb = (data) => data.map(sizeInBytes => (sizeInBytes / 1000).toFixed(2));

const ComplexityChart = ({ report, title }) => {
  const methods = {
    get series() {
      const { ruleNumber, data } = report;

      return data
        .map(trial => asKb(trial))
        .map(trial => asVis(trial))
        .map((data, trialNumber) => (
          <LineSeries
            key={`rule-${ruleNumber}-trial-${trialNumber}`}
            data={data}
            curve="curveMonotoneX"
          />
        ));
    }
  };
  return (
    <div>
      <h3>{title}</h3>
      <XYPlot height={300} width={800}>
        <XAxis title="Trial" />
        <YAxis title="Filesize (bytes)" />
        <HorizontalGridLines />
        <VerticalGridLines />
        {methods.series}
      </XYPlot>
    </div>
  );
};

ComplexityChart.propTypes = {
  report: RuleReport.isRequired,
  title: PropTypes.string.isRequired,
};

export default ComplexityChart;
