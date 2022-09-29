import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserStore } from "./context/UserContext.jsx";

// import HelpTabs from "./components/HelpTabs";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <>
    <CssBaseline />
    <BrowserRouter basename="/">
      <UserStore>
        <App />
      </UserStore>
    </BrowserRouter>
  </>,
  rootElement
);
reportWebVitals();
