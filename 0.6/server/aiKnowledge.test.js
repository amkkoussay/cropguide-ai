import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, "data", file), "utf8"));
const dataset = readJson("ai-dataset.json");
const graph = readJson("knowledge-graph.json");

describe("AI knowledge exports", () => {
  it("covers each disease record with provenance and at least one retrieval-safe visual feature", () => {
    expect(dataset.diseaseRecords).toHaveLength(439);
    for (const record of dataset.diseaseRecords) {
      expect(record.provenance.url).toMatch(/^https?:\/\//);
      expect(record.visualFeatures.length).toBeGreaterThan(0);
      expect(record.visualFeatures.every(feature => feature.imageEligible)).toBe(true);
    }
  });

  it("keeps North-African data contextual and non-ranking", () => {
    for (const record of dataset.diseaseRecords) {
      expect(record.regionalContext).toEqual(expect.objectContaining({
        relevanceStatus: "contextual_only",
        diseasePresenceStatus: "not_assessed_per_record",
        rankingEffect: "none",
      }));
    }
  });

  it("does not include dangling knowledge-graph edges", () => {
    const nodeIds = new Set(graph.nodes.map(node => node.id));
    expect(graph.edges.every(edge => nodeIds.has(edge.from) && nodeIds.has(edge.to))).toBe(true);
    expect(graph.edges.some(edge => edge.type === "HAS_VISUAL_FEATURE")).toBe(true);
    expect(graph.edges.some(edge => edge.type === "HAS_FIELD_ONLY_OBSERVATION")).toBe(true);
  });

  it("exports differential cue sets without the retired ambiguous visual-cue field", () => {
    const differentialNodes = graph.nodes.filter(node => node.type === "DifferentialRule");
    expect(differentialNodes.length).toBeGreaterThan(0);

    for (const node of differentialNodes) {
      expect(node).toHaveProperty("cueSets");
      expect(node).not.toHaveProperty("visualCueFeatures");
      for (const cueSet of Object.values(node.cueSets)) {
        const shared = new Set(node.sharedFeatures || []);
        expect(cueSet.supportingFeatures.every(feature => !shared.has(feature))).toBe(true);
        expect(cueSet.opposingFeatures.every(feature => !shared.has(feature))).toBe(true);
      }
    }
  });
});
