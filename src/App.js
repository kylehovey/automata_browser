import React, { useState } from 'react';
import './App.css';

import Terrarium from './components/terra/terrarium';

const App = () => {
  const [ started, setStarted ] = useState(false);

  const methods = {
    get toggleButton() {
      const buttonText = started ? 'stop' : 'start';

      return (
        <button onClick={() => setStarted(!started)}>
          {buttonText}
        </button>
      );
    }
  };

  return (
    <div>
      {methods.toggleButton}
      <Terrarium
        width={100}
        height={100}
        cellSize={5}
        started={started}
      />
    </div>
  );
};

export default App;
