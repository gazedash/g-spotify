// @flow
import React, { Component } from "react";

      // <text textAnchor="middle" x="50%" y="50%" fontFamily="Verdana" fontSize="16" fill="blue">
      //   Valence
      // </text>
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

export default class List extends Component<any> {
  static defaultProps = {};

  render() {
    console.log(this.props);

    return (
      <div className={"ListItem"}>
        <div className={"ListItem-graph"}>
          <Line value={1 - this.props.valence} />
          <Line value={this.props.energy} />
          <Line value={this.props.hysterical} />
        </div>
        <h6 className={"ListItem-track"}>
          {this.props.artistName} - {this.props.name}
        </h6>
      </div>
    );
  }
}
