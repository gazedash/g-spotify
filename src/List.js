// @flow
import React, { Component } from "react";
import { player } from "./Common";
import ListItem from "./ListItem";
// import items from "./items.json";
export default class List extends Component<any, any> {
  static defaultProps = {
    // items: R.sortBy(R.prop("hysterical"))(items)
    items: []
  };

  state = {
    url: "",
    active: false
  };

  handleClick = (nextUrl?: string) => {
    this.setState(player(this.state.url, nextUrl, this.state.active));
  };

  render() {
    return (
      <div className={"List"}>
        {this.props.items.map(item => (
          <ListItem
            onClick={this.handleClick}
            key={`${item.name}${JSON.stringify(
              item.artists
            )}${item.preview_url}${item.value}${Math.random()}`}
            name={item.name}
            artist={item.artists[0].name}
            preview_url={item.preview_url}
            value={item.value}
          />
        ))}
      </div>
    );
  }
}
