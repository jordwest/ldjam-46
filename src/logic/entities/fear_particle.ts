import { GameState } from "~state/state";
import { Vec2 } from "~base/vec2";
import { Entity } from "~logic/entity";
import { Sprites } from "~config";

export function createFearParticle(
  state: GameState,
  pos: Vec2,
  velocity: number
) {
  const id = Entity.mintId(state.entities);
  const lifetime = 1 + Math.random() * 2;
  state.components.position.set(id, pos);
  state.components.lifetime.set(id, { current: lifetime, max: lifetime });
  state.components.collectable.set(id, {
    state: "available",
    type: { t: "fear-droplet" },
  });
  state.components.particle.set(id, {
    velocity: {
      x: (Math.random() * 2 - 1) * velocity,
      y: (Math.random() * 2 - 1) * velocity,
    },
    velocityDamp: 0.8,
    jitter: 0,
  });
  state.components.sprite.set(id, {
    sprite: Sprites.fearParticle,
    currentAnimation: "default",
    layer: "overlay",
    frame: 0,
    autoplay: {
      timePerFrame: 0.2,
    },
  });
}
