import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// layouts
import HomepageLayouts from "./layouts/HomepageLayouts";
// pages
import HomePage from "./pages/HomePage";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Recovery from "./pages/Recovery";
import KortoMon from "./pages/Kortomon";
import MontoKor from "./pages/Montokor";
import Page404 from "./pages/404";

const App = (props) => {
  useEffect(() => {}, []);

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
        <Route
          path="/montokor"
          render={() => (
            <HomepageLayouts>
              <MontoKor />
            </HomepageLayouts>
          )}
        />
        <Route
          path="/kortomon"
          render={() => (
            <HomepageLayouts>
              <KortoMon />
            </HomepageLayouts>
          )}
        />
        <Redirect to="/404" />
      </Switch>
    </div>
  );
};

export default App;
