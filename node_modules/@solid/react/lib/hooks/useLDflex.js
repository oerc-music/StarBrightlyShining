"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = useLDflex;
exports.toString = toString;

var _react = require("react");

var _useWebId = _interopRequireDefault(require("./useWebId"));

var _useLiveUpdate = _interopRequireDefault(require("./useLiveUpdate"));

var _ExpressionEvaluator = _interopRequireDefault(require("../ExpressionEvaluator"));

const value = {
  result: undefined,
  pending: true,
  error: undefined
};
const list = {
  result: [],
  pending: true,
  error: undefined
};
const none = {};
/**
 * Evaluates the Solid LDflex expression.
 * Returns an array of [result, pending, error].
 */

function useLDflex(expression, listMode = false) {
  // The user's WebID and recent updates might influence the evaluation
  const webId = (0, _useWebId.default)();
  const latestUpdate = (0, _useLiveUpdate.default)(); // Obtain the latest expression result from the state

  const [{
    result,
    pending,
    error
  }, update] = (0, _react.useState)(listMode ? list : value);
  (0, _react.useDebugValue)(error || result, toString); // Set up the expression evaluator

  (0, _react.useEffect)(() => {
    const evaluator = new _ExpressionEvaluator.default();
    const query = {
      result: expression
    };
    evaluator.evaluate(!listMode ? query : none, listMode ? query : none, changed => update(current => ({ ...current,
      ...changed
    })));
    return () => evaluator.destroy();
  }, [expression, latestUpdate, webId && typeof expression === 'string']); // Return the state components

  return [result, pending, error];
}

function toString(object) {
  return Array.isArray(object) ? object.map(toString) : `${object}`;
}