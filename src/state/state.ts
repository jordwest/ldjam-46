import { Vec2 } from "~base/vec2";
import { Components } from "./components/components";
import { RenderState } from "~rendering/rendering";
import { Entities } from "./entity";
import { Audio } from "~audio/audio";

type InputEvent = {
  t: "click";
  pos: Vec2;
};

export type Inputs = {
  moveLeft: boolean;
  moveRight: boolean;
  moveUp: boolean;
  moveDown: boolean;
  sneak: boolean;
  cursor: Vec2;
  event: InputEvent | undefined;
};

export type GameState = {
  renderState: RenderState;
  audioState: Audio.State;
  cameraPosition: Vec2;
  virtualScreenSize: Vec2;
  t: number;

  screen:
    | { t: "screen"; texture: WebGLTexture }
    | {
        t: "transition";
        fromScreen: WebGLTexture | undefined;
        toScreen: WebGLTexture | undefined;
        time: number;
      }
    | { t: "game" };

  stats: {
    fearBar: number;
    dead: boolean;
  };

  components: Components;

  randomSource: Uint8Array;

  inputs: Inputs;

  entities: Entities;
};
