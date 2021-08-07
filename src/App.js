import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import AllPlaces from "./places/pages/AllPlaces";
import BreadCrumb from "./BreadCrumb";

// implement lazy loading
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const MyPlaces = React.lazy(() => import("./places/pages/MyPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./users/pages/Auth"));

const App = () => {
  const { token, login, logout, userId, username } = useAuth();
  let routes;
  if (token) {
    routes = (
      <div>
        <Switch>
          <Route path='/' exact component={AllPlaces} />
          <Route path='/:userId/places' exact component={UserPlaces} />
          <Route path='/:userId/myplaces' exact component={MyPlaces} />
          <Route path='/places/new' exact component={NewPlace} />
          <Route path='/places/:placeId' exact component={UpdatePlace} />
          <Redirect to='/' />
        </Switch>
      </div>
    );
  } else {
    routes = (
      <div>
        <Switch>
          <Route path='/' exact component={AllPlaces} />
          <Route path='/:userId/places' exact component={UserPlaces} />
          <Route path='/auth' component={Auth} />
          <Redirect to='/auth' />
        </Switch>
      </div>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        username: username,
        login: login,
        logout: logout,
      }}
    >
      <div className='App'>
        <Router>
          <Router>
            <MainNavigation />
            <main>
              <Suspense
                fallback={
                  <div className='center'>
                    <LoadingSpinner />
                  </div>
                }
              >
                <BreadCrumb />
                {routes}
              </Suspense>
            </main>
          </Router>
        </Router>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
