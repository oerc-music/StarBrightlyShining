"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = ActivityButton;
exports.customActivityButton = customActivityButton;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireWildcard(require("react"));

var _queryLdflex = _interopRequireDefault(require("@solid/query-ldflex"));

var _util = require("../util");

var _useLDflexValue = _interopRequireDefault(require("../hooks/useLDflexValue"));

const {
  as
} = _queryLdflex.default.context;
/**
 * Button that displays whether the user has performed an activity;
 * when clicked, performs the activity.
 */

function ActivityButton({
  activityType = `${as}Like`,
  object = `[${window.location.href}]`,
  children,
  shortName = /\w*$/.exec(activityType)[0],
  className = `solid activity ${shortName.toLowerCase()}`,
  activateText = shortName,
  deactivateText = activateText,
  activateLabel = children ? [activateText, ' ', children] : activateText,
  deactivateLabel = children ? [deactivateText, ' ', children] : deactivateText,
  ...props
}) {
  // Look up a possibly existing activity
  object = (0, _util.srcToLDflex)(object);
  const [exists, setExists] = (0, _react.useState)();
  const activity = (0, _useLDflexValue.default)(`${object}.findActivity("${activityType}")`);
  if (exists === undefined && activity) setExists(true); // Creates a new activity (if none already exists)

  async function toggleActivity() {
    // Optimistically display the result
    setExists(!exists);

    try {
      // Try performing the action
      const action = !exists ? 'create' : 'delete';
      await _queryLdflex.default.resolve(`${object}.${action}Activity("${activityType}")`); // Confirm the result (in case a concurrent action was pending)

      setExists(!exists);
    } catch (error) {
      // Revert to the previous state
      setExists(exists);
      console.warn('@solid/react-components', error);
    }
  } // Return the activity button


  className = `${className} ${exists ? 'performed' : ''}`;
  return /*#__PURE__*/_react.default.createElement("button", (0, _extends2.default)({
    className: className,
    onClick: toggleActivity
  }, props), exists ? deactivateLabel : activateLabel);
} // Internal helper for creating custom activity buttons


function customActivityButton(type, activate, deactivate, deactivateNoChildren) {
  const activityType = `${as}${type}`;
  return ({
    object,
    children = object ? null : 'this page',
    activateText = activate,
    deactivateText = children ? deactivate : deactivateNoChildren,
    ...props
  }) => /*#__PURE__*/_react.default.createElement(ActivityButton, (0, _extends2.default)({}, props, {
    activityType,
    object,
    children,
    activateText,
    deactivateText
  }));
}