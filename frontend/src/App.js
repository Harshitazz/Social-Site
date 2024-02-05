import React, { useState, useCallback, useEffect } from "react";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import MainNavigation from "./shared/componets/Navigation/MainNavigation";
import Authenticate from "./user/pages/Authenticate";
import { AuthContext } from "./shared/componets/hooks/context/auth-context";

let logoutTimer;

const App = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [date, setdate] = useState(false);
  

  const login = useCallback((uId, token, ExpirationDate) => {
    setUserId(uId);
    setToken(token);
    const tokenExpirationDate =
      ExpirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setdate(tokenExpirationDate)
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uId,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);
  const logout = useCallback(() => {
    setToken(false);
    setUserId(false);
    setdate(null)
    localStorage.removeItem("userData");
  }, []);

  useEffect(()=>{
    if(token && date){
      const remainingTime= date.getTime() - new Date().getTime();
      logoutTimer=setTimeout(logout , remainingTime);
    }else{
      clearTimeout(logoutTimer);
    }
  },[token,logout, date])
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token && 
      new Date(storedData.expiration)>new Date()) {
      login(storedData.userId, storedData.token , new Date( storedData.expiration));
    }
  });

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route exact path="/">
          <Users />
        </Route>
        <Route exact path="/:userId/places">
          <UserPlaces />
        </Route>
        <Route exact path="/place/new">
          <NewPlace />
        </Route>
        <Route exact path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path="/">
          <Users />
        </Route>
        <Route exact path="/:userId/places">
          <UserPlaces />
        </Route>
        <Route exact path="/auth">
          <Authenticate />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
