"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = Value;

var _react = _interopRequireDefault(require("react"));

var _useLDflex = _interopRequireDefault(require("../hooks/useLDflex"));

/** Displays the value of a Solid LDflex expression. */
function Value({
  src,
  children
}) {
  const [value, pending, error] = (0, _useLDflex.default)(src); // Render stringified value

  if (value !== undefined && value !== null) return `${value}`; // Render pending state
  else if (pending) return children || /*#__PURE__*/_react.default.createElement("span", {
      className: "solid value pending"
    }); // Render error state
    else if (error) return children || /*#__PURE__*/_react.default.createElement("span", {
        className: "solid value error",
        "data-error": error.message
      }); // Render empty value
      else return children || /*#__PURE__*/_react.default.createElement("span", {
          className: "solid value empty"
        });
}