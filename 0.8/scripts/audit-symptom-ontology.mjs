import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDirectory = path.join(root, "data");
const database = new DatabaseSync(path.join(dataDirectory, "cropguide.sqlite"), { readOnly: true });

function parseSymptoms(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed.filter(item => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function descriptor(token) {
  const parts = token.split("_");
  return parts.at(-1) || token;
}

function sharedMeaningfulParts(left, right) {
  const stopWords = new Set(["leaf", "plant", "growth", "upper", "lower", "new", "old", "or", "and"]);
  const leftParts = new Set(left.split("_").filter(part => !stopWords.has(part)));
  return right.split("_").filter(part => leftParts.has(part) && !stopWords.has(part));
}

const diseaseRows = database.prepare("SELECT id, crop_id, symptoms_json FROM diseases ORDER BY id").all();
database.close();

const tokens = new Map();
for (const row of diseaseRows) {
  for (const token of parseSymptoms(row.symptoms_json)) {
    const usage = tokens.get(token) || { token, diseaseIds: [], cropIds: [] };
    usage.diseaseIds.push(row.id);
    if (!usage.cropIds.includes(row.crop_id)) usage.cropIds.push(row.crop_id);
    tokens.set(token, usage);
  }
}

const vocabulary = [...tokens.values()]
  .map(entry => ({
    token: entry.token,
    descriptor: descriptor(entry.token),
    diseaseCount: entry.diseaseIds.length,
    cropCount: entry.cropIds.length,
    diseaseIds: entry.diseaseIds.sort(),
    cropIds: entry.cropIds.sort(),
  }))
  .sort((left, right) => left.token.localeCompare(right.token));

const normalizationReviewPairs = [];
for (let index = 0; index < vocabulary.length; index += 1) {
  for (let otherIndex = index + 1; otherIndex < vocabulary.length; otherIndex += 1) {
    const left = vocabulary[index];
    const right = vocabulary[otherIndex];
    const sharedParts = sharedMeaningfulParts(left.token, right.token);
    if (left.descriptor === right.descriptor || sharedParts.length >= 2) {
      normalizationReviewPairs.push({
        left: left.token,
        right: right.token,
        reason: left.descriptor === right.descriptor
          ? `shared terminal descriptor: ${left.descriptor}`
          : `shared lexical parts: ${sharedParts.join(", ")}`,
      });
    }
  }
}

const report = {
  schemaVersion: "0.1.0",
  generatedAt: new Date().toISOString(),
  purpose: "Inventory only. Candidate relationships require scientific review before any aliases are merged.",
  summary: {
    diseaseRecords: diseaseRows.length,
    uniqueTokens: vocabulary.length,
    totalDiseaseToTokenAssertions: vocabulary.reduce((sum, entry) => sum + entry.diseaseCount, 0),
    singleUseTokens: vocabulary.filter(entry => entry.diseaseCount === 1).length,
    candidateNormalizationPairs: normalizationReviewPairs.length,
  },
  vocabulary,
  normalizationReviewPairs,
};

fs.writeFileSync(path.join(dataDirectory, "symptom-ontology-audit.json"), `${JSON.stringify(report, null, 2)}\n`);

const markdown = [
  "# Symptom Ontology Audit",
  "",
  "> This inventory does not merge aliases automatically. A lexical relationship is only a review prompt, not evidence that two visual features are equivalent.",
  "",
  `- **Disease records:** ${report.summary.diseaseRecords}`,
  `- **Unique current symptom tokens:** ${report.summary.uniqueTokens}`,
  `- **Disease-to-token assertions:** ${report.summary.totalDiseaseToTokenAssertions}`,
  `- **Single-use tokens needing careful review:** ${report.summary.singleUseTokens}`,
  `- **Lexical review pairs:** ${report.summary.candidateNormalizationPairs}`,
  "",
  "## Current Token Inventory",
  "",
  "| Token | Terminal descriptor | Disease records | Crops |",
  "|---|---|---:|---:|",
  ...vocabulary.map(entry => `| \`${entry.token}\` | ${entry.descriptor} | ${entry.diseaseCount} | ${entry.cropCount} |`),
  "",
  "## Candidate Relationships for Human Review",
  "",
  "| Token A | Token B | Why this was flagged |",
  "|---|---|---|",
  ...normalizationReviewPairs.map(pair => `| \`${pair.left}\` | \`${pair.right}\` | ${pair.reason} |`),
  "",
  "## Next Decision",
  "",
  "The canonical ontology must define a feature ID, EN/AR/FR labels, aliases, visual observability, tissue/location/pattern attributes, and whether a token is safe to request from an image-only extraction model.",
  "",
].join("\n");

fs.writeFileSync(path.join(dataDirectory, "symptom-ontology-audit.md"), markdown);
console.log(`Audited ${report.summary.diseaseRecords} disease records and ${report.summary.uniqueTokens} symptom tokens.`);
