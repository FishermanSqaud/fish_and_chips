import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Index from "views/Index.js";
import LoginPage from "views/LoginPage";
import SignUpPage from "views/SignUpPage"

import { Provider } from "mobx-react";
import Store from './store/store';
import AdminPage from "./views/AdminPage"

import "assets/css/material-dashboard-react.css?v=1.9.0";

const store = new Store();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Switch>
          <Route path="/admin" render={props => <AdminPage {...props} />} />
          <Route path="/signUp" render={props => <SignUpPage {...props} />} />
          <Route path="/signIn" render={props => <LoginPage {...props}/>} />
          <Route path="/" render={props => <Index {...props} />} />
          <Redirect to="/" />
        </Switch>
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
