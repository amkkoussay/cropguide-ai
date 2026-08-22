import { describe, expect, it } from "vitest";
import { shouldDiscardQueuedScan } from "./offlineQueue";

describe("shouldDiscardQueuedScan", () => {
  it("discards only queue entries that the server identifies as permanently invalid", () => {
    expect(shouldDiscardQueuedScan({ data: { code: "BAD_REQUEST" } })).toBe(true);
    expect(shouldDiscardQueuedScan({ data: { code: "PAYLOAD_TOO_LARGE" } })).toBe(true);
    expect(shouldDiscardQueuedScan({ data: { code: "BAD_GATEWAY" } })).toBe(false);
    expect(shouldDiscardQueuedScan(new Error("network unavailable"))).toBe(false);
  });
});
