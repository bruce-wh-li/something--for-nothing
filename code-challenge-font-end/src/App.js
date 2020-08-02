import React from 'react';
import {
  BrowserRouter, Route, Switch, Redirect,
} from 'react-router-dom';
// import logo from './logo.svg';
import Layout from './shared/components/layout/Layout';
import LoginRegisterPage from './pages/UserPage/LoginRegistePage';
import ItemsPage from './pages/itemPage/ItemsPage';
import NewItem from './pages/itemPage/NewItemPage';
import HomePage from './pages/homePage/HomePage';
import UpdateItemPage from './pages/itemPage/UpdateItemPage';
import AuthContext from './shared/utils/context/auth-context';
import './App.css';
import useAuth from './shared/utils/hooks/auth-hook';

function App() {
  const {
    token, login, logout, userId,
  } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Layout>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/items" component={ItemsPage} />
          <Route exact path="/items/newitem" component={NewItem} />
          <Route path="/items/edit/:itemId" component={UpdateItemPage} />
          {/* <Route path="/signin" component={LoginRegisterPage} /> */}
          <Redirect to="/" />
        </Switch>
      </Layout>
    );
  } else {
    routes = (
      <Layout>

        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/items" component={ItemsPage} />
          <Route exact path="/items/newitem" component={NewItem} />
          {/* <Route path="/items/edit/:itemId" component={UpdateItemPage} /> */}
          <Route path="/signin" component={LoginRegisterPage} />
          <Redirect to="/signin" />
        </Switch>
      </Layout>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        userId,
        login,
        logout,
      }}
    >
      <BrowserRouter>
        {routes}
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
