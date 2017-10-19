// @flow
import React, { Component } from "react";
import { Howl } from "howler";
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


  handleClick = (preview_url?: string) => {
    if (this.state.url === preview_url) {
      console.log('this,', this.howler, this.state.active);
      if (this.howler) {
        if (!this.state.active) {
          this.howler.play();
        } else {
          this.howler.stop();
        }
      } 
      this.setState({ url: preview_url, active: !this.state.active });
    } else {
      if (preview_url) {
        console.log('that,', this.howler, this.state.active);
        if (this.howler) {
          this.howler.unload();
        }
        this.howler = new Howl({
          src: [preview_url],
          format: ["mp3"]
        });
      }
      this.howler.play();
      this.setState({ url: preview_url, active: true });
    }
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
