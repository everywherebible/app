import React from "react";
import {Provider} from "react-redux";
import {Router, Route, Redirect, Switch} from "react-router-dom";

import About from "./about";
import Lookup from "../containers/lookup";
import Main from "../containers/main";
import Nav from "../containers/nav";
import Read from "../containers/read";
import Settings from "../containers/settings";
import Toast from "../containers/toast";

import {chapterToLocation} from "../data/model";

const redirectToLastChapter = reference => () => (
  <Redirect
    to={reference == null ? "/Genesis+1" : chapterToLocation(reference)}
  />
);

export default ({store, history}) => (
  <Provider store={store}>
    <Router history={history}>
      <Main>
        <section className="fit">
          <Switch>
            <Route path="/lookup" component={Lookup} />
            <Route path="/settings" component={Settings} />
            <Route path="/about" component={About} />
            <Route path="/:passage" exact component={Read} />
            <Route
              path="/"
              exact
              component={redirectToLastChapter(store.getState().recents[0])}
            />
          </Switch>
        </section>
        <Toast />
        <Nav style={{position: "fixed", right: 0, bottom: 0, left: 0}} />
      </Main>
    </Router>
  </Provider>
);
