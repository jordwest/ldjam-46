import { Howl } from "howler";
import foot1 from "../assets/footstep1.wav";
import foot2 from "../assets/footstep2.wav";
import foot3 from "../assets/footstep3.wav";
import foot4 from "../assets/footstep4.wav";
import collectFear from "../assets/collect_fear3.wav";
import ambience from "../assets/ambience.wav";
import { expect } from "~base/expect";

export namespace Audio {
  type Sound = {
    variants: Howl[];
  };

  export type State = {
    sounds: Map<string, Sound>;
  };

  export function init(): State {
    const sounds = new Map();
    sounds.set("ambience", {
      variants: [new Howl({ src: [ambience], loop: true })],
    });
    sounds.set("footstep", {
      variants: [
        new Howl({ src: [foot1] }),
        new Howl({ src: [foot2] }),
        new Howl({ src: [foot3] }),
        new Howl({ src: [foot4] }),
      ],
    });
    sounds.set("collectFear", {
      variants: [new Howl({ src: [collectFear] })],
    });

    return { sounds };
  }

  export function playSound(state: State, sound: string) {
    const howl = expect(state.sounds.get(sound));
    const variant = Math.floor(Math.random() * howl.variants.length);
    howl.variants[variant].play();
  }
}