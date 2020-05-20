import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { register, nameForRuleNumber } from '../../lib/ca.js';

// TODO: Allow for more than one (id)
const Terrarium = ({
  width,
  height,
  cellSize,
  ruleNumber,
}) => {
  const [ board, setBoard ] = useState(null);
  const [ started, setStarted ] = useState(false);
  const withBoard = name => fn => ({
    [name](...args) {
      if (board === null) return;
      return fn(...args);
    },
  });

  const methods = {
    ...withBoard`randomize`(() => {
      board.grid = board.makeGrid(nameForRuleNumber(ruleNumber));
      board.animate(1);
      setBoard(board);
    }),
    ...withBoard`animate`(() => board.animate()),
    ...withBoard`pause`(() => board.stop()),
    get toggleButton() {
      return (
        <button onClick={() => setStarted(!started)}>
          {started ? 'stop' : 'start'}
        </button>
      );
    },
  };

  // Initialize the board on mount
  useEffect(() => {
    const board = new window.terra.Terrarium(
      width,
      height,
      {
        id: 'terrarium',
        cellSize: cellSize,
        trails: 0,
        background: [0, 0, 0],
      }
    );

    const canvas = document.getElementById('terrarium');
    document.getElementById('terrarium-container').appendChild(canvas);

    setBoard(board);
  }, []);

  // Start and stop the board on started change
  useEffect(() => {
    if (started) {
      methods.animate();
    } else {
      methods.pause();
    }
  }, [started]);

  useEffect(() => {
    register(ruleNumber);
  }, [ruleNumber]);

  return (
    <div>
      {methods.toggleButton}
      <button onClick={methods.randomize}>Randomize</button>
      <div id="terrarium-container"></div>
    </div>
  )
};

Terrarium.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  cellSize: PropTypes.number.isRequired,
  ruleNumber: PropTypes.number.isRequired,
};

export default Terrarium;
