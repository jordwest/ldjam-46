import { Vec2 } from "~base/vec2";
import { Components } from "./components/components";
import { RenderState } from "~rendering/rendering";
import { EntityId } from "./entity";
import { Audio } from "~audio/audio";

export type Inputs = {
  moveLeft: boolean;
  moveRight: boolean;
  moveUp: boolean;
  moveDown: boolean;
};

export type GameState = {
  renderState: RenderState;
  audioState: Audio.State;
  cameraPosition: Vec2;
  virtualScreenSize: Vec2;

  components: Components;

  randomSource: Uint8Array;

  inputs: Inputs;

  entities: {
    nextId: EntityId;
    player: EntityId;
  };
};
