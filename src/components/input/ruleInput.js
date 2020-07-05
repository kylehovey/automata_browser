import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { ruleFor } from '../../lib/ca';

const RuleInput = ({
  ruleNumber = 0,
  onChange = () => {},
} = {}) => {
  const rule = ruleFor(ruleNumber);

  const methods = {
    countButtons(isBirth) {
      return Array(9).fill().map(
        (_, neighbors) =>  {
          const selected = rule(neighbors, !isBirth) ? ' selected' : '';

          return (
            <td
              className={`bit-button${selected}`}
              onClick={() => methods.toggleBit(neighbors, isBirth)}
              key={`${isBirth ? 'B' : 'S'}-${neighbors}`}
            >
              {neighbors}
            </td>
          )
        }
      );
    },
    toggleBit(neighbors, isBirth) {
      const mask = 1 << neighbors + (isBirth ? 0 : 9);
      onChange(ruleNumber ^ mask);
    },
  };

  return (
    <div className="rule-input">
      <table>
        <tbody>
          <tr>
            <td className="label">B:</td>
            {methods.countButtons(true)}
          </tr>
          <tr>
            <td className="label">S:</td>
            {methods.countButtons(false)}
          </tr>
        </tbody>
      </table>
    </div>
  )
};

RuleInput.propTypes = {
  ruleNumber: PropTypes.number,
  onChange: PropTypes.func,
};

export default RuleInput;
