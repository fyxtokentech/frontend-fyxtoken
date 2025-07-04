import React, { Component } from "react";
import {
  AppThemeProvider,
  initThemeCamaleon,
  addThemeChangeListener,
  removeThemeChangeListener,
} from "@jeff-aporta/camaleon";

import { Footer, HeadMain } from "./menu/index.js";

import "./temp.scss";

initThemeCamaleon();

export class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this._listener = (themeProps) => {
      setTimeout(() => {
        this.setState(themeProps);
      });
    };
    addThemeChangeListener(this._listener);
  }

  componentWillUnmount() {
    removeThemeChangeListener(this._listener);
  }

  render() {
    return (
      <AppThemeProvider
        h_init="50px"
        h_fin="50px"
        Footer={Footer}
        Header={HeadMain}
        {...this.props}
        {...this.state}
      />
    );
  }
}
