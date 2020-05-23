import React, { useState } from 'react';
import '../node_modules/react-vis/dist/style.css';
import './App.css';

import { maxRuleNumber } from './lib/ca';

import RuleInput from './components/input/ruleInput';
import Terrarium from './components/terra/terrarium';
import ComplexityChart from './components/charts/complexityChart';

import rule667 from './data/667.json';

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

  return (
    <div>
      <h1>Complexity Exploration</h1>
      <hr />
      <button onClick={methods.randomizeRule}>
        Random Rule
      </button>
      <RuleInput ruleNumber={ruleNumber} onChange={setRuleNumber} />
      <Terrarium
        width={100}
        height={100}
        cellSize={5}
        ruleNumber={ruleNumber}
        onComplexityChange={setComplexityHistory}
      />
      <ComplexityChart title="Simulation Complexity:" report={report} />
      <ComplexityChart title="Data Readout:" report={rule667} />
    </div>
  );
};

export default App;
