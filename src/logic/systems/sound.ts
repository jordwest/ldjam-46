import { GameState } from "~state/state";
import { Audio } from "~audio/audio";
import { expect } from "~base/expect";
import { CircleProgram } from "~rendering/shaders/circle/circle";
import { Coords } from "~base/coords";
import { Vec2 } from "~base/vec2";
import { Entity } from "~logic/entity";

export function drawAndUpdateSounds(state: GameState, dt: number) {
  let circles: CircleProgram.CircleInstance[] = [];
  for (const [entityId, sound] of state.components.sound.entries()) {
    const position = expect(state.components.position.get(entityId));
    if (sound.age === 0 && sound.audio) {
      const distanceFromCamera = Vec2.distance(state.cameraPosition, position);
      if (distanceFromCamera < 10) {
        Audio.playSound(state.audioState, sound.audio);
      }
    }
    if (sound.age > 1.5) {
      Entity.remove(state, entityId);
      continue;
    }
    sound.age += dt;

    const r = sound.age * 150;
    const distance = sound.volume * 16;

    circles.push({
      pos: Coords.worldToVirtualScreen(
        Vec2.add(position, { x: 0.5, y: 0.5 }),
        state.cameraPosition,
        state.virtualScreenSize
      ),
      innerRadius: r - 4,
      outerRadius: Math.min(r, distance),
      color: [1, 1, 1, 0.02],
    });
  }
  CircleProgram.render(
    state.renderState.circleProgram,
    state.virtualScreenSize,
    circles
  );
}
