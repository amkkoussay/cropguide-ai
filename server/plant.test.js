import { describe, expect, it } from "vitest";
import { cropFromPlantCandidate } from "./plant.js";

describe("Plant.id crop aliases", () => {
  it.each([
    ["Phoenix dactylifera", "date_palm"],
    ["Citrus limon", "citrus"],
    ["Cucumis sativus", "cucumber"],
    ["Cicer arietinum", "chickpea"],
    ["Zea mays", "maize"],
    ["Fragaria × ananassa", "strawberry"],
  ])("maps %s to the expanded crop catalog", (name, cropId) => {
    expect(cropFromPlantCandidate({ name, commonNames: [] })).toBe(cropId);
  });

  it("does not treat an unrelated plant as a supported crop", () => {
    expect(cropFromPlantCandidate({ name: "Lavandula angustifolia", commonNames: ["lavender"] })).toBeNull();
  });
});
