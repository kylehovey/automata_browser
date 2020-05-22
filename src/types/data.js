import PropTypes from 'prop-types';

export const ComplexityTrial = PropTypes.arrayOf(PropTypes.number);

export const ComplexityTrials = PropTypes.arrayOf(ComplexityTrial);

export const RuleReport = PropTypes.shape({
  ruleNumber: PropTypes.number.isRequired,
  data: ComplexityTrials.isRequired,
});
