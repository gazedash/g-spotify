// @flow
import "rc-slider/assets/index.css";

import { Range } from "rc-slider";
import React, { Component } from "react";

type Item = {
  name: string,
  values: number[]
};
type Props = {
  items: Item[],
  onChange(item: Item): void
};
// "danceability" : 0.735,
// "energy" : 0.578,
// "speechiness" : 0.0461,
// "acousticness" : 0.514,
// "instrumentalness" : 0.0902,
// "liveness" : 0.159,
// "valence" : 0.624,
// "popularity": ...
export default class Slider extends Component<Props> {
  static defaultProps = {
    onChange: (value: Item) => {},
    items: []
  };

  render() {
    return (
      <div className={""}>
        {Array.from(this.props.items).map((item: any) => {
          const { name, values } = item;
          if (name && values) {
            return (
              <div key={name}>
                {name}
                <Range
                  allowCross={false}
                  defaultValue={values}
                  onChange={vals => this.props.onChange({ name, values: vals })}
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }
}

type SliderOptionsProps = {
  items: Item[],
  onSubmit(values: { [name: string]: Item }): any,
};
export class SliderOptions extends Component<SliderOptionsProps, any> {
  state = {};
  onChange = ({ name, values }: Item) => {
    this.setState({ [name]: values });
  };
  onSubmit = () => {
    this.props.onSubmit(this.state);
  };
  render() {
    return (
      <div>
        <Slider items={this.props.items} onChange={this.onChange} />
        <button onClick={this.onSubmit}>Go</button>
      </div>
    );
  }
}
