import { GameState } from "~state/state";
import { VIRTUAL_SCREEN_SIZE } from "~config";
import { RenderState } from "~rendering/rendering";
import { EntityId } from "~state/entity";
import { Entity } from "./entity";
import { createPlayer } from "./entities/player";
import { Components } from "~state/components/components";

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
  };

  const startLocation = { x: 30, y: 30 };
  createPlayer(player, startLocation, components);

  const state: GameState = {
    renderState,
    randomSource,
    cameraPosition: { ...startLocation },
    virtualScreenSize: VIRTUAL_SCREEN_SIZE,
    components,
    inputs: {
      moveUp: false,
      moveLeft: false,
      moveDown: false,
      moveRight: false,
    },
    entities: {
      ...entities,
      player,
    },
  };

  return state;
}
