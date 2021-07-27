"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = AuthButton;

var _react = _interopRequireDefault(require("react"));

var _LoginButton = _interopRequireDefault(require("./LoginButton"));

var _LogoutButton = _interopRequireDefault(require("./LogoutButton"));

var _useLoggedIn = _interopRequireDefault(require("../hooks/useLoggedIn"));

/** Button that lets the user log in or out with Solid.  */
function AuthButton({
  login,
  logout,
  ...props
}) {
  return (0, _useLoggedIn.default)() ? /*#__PURE__*/_react.default.createElement(_LogoutButton.default, props, logout) : /*#__PURE__*/_react.default.createElement(_LoginButton.default, props, login);
}