"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.default = useLDflexValue;

var _react = require("react");

var _useLDflex = _interopRequireWildcard(require("./useLDflex"));

/**
 * Evaluates the Solid LDflex expression into a single value.
 */
function useLDflexValue(expression) {
  const [value] = (0, _useLDflex.default)(expression, false);
  (0, _react.useDebugValue)(value, _useLDflex.toString);
  return value;
}