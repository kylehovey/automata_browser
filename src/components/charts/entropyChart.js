import React, { useState, useEffect } from 'react';
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

const EntropyChart = ({ report }) => {
  const methods = {
    get series() {
      const { ruleNumber, data } = report;

      return data
        .map(trial => asKb(trial))
        .map(trial => asVis(trial))
        .map((data, trialNumber) => (
          <LineSeries
            id={`rule-${ruleNumber}-trial-${trialNumber}`}
            data={data}
          />
        ));
    }
  };
  return (
    <XYPlot height={400} width={800}>
      <XAxis title="Trial" />
      <YAxis title="Filesize (bytes)" />
      <HorizontalGridLines />
      <VerticalGridLines />
      {methods.series}
    </XYPlot>
  );
};

EntropyChart.propTypes = {
  report: RuleReport.isRequired,
};

export default EntropyChart;
