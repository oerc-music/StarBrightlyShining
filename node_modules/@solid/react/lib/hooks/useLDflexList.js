"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.default = useLDflexList;

var _react = require("react");

var _useLDflex = _interopRequireWildcard(require("./useLDflex"));

/**
 * Evaluates the Solid LDflex expression into a list.
 */
function useLDflexList(expression) {
  const [items] = (0, _useLDflex.default)(expression, true);
  (0, _react.useDebugValue)(items, _useLDflex.toString);
  return items;
}