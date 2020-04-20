import { GameState } from "~state/state";
import { VIRTUAL_SCREEN_SIZE } from "~config";
import { RenderState } from "~rendering/rendering";
import { EntityId } from "~state/entity";
import { Entity } from "./entity";
import { createPlayer } from "./entities/player";
import { Components } from "~state/components/components";
import { Audio } from "../audio/audio";
import { createCamp } from "./entities/camp";
import { createCursor } from "./entities/cursor";
import { createStone } from "./entities/stone";

export function init(renderState: RenderState): GameState {
  const randomSource = new Uint8Array(1024);

  for (let i = 0; i < randomSource.length; i++) {
    randomSource[i] = Math.floor(Math.random() * 255);
  }

  const entities = { nextId: 0 as EntityId };
  const player = Entity.mintId(entities);
  const components: Components = {
    position: new Map(),
    sprite: new Map(),
    agility: new Map(),
    lightSource: new Map(),
    angle: new Map(),
    visibility: new Map(),
    brain: new Map(),
    particle: new Map(),
    collectable: new Map(),
    lifetime: new Map(),
    screenPosition: new Map(),
    stepper: new Map(),
    sound: new Map(),
    throwable: new Map(),
    hand: new Map(),
  };

  const startLocation = { x: 30, y: 30 };
  createPlayer(player, startLocation, components);
  const cursor = createCursor(entities, components);
  const audioState = Audio.init();
  Audio.playSound(audioState, "ambience");

  const state: GameState = {
    renderState,
    audioState,
    randomSource,
    cameraPosition: { ...startLocation },
    virtualScreenSize: VIRTUAL_SCREEN_SIZE,
    components,
    stats: {
      fearBar: 0.9,
    },
    inputs: {
      moveUp: false,
      moveLeft: false,
      moveDown: false,
      moveRight: false,
      sneak: false,
      cursor: { x: 0, y: 0 },
      event: undefined,
    },
    entities: {
      ...entities,
      player,
      cursor,
    },
  };

  createCamp(state, { x: 40, y: 29 });

  createStone(state, { x: 35, y: 30 });

  return state;
}
