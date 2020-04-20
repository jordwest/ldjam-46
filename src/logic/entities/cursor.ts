import { EntityId } from "~state/entity";
import { Components } from "~state/components/components";
import { Entity } from "~logic/entity";
import { Sprites } from "~config";

export function createCursor(
  entities: { nextId: EntityId },
  components: Components
): EntityId {
  const id = Entity.mintId(entities);
  components.sprite.set(id, {
    sprite: Sprites.cursor,
    currentAnimation: "default",
    frame: 0,
    layer: "overlay",
  });
  return id;
}
