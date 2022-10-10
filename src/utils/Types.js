import PropTypes from "prop-types";

export const nodeState = PropTypes.oneOfType([
  PropTypes.shape(),
  PropTypes.array,
  PropTypes.string,
]);

export default {
  nodeState,
};
