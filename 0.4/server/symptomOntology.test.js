import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describeObservation, differentialsForDisease, filterImageExtractableTokens } from "./symptomOntology.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ontology = JSON.parse(fs.readFileSync(path.join(root, "data", "symptom-ontology.json"), "utf8"));

describe("symptom ontology safety bridge", () => {
  it("does not allow field-only observations in the image extraction vocabulary", () => {
    expect(filterImageExtractableTokens(["vascular_browning", "circular_dark_spot", "root_galls"]))
      .toEqual(["circular_dark_spot"]);
  });

  it("preserves a traceable canonical feature and its visual extraction constraint", () => {
    expect(describeObservation("white_powdery_growth")).toEqual(expect.objectContaining({
      canonicalFeatureId: "vf.foliage.growth.powdery",
      extractability: "primary",
    }));
  });

  it("attaches a conservative differential rule to confusable wilt profiles", () => {
    const rules = differentialsForDisease("tomato_fusarium_wilt");
    expect(rules).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: "wilt-fusarium-vs-verticillium",
        requiresFieldConfirmation: true,
        requiresLaboratoryConfirmation: true,
      }),
    ]));
  });

  it("assigns every canonical feature to an explicit machine-readable family", () => {
    const familyIds = new Set(ontology.featureFamilies.map(family => family.id));
    expect(ontology.featureFamilies.length).toBeGreaterThan(1);
    expect(ontology.features.every(feature => familyIds.has(feature.familyId))).toBe(true);
    expect(ontology.validation.featuresWithoutFamilyCount).toBe(0);
  });

  it("keeps complete legacy-token coverage and exposes only reviewed alias merges", () => {
    expect(ontology.observations.length).toBe(ontology.validation.observationCount);
    expect(ontology.observations.every(observation => observation.canonicalFeatureId)).toBe(true);
    expect(ontology.validation.observationsWithoutFeatureCount).toBe(0);
    expect(ontology.aliases.find(alias => alias.alias === "gumming")).toEqual(expect.objectContaining({
      canonicalToken: "gummy_exudate",
      policy: "exact_or_near_exact_visible_meaning",
    }));
  });
});
