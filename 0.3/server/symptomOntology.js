import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(serverDirectory, "../data");
const ontology = JSON.parse(fs.readFileSync(path.join(dataDirectory, "symptom-ontology.json"), "utf8"));
const differentialRules = JSON.parse(fs.readFileSync(path.join(dataDirectory, "differential-rules.json"), "utf8"));
const featureById = new Map(ontology.features.map(feature => [feature.id, feature]));
const observationByLegacyToken = new Map(ontology.observations.map(observation => [observation.legacyToken, observation]));

export function filterImageExtractableTokens(tokens) {
  return tokens.filter(token => {
    const observation = observationByLegacyToken.get(token);
    const feature = observation && featureById.get(observation.canonicalFeatureId);
    return feature && feature.extractability !== "field_only";
  });
}

export function describeObservation(token) {
  const observation = observationByLegacyToken.get(token);
  if (!observation) return null;
  return {
    id: observation.id,
    canonicalFeatureId: observation.canonicalFeatureId,
    canonicalToken: observation.canonicalToken,
    attributes: observation.attributes,
    extractability: featureById.get(observation.canonicalFeatureId)?.extractability || "field_only",
  };
}

export function differentialsForDisease(diseaseId) {
  return differentialRules.rules
    .filter(rule => rule.profiles.some(profile => diseaseId.endsWith(`_${profile}`)))
    .map(rule => ({
      id: rule.id,
      profiles: rule.profiles,
      sharedFeatures: rule.sharedFeatures,
      distinguishingCues: rule.distinguishingCues,
      requiresFieldConfirmation: rule.requiresFieldConfirmation,
      requiresLaboratoryConfirmation: rule.requiresLaboratoryConfirmation,
    }));
}
