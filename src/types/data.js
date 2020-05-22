import PropTypes from 'prop-types';

export const RuleData = PropTypes.arrayOf(
  PropTypes.arrayOf(
    PropTypes.number,
  ),
);

export const RuleReport = PropTypes.shape({
  ruleNumber: PropTypes.number.isRequired,
  data: RuleData.isRequired,
});
