import React, { useState } from 'react';
import './App.css';

import Terrarium from './components/terra/terrarium';
import { nameForRuleNumber, maxRuleNumber } from './lib/ca.js';

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
    </div>
  );
};

export default App;
