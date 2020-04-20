import { Howl } from "howler";
import foot1 from "../assets/footstep1.webm";
import foot2 from "../assets/footstep2.webm";
import foot3 from "../assets/footstep3.webm";
import foot4 from "../assets/footstep4.webm";
import foot1Mp3 from "../assets/footstep1.mp3";
import foot2Mp3 from "../assets/footstep2.mp3";
import foot3Mp3 from "../assets/footstep3.mp3";
import foot4Mp3 from "../assets/footstep4.mp3";
import collectFear from "../assets/collect_fear.webm";
import collectFearMp3 from "../assets/collect_fear.mp3";
import ambience from "../assets/ambience.webm";
import ambienceMp3 from "../assets/ambience.mp3";
import creepy from "../assets/creepysound.webm";
import creepyMp3 from "../assets/creepysound.mp3";
import stone from "../assets/stone.webm";
import stoneMp3 from "../assets/stone.mp3";
import die from "../assets/die.webm";
import dieMp3 from "../assets/die.mp3";
import { expect } from "~base/expect";

export namespace Audio {
  type Sound = {
    variants: Howl[];
  };

  export type State = {
    lastPlayedVariant: Map<string, number>;
    sounds: Map<string, Sound>;
  };

  export function init(): State {
    const sounds = new Map();
    sounds.set("ambience", {
      variants: [new Howl({ src: [ambience, ambienceMp3], loop: true })],
    });
    //sounds.set("creepy-sound", {
    //  variants: [new Howl({ src: [creepy, creepyMp3] })],
    //});
    sounds.set("footstep", {
      variants: [
        new Howl({ src: [foot1, foot1Mp3] }),
        new Howl({ src: [foot2, foot2Mp3] }),
        new Howl({ src: [foot3, foot3Mp3] }),
        new Howl({ src: [foot4, foot4Mp3] }),
      ],
    });
    sounds.set("collectFear", {
      variants: [new Howl({ src: [collectFear, collectFearMp3] })],
    });
    sounds.set("die", {
      variants: [new Howl({ src: [die, dieMp3] })],
    });
    sounds.set("stone", {
      variants: [new Howl({ src: [stone, stoneMp3] })],
    });
    sounds.set("creepy-sound", {
      variants: [new Howl({ src: [creepy, creepyMp3] })],
    });

    return { sounds, lastPlayedVariant: new Map() };
  }

  export function playSound(state: State, sound: string, volume: number = 1.0) {
    const howl = expect(state.sounds.get(sound));
    let variant = Math.floor(Math.random() * howl.variants.length);
    if (howl.variants.length > 1) {
      // Make sure we don't play the same variant twice in a row
      const lastPlayed = state.lastPlayedVariant.get(sound);
      if (lastPlayed != null) {
        while (variant == lastPlayed) {
          console.log(variant, lastPlayed);
          variant = Math.floor(Math.random() * howl.variants.length);
        }
      }
    }
    const vol = volume;

    const id = howl.variants[variant].play();
    howl.variants[variant].volume(vol, id);
    state.lastPlayedVariant.set(sound, variant);
  }
}
