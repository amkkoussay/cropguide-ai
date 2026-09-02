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
  source_scope: "record_specific", review_status: "reviewed",
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
      evidenceScore: expect.any(Number),
      immediateCare: expect.objectContaining({ ar: expect.any(String) }),
      conditionalCare: expect.objectContaining({ ar: expect.any(String) }),
      safety: expect.objectContaining({ ar: expect.any(String) }),
      sourceUrl: expect.stringMatching(/^https:\/\//),
      sourceScope: "record_specific",
      reviewStatus: "reviewed",
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

  it("keeps a one-feature visual match below the low-evidence ceiling", () => {
    const [candidate] = rankDiseaseRecords([oliveDisease], {
      symptoms: ["circular_dark_spot"],
      symptomConfidence: 0.98,
      cropConfidence: 0.98,
    });
    expect(candidate.evidenceScore).toBeLessThanOrEqual(55);
    expect(candidate.evidence.scoreCeiling).toBeLessThanOrEqual(55);
  });

  it("keeps low-confidence visual evidence below the visual-confidence ceiling", () => {
    const [candidate] = rankDiseaseRecords([oliveDisease], {
      symptoms: ["circular_dark_spot", "yellow_halo", "upper_leaf_spot"],
      symptomConfidence: 0.2,
      cropConfidence: 0.98,
    });
    expect(candidate.evidenceScore).toBeLessThanOrEqual(45);
    expect(candidate.evidence.scoreCeiling).toBeLessThanOrEqual(45);
  });

  it("returns rule-specific visual cues and an evidence gap for a shared mildew sign", () => {
    const mildewRecord = {
      ...oliveDisease,
      id: "cucumber_powdery_mildew",
      symptoms_json: JSON.stringify(["circular_dark_spot", "white_powdery_growth", "yellow_halo"]),
    };
    const [candidate] = rankDiseaseRecords([mildewRecord], {
      symptoms: ["circular_dark_spot", "yellow_halo"],
      symptomConfidence: 0.9,
      cropConfidence: 0.9,
    });
    const mildewRule = candidate.differentials.find(rule => rule.id === "mildew-powdery-vs-downy");
    expect(mildewRule).toEqual(expect.objectContaining({ evidenceGap: true, distinguishingCueObserved: false }));
    expect(mildewRule.supportingFeatures).toContain("vf.foliage.growth.powdery");
    expect(candidate.evidenceScore).toBeLessThanOrEqual(60);
  });

  it("does not treat a shared wilt feature as opposition to the same candidate", () => {
    const wiltRecord = {
      ...oliveDisease,
      id: "tomato_fusarium_wilt",
      symptoms_json: JSON.stringify(["one_sided_wilting", "vascular_browning", "yellow_halo"]),
    };
    const [candidate] = rankDiseaseRecords([wiltRecord], {
      symptoms: ["one_sided_wilting", "vascular_browning"],
      symptomConfidence: 0.9,
      cropConfidence: 0.9,
    });
    const wiltRule = candidate.differentials.find(rule => rule.id === "wilt-fusarium-vs-verticillium");

    expect(wiltRule).toEqual(expect.objectContaining({
      sharedFeatureObserved: true,
      supportingCueObserved: false,
      opposingCueObserved: false,
      conflictingEvidence: false,
    }));
    expect(wiltRule.supportingFeatures).toEqual([]);
    expect(wiltRule.opposingFeatures).toEqual([]);
  });

  it("calculates coverage only against symptoms that image analysis is permitted to observe", () => {
    const mixedRecord = {
      ...oliveDisease,
      symptoms_json: JSON.stringify(["circular_dark_spot", "yellow_halo", "vascular_browning", "root_galls"]),
    };
    const [candidate] = rankDiseaseRecords([mixedRecord], {
      symptoms: ["circular_dark_spot", "yellow_halo"],
      symptomConfidence: 0.9,
      cropConfidence: 0.9,
    });

    expect(candidate.evidence).toEqual(expect.objectContaining({
      expectedVisualSymptomCount: 2,
      coverage: 1,
    }));
  });

  it("does not promote a feature merely because it appears in one incomplete record", () => {
    const singletonFeatureRecord = {
      ...oliveDisease,
      id: "tomato_powdery_mildew",
      symptoms_json: JSON.stringify(["white_powdery_growth"]),
    };
    const [candidate] = rankDiseaseRecords([singletonFeatureRecord], {
      symptoms: ["white_powdery_growth"],
      symptomConfidence: 0.98,
      cropConfidence: 0.98,
    });

    expect(candidate.evidence.diagnosticDiscrimination).toBe(0);
  });
});
