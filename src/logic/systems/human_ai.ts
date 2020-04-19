import { GameState } from "~state/state";
import { expect } from "~base/expect";
import { Vec2 } from "~base/vec2";
import { Debug } from "~base/debug";
import { Angle } from "~base/angle";
import { createFearParticle } from "~logic/entities/fear_particle";
import { createDialogue } from "~logic/entities/dialogue";

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

    brain.fear = Math.max(0, brain.fear - 0.01 * dt);
    brain.accumulatedFear += brain.fear * dt * 7 * Math.random();
    if (brain.accumulatedFear > 0) {
      const emitParticles = Math.floor(brain.accumulatedFear);
      for (let i = 0; i < emitParticles; i++) {
        createFearParticle(state, { x: pos.x, y: pos.y - 0.2 }, brain.fear * 4);
      }
      brain.accumulatedFear = brain.accumulatedFear - emitParticles;
    }

    // Do we need to change our current activity?
    if (distanceToPlayer < 2 && playerVisibility > 0.2) {
      // Holy mother of god
      brain.fear = 1;
      brain.sawPlayerAt = { ...playerPos };
    } else if (distanceToPlayer < 1) {
      // IT TOUCHED ME
      brain.fear = 0.4;

      brain.state = { t: "investigating", lookingAt: { ...playerPos } };
      brain.sawPlayerAt = { ...playerPos };
    } else if (distanceToPlayer < 6 && playerVisibility > 0.4) {
      // Oh shit, that's a monster, RUN!
      brain.fear = Math.max(brain.fear, 0.7);
      if (brain.state.t !== "running") {
        createDialogue(state, pos, "ahh");
      }
      brain.state = { t: "running", awayFrom: { ...playerPos } };
    } else if (distanceToPlayer <= 15 && playerVisibility > 0.05) {
      // What IS that?
      if (brain.fear < 0.4) {
        if (brain.state.t !== "investigating") {
          createDialogue(state, pos, "look");
        }
        brain.fear += 0.15 * dt;
        brain.state = { t: "investigating", lookingAt: { ...playerPos } };
      } else if (brain.fear < 0.9) {
        if (brain.state.t !== "running") {
          createDialogue(state, pos, "ahh");
        }
        // Too scared, run away
        brain.state = { t: "running", awayFrom: { ...playerPos } };
      }
    }

    if (brain.fear > 0 && brain.sawPlayerAt) {
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
      state.components.lightSource.set(entityId, "torch");
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
      state.components.lightSource.set(entityId, "torch");
    }
    if (deltaPos != null) {
      state.components.position.set(entityId, Vec2.add(pos, deltaPos));
    }

    const angleError = Angle.angleBetween(angle, brain.targetAngle);
    state.components.angle.set(entityId, angle + angleError * 4.0 * dt);

    Debug.record("human brain", brain);
  }
}
