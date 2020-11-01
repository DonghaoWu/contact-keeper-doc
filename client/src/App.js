import { Fragment, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alerts from './components/layout/Alerts';
import PrivateRoute from './components/routing/PrivateRoute';

import AuthContext from './context/auth/AuthContext';
import setAuthToken from './utils/setAuthToken';

import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {

  const { loadUser } = useContext(AuthContext);
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line 
  }, [])

  return (
    <Router>
      <Fragment>
        <Navbar />
        <Alerts />
        <div className="container">
          <Switch>
            <PrivateRoute exact path='/' component={Home} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
          </Switch>
        </div>
      </Fragment>
    </Router>
  );
}

export default App;
