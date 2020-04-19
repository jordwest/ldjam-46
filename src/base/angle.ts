export namespace Angle {
  export const normalize = (angle: number): number => {
    while (angle < 0) {
      angle += Math.PI * 2;
    }

    while (angle > Math.PI * 2) {
      angle -= Math.PI * 2;
    }

    return angle;
  };

  export const angleBetween = (a: number, b: number): number => {
    a = normalize(a);
    b = normalize(b);

    // Stupid code for finding shortest angles that wrap around 0
    // Probably better ways but this works ¯\_(ツ)_/¯
    const noWrap = b - a;
    const wrapCw = b + Math.PI * 2 - a;
    const wrapCcw = b - (a + Math.PI * 2);
    const wraps = [
      { abs: Math.abs(noWrap), v: noWrap },
      { abs: Math.abs(wrapCw), v: wrapCw },
      { abs: Math.abs(wrapCcw), v: wrapCcw },
    ].sort((a, b) => a.abs - b.abs);

    return wraps[0].v;
  };
}

