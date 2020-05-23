import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { register, nameForRuleNumber } from '../../lib/ca';

// TODO: Allow for more than one (id)
const Terrarium = ({
  width,
  height,
  cellSize,
  ruleNumber,
  onComplexityChange = () => {},
} = {}) => {
  const [ board, setBoard ] = useState(null);
  const [ started, setStarted ] = useState(false);

  // Needs to be a ref for Terra animation callback side-effect
  const complexity = useRef([]);

  const withBoard = name => fn => ({
    [name](...args) {
      if (board === null) return;
      return fn(...args);
    },
  });

  const methods = {
    ...withBoard`randomize`(() => {
      board.grid = board.makeGrid(nameForRuleNumber(ruleNumber));
      board.draw();

      setStarted(false);
      setBoard(board);
      methods.resetComplexity();
      methods.updateComplexity();
    }),
    ...withBoard`animate`(() => board.animate(methods.updateComplexity)),
    ...withBoard`pause`(() => board.stop()),
    ...withBoard`step`(() => board.animate(1, methods.updateComplexity)),
    resetComplexity() {
      complexity.current = [];
    },
    updateComplexity() {
      methods.canvas.toBlob(
        ({ size }) => {
          complexity.current = [...complexity.current, size];
          onComplexityChange(complexity.current);
        },
        'image/png',
        1,
      );
    },
    get canvas() {
      return document.getElementById("terrarium");
    },
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
        periodic: true,
      }
    );

    const canvas = document.getElementById('terrarium');
    document.getElementById('terrarium-container').appendChild(canvas);

    setBoard(board);
    methods.updateComplexity();
  }, []);

  useEffect(methods.randomize, [board]);

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
    methods.randomize();
  }, [ruleNumber]);

  return (
    <div className="terrarium">
      <div id="terrarium-container" />
      <div>
        {methods.toggleButton}
        <button onClick={methods.step} disabled={started}>Step</button>
        <button onClick={methods.randomize}>Randomize</button>
      </div>
    </div>
  )
};

Terrarium.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  cellSize: PropTypes.number.isRequired,
  ruleNumber: PropTypes.number.isRequired,
  onComplexityChange: PropTypes.func,
};

export default Terrarium;
