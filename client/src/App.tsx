import React, { Fragment } from "react";
import { Navbar } from "./Table/Navbar";
import "./App.css";
import { Main } from "./Pages/Main";

function App() {
  return (
    <Fragment>
      <Navbar />
      <Main />
    </Fragment>
  );
}

export default App;
