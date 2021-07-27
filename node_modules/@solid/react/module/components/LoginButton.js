import React from 'react';
import auth from 'solid-auth-client';
/** Button that lets the user log in with Solid. */

export default function LoginButton({
  popup,
  children = 'Log in',
  className = 'solid auth login'
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: className,
    onClick: () => auth.popupLogin({
      popupUri: popup
    })
  }, children);
}