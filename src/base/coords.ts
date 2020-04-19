import { Vec2 } from "./vec2";

export namespace Coords {
  export const worldToVirtualScreen = (
    world: Vec2,
    cameraPosition: Vec2,
    virtualScreenSize: Vec2
  ): Vec2 =>
    Vec2.quantize(
      {
        x: (world.x - cameraPosition.x) * 16 + virtualScreenSize.x / 2,
        y: (world.y - cameraPosition.y) * 16 + virtualScreenSize.y / 2,
      },
      1
    );
}
