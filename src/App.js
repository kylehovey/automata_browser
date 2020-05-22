import React, { useState } from 'react';
import '../node_modules/react-vis/dist/style.css';
import './App.css';

import { nameForRuleNumber, maxRuleNumber } from './lib/ca.js';

import Terrarium from './components/terra/terrarium';
import ComplexityChart from './components/charts/complexityChart';

import rule667 from './data/667.json';

const App = () => {
  const [ ruleNumber, setRuleNumber ] = useState(6152);
  const [ complexityHistory, setComplexityHistory ] = useState([]);

  const methods = {
    onRuleNumberChange({ target }) {
      setRuleNumber(target.value);
    },
    randomizeRule() {
      setRuleNumber(parseInt(Math.random() * maxRuleNumber, 10));
    },
    onComplexityChange(complexity) {
      setComplexityHistory(complexity);
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
      <input
        type="number"
        value={ruleNumber}
        onChange={methods.onRuleNumberChange}
      />
      <span>{nameForRuleNumber(ruleNumber)}</span>
      <Terrarium
        width={100}
        height={100}
        cellSize={5}
        ruleNumber={ruleNumber}
        onComplexityChange={methods.onComplexityChange}
      />
      <ComplexityChart title="Simulation Complexity:" report={report} />
      <ComplexityChart title="Data Readout:" report={rule667} />
    </div>
  );
};

export default App;
