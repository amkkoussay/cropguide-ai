import { describe, expect, it } from "vitest";
import { healthStatusLabel } from "./observationStatus";

describe("healthStatusLabel", () => {
  it("does not describe a completed empty health assessment as pending", () => {
    expect(healthStatusLabel({ isHealthy: null, topHealth: null, healthCandidates: [] })).toBe("no health signal returned");
  });

  it("prioritizes a returned health candidate", () => {
    expect(healthStatusLabel({ topHealth: { name: "leaf spot", probability: 0.72 } })).toBe("leaf spot");
  });
});
