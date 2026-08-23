import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const database = new DatabaseSync(path.join(root, "data", "cropguide.sqlite"), { readOnly: true });
const cropCount = database.prepare("SELECT COUNT(*) AS total FROM crops").get().total;
const diseaseCount = database.prepare("SELECT COUNT(*) AS total FROM diseases").get().total;
const missingRequiredText = database.prepare(`
  SELECT COUNT(*) AS total FROM diseases
  WHERE source_url = '' OR immediate_care_ar = '' OR conditional_care_ar = '' OR safety_ar = ''
`).get().total;

assert.equal(cropCount, 7, "Expected the seven first-release crops in SQLite.");
assert.ok(diseaseCount >= 7, "Expected at least one documented disease per first-release crop.");
assert.equal(missingRequiredText, 0, "Every disease needs source, immediate care, conditional care, and safety text.");
database.close();
console.log(`Knowledge base verified: ${cropCount} crops and ${diseaseCount} disease records.`);
