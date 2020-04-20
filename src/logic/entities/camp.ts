import { GameState } from "~state/state";
import { createFire } from "./fire";
import { createHuman } from "./human";
import { Vec2 } from "~base/vec2";
import { Angle } from "~base/angle";

export function createCamp(state: GameState, pos: Vec2) {
  createFire(state, pos);
  const humans = Math.floor(Math.random() * 2) + 2;
  let angleFromFire = Math.random();

  for (let i = 0; i < humans; i++) {
    angleFromFire += Math.random() * (Math.PI / 3) + 0.2;
    const humanPos = Vec2.add(
      pos,
      Vec2.multScalar(Angle.toVec(angleFromFire), 3)
    );

    createHuman(state, humanPos, angleFromFire - Math.PI);
  }
}
