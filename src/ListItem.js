// @flow
import React, { PureComponent } from "react";

const Line = props => (
  <svg height="10" width="400">
    <g>
      <rect
        x={"0"}
        width={400 * props.value}
        y="0"
        height={"10"}
        className={"ListItem-line"}
      />
    </g>
  </svg>
);

export default class List extends PureComponent<any> {
  static defaultProps = {};

  onClick = () => {
    this.props.onClick(this.props.preview_url);
  };

  render() {
    return (
      <div className={"ListItem"}>
        <Line value={this.props.value} />
        {this.props.artist && this.props.name ? (
          <span>{`${this.props.artist} - ${this.props.name}`}</span>
        ) : null}
        {this.props.preview_url ? (
          <button onClick={this.onClick}>></button>
        ) : null}
      </div>
    );
  }
}
