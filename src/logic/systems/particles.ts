import { GameState } from "~state/state";
import { expect } from "~base/expect";
import { Vec2 } from "~base/vec2";
export function updateParticles(state: GameState, dt: number) {
  for (const [entityId, particle] of state.components.particle.entries()) {
    const pos = expect(state.components.position.get(entityId));

    let velocity = Vec2.multScalar(
      particle.velocity,
      1.0 - particle.velocityDamp * dt
    );
    particle.velocity = velocity;
    const dPos = Vec2.multScalar(
      Vec2.add(velocity, {
        x: (Math.random() * 2 - 1) * particle.jitter,
        y: (Math.random() * 2 - 1) * particle.jitter,
      }),
      dt
    );

    state.components.position.set(entityId, Vec2.add(pos, dPos));
  }
}
