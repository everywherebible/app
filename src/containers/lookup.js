import React from "react";
import {connect} from "react-redux";

import {Route} from "react-router-dom";

import {addRecent} from "../actions";

import {populateStoreWithRecents} from "../data/recent-reference-tracker";

import ChooseBook from "../ui/choose-book";
import ChooseChapter from "../ui/choose-chapter";

const stateToProps = ({recents}) => ({recents});

const dispatchToProps = dispatch => ({
  addRecent: reference => dispatch(addRecent(reference)),
  populateStoreWithRecents: () => populateStoreWithRecents(dispatch),
});

export default ({match: {path}}) => (
  <div className="fit">
    <Route
      exact
      path={`${path}`}
      component={connect(
        stateToProps,
        dispatchToProps
      )(ChooseBook)}
    />
    <Route
      exact
      path={`${path}/:book`}
      component={connect(
        stateToProps,
        dispatchToProps
      )(ChooseChapter)}
    />
  </div>
);
