import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDirectory = path.join(root, "data");
const database = new DatabaseSync(path.join(dataDirectory, "cropguide.sqlite"), { readOnly: true });
const ontology = JSON.parse(fs.readFileSync(path.join(dataDirectory, "symptom-ontology.json"), "utf8"));
const differentialRules = JSON.parse(fs.readFileSync(path.join(dataDirectory, "differential-rules.json"), "utf8"));
const northAfricaContext = JSON.parse(fs.readFileSync(path.join(dataDirectory, "north-africa-context.json"), "utf8"));

function parseJson(value, fallback = []) {
  try {
    const parsed = JSON.parse(value || "");
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function labels(row, prefix) {
  return { ar: row[`${prefix}_ar`], fr: row[`${prefix}_fr`], en: row[`${prefix}_en`] };
}

function sourceId(url) {
  return `source:${crypto.createHash("sha256").update(url).digest("hex").slice(0, 16)}`;
}

function relevantRules(diseaseId) {
  return differentialRules.rules
    .filter(rule => rule.profiles.some(profile => diseaseId.endsWith(`_${profile}`)))
    .map(rule => rule.id);
}

const featureById = new Map(ontology.features.map(feature => [feature.id, feature]));
const observationByLegacyToken = new Map(ontology.observations.map(observation => [observation.legacyToken, observation]));
const crops = database.prepare("SELECT * FROM crops ORDER BY id").all();
const diseases = database.prepare("SELECT * FROM diseases ORDER BY id").all();
database.close();

const sourceNodes = new Map();
const diseaseRecords = diseases.map(row => {
  const symptoms = parseJson(row.symptoms_json).map(legacyToken => {
    const observation = observationByLegacyToken.get(legacyToken);
    const feature = observation && featureById.get(observation.canonicalFeatureId);
    if (!observation || !feature) throw new Error(`Unmapped legacy symptom token: ${legacyToken} in ${row.id}`);
    return {
      legacyToken,
      observationId: observation.id,
      featureId: feature.id,
      featureLabels: feature.labels,
      familyId: feature.familyId,
      extractability: feature.extractability,
      imageEligible: feature.extractability !== "field_only",
      attributes: observation.attributes,
      evidenceVector: observation.evidenceVector,
    };
  });
  const url = row.source_url;
  const provenance = {
    url,
    scope: row.source_scope || "crop_group",
    reviewStatus: row.review_status || "queued",
  };
  if (url && !sourceNodes.has(url)) sourceNodes.set(url, {
    id: sourceId(url),
    type: "Source",
    url,
  });

  return {
    id: row.id,
    cropId: row.crop_id,
    names: labels(row, "name"),
    scientificName: row.scientific_name,
    visualFeatures: symptoms.filter(symptom => symptom.imageEligible),
    fieldOnlyObservations: symptoms.filter(symptom => !symptom.imageEligible),
    differentialRuleIds: relevantRules(row.id),
    fieldCheck: labels(row, "field_check"),
    care: {
      immediate: labels(row, "immediate_care"),
      conditional: labels(row, "conditional_care"),
      safety: labels(row, "safety"),
    },
    regionalContext: {
      regionId: northAfricaContext.regionId,
      relevanceStatus: northAfricaContext.relevanceModel.defaultStatus,
      diseasePresenceStatus: northAfricaContext.relevanceModel.diseasePresenceStatus,
      rankingEffect: northAfricaContext.relevanceModel.rankingEffect,
    },
    provenance,
  };
});

const cropNodes = crops.map(crop => ({
  id: `crop:${crop.id}`,
  type: "Crop",
  labels: labels(crop, "name"),
  scientificName: crop.scientific_name,
}));
const featureNodes = ontology.features.map(feature => ({
  id: `feature:${feature.id}`,
  type: "VisualFeature",
  labels: feature.labels,
  familyId: feature.familyId,
  extractability: feature.extractability,
}));
const featureFamilyNodes = ontology.featureFamilies.map(family => ({
  id: `feature-family:${family.id}`,
  type: "VisualFeatureFamily",
  labels: family.labels,
}));
const diseaseNodes = diseaseRecords.map(record => ({
  id: `disease:${record.id}`,
  type: "DiseaseRecord",
  labels: record.names,
  scientificName: record.scientificName,
  regionalRelevanceStatus: record.regionalContext.relevanceStatus,
}));
const regionNode = {
  id: `region:${northAfricaContext.regionId}`,
  type: "RegionContext",
  labels: northAfricaContext.regionName,
  relevanceModel: northAfricaContext.relevanceModel,
};

const graphEdges = [];
for (const record of diseaseRecords) {
  const diseaseNodeId = `disease:${record.id}`;
  graphEdges.push({ from: `crop:${record.cropId}`, type: "HAS_DISEASE_RECORD", to: diseaseNodeId });
  graphEdges.push({ from: diseaseNodeId, type: "CONTEXTUAL_TO", to: regionNode.id, effect: "none" });
  for (const visualFeature of record.visualFeatures) {
    graphEdges.push({ from: diseaseNodeId, type: "HAS_VISUAL_FEATURE", to: `feature:${visualFeature.featureId}`, legacyToken: visualFeature.legacyToken });
  }
  for (const fieldObservation of record.fieldOnlyObservations) {
    graphEdges.push({ from: diseaseNodeId, type: "HAS_FIELD_ONLY_OBSERVATION", to: `feature:${fieldObservation.featureId}`, legacyToken: fieldObservation.legacyToken });
  }
  if (record.provenance.url) {
    graphEdges.push({ from: diseaseNodeId, type: "EVIDENCED_BY", to: sourceId(record.provenance.url), scope: record.provenance.scope, reviewStatus: record.provenance.reviewStatus });
  }
  for (const ruleId of record.differentialRuleIds) {
    graphEdges.push({ from: diseaseNodeId, type: "GOVERNED_BY_DIFFERENTIAL", to: `differential:${ruleId}` });
  }
}
for (const feature of ontology.features) {
  graphEdges.push({ from: `feature:${feature.id}`, type: "BELONGS_TO_FAMILY", to: `feature-family:${feature.familyId}` });
}

const differentialNodes = differentialRules.rules.map(({ id, ...rule }) => ({
  id: `differential:${id}`,
  ruleId: id,
  type: "DifferentialRule",
  ...rule,
}));
const generatedAt = new Date().toISOString();
const dataset = {
  schemaVersion: "1.0.0",
  generatedAt,
  intendedUse: "Candidate retrieval and evidence presentation for crop-image workflows; not a confirmation, prescription, or country-presence dataset.",
  governance: {
    symptomOntology: "symptom-ontology.json",
    differentialRules: "differential-rules.json",
    northAfricaContext: "north-africa-context.json",
  },
  crops: cropNodes.map(({ id, type, ...crop }) => crop),
  diseaseRecords,
};
const graph = {
  schemaVersion: "1.0.0",
  generatedAt,
  semantics: {
    hasVisualFeature: "A feature may be requested from a suitable image, but does not by itself confirm a disease.",
    hasFieldOnlyObservation: "A feature must not be requested from the image model; it is preserved for field verification.",
    contextualTo: "The region context does not change candidate ranking or assert disease presence.",
  },
  nodes: [...cropNodes, ...diseaseNodes, ...featureNodes, ...featureFamilyNodes, ...differentialNodes, ...sourceNodes.values(), regionNode],
  edges: graphEdges,
};

fs.writeFileSync(path.join(dataDirectory, "ai-dataset.json"), `${JSON.stringify(dataset, null, 2)}\n`);
fs.writeFileSync(path.join(dataDirectory, "knowledge-graph.json"), `${JSON.stringify(graph, null, 2)}\n`);
fs.writeFileSync(path.join(dataDirectory, "ai-data-manifest.md"), [
  "# CropGuide AI Dataset and Knowledge Graph",
  "",
  `Generated: ${generatedAt}`,
  "",
  `- **Crop nodes:** ${cropNodes.length}`,
  `- **Disease records:** ${diseaseRecords.length}`,
  `- **Canonical visual features:** ${featureNodes.length}`,
  `- **Differential rules:** ${differentialNodes.length}`,
  `- **Source nodes:** ${sourceNodes.size}`,
  `- **Graph edges:** ${graphEdges.length}`,
  "",
  "## Safety Contract",
  "",
  "The dataset distinguishes image-eligible features from field-only observations. It is designed for ranked candidate retrieval and explainable evidence display. It must not be used as a confirmed diagnosis, a pesticide prescription, or a country-presence assertion.",
  "",
  "North Africa is stored as contextual metadata only. A disease can be assigned a country-presence status only after a separately traced organism-and-country review with human approval.",
  "",
].join("\n"));

console.log(`Exported ${diseaseRecords.length} disease records, ${graph.nodes.length} graph nodes, and ${graph.edges.length} graph edges.`);
