"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = Link;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _Label = _interopRequireDefault(require("./Label"));

var _useLDflexValue = _interopRequireDefault(require("../hooks/useLDflexValue"));

/** Creates a link to the value of the Solid LDflex expression. */
function Link({
  href,
  children,
  ...props
}) {
  href = (0, _useLDflexValue.default)(href) || '';
  children = children || /*#__PURE__*/_react.default.createElement(_Label.default, {
    src: href && `[${href}]`
  }, `${href}`);
  return href ? /*#__PURE__*/_react.default.createElement("a", (0, _extends2.default)({
    href: href
  }, props), children) : children;
}