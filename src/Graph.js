// @flow
import React, { Component, PureComponent } from "react";
import R from "ramda";
import { Howl } from "howler";
import { debounce } from "lodash";
import ListItem from "./ListItem";
import { features } from "./api";
// import items from "./items.json";

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
// const sorted = R.sortBy(R.prop("hysterical"))(items);
// this.props.items = this.props.items.map(item => getProps(item));

class Circles extends PureComponent<any, any> {
  render() {
    return this.props.items.map(({ key, value, enabled }, ind) => {
      return (
        <circle
          pointerEvents={"none"}
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
        <Circles items={this.props.items} x={this.props.x + 5} />
      </g>
    );
  }
}

export default class Graph extends Component<any, any> {
  static defaultProps = {
    // items: transItems
    items: []
  };

  state = {
    id: null,
    item: {
      details: {},
      values: {}
    },
    url: "",
    active: false,
    features: R.fromPairs(
      features.map(item => {
        return [item.key, item.enabled];
      })
    )
  };

  handleMouseOver = debounce((item: Object) => {
    this.setState({ item });
  }, 100);

  handleClick = (preview_url?: string) => {
    if (this.state.url === preview_url) {
      console.log('this,', window.howler, this.state.active);
      if (window.howler) {
        if (!this.state.active) {
          window.howler.play();
        } else {
          window.howler.stop();
        }
      } 
      this.setState({ url: preview_url, active: !this.state.active });
    } else {
      if (preview_url) {
        console.log('that,', window.howler, this.state.active);
        if (window.howler) {
          window.howler.unload();
        }
        window.howler = new Howl({
          src: [preview_url],
          format: ["mp3"]
        });
      }
      window.howler.play();
      this.setState({ url: preview_url, active: true });
    }
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
              readOnly
              checked={this.state.features[f.key]}
            />
            {features[index].key}{" "}
          </div>
        ))}
        <ListItem
          value={0}
          artist={this.state.item.details.artist}
          name={this.state.item.details.name}
          preview_url={this.state.item.details.preview_url}
          onClick={this.handleClick}
        />
        <svg width={this.props.items.length * 13} height="500">
          {this.props.items.map(item => getProps(item)).map((item, index) => {
            const id = item.details.preview_url + " " + index;
            const val = item.values.map(item => {
              item.enabled = this.state.features[item.key];
              return item;
            });
            return (
              <Line
                onMouseOver={() => this.handleMouseOver(item)}
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
