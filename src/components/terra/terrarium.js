import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// TODO: Allow for more than one (id)
const Terrarium = ({
  width,
  height,
  cellSize,
  started,
}) => {
  useEffect(() => {
    window.terra.registerCreature({
      type: 'secondCreature',
      color: [120, 0, 240],
      sustainability: 6,
      reproduceLv: 1
    });

    window.terra.registerCreature({
      type: 'simplePlant',
      color: [166, 226, 46],
      size: 10,
      reproduceLv: 0.8,
      wait: function() { this.energy += 3; },
      move: false,
    });

    const ex1 = new window.terra.Terrarium(
      width,
      height,
      {
        id: 'terrarium',
        cellSize: cellSize
      });

    ex1.grid = ex1.makeGridWithDistribution(
      [
        ['secondCreature', 10],
        ['simplePlant', 90],
      ],
    );

    const canvas = document.getElementById('terrarium');
    document.getElementById('terrarium-container').appendChild(canvas);

    ex1.animate(300);
  });

  return (
    <div id="terrarium-container"></div>
  )
};

Terrarium.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  cellSize: PropTypes.number.isRequired,
  started: PropTypes.bool.isRequired,
};

export default Terrarium;
