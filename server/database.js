import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { collectSymptomVocabulary, rankDiseaseRecords } from "./matcher.js";

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const databasePath = path.resolve(serverDirectory, "../data", "cropguide.sqlite");
let database;

function getDatabase() {
  if (!database) {
    database = new DatabaseSync(databasePath, { readOnly: true });
  }
  return database;
}

export function listCropVocabulary(cropId) {
  const rows = getDatabase()
    .prepare("SELECT symptoms_json FROM diseases WHERE crop_id = ?")
    .all(cropId);
  return collectSymptomVocabulary(rows);
}

export function matchDiseases({ cropId, symptoms, symptomConfidence }) {
  const rows = getDatabase()
    .prepare("SELECT * FROM diseases WHERE crop_id = ?")
    .all(cropId);

  return rankDiseaseRecords(rows, { cropId, symptoms, symptomConfidence });
}

export function getCrop(cropId) {
  const row = getDatabase().prepare("SELECT * FROM crops WHERE id = ?").get(cropId);
  if (!row) return null;
  return {
    id: row.id,
    name: { ar: row.name_ar, fr: row.name_fr, en: row.name_en },
    scientificName: row.scientific_name,
  };
}
