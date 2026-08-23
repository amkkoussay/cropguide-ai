import { describe, expect, it } from "vitest";
import { collectSymptomVocabulary, rankDiseaseRecords } from "./matcher.js";

const oliveDisease = {
  id: "olive_peacock_spot",
  scientific_name: "Fusicladium oleagineum",
  symptoms_json: JSON.stringify(["circular_dark_spot", "yellow_halo", "upper_leaf_spot", "leaf_drop"]),
  name_ar: "عين الطاووس", name_fr: "Œil de paon", name_en: "Olive leaf spot",
  evidence_ar: "دليل", evidence_fr: "Preuve", evidence_en: "Evidence",
  field_check_ar: "تحقق", field_check_fr: "Vérifier", field_check_en: "Check",
  immediate_care_ar: "إدارة", immediate_care_fr: "Gérer", immediate_care_en: "Manage",
  conditional_care_ar: "علاج مشروط", conditional_care_fr: "Traitement conditionnel", conditional_care_en: "Conditional care",
  safety_ar: "سلامة", safety_fr: "Sécurité", safety_en: "Safety", source_url: "https://example.edu/olive",
};

describe("disease matcher", () => {
  it("collects a visible symptom vocabulary from safe disease records", () => {
    expect(collectSymptomVocabulary([oliveDisease])).toContain("circular_dark_spot");
  });

  it("returns a ranked, bounded disease candidate with simple care fields", () => {
    const candidates = rankDiseaseRecords([oliveDisease], {
      symptoms: ["circular_dark_spot", "yellow_halo", "upper_leaf_spot"],
      symptomConfidence: 0.9,
    });

    expect(candidates).toHaveLength(1);
    expect(candidates).toEqual([expect.objectContaining({
      id: "olive_peacock_spot",
      confidence: expect.any(Number),
      immediateCare: expect.objectContaining({ ar: expect.any(String) }),
      conditionalCare: expect.objectContaining({ ar: expect.any(String) }),
      safety: expect.objectContaining({ ar: expect.any(String) }),
      sourceUrl: expect.stringMatching(/^https:\/\//),
    })]);
  });

  it("does not return a disease when there is no matching visible symptom", () => {
    expect(rankDiseaseRecords([oliveDisease], { symptoms: ["white_powdery_growth"], symptomConfidence: 0.9 })).toEqual([]);
  });

  it("caps a direct result at three ranked disease candidates", () => {
    const matchingRecords = Array.from({ length: 5 }, (_, index) => ({
      ...oliveDisease,
      id: `matching-disease-${index + 1}`,
      name_ar: `مرض ${index + 1}`,
    }));

    const candidates = rankDiseaseRecords(matchingRecords, {
      symptoms: ["circular_dark_spot", "yellow_halo", "upper_leaf_spot"],
      symptomConfidence: 0.9,
    });

    expect(candidates).toHaveLength(3);
  });
});
