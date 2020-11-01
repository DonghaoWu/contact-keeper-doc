import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import ContactState from './context/contact/ContactState';
import AuthState from './context/auth/AuthState';
import AlertsState from './context/alert/AlertsState';

ReactDOM.render(
  <React.StrictMode>
    <AuthState>
      <ContactState>
        <AlertsState>
          <App />
        </AlertsState>
      </ContactState>
    </AuthState>
  </React.StrictMode>,
  document.getElementById('root')
);
