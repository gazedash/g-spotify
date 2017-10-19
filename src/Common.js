// @flow
import { Howl } from "howler";
export function player(prevUrl?: string, nextUrl?: string, active?: boolean) {
  if (prevUrl === nextUrl) {
    if (window.hwler) {
      if (!active) {
        window.howler.play();
      } else {
        window.howler.stop();
      }
    }
    return { url: nextUrl, active: !active };
  } else {
    if (nextUrl) {
      if (window.howler) {
        window.howler.unload();
      }
      window.howler = new Howl({
        src: [nextUrl],
        format: ["mp3"]
      });
    }
    window.howler.play();
    return { url: nextUrl, active: true };
  }
}

export default {
  player
};
