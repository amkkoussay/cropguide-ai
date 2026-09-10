import { describeObservation, differentialsForDisease, filterImageExtractableTokens } from "./symptomOntology.js";

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

function scoreDifferentials(diseaseId, selectedFeatureIds, selectedTokens) {
  return differentialsForDisease(diseaseId).map(rule => {
    const profile = rule.profiles.find(candidate => diseaseId.endsWith(`_${candidate}`)) || null;
    const sharedFeatureIds = new Set(rule.sharedFeatures || []);
    const cueSet = profile ? (rule.cueSets?.[profile] || {}) : {};
    // A shared feature is never allowed to act as either support or opposition.
    const supportingFeatures = (cueSet.supportingFeatures || []).filter(feature => !sharedFeatureIds.has(feature));
    const opposingFeatures = (cueSet.opposingFeatures || []).filter(feature => !sharedFeatureIds.has(feature));
    const supportingTokens = cueSet.supportingTokens || [];
    const opposingTokens = cueSet.opposingTokens || [];
    const sharedFeatureObserved = rule.sharedFeatures.some(feature => selectedFeatureIds.has(feature));
    const supportingCueObserved = supportingFeatures.some(feature => selectedFeatureIds.has(feature))
      || supportingTokens.some(token => selectedTokens.has(token));
    const opposingCueObserved = opposingFeatures.some(feature => selectedFeatureIds.has(feature))
      || opposingTokens.some(token => selectedTokens.has(token));
    const distinguishingCueObserved = supportingCueObserved;
    const active = sharedFeatureObserved || distinguishingCueObserved || opposingCueObserved;
    const evidenceGap = sharedFeatureObserved && !distinguishingCueObserved;
    const conflictingEvidence = opposingCueObserved;
    const ceiling = (evidenceGap || conflictingEvidence)
      ? (rule.requiresLaboratoryConfirmation ? 45 : 60)
      : 100;
    return {
      ...rule,
      profile,
      supportingFeatures,
      opposingFeatures,
      supportingTokens,
      opposingTokens,
      active,
      sharedFeatureObserved,
      supportingCueObserved,
      distinguishingCueObserved,
      opposingCueObserved,
      evidenceGap,
      conflictingEvidence,
      penalty: conflictingEvidence ? (rule.requiresLaboratoryConfirmation ? 25 : 15) : evidenceGap ? (rule.requiresLaboratoryConfirmation ? 20 : 10) : 0,
      ceiling,
    };
  });
}

function visualFeatureIdsForRecord(record) {
  return new Set(filterImageExtractableTokens(decodeSymptoms(record.symptoms_json))
    .map(token => describeObservation(token)?.canonicalFeatureId)
    .filter(Boolean));
}

function calculateDiagnosticDiscrimination(matchedFeatureIds, visualFeatureSets) {
  const comparableFeatureSets = visualFeatureSets.filter(featureSet => featureSet.size > 0);
  if (matchedFeatureIds.length === 0 || comparableFeatureSets.length < 2) return 0;

  return matchedFeatureIds.reduce((total, featureId) => {
    const supportingRecords = comparableFeatureSets.filter(featureSet => featureSet.has(featureId)).length;
    // A feature seen in only one incomplete record is not treated as diagnostic.
    if (supportingRecords < 2) return total;
    const separationFromAlternatives = 1 - ((supportingRecords - 1) / Math.max(1, comparableFeatureSets.length - 1));
    const corroboration = Math.min(1, Math.log2(supportingRecords) / 2);
    return total + (separationFromAlternatives * corroboration);
  }, 0) / Math.max(1, matchedFeatureIds.length);
}

/**
 * Candidate-retrieval score, not probability. It combines observed-image support,
 * candidate-relative diagnostic discrimination, crop-selection support and proof safeguards. A single shared
 * sign, a contradictory cue, or an unresolved differential cannot produce a high score.
 */
export function rankDiseaseRecords(records, { symptoms = [], symptomConfidence = 0, cropConfidence = 1 } = {}) {
  const safeSymptoms = filterImageExtractableTokens(Array.isArray(symptoms) ? symptoms.filter(item => typeof item === "string") : []);
  const observedTokens = new Set(safeSymptoms);
  const selectedFeatureIds = new Set(safeSymptoms.map(token => describeObservation(token)?.canonicalFeatureId).filter(Boolean));
  const visualConfidence = clamp(Number(symptomConfidence) || 0);
  const cropSupport = clamp(Number(cropConfidence) || 0);
  const visualFeatureSets = records.map(visualFeatureIdsForRecord);

  return records.map(row => {
    const expectedVisualSymptoms = filterImageExtractableTokens(decodeSymptoms(row.symptoms_json));
    const matchedSymptoms = expectedVisualSymptoms.filter(symptom => observedTokens.has(symptom));
    if (!matchedSymptoms.length) return null;
    const matchedFeatureIds = [...new Set(matchedSymptoms.map(token => describeObservation(token)?.canonicalFeatureId).filter(Boolean))];
    const coverage = matchedSymptoms.length / Math.max(1, expectedVisualSymptoms.length);
    const diagnosticDiscrimination = calculateDiagnosticDiscrimination(matchedFeatureIds, visualFeatureSets);
    const evidenceSufficiency = Math.min(1, matchedSymptoms.length / MIN_MATCHES_FOR_UNCAPPED_SCORE);
    const differentials = scoreDifferentials(row.id, selectedFeatureIds, observedTokens);
    const differentialPenalty = differentials.reduce((total, rule) => total + rule.penalty, 0);
    let scoreCeiling = differentials.reduce((ceiling, rule) => Math.min(ceiling, rule.ceiling), 100);
    if (matchedSymptoms.length < MIN_MATCHES_FOR_UNCAPPED_SCORE) scoreCeiling = Math.min(scoreCeiling, LOW_EVIDENCE_CEILING);
    if (visualConfidence < 0.45) scoreCeiling = Math.min(scoreCeiling, LOW_VISUAL_CONFIDENCE_CEILING);
    if (cropSupport < 0.65) scoreCeiling = Math.min(scoreCeiling, 60);

    const rawScore = 100 * ((0.35 * visualConfidence) + (0.25 * coverage) + (0.15 * diagnosticDiscrimination) + (0.15 * cropSupport) + (0.10 * evidenceSufficiency));
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
        expectedVisualSymptomCount: expectedVisualSymptoms.length,
        visualConfidence,
        cropSupport,
        coverage: Number(coverage.toFixed(3)),
        diagnosticDiscrimination: Number(diagnosticDiscrimination.toFixed(3)),
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
