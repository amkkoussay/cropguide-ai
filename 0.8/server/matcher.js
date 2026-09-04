import { describeObservation, differentialsForDisease, filterImageExtractableTokens } from "./symptomOntology.js";

const MIN_MATCHES_FOR_UNCAPPED_SCORE = 2;
const LOW_EVIDENCE_CEILING = 55;
const LOW_VISUAL_CONFIDENCE_CEILING = 45;
const GENERIC_EVIDENCE_CEILING = 55;
const GENERIC_TOKEN_FREQUENCY = 0.25;
const GENERIC_BASE_FEATURE_IDS = new Set([
  "vf.foliage.spot",
  "vf.foliage.yellowing",
]);

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

function visualTokensForRecord(record) {
  return new Set(filterImageExtractableTokens(decodeSymptoms(record.symptoms_json)));
}

function evidenceUnitKey(observation, token, detail = "") {
  return detail ? `detail:${observation?.canonicalFeatureId || token}:${detail}` : `base:${observation?.canonicalFeatureId || token}`;
}

function detailDescriptor(observation) {
  const vector = observation?.evidenceVector || observation?.attributes || {};
  const entries = ["tissue", "geometry", "surface", "pattern", "progression"]
    .flatMap(attribute => (Array.isArray(vector[attribute]) ? vector[attribute].map(value => `${attribute}:${value}`) : []))
    .filter(value => !value.endsWith(":lesion_or_spot"));
  return [...new Set(entries)].sort().join("|");
}

function evidenceUnitsForTokens(tokens) {
  const grouped = new Map();
  for (const token of tokens) {
    const observation = describeObservation(token);
    const baseKey = evidenceUnitKey(observation, token);
    if (!grouped.has(baseKey)) grouped.set(baseKey, { key: baseKey, kind: "base", tokens: [] });
    grouped.get(baseKey).tokens.push(token);

    // A detailed visual attribute is a bounded modifier for its base feature.
    // It is retained separately only when it adds organ, geometry, surface,
    // pattern, or progression information. Colour-only aliases remain grouped.
    const detail = detailDescriptor(observation);
    if (!detail) continue;
    const detailKey = evidenceUnitKey(observation, token, detail);
    if (!grouped.has(detailKey)) grouped.set(detailKey, { key: detailKey, kind: "detail", tokens: [] });
    grouped.get(detailKey).tokens.push(token);
  }
  return [...grouped.values()].map(unit => ({ ...unit, tokens: [...new Set(unit.tokens)].sort() }));
}

function calculateCandidateRelativeDiscrimination(matchedTokens, visualTokenSets, candidateIndex) {
  const alternatives = visualTokenSets.filter((tokenSet, index) => index !== candidateIndex && tokenSet.size > 0);
  if (matchedTokens.length === 0 || alternatives.length === 0) return { score: 0, hasCandidateSpecificEvidence: false };

  let hasCandidateSpecificEvidence = false;
  const score = matchedTokens.reduce((total, token) => {
    const supportingAlternatives = alternatives.filter(tokenSet => tokenSet.has(token)).length;
    const supportingRecords = supportingAlternatives + 1;
    // A feature present in only one record can reflect incomplete curation, not a diagnostic separator.
    if (supportingRecords < 2) return total;
    const separationFromAlternatives = 1 - (supportingAlternatives / alternatives.length);
    const corroboration = Math.min(1, Math.log2(supportingRecords) / 2);
    if (supportingAlternatives < alternatives.length) hasCandidateSpecificEvidence = true;
    return total + (separationFromAlternatives * corroboration);
  }, 0) / Math.max(1, matchedTokens.length);

  return { score, hasCandidateSpecificEvidence };
}

function isGenericEvidenceUnit(unit, visualTokenSets) {
  if (unit.kind === "base" && unit.tokens.every(token => GENERIC_BASE_FEATURE_IDS.has(describeObservation(token)?.canonicalFeatureId))) {
    return true;
  }
  if (!visualTokenSets.length) return false;
  return unit.tokens.every(token => {
    const support = visualTokenSets.filter(tokenSet => tokenSet.has(token)).length;
    return (support / visualTokenSets.length) >= GENERIC_TOKEN_FREQUENCY;
  });
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
  const visualTokenSets = records.map(visualTokensForRecord);

  return records.map((row, candidateIndex) => {
    const expectedVisualSymptoms = filterImageExtractableTokens(decodeSymptoms(row.symptoms_json));
    const expectedEvidenceUnits = evidenceUnitsForTokens(expectedVisualSymptoms);
    const matchedEvidenceUnits = expectedEvidenceUnits.filter(unit => unit.tokens.some(token => observedTokens.has(token)));
    const matchedSymptoms = [...new Set(matchedEvidenceUnits.flatMap(unit => unit.tokens.filter(token => observedTokens.has(token))))];
    if (!matchedEvidenceUnits.length) return null;
    const matchedFeatureIds = [...new Set(matchedSymptoms.map(token => describeObservation(token)?.canonicalFeatureId).filter(Boolean))];
    const coverage = matchedEvidenceUnits.length / Math.max(1, expectedEvidenceUnits.length);
    const discrimination = calculateCandidateRelativeDiscrimination(matchedSymptoms, visualTokenSets, candidateIndex);
    const diagnosticDiscrimination = discrimination.score;
    const evidenceSufficiency = Math.min(1, matchedEvidenceUnits.length / MIN_MATCHES_FOR_UNCAPPED_SCORE);
    const genericEvidenceUnitCount = matchedEvidenceUnits.filter(unit => isGenericEvidenceUnit(unit, visualTokenSets)).length;
    const detailedEvidenceUnitCount = matchedEvidenceUnits.filter(unit => unit.kind === "detail").length;
    const genericOnlyEvidence = genericEvidenceUnitCount === matchedEvidenceUnits.length;
    const differentials = scoreDifferentials(row.id, selectedFeatureIds, observedTokens);
    const differentialPenalty = differentials.reduce((total, rule) => total + rule.penalty, 0);
    const differentialSupportBonus = Math.min(6, differentials.reduce((total, rule) => total + (rule.supportingCueObserved && !rule.opposingCueObserved ? 3 : 0), 0));
    let scoreCeiling = differentials.reduce((ceiling, rule) => Math.min(ceiling, rule.ceiling), 100);
    const requiresFieldConfirmation = differentials.some(rule => rule.requiresFieldConfirmation && rule.active);
    if (requiresFieldConfirmation) scoreCeiling = Math.min(scoreCeiling, 60);
    if (matchedEvidenceUnits.length < MIN_MATCHES_FOR_UNCAPPED_SCORE) scoreCeiling = Math.min(scoreCeiling, LOW_EVIDENCE_CEILING);
    if (genericOnlyEvidence) scoreCeiling = Math.min(scoreCeiling, GENERIC_EVIDENCE_CEILING);
    if (visualConfidence < 0.45) scoreCeiling = Math.min(scoreCeiling, LOW_VISUAL_CONFIDENCE_CEILING);
    if (cropSupport < 0.65) scoreCeiling = Math.min(scoreCeiling, 60);

    const rawScore = 100 * ((0.35 * visualConfidence) + (0.25 * coverage) + (0.15 * diagnosticDiscrimination) + (0.15 * cropSupport) + (0.10 * evidenceSufficiency));
    const evidenceScore = Math.round(clamp(rawScore - differentialPenalty + differentialSupportBonus, 0, scoreCeiling));
    const retrievalSufficient = matchedEvidenceUnits.length >= MIN_MATCHES_FOR_UNCAPPED_SCORE
      && !genericOnlyEvidence
      && discrimination.hasCandidateSpecificEvidence;

    return {
      id: row.id,
      name: { ar: row.name_ar, fr: row.name_fr, en: row.name_en },
      scientificName: row.scientific_name,
      evidenceScore,
      matchedSymptoms,
      evidence: {
        ar: row.evidence_ar,
        fr: row.evidence_fr,
        en: row.evidence_en,
        matchedFeatureIds,
        matchCount: matchedEvidenceUnits.length,
        expectedVisualSymptomCount: expectedVisualSymptoms.length,
        expectedIndependentVisualSymptomCount: expectedEvidenceUnits.length,
        genericEvidenceUnitCount,
        detailedEvidenceUnitCount,
        genericOnlyEvidence,
        candidateRelativeEvidence: discrimination.hasCandidateSpecificEvidence,
        retrievalSufficient,
        visualConfidence,
        cropSupport,
        coverage: Number(coverage.toFixed(3)),
        diagnosticDiscrimination: Number(diagnosticDiscrimination.toFixed(3)),
        differentialSupportBonus,
        scoreCeiling,
        requiresFieldConfirmation,
      },
      fieldCheck: { ar: row.field_check_ar, fr: row.field_check_fr, en: row.field_check_en },
      immediateCare: { ar: row.immediate_care_ar, fr: row.immediate_care_fr, en: row.immediate_care_en },
      conditionalCare: { ar: row.conditional_care_ar, fr: row.conditional_care_fr, en: row.conditional_care_en },
      safety: { ar: row.safety_ar, fr: row.safety_fr, en: row.safety_en },
      sourceUrl: row.source_url,
      sourceScope: row.source_scope || "crop_group",
      reviewStatus: row.review_status || "queued",
      differentials,
      decision: requiresFieldConfirmation ? "field_confirmation_required" : "ranked_evidence",
    };
  }).filter(Boolean).sort((left, right) => right.evidenceScore - left.evidenceScore || right.evidence.matchCount - left.evidence.matchCount || left.id.localeCompare(right.id)).slice(0, 3);
}
