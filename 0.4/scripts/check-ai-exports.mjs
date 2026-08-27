import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDirectory = path.join(root, "data");
const readJson = file => JSON.parse(fs.readFileSync(path.join(dataDirectory, file), "utf8"));
const dataset = readJson("ai-dataset.json");
const graph = readJson("knowledge-graph.json");
const ontology = readJson("symptom-ontology.json");
const featureById = new Map(ontology.features.map(feature => [feature.id, feature]));

const problems = [];
for (const record of dataset.diseaseRecords) {
  if (!record.visualFeatures.length && !record.fieldOnlyObservations.length) problems.push(`${record.id}: no linked observations`);
  if (!record.visualFeatures.length) problems.push(`${record.id}: no image-eligible feature for candidate retrieval`);
  if (!record.provenance.url) problems.push(`${record.id}: missing provenance URL`);
  if (record.regionalContext.relevanceStatus !== "contextual_only") problems.push(`${record.id}: unexpected regional relevance status`);
  if (record.regionalContext.rankingEffect !== "none") problems.push(`${record.id}: regional context alters candidate ranking`);
  for (const feature of record.visualFeatures) {
    if (featureById.get(feature.featureId)?.extractability === "field_only") problems.push(`${record.id}: field-only feature appears as image eligible`);
  }
}
const nodeIds = new Set(graph.nodes.map(node => node.id));
for (const edge of graph.edges) {
  if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) problems.push(`orphan graph edge: ${edge.from} ${edge.type} ${edge.to}`);
  if (edge.type === "HAS_VISUAL_FEATURE" && featureById.get(edge.to.slice("feature:".length))?.extractability === "field_only") {
    problems.push(`unsafe visual edge to field-only feature: ${edge.to}`);
  }
}
if (problems.length) {
  console.error(`AI export check failed with ${problems.length} problem(s):\n${problems.join("\n")}`);
  process.exit(1);
}
console.log(`AI exports verified: ${dataset.diseaseRecords.length} records, ${graph.nodes.length} nodes, ${graph.edges.length} edges.`);
