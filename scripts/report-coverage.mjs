import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const database = new DatabaseSync(path.join(root, "data", "cropguide.sqlite"), { readOnly: true });

const totals = database.prepare(`
  SELECT
    COUNT(*) AS diseases,
    COUNT(DISTINCT crop_id) AS crops,
    SUM(CASE WHEN source_scope = 'record_specific' THEN 1 ELSE 0 END) AS record_specific,
    SUM(CASE WHEN source_scope = 'crop_group' THEN 1 ELSE 0 END) AS crop_group,
    SUM(CASE WHEN symptoms_json != '[]' AND symptoms_json != '' THEN 1 ELSE 0 END) AS with_symptoms,
    SUM(CASE WHEN field_check_ar != '' AND field_check_fr != '' AND field_check_en != '' THEN 1 ELSE 0 END) AS with_field_checks
  FROM diseases
`).get();
const cropRows = database.prepare(`
  SELECT c.name_ar, c.name_fr, c.name_en, COUNT(d.id) AS disease_count
  FROM crops c
  LEFT JOIN diseases d ON d.crop_id = c.id
  GROUP BY c.id
  ORDER BY c.name_en
`).all();
database.close();

const lines = [
  "# CropGuide coverage snapshot",
  "",
  "> Generated from `data/cropguide.sqlite`. This is a coverage count, not a diagnostic accuracy claim.",
  "",
  `- **Crops:** ${totals.crops}`,
  `- **Disease candidate records:** ${totals.diseases}`,
  `- **Record-specific source scope:** ${totals.record_specific}`,
  `- **Crop-group source scope:** ${totals.crop_group}`,
  `- **Records with visual symptom tokens:** ${totals.with_symptoms}`,
  `- **Records with field checks in Arabic, French, and English:** ${totals.with_field_checks}`,
  "",
  "## Records by crop",
  "",
  "| Arabic | French | English | Records |",
  "|---|---|---|---:|",
  ...cropRows.map((crop) => `| ${crop.name_ar} | ${crop.name_fr} | ${crop.name_en} | ${crop.disease_count} |`),
  "",
  "## Reading the source scope",
  "",
  "A **record-specific** source is tied to the individual disease record. A **crop-group** source supports the disease family or crop group and remains marked `source_mapped` until a record-specific review is approved. The monthly review checks links and opens review items; it never changes advice automatically.",
  "",
];

fs.writeFileSync(path.join(root, "data", "coverage.md"), `${lines.join("\n")}\n`);
console.log(`Coverage report saved: data/coverage.md (${totals.crops} crops, ${totals.diseases} records).`);
