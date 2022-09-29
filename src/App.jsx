import React, { useContext, useEffect } from "react";
//import { ThemeProvider } from "@mui/material/styles";
import { Switch, Route, Redirect } from "react-router-dom";
//components
import AdminToolbar from "./components/AdminToolbar";
// hoc
import WithAuth from "./hoc/withAuth";
import WithAdminAuth from "./hoc/withAdminAuth.js";
// layouts
import MainLayout from "./layouts/MainLayout";
import HomepageLayouts from "./layouts/HomepageLayouts";

// pages
import Homepage from "./pages/Homepage";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Recovery from "./pages/Recovery";
import PlanTabs from "./components/PlanTabs";
import ResultTabs from "./components/ResultTabs";
import Admin from "./components/AdminTabs/Admin";
import Profile from "./pages/Profile/";
import UserContext from "./context/UserContext.jsx";
import HelpTabs from "./components/HelpTabs";
import Page404 from "./pages/404";

import "./default.scss";

const App = (props) => {
  const userContext = useContext(UserContext);

  useEffect(() => {
    userContext.onCheckUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <AdminToolbar />
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <HomepageLayouts>
              <Homepage />
            </HomepageLayouts>
          )}
        />
        <Route
          path="/registration"
          render={() => (
            <MainLayout>
              <Registration />
            </MainLayout>
          )}
        />
        <Route
          path="/login"
          render={() => (
            <MainLayout>
              <Login />
            </MainLayout>
          )}
        />
        <Route
          path="/recovery"
          render={() => (
            <MainLayout>
              <Recovery />
            </MainLayout>
          )}
        />
        <Route
          path="/plan"
          render={() => (
            <WithAuth>
              <MainLayout>
                <PlanTabs />
              </MainLayout>
            </WithAuth>
          )}
        />
        <Route
          path="/profile"
          render={() => (
            <MainLayout>
              <Profile />
            </MainLayout>
          )}
        />
        <Route
          path="/result"
          render={() => (
            <WithAuth>
              <MainLayout>
                <ResultTabs />
              </MainLayout>
            </WithAuth>
          )}
        />
        <Route
          path="/admin"
          render={() => (
            <WithAdminAuth>
              <MainLayout>
                <Admin />
              </MainLayout>
            </WithAdminAuth>
          )}
        />
        <Route
          path="/help"
          render={() => (
            <MainLayout>
              <HelpTabs />
            </MainLayout>
          )}
        />
        <Route
          path="/404"
          render={() => (
            <MainLayout>
              <Page404 />
            </MainLayout>
          )}
        />
        <Redirect to="/404" />
      </Switch>
    </div>
  );
};

export default App;
