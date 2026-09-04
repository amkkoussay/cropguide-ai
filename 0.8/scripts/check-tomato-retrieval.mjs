import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { rankDiseaseRecords } from "../server/matcher.js";

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const databasePath = path.resolve(scriptsDirectory, "../data/cropguide.sqlite");
const database = new DatabaseSync(databasePath, { readOnly: true });
const records = database.prepare("SELECT * FROM diseases WHERE crop_id = ?").all("tomato");
const candidates = rankDiseaseRecords(records, {
  symptoms: ["dark_brown_spot", "yellow_halo"],
  symptomConfidence: 0.98,
  cropConfidence: 0.98,
});
database.close();

const earlyBlight = candidates.find(candidate => candidate.id === "tomato_early_blight");
if (!earlyBlight) throw new Error("Tomato early-blight record was not found in the matcher output.");

const isSafelyBlocked = earlyBlight.evidence.genericOnlyEvidence
  && !earlyBlight.evidence.retrievalSufficient
  && earlyBlight.evidenceScore <= 55;
if (!isSafelyBlocked) {
  throw new Error(`Generic tomato spot-plus-halo evidence was not safely blocked: ${JSON.stringify({
    evidenceScore: earlyBlight.evidenceScore,
    genericOnlyEvidence: earlyBlight.evidence.genericOnlyEvidence,
    retrievalSufficient: earlyBlight.evidence.retrievalSufficient,
  })}`);
}

console.log("Tomato generic-evidence guard verified: early blight is capped and not retrieval-sufficient.");
