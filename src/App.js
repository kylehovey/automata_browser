import React, { useState } from 'react';
import '../node_modules/react-vis/dist/style.css';
import './App.css';

import { maxRuleNumber } from './lib/ca';

import RuleInput from './components/input/ruleInput';
import Terrarium from './components/terra/terrarium';
import ComplexityChart from './components/charts/complexityChart';
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
  const [ neighborhood, setNeighborhood ] = useState([]);
  const [ complexityHistory, setComplexityHistory ] = useState([]);

  const methods = {
    randomizeRule() {
      setRuleNumber(parseInt(Math.random() * maxRuleNumber, 10));
    },
    setRuleState({ rule, neighborhood }) {
      setRuleNumber(rule);
      setNeighborhood(neighborhood);
    },
  };

  const report = {
    ruleNumber,
    data: [complexityHistory],
  };

  return (
    <div className="container">
      <div className="row">
        <div className="column third">
          <UMAPSelect
            width="400px"
            height="400px"
            embedding={UMAPEmbedding}
            ruleNumber={ruleNumber}
            onChange={methods.setRuleState}
          />
        </div>
        <div className="column third">
          <button onClick={methods.randomizeRule}>Random Rule</button>
          <label for="rule-number">Rule Number:</label>
          <input
            type="number"
            id="rule-number"
            value={ruleNumber}
            onChange={unWrap(setRuleNumber)}
          />
          <RuleInput ruleNumber={ruleNumber} onChange={setRuleNumber} />
          <UMAPSelect
            width="300px"
            height="300px"
            embedding={(console.log(neighborhood), neighborhood)}
            ruleNumber={ruleNumber}
            onChange={({ rule }) => setRuleNumber(rule)}
            pointSize={3}
            alpha={1}
          />
        </div>
        <div className="column third">
          <Terrarium
            width={100}
            height={100}
            cellSize={4}
            ruleNumber={ruleNumber}
            onComplexityChange={setComplexityHistory}
          />
        </div>
      </div>
      <div className="row">
        <div className="column full">
          <ComplexityChart title="Simulation Complexity:" report={report} />
        </div>
      </div>
    </div>
  );
};

export default App;
