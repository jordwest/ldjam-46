export function expect<T>(val: T | undefined | null): T {
  if (val == null) {
    throw new Error("expected value but got " + val);
  }
  return val;
}
