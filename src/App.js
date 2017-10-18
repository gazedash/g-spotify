// @flow
import React, { Component } from "react";
import R from "ramda";
import List from "./List";
import Graph from "./Graph";
import Player from "./Player";
import * as api from "./api";
import auth from "./api/auth";
import "./App.css";

export class Container extends Component<any, any> {
  state = { isLoggedIn: false, results: [] };

  componentDidMount() {
    auth.redirected();
    this._componentDidMount();
  }

  async _componentDidMount() {
    const isLoggedIn = await api.checkLogin();
    this.setState({ isLoggedIn });
  }

  onSubmit = async (name: ?string) => {
    if (name) {
      const results = await api.fetchSongsAndFeatures(name);
      // const results2 = R.sortBy(R.prop("hysterical"))(results);
      const results2 = R.sortBy(R.prop("valence"))(results);
      this.setState({ results: results2 });
    }
  };

  login = () => {
    const win = auth.openLogin();
    auth
      .windowClosedPromise(win)
      .then(async () => await this._componentDidMount());
  };

  render() {
    const { children: Children } = this.props;
    const { isLoggedIn } = this.state;
    // if (!isLoggedIn) {
    //   return (
    //     <div>
    //       <button onClick={this.login}>Login</button>
    //     </div>
    //   );
    // }
    return (
      <Children
        {...this.props}
        onSubmit={this.onSubmit}
        items={this.state.results}
      />
    );
  }
}
class AppInner extends Component<any> {
  onClick = ({ key = null }) => {
    if (key === "Enter" || !key) {
      const { onSubmit } = this.props;
      const { value = null } = this.input || {};
      onSubmit(value);
    }
  };
  input = null;
  static defaultProps = {
    items: []
  };
  // <List items={this.props.items} />
  render() {
    return (
      <div>
        <input
          onKeyUp={this.onClick}
          type="text"
          ref={input => (this.input = input)}
        />
        <button onClick={this.onClick}>go</button>
        <Graph />
      </div>
    );
  }
}
// items={this.props.items}
class App extends Component<any, any> {
  render() {
    return (
      <div className="App">
        <Container children={AppInner} />
      </div>
    );
  }
}

export default App;
