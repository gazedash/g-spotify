// @flow
import React, { PureComponent } from "react";
import { Howl } from "howler";

type Props = {
  item: string,
  stop: boolean
};

class Player extends PureComponent<Props, any> {
  sound = null;
  constructor(props: Props) {
    super(props);
    if (props.item && !props.stop) {
      this.play(props.item);
    }
  }

  play(item: string) {
    this.sound = new Howl({
      src: [item],
      format: ["mp3"]
    });

    this.sound.play();
    console.log(this.sound);
  }

  componentWillReceiveProps(nextProps: Props) {
    console.log("am render");
    const { item } = this.props;
    if (!nextProps.stop) {
      this.play(nextProps.item);
    }
    if (this.sound && nextProps.stop) {
      this.sound.stop();
    }
  }

  render() {
    return <div />;
  }
}

export default Player;
