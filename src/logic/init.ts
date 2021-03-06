import { GameState } from "~state/state";
import { VIRTUAL_SCREEN_SIZE } from "~config";
import { RenderState } from "~rendering/rendering";
import { EntityId } from "~state/entity";
import { Entity } from "./entity";
import { createPlayer } from "./entities/player";
import { Audio } from "../audio/audio";
import { createCamp } from "./entities/camp";
import { createCursor } from "./entities/cursor";
import { createStone } from "./entities/stone";
import { Vec2 } from "~base/vec2";
import { expect } from "~base/expect";
import { Angle } from "~base/angle";

const NUM_CAMPS = 40;
const NUM_STONES = 200;

export const PLAY_AREA_SIZE = {
  x: 200,
  y: 200,
};

const initialStats = () => ({
  fearBar: 0.4,
  dead: false,
});

const initEcs = () => {
  const components = {
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

  const startLocation = Vec2.divScalar(PLAY_AREA_SIZE, 2);

  const entityBootstrap = { nextId: 0 as EntityId };
  const player = Entity.mintId(entityBootstrap);
  createPlayer(player, startLocation, components);
  const cursor = createCursor(entityBootstrap, components);

  return {
    entities: { ...entityBootstrap, player, cursor },
    components,
    startLocation,
  };
};

export function restartGame(state: GameState) {
  state.stats = initialStats();
  const { entities, components, startLocation } = initEcs();
  state.entities = entities;
  state.components = components;
  state.cameraPosition = { ...startLocation };
  generateEntities(state, PLAY_AREA_SIZE);
}

export function init(renderState: RenderState): GameState {
  const randomSource = new Uint8Array(1024);

  for (let i = 0; i < randomSource.length; i++) {
    randomSource[i] = Math.floor(Math.random() * 255);
  }

  const audioState = Audio.init();
  Audio.playSound(audioState, "ambience");

  const { entities, components, startLocation } = initEcs();

  const state: GameState = {
    renderState,
    audioState,
    randomSource,
    t: 0,
    cameraPosition: { ...startLocation },
    virtualScreenSize: VIRTUAL_SCREEN_SIZE,
    components,
    screen: { t: "screen", texture: renderState.titleScreen },
    stats: initialStats(),
    inputs: {
      moveUp: false,
      moveLeft: false,
      moveDown: false,
      moveRight: false,
      sneak: false,
      cursor: { x: 0, y: 0 },
      event: undefined,
    },
    entities,
  };

  generateEntities(state, PLAY_AREA_SIZE);

  return state;
}

function generateEntities(state: GameState, area: Vec2) {
  // Create one camp near the player
  const distance = 8;
  const angle = Math.random() * (Math.PI * 2);
  const playerPos = expect(
    state.components.position.get(state.entities.player)
  );
  const initialCampPos = Vec2.add(
    playerPos,
    Vec2.multScalar(Angle.toVec(angle), distance)
  );
  createCamp(state, initialCampPos);

  const getRandomLocation = () => ({
    x: Math.random() * area.x,
    y: Math.random() * area.y,
  });
  for (let i = 0; i < NUM_CAMPS; i++) {
    let pos = getRandomLocation();
    const distanceToPlayer = Vec2.distance(pos, playerPos);
    // Don't create more camps close to the player
    if (distanceToPlayer > 10) {
      createCamp(state, pos);
    }
  }

  for (let i = 0; i < NUM_STONES; i++) {
    let pos = getRandomLocation();
    createStone(state, pos);
  }
}
