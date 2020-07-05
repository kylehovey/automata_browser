import React, { useState } from 'react';
import '../node_modules/react-vis/dist/style.css';
import './App.css';

import { maxRuleNumber, nameForRuleNumber } from './lib/ca';

import RuleInput from './components/input/ruleInput';
import Terrarium from './components/terra/terrarium';
import ComplexityChart from './components/charts/complexityChart';
import UMAPSelect from './components/charts/umapSelect';

import rule667 from './data/667.json';
import UMAPEmbedding from './data/embedding.json';

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
          <div className="label-container">
            <div className="row">
              Rule Number: <span className="thicc">{ruleNumber}</span>
            </div>
            <div className="row">
              Canonical Name: <span className="thicc">
                {nameForRuleNumber(ruleNumber)}
              </span>
            </div>
          </div>
          <RuleInput ruleNumber={ruleNumber} onChange={setRuleNumber} />
          <button className="chungus" onClick={methods.randomizeRule}>
            Random Rule
          </button>
          <UMAPSelect
            width="300px"
            height="300px"
            embedding={neighborhood}
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
