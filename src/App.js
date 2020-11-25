import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Main } from "./pages/Main";
import { Privacy } from "./pages/Privacy";
import { Redirect, BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  // Google Analytics
  if (process.env.REACT_APP_ENV === "production") {
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=UA-180645492-1";
    const script2 = document.createElement("script");
    script2.innerHTML =
      "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-180645492-1');";

    document.head.append(script1);
    document.head.append(script2);
  }

  return (
    <Router>
      <Route path="/course/:courseIDs?">
        <Main />
      </Route>
      <Route path="/fce/:courseIDs?">
        <Main fce />
      </Route>
      <Route path="/privacy">
        <Privacy />
      </Route>
      <Route exact path="/">
        <Redirect to="/course" />
      </Route>
    </Router>
  );
}

export default App;
