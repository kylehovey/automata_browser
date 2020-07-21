import React, { useState } from 'react';
import '../node_modules/react-vis/dist/style.css';
import './App.css';

import { maxRuleNumber, nameForRuleNumber } from './lib/ca';

import RuleInput from './components/input/ruleInput';
import Terrarium from './components/terra/terrarium';
import UMAPSelect from './components/charts/umapSelect';

import rule667 from './data/667.json';
import UMAPEmbedding from './data/embedding.json';

const unWrapNumeric = method => fn => ({
  [method]: ({ target }) => {
    const value = parseInt(target.value, 10);

    if (isNaN(value)) {
      fn(0);
    } else {
      fn(value);
    }
  }
});

const App = () => {
  const [ ruleNumber, setRuleNumber ] = useState(6152);
  const [ neighborhood, setNeighborhood ] = useState([]);
  const [ initialProbability, setInitialProbability ] = useState(50);

  const methods = {
    randomizeRule() {
      setRuleNumber(parseInt(Math.random() * maxRuleNumber, 10));
    },
    setRuleState({ rule, neighborhood }) {
      setRuleNumber(rule);
      setNeighborhood(neighborhood);
    },
    ...unWrapNumeric`onInitialProbabilityChange`(setInitialProbability),
    ...unWrapNumeric`onRuleNumberChange`((ruleNumber) => {
      if (ruleNumber < 0) {
        setRuleNumber(0);
      } else if (ruleNumber > maxRuleNumber) {
        setRuleNumber(maxRuleNumber);
      } else {
        setRuleNumber(ruleNumber);
      }
    }),
  };

  return (
    <div className="container">
      <div className="row">
        <div className="column full">
          <h1>UMAP Embedding of Life-Like CA - Data Explorer</h1>
        </div>
      </div>
      <div className="row">
        <div className="column third">
          <UMAPSelect
            width="400px"
            height="400px"
            embedding={UMAPEmbedding}
            ruleNumber={ruleNumber}
            onChange={methods.setRuleState}
            relativeLeft="6%"
            relativeTop="30px"
          />
        </div>
        <div className="column third">
          <div className="label-container">
            <div className="row">
              Rule Number: <input
                value={ruleNumber === 0 ? '' : ruleNumber}
                onChange={methods.onRuleNumberChange}
                style={{ width: "50px" }}
              />
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
            relativeLeft="16%"
            relativeTop="20px"
          />
        </div>
        <div className="column third">
          <Terrarium
            width={100}
            height={100}
            cellSize={4}
            ruleNumber={ruleNumber}
            initialProbability={initialProbability}
          />
          <div className="label-container">
            <div className="row">
              Initial probability of cell life: <input
                style={{ width: "20px" }}
                value={initialProbability === 0 ? '' : initialProbability}
                onChange={methods.onInitialProbabilityChange}
              />
              <span>%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
