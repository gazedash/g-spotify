// @flow
import React, { Component, PureComponent } from "react";
import R from "ramda";
import ListItem from "./ListItem";
import items from "./items.json";

const colors = [
  "aqua",
  "black",
  "blue",
  "fuchsia",
  "gray",
  "green",
  "lime",
  "maroon",
  "navy",
  "olive",
  "orange",
  "purple",
  "red",
  "silver",
  "teal",
  "white",
  "yellow"
];
const features = [
  "danceability",
  "energy",
  "speechiness",
  "acousticness",
  "instrumentalness",
  "liveness",
  "valence",
  "hysterical"
];
const getDefColor = ind => colors[ind];

const convert = R.compose(R.map(R.zipObj(["key", "value"])), R.toPairs);
const getProps = item => {
  const artist = R.path(["artists", 0, "name"], item);
  const name = R.path(["name"], item);
  const preview_url = R.path(["preview_url"], item);
  // { details: { ... }, values: { ... }}
  const details = { name, preview_url, artist };
  const valuesObj = R.pick(features, item);
  const values = convert(valuesObj);
  const track = { details, values };
  return track;
};
const sorted = R.sortBy(R.prop("hysterical"))(items);
const transItems = sorted.map(item => getProps(item));

class VerticalLine extends PureComponent<any, any> {
  render() {
    return this.props.items.map(({ key, value }, ind) => {
      return (
        <circle
          cx={this.props.x}
          cy={300 - value * 200}
          key={key}
          r="1.5"
          stroke={getDefColor(ind)}
          strokeWidth="3"
          fill={"red"}
        />
      );
    });
  }
}

class BackgroundLine extends PureComponent<any, any> {
  render() {
    return (
      <rect
        fill={this.props.isActive ? "grey" : "black"}
        y={100}
        x={this.props.x}
        width={13}
        height={210}
      />
    );
  }
}

class Line extends PureComponent<any, any> {
  handleMouseOver = () => {
    this.props.onMouseOver(this.props.id);
  };
  render() {
    return (
      <g onMouseOver={this.handleMouseOver}>
        <BackgroundLine x={this.props.x} isActive={this.props.isActive} />
        <VerticalLine items={this.props.items} x={this.props.x} />
      </g>
    );
  }
}

export default class Graph extends Component<any, any> {
  static defaultProps = {
    items: transItems
    // items: []
  };

  state = {
    id: null
  };

  handleMouseOver = id => {
    this.setState({ id });
  };

  render() {
    return (
      <div className={"List"}>
        {[...Array(8).keys()].map((_, index) => (
          <div key={index} style={{ color: colors[index] }}>
            {features[index]}
          </div>
        ))}
        {this.state.id ? <div>{this.state.id}</div> : null}
        <svg width="10000" height="500">
          {this.props.items.map((item, index) => {
            const id = item.details.preview_url + " " + index;
            return (
              <Line
                onMouseOver={this.handleMouseOver}
                key={id}
                x={index * 13}
                id={id}
                items={item.values}
                isActive={this.state.id === id}
              />
            );
          })}
        </svg>
      </div>
    );
  }
}
