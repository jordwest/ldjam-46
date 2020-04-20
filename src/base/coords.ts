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
  export const virtualScreenToWorld = (
    screenCoord: Vec2,
    cameraPosition: Vec2,
    virtualScreenSize: Vec2
  ): Vec2 => ({
    x: (screenCoord.x - virtualScreenSize.x / 2) / 16 + cameraPosition.x,
    y: (screenCoord.y - virtualScreenSize.y / 2) / 16 + cameraPosition.y,
  });
}
