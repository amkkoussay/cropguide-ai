import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const policy = JSON.parse(await fs.readFile(path.join(root, "data", "review-policy.json"), "utf8"));
const database = new DatabaseSync(path.join(root, "data", "cropguide.sqlite"), { readOnly: true });
const sourceRows = database.prepare(`
  SELECT source_url AS url, source_scope AS scope, COUNT(*) AS recordCount
  FROM diseases GROUP BY source_url, source_scope ORDER BY source_url
`).all();
const statusRows = database.prepare(`
  SELECT review_status AS status, COUNT(*) AS recordCount FROM diseases GROUP BY review_status
`).all();
database.close();

async function checkSource({ url, scope, recordCount }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { redirect: "follow", signal: controller.signal });
    await response.body?.cancel();
    return { url, scope, recordCount, ok: response.ok, status: response.status, checkedAt: new Date().toISOString() };
  } catch (error) {
    return { url, scope, recordCount, ok: false, status: null, error: error.name, checkedAt: new Date().toISOString() };
  } finally {
    clearTimeout(timeout);
  }
}

const sources = [];
for (const row of sourceRows) sources.push(await checkSource(row));

const createdAt = new Date().toISOString();
const report = {
  createdAt,
  policy: {
    frequency: policy.frequency,
    timezone: policy.timezone,
    autoApplyDiseaseChanges: policy.autoApplyDiseaseChanges,
    humanApprovalRequired: policy.humanApprovalRequired,
  },
  summary: {
    totalSources: sources.length,
    reachableSources: sources.filter((source) => source.ok).length,
    unavailableSources: sources.filter((source) => !source.ok).length,
    reviewStatusCounts: statusRows,
  },
  sources,
  nextAction: "Record any source change in data/review-queue.md. Do not edit disease guidance automatically.",
};

const outputDirectory = path.join(root, policy.outputDirectory);
await fs.mkdir(outputDirectory, { recursive: true });
const outputPath = path.join(outputDirectory, `source-review-${createdAt.replace(/[:.]/g, "-")}.json`);
await fs.writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Source review saved: ${path.relative(root, outputPath)} (${report.summary.reachableSources}/${report.summary.totalSources} reachable).`);
