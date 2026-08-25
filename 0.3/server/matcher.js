import { differentialsForDisease } from "./symptomOntology.js";

function decodeSymptoms(value) {
  if (Array.isArray(value)) return value;
  try {
    const decoded = JSON.parse(value || "[]");
    return Array.isArray(decoded) ? decoded : [];
  } catch {
    return [];
  }
}

export function collectSymptomVocabulary(records) {
  return [...new Set(records.flatMap(record => decodeSymptoms(record.symptoms_json)))];
}

export function rankDiseaseRecords(records, { symptoms = [], symptomConfidence = 0 }) {
  const safeSymptoms = Array.isArray(symptoms) ? symptoms : [];
  const safeConfidence = Number.isFinite(symptomConfidence) ? Math.min(1, Math.max(0, symptomConfidence)) : 0;

  return records
    .map(row => {
      const expectedSymptoms = decodeSymptoms(row.symptoms_json);
      const matchedSymptoms = expectedSymptoms.filter(symptom => safeSymptoms.includes(symptom));
      const coverage = expectedSymptoms.length ? matchedSymptoms.length / expectedSymptoms.length : 0;
      const precision = safeSymptoms.length ? matchedSymptoms.length / safeSymptoms.length : 0;
      const confidence = Math.round(Math.min(0.92, 0.18 + coverage * 0.52 + precision * 0.2 + safeConfidence * 0.1) * 100);
      return {
        id: row.id,
        name: { ar: row.name_ar, fr: row.name_fr, en: row.name_en },
        scientificName: row.scientific_name,
        confidence,
        matchedSymptoms,
        evidence: { ar: row.evidence_ar, fr: row.evidence_fr, en: row.evidence_en },
        fieldCheck: { ar: row.field_check_ar, fr: row.field_check_fr, en: row.field_check_en },
        immediateCare: { ar: row.immediate_care_ar, fr: row.immediate_care_fr, en: row.immediate_care_en },
        conditionalCare: { ar: row.conditional_care_ar, fr: row.conditional_care_fr, en: row.conditional_care_en },
        safety: { ar: row.safety_ar, fr: row.safety_fr, en: row.safety_en },
        sourceUrl: row.source_url,
        sourceScope: row.source_scope || "crop_group",
        reviewStatus: row.review_status || "queued",
        differentials: differentialsForDisease(row.id),
      };
    })
    .filter(candidate => candidate.matchedSymptoms.length > 0)
    .sort((left, right) => right.confidence - left.confidence)
    .slice(0, 3);
}
