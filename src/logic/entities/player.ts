import { Components } from "~state/components/components";
import { EntityId } from "~state/entity";
import { Vec2 } from "~base/vec2";
import { Sprites } from "~config";

export function createPlayer(id: EntityId, pos: Vec2, components: Components) {
  components.position.set(id, pos);
  components.sprite.set(id, {
    sprite: Sprites.player,
    currentAnimation: "walk-south",
    layer: "sprite",
    frame: 0,
  });
  components.stepper.set(id, {
    accum: 0,
    perFrame: 0.6,
    sneaking: false,
    frameSounds: [
      { frame: 1, sound: "footstep" },
      { frame: 3, sound: "footstep" },
    ],
    producesSound: true,
  });
  components.agility.set(id, {
    sneakSpeed: 1.5,
    walkSpeed: 4.0,
    runSpeed: 4.0,
  });
  components.visibility.set(id, 0);
  components.hand.set(id, { holding: undefined });
}
