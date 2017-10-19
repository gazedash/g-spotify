// @flow
import React, { Component } from "react";
import R from "ramda";
import List from "./List";
import Graph from "./Graph";
import { features } from "./api";
import * as api from "./api";
import auth from "./api/auth";
import "./App.css";

const sort = (arr: Array<any>, sortBy: string) => R.sortBy(R.prop(sortBy))(arr);

export class Container extends Component<any, any> {
  state = { isLoggedIn: false, results: [], sortBy: "hysterical" };

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
      this.setState({ results });
    }
  };

  changeSort = (event: Event) => {
    const { target: { value } } = event;
    this.setState({ sortBy: value });
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
    if (!isLoggedIn) {
      return (
        <div>
          <button onClick={this.login}>Login</button>
        </div>
      );
    }
    return (
      <Children
        {...this.props}
        changeSort={this.changeSort}
        onSubmit={this.onSubmit}
        sortBy={this.state.sortBy}
        items={R.uniqBy(
          item =>
            item.preview_url
              ? item.preview_url.split("cid=")[0]
              : `${item.preview_url}${item.name}${item.artist}`,
          sort(this.state.results, this.state.sortBy).map(item => {
            return { ...item, value: item[this.state.sortBy] };
          })
        )}
      />
    );
  }
}
type Props = {
  items: Array<any>,
  onSubmit(value: any): void,
  changeSort(): void,
  sortBy: string
};
class AppInner extends Component<Props, any> {
  state = {
    tab: "graph"
  };
  onClick = ({ key = null }) => {
    if (key === "Enter" || !key) {
      const { onSubmit } = this.props;
      const { value = null } = this.input || {};
      onSubmit(value);
    }
  };

  componentDidMount() {
    const artist = window.location.pathname.slice(1);

    if (artist) {
      if (this.input) {
        this.input.value = artist;
      }

      const { onSubmit } = this.props;
      onSubmit(artist);
    }
  }

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
        <div>
          Sort by
          <select value={this.props.sortBy} onChange={this.props.changeSort}>
            {features.map(({ key }) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={() => this.setState({ tab: "linear" })}>
            Linear
          </button>
          <button onClick={() => this.setState({ tab: "graph" })}>Graph</button>
        </div>
        {this.state.tab === "graph" ? (
          <Graph items={this.props.items} />
        ) : (
          <List items={this.props.items} />
        )}
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
