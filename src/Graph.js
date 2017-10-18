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
  { key: "danceability", enabled: true },
  { key: "energy", enabled: true },
  { key: "speechiness", enabled: true },
  { key: "acousticness", enabled: true },
  { key: "instrumentalness", enabled: true },
  { key: "liveness", enabled: true },
  { key: "valence", enabled: true },
  { key: "hysterical", enabled: true }
];
const getDefColor = ind => colors[ind];

const convert = R.compose(R.map(R.zipObj(["key", "value"])), R.toPairs);
const getProps = item => {
  const artist = R.path(["artists", 0, "name"], item);
  const name = R.path(["name"], item);
  const preview_url = R.path(["preview_url"], item);
  // { details: { ... }, values: { ... }}
  const details = { name, preview_url, artist };
  const valuesObj = R.pick(features.map(f => f.key), item);
  const values = convert(valuesObj);
  const track = { details, values };
  return track;
};
const sorted = R.sortBy(R.prop("hysterical"))(items);
const transItems = sorted.map(item => getProps(item));

class Circles extends PureComponent<any, any> {
  render() {
    return this.props.items.map(({ key, value, enabled }, ind) => {
      return (
        <circle
          cx={this.props.x}
          cy={300 - value * 200}
          key={key}
          r={enabled ? 1.5 : 0}
          stroke={getDefColor(ind)}
          strokeWidth={3}
        />
      );
    });
  }
}

class BackgroundLine extends PureComponent<any, any> {
  render() {
    return (
      <rect
        className={"BackgroundLine"}
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
        <Circles items={this.props.items} x={this.props.x} />
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
    id: null,
    features: {}
  };

  handleMouseOver = (id: string) => {
    console.log(id);
    
  };

  handleCheck = (feature: string) => {
    this.setState(prevState => {
      return {
        features: {
          ...prevState.features,
          [feature]: !prevState.features[feature]
        }
      };
    });
  };

  render() {
    return (
      <div className={"List"}>
        {features.map((f, index) => (
          <div
            className={"Feature"}
            key={index}
            style={{ color: colors[index] }}
            onClick={() => this.handleCheck(f.key)}
          >
            <input
              type={"checkbox"}
              checked={this.state.features[f.key]}
            />
            {features[index].key}{" "}
          </div>
        ))}
        {this.state.id ? <div>{this.state.id}</div> : null}
        <svg width="10000" height="500">
          {this.props.items.map((item, index) => {
            const id = item.details.preview_url + " " + index;
            const val = item.values.map(item => {
              item.enabled = this.state.features[item.key];
              return item;
            });

            return (
              <Line
                onMouseOver={this.handleMouseOver}
                key={id}
                x={index * 13}
                id={id}
                items={val}
                isActive={this.state.id === id}
              />
            );
          })}
        </svg>
      </div>
    );
  }
}
