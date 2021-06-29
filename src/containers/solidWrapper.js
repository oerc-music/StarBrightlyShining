import React, { useState } from 'react';
import data from '@solid/query-ldflex';

import { 
  LoginButton,
  LogoutButton,
  Value, 
  LoggedIn, 
  LoggedOut, 
  useLDflexValue, 
} from '@solid/react';

import App from './app';

export default function SolidWrapper(props) {
    data.context.extend({
      trompa: "http://vocab.trompamusic.eu/vocab#"
    })
    const userPOD = useLDflexValue('user.storage');

    return(
      <div id="authWrapper">
        <LoggedOut>
            <div>
                <p><LoginButton popup="auth-popup.html">Log in with Solid</LoginButton></p>
            </div>
        </LoggedOut>
        <LoggedIn>
          { typeof userPOD !== "undefined"
						? <App submitUri={ `${userPOD}public/` } {...props} />
           : <div>Loading... </div>
          }
          <footer>You are logged in as <Value src="user.name"/>
					        <LogoutButton>Log out</LogoutButton> </footer>
        </LoggedIn>
      </div>
    )
}
