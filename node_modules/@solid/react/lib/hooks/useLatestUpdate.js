"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = useLatestUpdate;

var _react = require("react");

var _UpdateTracker = _interopRequireDefault(require("../UpdateTracker"));

/**
 * Hook that subscribes to updates on the given resources,
 * returning the latest update as `{ timestamp, url }`.
 */
function useLatestUpdate(...urls) {
  const [latestUpdate, setLatestUpdate] = (0, _react.useState)({});
  (0, _react.useDebugValue)(latestUpdate.timestamp || null);
  (0, _react.useEffect)(() => {
    const tracker = new _UpdateTracker.default(setLatestUpdate);
    tracker.subscribe(...urls);
    return () => tracker.unsubscribe(...urls);
  }, urls);
  return latestUpdate;
}