import { describe, expect, it } from "vitest";
import { cropFromPlantCandidate, selectSupportedCrop } from "./plant.js";

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

  it("resolves the highest supported crop rather than trusting suggestion order", () => {
    const selection = selectSupportedCrop([
      { name: "Citrus limon", probability: 0.66, details: { common_names: ["lemon"] } },
      { name: "Olea europaea", probability: 0.88, details: { common_names: ["olive"] } },
    ]);
    expect(selection).toMatchObject({ status: "resolved", cropId: "olive", cropConfidence: 0.88 });
  });

  it("abstains when supported crop suggestions are too close", () => {
    const selection = selectSupportedCrop([
      { name: "Citrus limon", probability: 0.78, details: { common_names: ["lemon"] } },
      { name: "Olea europaea", probability: 0.72, details: { common_names: ["olive"] } },
    ]);
    expect(selection).toMatchObject({ status: "ambiguous", cropId: null, cropConfidence: 0.78 });
  });

  it("abstains when the best supported crop is below the evidence threshold", () => {
    const selection = selectSupportedCrop([
      { name: "Olea europaea", probability: 0.41, details: { common_names: ["olive"] } },
    ]);
    expect(selection).toMatchObject({ status: "low_confidence", cropId: null, cropConfidence: 0.41 });
  });

  it("does not resolve a supported crop when a stronger unsupported suggestion conflicts with it", () => {
    const selection = selectSupportedCrop([
      { name: "Lavandula angustifolia", probability: 0.9, details: { common_names: ["lavender"] } },
      { name: "Olea europaea", probability: 0.6, details: { common_names: ["olive"] } },
    ]);
    expect(selection).toMatchObject({ status: "ambiguous", cropId: null, cropConfidence: 0.6 });
  });

  it("does not map a short alias inside an unrelated word", () => {
    expect(cropFromPlantCandidate({ name: "Prunus persica", commonNames: ["peach"] })).not.toBe("pea");
  });

  it("considers a supported crop that appears after the first five Plant.id suggestions", () => {
    const suggestions = Array.from({ length: 6 }, (_, index) => ({
      name: `Unsupported plant ${index + 1}`,
      probability: 0.5 - (index * 0.02),
      details: { common_names: [] },
    }));
    suggestions[5] = { name: "Olea europaea", probability: 0.7, details: { common_names: ["olive"] } };
    expect(selectSupportedCrop(suggestions)).toMatchObject({ status: "resolved", cropId: "olive" });
  });
});
