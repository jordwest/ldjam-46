import { Components } from "~state/components/components";
import { EntityId } from "~state/entity";
import { Vec2 } from "~base/vec2";
import { Sprites } from "~config";

export function createPlayer(id: EntityId, pos: Vec2, components: Components) {
  components.position.set(id, pos);
  components.sprite.set(id, {
    sprite: Sprites.player,
    currentAnimation: "walk-south",
    frame: 0,
  });
  components.agility.set(id, {
    sneakSpeed: 1,
    walkSpeed: 2.9,
    runSpeed: 2.9,
  });
  components.visibility.set(id, 0);
}
