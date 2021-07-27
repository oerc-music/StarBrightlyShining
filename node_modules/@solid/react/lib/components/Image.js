"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = Image;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _useLDflexValue = _interopRequireDefault(require("../hooks/useLDflexValue"));

/** Displays an image whose source is a Solid LDflex expression. */
function Image({
  src,
  defaultSrc,
  children = null,
  ...props
}) {
  src = (0, _useLDflexValue.default)(src) || defaultSrc;
  return src ? /*#__PURE__*/_react.default.createElement("img", (0, _extends2.default)({
    src: src,
    alt: ""
  }, props)) : children;
}