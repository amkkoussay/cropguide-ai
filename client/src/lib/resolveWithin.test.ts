import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveWithin } from "./resolveWithin";

describe("resolveWithin", () => {
  afterEach(() => vi.useRealTimers());

  it("preserves a prompt source value", async () => {
    await expect(resolveWithin(Promise.resolve("coordinates"), 2_500)).resolves.toBe("coordinates");
  });

  it("releases the caller when a browser API never settles", async () => {
    vi.useFakeTimers();
    const result = resolveWithin(new Promise<never>(() => undefined), 2_500);

    await vi.advanceTimersByTimeAsync(2_500);
    await expect(result).resolves.toBeUndefined();
  });
});
