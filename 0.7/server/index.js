import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import { getCrop, listVisionVocabulary, matchDiseases } from "./database.js";
import { identifyPlant } from "./plant.js";
import { extractVisibleSymptoms } from "./vision.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);
app.disable("x-powered-by");
app.use(express.json({ limit: "11mb" }));

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
  const entries = (requestWindows.get(ip) || []).filter(time => now - time < 60_000);
  if (entries.length >= 8) return false;
  entries.push(now);
  requestWindows.set(ip, entries);
  return true;
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/analyze", async (req, res) => {
  const { imageDataUrl } = req.body || {};
  if (!analysisRateAllowed(req.ip || "unknown")) {
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
    return res.json({
      status: diseases[0]?.evidenceScore >= 60 ? "matched" : "inconclusive",
      crop,
      detectedPlant: plant.candidate,
      cropSelection: { support: plant.cropConfidence, margin: plant.margin },
      observation,
      diseases: diseases[0]?.evidenceScore >= 60 ? diseases : [],
      privacy: "The image is sent to Plant.id and the configured visual-analysis provider for this request. CropGuide does not store the image; external providers process it under their own policies.",
    });
  } catch (error) {
    console.error("[CropGuide] analysis failed", error);
    return res.status(502).json({ error: error instanceof Error ? error.message : "Analysis could not be completed." });
  }
});

async function start() {
  if (process.env.NODE_ENV === "production") {
    const clientDir = path.resolve(__dirname, "../dist/public");
    app.use(express.static(clientDir, { index: false, maxAge: "1h" }));
    app.get("*", (_req, res) => {
      // The shell chooses hashed frontend assets. Revalidate it on every
      // navigation so a deployment cannot retain an older visual-identity
      // bundle in a browser or CDN cache.
      res.set({
        "Cache-Control": "no-store, max-age=0, must-revalidate",
        "CDN-Cache-Control": "no-store",
        "Surrogate-Control": "no-store",
      });
      res.sendFile(path.join(clientDir, "index.html"));
    });
  } else {
    // The managed preview URL is served by Vite and does not expose the
    // platform's /manus-storage edge route. Keep the production asset path in
    // the UI, but forward preview requests to the already stable project URL.
    app.get("/manus-storage/:asset", (req, res) => {
      res.redirect(307, `https://cropguideai-vzxcd2cz.manus.space/manus-storage/${encodeURIComponent(req.params.asset)}`);
    });
    const vite = await createViteServer({
      root: path.resolve(__dirname, "../client"),
      server: {
        middlewareMode: true,
        allowedHosts: ["3000-isqjra44p4h9d7aoit7hb-3e7437eb.us4.manus.computer"],
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }
  app.listen(port, () => console.log(`CropGuide is running at http://localhost:${port}`));
}

start().catch(error => {
  console.error(error);
  process.exit(1);
});
