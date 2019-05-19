import {connect} from "react-redux";

import {enableNightMode, setPreferences} from "../actions";

import Settings from "../ui/settings";

const stateToProps = ({preferences: {enableNightMode, translation}}) => ({
  enableNightMode,
  translation,
});

const dispatchToProps = dispatch => ({
  setNightModeEnabled: enabled => dispatch(enableNightMode(enabled)),
  setTranslation: translation => dispatch(setPreferences({translation})),
});

export default connect(
  stateToProps,
  dispatchToProps
)(Settings);
