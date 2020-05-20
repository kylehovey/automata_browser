import React from 'react';
import './App.css';

import Terrarium from './components/terra/terrarium';

const App = () => (
  <div>
    <h1>Entropy Exploration</h1>
    <Terrarium
      width={100}
      height={100}
      cellSize={5}
      ruleNumber={6152}
    />
  </div>
);

export default App;
