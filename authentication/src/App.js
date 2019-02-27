import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import AuthPage from './components/AuthForm/AuthForm';
import AuthContext from './auth-context';
import UsersPage from './components/Users';
import './App.css';

class App extends Component {
  state = {
    email: null,
    userId: null
  }
  login = ({email, id: userId}) => {
    this.setState({email, userId})
    localStorage.setItem('email', email);
  }
  logout = () => {
    this.setState({email: null, userId: null});
    localStorage.clear('email');
  }

  render() {
    return (
      <div className="App">
        <AuthContext.Provider value={{email: this.state.email, userId: this.state.userId, login: this.login, logout: this.logout}}>
          <Switch>
            <Redirect from="/" exact to="/authenticate" />
            <Route path="/authenticate" component={AuthPage} />
            <Route path="/users" component={UsersPage} />
            <Redirect to="/authenticate" />
          </Switch>
        </AuthContext.Provider>
      </div>
    );
  }
}

export default App;
