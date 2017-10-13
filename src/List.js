// @flow
import React, { Component } from "react";
import ListItem from "./ListItem";
// import items from "./items.json";
export default class List extends Component<any> {
  static defaultProps = {
    // items: R.sortBy(R.prop("hysterical"))(items)
    items: []
  };

  render() {
    console.log(this.props.items);
    
    return (
      <div className={"List"}>
        {this.props.items.map(item => (
          <ListItem
            name={item.name}
            artistName={item.artists[0].name}
            hysterical={item.hysterical}
            energy={item.energy}
            valence={item.valence}
          />
        ))}
      </div>
    );
  }
}
