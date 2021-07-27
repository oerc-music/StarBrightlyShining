"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncIterator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncIterator"));

var _util = require("./util");

var _queryLdflex = _interopRequireDefault(require("@solid/query-ldflex"));

const evaluatorQueue = (0, _util.createTaskQueue)();
/**
 * Evaluates a map of LDflex expressions into a singular value or a list.
 * Expressions can be changed and/or re-evaluated.
 */

class ExpressionEvaluator {
  constructor() {
    (0, _defineProperty2.default)(this, "pending", {});
    (0, _defineProperty2.default)(this, "cancel", false);
  }

  /** Stops all pending and future evaluations */
  destroy() {
    this.pending = {};
    this.cancel = true;
    evaluatorQueue.clear(this);
  }
  /** Evaluates the given singular value and list expressions. */


  async evaluate(values, lists, updateCallback) {
    // Reset the pending status and clear any errors
    updateCallback({
      pending: true,
      error: undefined
    }); // Create evaluators for each expression, and mark them as pending

    const evaluators = evaluatorQueue.schedule([...Object.entries(values).map(([key, expr]) => () => this.evaluateAsValue(key, expr, updateCallback)), ...Object.entries(lists).map(([key, expr]) => () => this.evaluateAsList(key, expr, updateCallback))], this); // Wait until all evaluators are done (or one of them errors)

    try {
      await Promise.all(evaluators);
    } catch (error) {
      updateCallback({
        error
      });
    } // Update the pending flag if all evaluators wrote their value or errored,
    // and if no new evaluators are pending


    const statuses = await Promise.all(evaluators.map(e => e.catch(error => {
      console.warn('@solid/react-components', 'Expression evaluation failed.', error);
      return true;
    }))); // Stop if results are no longer needed

    if (this.cancel) return; // Reset the pending flag if all are done and no others are pending

    if (!statuses.some(done => !done) && Object.keys(this.pending).length === 0) updateCallback({
      pending: false
    });
  }
  /** Evaluates the property expression as a singular value. */


  async evaluateAsValue(key, expr, updateCallback) {
    // Obtain and await the promise
    const promise = this.pending[key] = this.resolveExpression(expr);
    let value;

    try {
      value = await promise; // Stop if another evaluator took over in the meantime (component update)

      if (this.pending[key] !== promise) return false;
    } // Update the result and remove the evaluator, even in case of errors
    finally {
      if (this.pending[key] === promise) {
        delete this.pending[key];
        updateCallback({
          [key]: value
        });
      }
    }

    return true;
  }
  /** Evaluates the property expression as a list. */


  async evaluateAsList(key, expr, updateCallback) {
    // Read the iterable's items, throttling updates to avoid congestion
    let empty = true;
    const items = [];
    const iterable = this.pending[key] = this.resolveExpression(expr);

    const update = () => !this.cancel && updateCallback({
      [key]: [...items]
    });

    const updateQueue = (0, _util.createTaskQueue)({
      timeBetween: 100,
      drop: true
    });

    try {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;

      var _iteratorError;

      try {
        for (var _iterator = (0, _asyncIterator2.default)(iterable), _step, _value; _step = await _iterator.next(), _iteratorNormalCompletion = _step.done, _value = await _step.value, !_iteratorNormalCompletion; _iteratorNormalCompletion = true) {
          const item = _value;

          // Stop if another evaluator took over in the meantime (component update)
          if (this.pending[key] !== iterable) {
            updateQueue.clear();
            return false;
          } // Add the item and schedule an update


          empty = false;
          items.push(item);
          updateQueue.schedule(update);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            await _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } // Ensure pending updates are applied immediately, and the evaluator is removed
    finally {
      const needsUpdate = empty || updateQueue.clear();

      if (this.pending[key] === iterable) {
        delete this.pending[key];
        if (needsUpdate) update();
      }
    }

    return true;
  }
  /** Resolves the expression into an LDflex path. */


  resolveExpression(expr) {
    // Ignore an empty expression
    if (!expr) return ''; // Resolve an LDflex string expression
    else if (typeof expr === 'string') return _queryLdflex.default.resolve(expr); // Return a resolved LDflex path (and any other object) as-is
      else return expr;
  }

}

exports.default = ExpressionEvaluator;