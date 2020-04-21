import { GameState } from "~state/state";
import { expect } from "~base/expect";
import { Vec2 } from "~base/vec2";
import { Angle } from "~base/angle";
import { createFearParticle } from "~logic/entities/fear_particle";
import { createDialogue } from "~logic/entities/dialogue";
import { HumanAction } from "~state/components/components";

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
    const sprite = expect(state.components.sprite.get(entityId));
    brain.currentActionTime += dt;

    // Forget whatever we were doing, start a new activity
    const overrideState = (
      newState: HumanAction,
      queue: HumanAction[] = []
    ) => {
      brain.state = newState;
      brain.queuedActions = queue;
      brain.currentActionTime = 0;
    };

    for (const [soundId, sound] of state.components.sound.entries()) {
      const soundPos = expect(state.components.position.get(soundId));
      const distance = Vec2.distance(soundPos, pos);
      if (distance < sound.volume && sound.age === 0) {
        if (sound.scariness === "slightly-scary") {
          if (brain.state.t === "sitting") {
            brain.fear += 0.1;
            createDialogue(state, pos, "what-was-that");
            overrideState({ t: "listening" });
          } else if (
            brain.state.t === "walking" ||
            brain.state.t === "listening" ||
            brain.state.t === "searching"
          ) {
            brain.fear += 0.2;
            overrideState({ t: "investigating", lookingAt: { ...soundPos } });
          } else if (brain.state.t === "investigating") {
            brain.fear += 0.2;
            overrideState({ t: "investigating", lookingAt: { ...soundPos } });
          }
        }
      }
    }

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
    } else if (distanceToPlayer < 0.8) {
      // IT TOUCHED ME
      brain.fear = 0.4;
      createDialogue(state, pos, "ahh");

      state.stats.fearBar -= dt * 0.1;

      brain.state = { t: "investigating", lookingAt: { ...playerPos } };
      brain.sawPlayerAt = { ...playerPos };
    } else if (distanceToPlayer < 6 && playerVisibility > 0.5) {
      // Oh shit, that's a monster, RUN!
      console.log("seen phobos at", playerVisibility, "visibility");
      brain.fear = Math.max(brain.fear, 0.7);
      state.stats.fearBar -= playerVisibility * dt * 0.6;
      if (brain.state.t !== "running") {
        createDialogue(state, pos, "ahh");
      }
      brain.state = { t: "running", awayFrom: { ...playerPos } };
    } else if (distanceToPlayer <= 8 && playerVisibility > 0.05) {
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
      if (distToTarget > 0.1) {
        const fearMult = Math.min(brain.fear, 1.0);

        // Walk faster as we get more scared
        const speed =
          agility.sneakSpeed +
          (agility.runSpeed - agility.sneakSpeed) * fearMult;
        // Move towards thing
        deltaPos = Vec2.multScalar(vecToTarget, dt * agility.sneakSpeed);
      } else {
        if (Vec2.distance(pos, brain.home) > 20) {
          // Been investigating far enough and haven't found anything, head back to camp
          brain.state = { t: "returning" };
        } else {
          // Pick a new nearby spot to look
          const newAngle = brain.targetAngle + (Math.random() - 0.5);
          const newTarget = Vec2.add(
            brain.state.lookingAt,
            Vec2.multScalar(Angle.toVec(newAngle), 3)
          );
          brain.state.lookingAt = newTarget;
        }
      }
    } else if (brain.state.t === "running") {
      const vecAwayFrom = Vec2.unitVector(
        Vec2.subtract(pos, brain.state.awayFrom)
      );
      brain.targetAngle = Vec2.angleOf(vecAwayFrom);
      deltaPos = Vec2.multScalar(vecAwayFrom, dt * agility.runSpeed);
      state.components.lightSource.set(entityId, "torch");
    } else if (brain.state.t === "returning") {
      const vecToTarget = Vec2.unitVector(Vec2.subtract(brain.home, pos));
      const distToTarget = Vec2.distance(brain.home, pos);
      if (distToTarget > 0.1) {
        // Move towards home
        deltaPos = Vec2.multScalar(vecToTarget, dt * agility.walkSpeed);
        brain.targetAngle = Vec2.angleOf(vecToTarget);
        state.components.lightSource.set(entityId, "torch");
      } else {
        // Back at camp, sit down
        brain.state = { t: "sitting" };
        state.components.lightSource.delete(entityId);
      }
    }
    const stepper = state.components.stepper.get(entityId);
    if (deltaPos != null) {
      if (stepper != null) {
        stepper.accum += Vec2.distance({ x: 0, y: 0 }, deltaPos);
      }
      state.components.position.set(entityId, Vec2.add(pos, deltaPos));
    }

    const angleError = Angle.angleBetween(angle, brain.targetAngle);
    const newAngle = Angle.normalize(angle + angleError * 4.0 * dt);
    state.components.angle.set(entityId, newAngle);

    let facing = "right";
    if (newAngle > Math.PI / 2 && newAngle < (Math.PI / 2) * 3) {
      facing = "left";
    }
    if (brain.state.t === "sitting") {
      sprite.currentAnimation = "sitting-" + facing;
    } else {
      sprite.currentAnimation = "moving-" + facing;
    }
  }
}
