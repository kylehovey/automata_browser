import React, { useState } from 'react';
import './App.css';

import Terrarium from './components/terra/terrarium';
import { nameForRuleNumber } from './lib/ca.js';

const App = () => {
  const [ ruleNumber, setRuleNumber ] = useState(6152);

  const methods = {
    onRuleNumberChange({ target }) {
      setRuleNumber(target.value);
    },
  };

  return (
    <div>
      <h1>Entropy Exploration</h1>
      <hr />
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
