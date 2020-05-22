import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { register, nameForRuleNumber } from '../../lib/ca.js';

import ComplexityChart from '../charts/complexityChart';

// TODO: Allow for more than one (id)
const Terrarium = ({
  width,
  height,
  cellSize,
  ruleNumber,
}) => {
  const [ board, setBoard ] = useState(null);
  const [ started, setStarted ] = useState(false);
  const [ complexity, setComplexity ] = useState([]);

  const complexityRef = useRef(complexity);

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
      setComplexity([]);
    }),
    ...withBoard`animate`(() => board.animate(methods.updateComplexity)),
    ...withBoard`pause`(() => board.stop()),
    ...withBoard`step`(() => board.animate(1, methods.updateComplexity)),
    updateComplexity() {
      methods.canvas.toBlob(
        ({ size }) => setComplexity([...complexityRef.current, size]),
        'image/png',
        1,
      );
    },
    get canvas() {
      return document.getElementById("terrarium");
    },
    get complexityReadout() {
      const report = {
        ruleNumber,
        data: [complexity],
      };

      return <ComplexityChart report={report} />;
    },
    get toggleButton() {
      return (
        <button onClick={() => setStarted(!started)}>
          {started ? 'stop' : 'start'}
        </button>
      );
    },
  };

  useEffect(() => {
    complexityRef.current = complexity;
  }, [complexity]);

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
    setComplexity([]);
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
    <div>
      <div>
        {methods.toggleButton}
        <button onClick={methods.step} disabled={started}>Step</button>
        <button onClick={methods.randomize}>Randomize</button>
      </div>
      {methods.complexityReadout}
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
