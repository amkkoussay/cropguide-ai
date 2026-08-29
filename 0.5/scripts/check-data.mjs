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
  WHERE source_url = '' OR immediate_care_ar = '' OR immediate_care_fr = '' OR immediate_care_en = ''
    OR conditional_care_ar = '' OR conditional_care_fr = '' OR conditional_care_en = ''
    OR safety_ar = '' OR safety_fr = '' OR safety_en = ''
`).get().total;
const missingSymptomsOrFieldChecks = database.prepare(`
  SELECT COUNT(*) AS total FROM diseases
  WHERE symptoms_json = '[]' OR symptoms_json = ''
    OR evidence_ar = '' OR evidence_fr = '' OR evidence_en = ''
    OR field_check_ar = '' OR field_check_fr = '' OR field_check_en = ''
`).get().total;
const cropsBelowMinimum = database.prepare(`
  SELECT COUNT(*) AS total FROM (
    SELECT crop_id, COUNT(*) AS disease_count FROM diseases GROUP BY crop_id HAVING disease_count < 8
  )
`).get().total;
const duplicateDiseaseNames = database.prepare(`
  SELECT COUNT(*) AS total FROM (
    SELECT crop_id, name_en, COUNT(*) AS duplicate_count FROM diseases GROUP BY crop_id, name_en HAVING duplicate_count > 1
  )
`).get().total;
const invalidSourceMetadata = database.prepare(`
  SELECT COUNT(*) AS total FROM diseases
  WHERE source_scope NOT IN ('record_specific', 'crop_group')
     OR review_status NOT IN ('reviewed', 'source_mapped', 'pending_evidence')
`).get().total;
const groupSourceWithoutReviewFlag = database.prepare(`
  SELECT COUNT(*) AS total FROM diseases
  WHERE source_scope = 'crop_group' AND review_status != 'source_mapped'
`).get().total;

assert.equal(cropCount, 40, "Expected the 40-crop catalog in SQLite.");
assert.ok(diseaseCount >= 400, "Expected at least 400 source-mapped disease candidate records.");
assert.equal(cropsBelowMinimum, 0, "Every crop needs at least eight documented candidate records.");
assert.equal(duplicateDiseaseNames, 0, "Each crop must not contain duplicate English disease names.");
assert.equal(missingRequiredText, 0, "Every disease needs a source and three-language immediate, conditional, and safety text.");
assert.equal(missingSymptomsOrFieldChecks, 0, "Every disease needs visible symptoms, evidence text, and field checks in all three languages.");
assert.equal(invalidSourceMetadata, 0, "Every disease needs a valid source scope and review status.");
assert.equal(groupSourceWithoutReviewFlag, 0, "Group-level sources must stay marked as source-mapped until individually reviewed.");
database.close();
console.log(`Knowledge base verified: ${cropCount} crops and ${diseaseCount} disease records.`);
