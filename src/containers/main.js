import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

const stateToProps = ({preferences: {enableNightMode}}) => ({enableNightMode});

const Main = ({enableNightMode, children}) => (
  <main className={`fit ${enableNightMode ? "night-mode" : ""}`}>
    {children}
  </main>
);

export default withRouter(connect(stateToProps)(Main));
