import { GameState } from "~state/state";
import { expect } from "~base/expect";
import { Vec2 } from "~base/vec2";
import { Coords } from "~base/coords";
import { Entity } from "~logic/entity";
import { Audio } from "~audio/audio";

export function collectCollectables(state: GameState, dt: number) {
  const playerPos = expect(
    state.components.position.get(state.entities.player)
  );

  if (state.stats.dead) {
    return;
  }

  for (const [
    entityId,
    collectable,
  ] of state.components.collectable.entries()) {
    if (collectable.state === "available") {
      const pos = expect(state.components.position.get(entityId));
      const distanceToPlayer = Vec2.distance(pos, playerPos);
      const sprite = state.components.sprite.get(entityId);

      if (distanceToPlayer <= 0.8) {
        // Collect this collectable
        collectable.state = "collecting";
        const screenPos = Coords.worldToVirtualScreen(
          pos,
          state.cameraPosition,
          state.virtualScreenSize
        );

        screenPos.y -= 21;
        Audio.playSound(state.audioState, "collectFear");
        state.stats.fearBar += 0.05;
        if (state.stats.fearBar > 1) {
          state.stats.fearBar = 1;
        }
        if (sprite && sprite.sprite.sequences.has("collected")) {
          sprite.currentAnimation = "collected";
        }
        state.components.particle.delete(entityId);
        state.components.lifetime.delete(entityId);
        state.components.screenPosition.set(entityId, screenPos);
        state.components.position.delete(entityId);
      }
    } else if (collectable.state === "collecting") {
      const pos = expect(state.components.screenPosition.get(entityId));
      const target = { x: state.virtualScreenSize.x - 32, y: 0 };
      const vecToTarget = Vec2.subtract(target, pos);
      const dist = Vec2.distance(pos, target);
      if (dist < 3) {
        Entity.remove(state, entityId);
      } else {
        const deltaPos = Vec2.multScalar(vecToTarget, dt * 4.0);
        state.components.screenPosition.set(entityId, Vec2.add(pos, deltaPos));
      }
    }
  }
}
