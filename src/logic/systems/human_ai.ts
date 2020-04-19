import { GameState } from "~state/state";
import { expect } from "~base/expect";
import { Vec2 } from "~base/vec2";
import { Debug } from "~base/debug";
import { Angle } from "~base/angle";

export function runAi(state: GameState, dt: number) {
  const playerPos = expect(
    state.components.position.get(state.entities.player)
  );
  const playerVisibility = expect(
    state.components.visibility.get(state.entities.player)
  );

  for (const [entityId, brain] of state.components.brain.entries()) {
    const pos = expect(state.components.position.get(entityId));
    const angle = expect(state.components.angle.get(entityId));
    const agility = expect(state.components.agility.get(entityId));
    const distanceToPlayer = Vec2.distance(pos, playerPos);

    brain.fear = Math.max(0, brain.fear - 0.03 * dt);

    // Do we need to change our current activity?
    if (distanceToPlayer < 2 && playerVisibility > 0.2) {
      // Holy mother of god
      brain.fear = 1;
      brain.sawPlayerAt = { ...playerPos };
    } else if (distanceToPlayer < 6 && playerVisibility > 0.4) {
      // Oh shit, that's a monster, RUN!
      brain.fear = Math.max(brain.fear, 0.7);
      brain.state = { t: "running", awayFrom: { ...playerPos } };
    } else if (distanceToPlayer <= 9 && playerVisibility > 0.2) {
      // What IS that?
      if (brain.fear < 0.2) {
        brain.state = { t: "investigating", lookingAt: { ...playerPos } };
      } else if (brain.fear < 0.9) {
        // Too scared, run away
        brain.state = { t: "running", awayFrom: { ...playerPos } };
      }
    }

    if (brain.fear > 0.9) {
      // Can't move at all when fear is this high
      brain.state = { t: "frozen" };
    } else if (brain.fear > 0 && brain.sawPlayerAt) {
      // If they've seen the player before, run at the slightest bit of fear
      brain.state = { t: "running", awayFrom: { ...brain.sawPlayerAt } };
    }

    // Act on current activity
    let deltaPos: Vec2 | undefined;
    if (brain.state.t === "investigating") {
      const distToTarget = Vec2.distance(brain.state.lookingAt, pos);
      const vecToTarget = Vec2.unitVector(
        Vec2.subtract(brain.state.lookingAt, pos)
      );
      brain.targetAngle = Vec2.angleOf(vecToTarget);
      if (distToTarget > 1) {
        // Move towards thing
        deltaPos = Vec2.multScalar(vecToTarget, dt * agility.sneakSpeed);
      }
    } else if (brain.state.t === "running") {
      const vecAwayFrom = Vec2.unitVector(
        Vec2.subtract(pos, brain.state.awayFrom)
      );
      brain.targetAngle = Vec2.angleOf(vecAwayFrom);
      deltaPos = Vec2.multScalar(vecAwayFrom, dt * agility.runSpeed);
    }
    if (deltaPos != null) {
      state.components.position.set(entityId, Vec2.add(pos, deltaPos));
    }

    const angleError = Angle.angleBetween(angle, brain.targetAngle);
    state.components.angle.set(entityId, angle + angleError * 4.0 * dt);

    Debug.record("human brain", brain);
  }
}
