import React, { useContext, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// layouts
import HomepageLayouts from "./layouts/HomepageLayouts";

// pages
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Recovery from "./pages/Recovery";
import UserContext from "./context/UserContext.jsx";
import Page404 from "./pages/404";
import HomePage from "./pages/HomePage";

const App = (props) => {
  const userContext = useContext(UserContext);

  useEffect(() => {
    userContext.onCheckUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <HomepageLayouts>
              <HomePage />
            </HomepageLayouts>
          )}
        />
        <Route
          path="/registration"
          render={() => (
            <HomepageLayouts>
              <Registration />
            </HomepageLayouts>
          )}
        />
        <Route
          path="/login"
          render={() => (
            <HomepageLayouts>
              <Login />
            </HomepageLayouts>
          )}
        />
        <Route
          path="/recovery"
          render={() => (
            <HomepageLayouts>
              <Recovery />
            </HomepageLayouts>
          )}
        />
        <Route
          path="/404"
          render={() => (
            <HomepageLayouts>
              <Page404 />
            </HomepageLayouts>
          )}
        />
        <Redirect to="/404" />
      </Switch>
    </div>
  );
};

export default App;
