import { describeObservation, differentialsForDisease } from "./symptomOntology.js";

const MIN_MATCHES_FOR_UNCAPPED_SCORE = 2;
const LOW_EVIDENCE_CEILING = 55;
const LOW_VISUAL_CONFIDENCE_CEILING = 45;

function decodeSymptoms(value) {
  if (Array.isArray(value)) return value.filter(item => typeof item === "string");
  try {
    const decoded = JSON.parse(value || "[]");
    return Array.isArray(decoded) ? decoded.filter(item => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function clamp(value, minimum = 0, maximum = 1) {
  return Math.max(minimum, Math.min(maximum, value));
}

export function collectSymptomVocabulary(records) {
  return [...new Set(records.flatMap(record => decodeSymptoms(record.symptoms_json)))].sort();
}

function scoreDifferentials(diseaseId, selectedFeatureIds) {
  return differentialsForDisease(diseaseId).map(rule => {
    const profile = rule.profiles.find(candidate => diseaseId.endsWith(`_${candidate}`)) || null;
    const supportingCues = profile ? (rule.visualCueFeatures?.[profile] || []) : [];
    const opposingCues = rule.profiles
      .filter(candidate => candidate !== profile)
      .flatMap(candidate => rule.visualCueFeatures?.[candidate] || []);
    const sharedFeatureObserved = rule.sharedFeatures.some(feature => selectedFeatureIds.has(feature));
    const distinguishingCueObserved = supportingCues.some(feature => selectedFeatureIds.has(feature));
    const opposingCueObserved = opposingCues.some(feature => selectedFeatureIds.has(feature));
    const active = sharedFeatureObserved || distinguishingCueObserved || opposingCueObserved;
    const evidenceGap = sharedFeatureObserved && !distinguishingCueObserved;
    const conflictingEvidence = opposingCueObserved && !distinguishingCueObserved;
    const ceiling = (evidenceGap || conflictingEvidence)
      ? (rule.requiresLaboratoryConfirmation ? 45 : 60)
      : 100;
    return {
      ...rule,
      profile,
      supportingCues,
      opposingCues,
      active,
      sharedFeatureObserved,
      distinguishingCueObserved,
      opposingCueObserved,
      evidenceGap,
      conflictingEvidence,
      penalty: conflictingEvidence ? (rule.requiresLaboratoryConfirmation ? 25 : 15) : evidenceGap ? (rule.requiresLaboratoryConfirmation ? 20 : 10) : 0,
      ceiling,
    };
  });
}

/**
 * Candidate-retrieval score, not probability. It combines observed-image support,
 * feature specificity, crop-selection support and proof safeguards. A single shared
 * sign, a contradictory cue, or an unresolved differential cannot produce a high score.
 */
export function rankDiseaseRecords(records, { symptoms = [], symptomConfidence = 0, cropConfidence = 1 } = {}) {
  const safeSymptoms = Array.isArray(symptoms) ? symptoms.filter(item => typeof item === "string") : [];
  const observedTokens = new Set(safeSymptoms);
  const selectedFeatureIds = new Set(safeSymptoms.map(token => describeObservation(token)?.canonicalFeatureId).filter(Boolean));
  const visualConfidence = clamp(Number(symptomConfidence) || 0);
  const cropSupport = clamp(Number(cropConfidence) || 0);
  const featureFrequency = new Map();

  for (const record of records) {
    for (const token of new Set(decodeSymptoms(record.symptoms_json))) {
      const featureId = describeObservation(token)?.canonicalFeatureId;
      if (featureId) featureFrequency.set(featureId, (featureFrequency.get(featureId) || 0) + 1);
    }
  }

  return records.map(row => {
    const expectedSymptoms = decodeSymptoms(row.symptoms_json);
    const matchedSymptoms = expectedSymptoms.filter(symptom => observedTokens.has(symptom));
    if (!matchedSymptoms.length) return null;
    const matchedFeatureIds = [...new Set(matchedSymptoms.map(token => describeObservation(token)?.canonicalFeatureId).filter(Boolean))];
    const coverage = matchedSymptoms.length / Math.max(1, expectedSymptoms.length);
    const specificity = matchedFeatureIds.reduce((total, featureId) => total + 1 / Math.sqrt(featureFrequency.get(featureId) || 1), 0) / Math.max(1, matchedFeatureIds.length);
    const evidenceSufficiency = Math.min(1, matchedSymptoms.length / MIN_MATCHES_FOR_UNCAPPED_SCORE);
    const differentials = scoreDifferentials(row.id, selectedFeatureIds);
    const differentialPenalty = differentials.reduce((total, rule) => total + rule.penalty, 0);
    let scoreCeiling = differentials.reduce((ceiling, rule) => Math.min(ceiling, rule.ceiling), 100);
    if (matchedSymptoms.length < MIN_MATCHES_FOR_UNCAPPED_SCORE) scoreCeiling = Math.min(scoreCeiling, LOW_EVIDENCE_CEILING);
    if (visualConfidence < 0.45) scoreCeiling = Math.min(scoreCeiling, LOW_VISUAL_CONFIDENCE_CEILING);
    if (cropSupport < 0.65) scoreCeiling = Math.min(scoreCeiling, 60);

    const rawScore = 100 * ((0.35 * visualConfidence) + (0.25 * coverage) + (0.15 * specificity) + (0.15 * cropSupport) + (0.10 * evidenceSufficiency));
    const evidenceScore = Math.round(clamp(rawScore - differentialPenalty, 0, scoreCeiling));

    return {
      id: row.id,
      name: { ar: row.name_ar, fr: row.name_fr, en: row.name_en },
      scientificName: row.scientific_name,
      confidence: evidenceScore,
      evidenceScore,
      matchedSymptoms,
      evidence: {
        ar: row.evidence_ar,
        fr: row.evidence_fr,
        en: row.evidence_en,
        matchedFeatureIds,
        matchCount: matchedSymptoms.length,
        visualConfidence,
        cropSupport,
        coverage: Number(coverage.toFixed(3)),
        specificity: Number(specificity.toFixed(3)),
        scoreCeiling,
      },
      fieldCheck: { ar: row.field_check_ar, fr: row.field_check_fr, en: row.field_check_en },
      immediateCare: { ar: row.immediate_care_ar, fr: row.immediate_care_fr, en: row.immediate_care_en },
      conditionalCare: { ar: row.conditional_care_ar, fr: row.conditional_care_fr, en: row.conditional_care_en },
      safety: { ar: row.safety_ar, fr: row.safety_fr, en: row.safety_en },
      sourceUrl: row.source_url,
      sourceScope: row.source_scope || "crop_group",
      reviewStatus: row.review_status || "queued",
      differentials,
    };
  }).filter(Boolean).sort((left, right) => right.evidenceScore - left.evidenceScore || right.evidence.matchCount - left.evidence.matchCount || left.id.localeCompare(right.id)).slice(0, 3);
}
