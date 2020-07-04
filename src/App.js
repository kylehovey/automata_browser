import React, { useState } from 'react';
import '../node_modules/react-vis/dist/style.css';
import './App.css';

import { maxRuleNumber } from './lib/ca';

import RuleInput from './components/input/ruleInput';
import Terrarium from './components/terra/terrarium';
import ComplexityChart from './components/charts/complexityChart';
import ScatterPlot from './components/charts/scatterPlot';
import UMAPSelect from './components/charts/umapSelect';

import rule667 from './data/667.json';
import UMAPEmbedding from './data/embedding.json';

const scatterData = Array(2**8).fill().map(
  () => [
    Math.random(),
    Math.random(),
  ],
);

const unWrap = fn => ({ target }) => fn(target.value);

const App = () => {
  const [ ruleNumber, setRuleNumber ] = useState(6152);
  const [ complexityHistory, setComplexityHistory ] = useState([]);

  const methods = {
    randomizeRule() {
      setRuleNumber(parseInt(Math.random() * maxRuleNumber, 10));
    },
  };

  const report = {
    ruleNumber,
    data: [complexityHistory],
  };

  /**
   * TODO: Delete this statement, it is for dev only.
   */
  return (
    <div style={{ margin: "50px" }}>
      <UMAPSelect
        width="750px"
        height="750px"
        embedding={UMAPEmbedding}
        ruleNumber={ruleNumber}
        onChange={setRuleNumber}
      />
    </div>
  );

  return (
    <div className="container">
      <div className="row">
        <h1>Complexity Exploration</h1>
        <hr />
      </div>
      <div className="row">
        <div className="column third">
          <button onClick={methods.randomizeRule}>
            Random Rule
          </button>
          <RuleInput ruleNumber={ruleNumber} onChange={setRuleNumber} />
          <label for="rule-number">Rule Number:</label>
          <input
            type="number"
            id="rule-number"
            value={ruleNumber}
            onChange={unWrap(setRuleNumber)}
          />
          <Terrarium
            width={100}
            height={100}
            cellSize={3}
            ruleNumber={ruleNumber}
            onComplexityChange={setComplexityHistory}
          />
        </div>
        <div className="column two-thirds">
          <ScatterPlot data={scatterData} />
          <ComplexityChart title="Simulation Complexity:" report={report} />
          <ComplexityChart title="Data Readout:" report={rule667} />
        </div>
      </div>
    </div>
  );
};

export default App;
