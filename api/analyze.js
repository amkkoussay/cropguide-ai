import { gunzipSync } from "node:zlib";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const DB_TMP = "/tmp/cropguide.sqlite";
if (!existsSync(DB_TMP)) {
  const gz = readFileSync(new URL("../data/cropguide.sqlite.gz", import.meta.url));
  writeFileSync(DB_TMP, gunzipSync(gz));
}
process.env.CROPGUIDE_DB_PATH = DB_TMP;

const { getCrop, listVisionVocabulary, matchDiseases } = await import("../server/database.js");
const { identifyPlant } = await import("../server/plant.js");
const { extractVisibleSymptoms } = await import("../server/vision.js");

function imageIsSupported(value) {
  return typeof value === "string" && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=\s]+$/.test(value);
}

function hasSupportedImageBytes(dataUrl) {
  const encoded = dataUrl.slice(dataUrl.indexOf(",") + 1).replace(/\s/g, "");
  const bytes = Buffer.from(encoded, "base64");
  if (bytes.length < 12 || bytes.length > 7 * 1024 * 1024) return false;
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp = bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  return isJpeg || isPng || isWebp;
}

const requestWindows = new Map();
function analysisRateAllowed(ip) {
  const now = Date.now();
  const entries = (requestWindows.get(ip) || []).filter((time) => now - time < 60_000);
  if (entries.length >= 8) return false;
  entries.push(now);
  requestWindows.set(ip, entries);
  return true;
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) return forwarded.split(",")[0].trim();
  return "unknown";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const { imageDataUrl } = req.body || {};
  if (!analysisRateAllowed(clientIp(req))) {
    return res.status(429).json({ error: "Too many analysis requests. Please wait one minute and try again." });
  }
  if (!imageIsSupported(imageDataUrl)) {
    return res.status(400).json({ error: "Please upload a JPEG, PNG, or WebP image." });
  }
  if (!hasSupportedImageBytes(imageDataUrl)) {
    return res.status(400).json({ error: "The image data could not be verified. Please upload a valid JPEG, PNG, or WebP file." });
  }
  if (Buffer.byteLength(imageDataUrl, "utf8") > 10 * 1024 * 1024) {
    return res.status(413).json({ error: "Please choose an image under 7 MB." });
  }

  try {
    const plant = await identifyPlant(imageDataUrl);
    if (plant.status !== "resolved" || !plant.candidate || !plant.cropId) {
      return res.json({
        status: plant.status === "unsupported" ? "unsupported_crop" : "crop_uncertain",
        detectedPlant: plant.candidate,
        cropCandidates: plant.cropCandidates,
        message: plant.status === "unsupported"
          ? "This image could not be matched to one of the 40 supported crops."
          : "Crop identification is not clear enough to safely rank diseases.",
      });
    }
    const crop = getCrop(plant.cropId);
    const allowedSymptoms = listVisionVocabulary();
    const observation = await extractVisibleSymptoms({
      imageDataUrl,
      cropName: crop.scientificName,
      allowedSymptoms,
    });
    if (observation.imageQuality !== "adequate" || observation.imageValidity !== "plant_symptoms_visible") {
      const status = observation.imageValidity === "unrelated_or_multiple" ? "image_invalid"
        : observation.imageValidity === "healthy_or_no_clear_symptoms" ? "no_clear_symptoms" : "image_limited";
      return res.json({
        status, crop, detectedPlant: plant.candidate, cropSelection: { support: plant.cropConfidence, margin: plant.margin }, observation, diseases: [],
        message: "The image does not provide enough clear, single-plant symptom evidence to rank diseases safely.",
        privacy: "The image is sent to Plant.id and the configured visual-analysis provider for this request. CropGuide does not store the image; external providers process it under their own policies.",
      });
    }
    const diseases = matchDiseases({
      cropId: plant.cropId,
      symptoms: observation.symptoms,
      symptomConfidence: observation.symptomConfidence,
      cropConfidence: plant.cropConfidence,
    });
    const leadingCandidate = diseases[0];
    const canReturnCandidates = Boolean(leadingCandidate?.evidence?.retrievalSufficient);
    return res.json({
      status: !canReturnCandidates ? "inconclusive"
        : leadingCandidate.decision === "field_confirmation_required" ? "field_confirmation_required" : "matched",
      crop,
      detectedPlant: plant.candidate,
      cropSelection: { support: plant.cropConfidence, margin: plant.margin },
      observation,
      diseases: canReturnCandidates ? diseases : [],
      message: !canReturnCandidates
        ? "The visible observations are not sufficiently distinct to return disease candidates safely."
        : undefined,
      privacy: "The image is sent to Plant.id and the configured visual-analysis provider for this request. CropGuide does not store the image; external providers process it under their own policies.",
    });
  } catch (error) {
    console.error("[CropGuide] analysis failed", error);
    return res.status(502).json({ error: error instanceof Error ? error.message : "Analysis could not be completed." });
  }
}
