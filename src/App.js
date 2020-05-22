import React, { useState } from 'react';
import '../node_modules/react-vis/dist/style.css';
import './App.css';

import { nameForRuleNumber, maxRuleNumber } from './lib/ca.js';

import Terrarium from './components/terra/terrarium';
import EntropyChart from './components/charts/entropyChart';

import rule667 from './data/667.json';

const App = () => {
  const [ ruleNumber, setRuleNumber ] = useState(6152);

  const methods = {
    onRuleNumberChange({ target }) {
      setRuleNumber(target.value);
    },
    randomizeRule() {
      setRuleNumber(parseInt(Math.random() * maxRuleNumber, 10));
    },
  };

  return (
    <div>
      <h1>Entropy Exploration</h1>
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
      />
      <EntropyChart report={rule667} />
    </div>
  );
};

export default App;
