import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import { getCrop, listCropVocabulary, matchDiseases } from "./database.js";
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

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/analyze", async (req, res) => {
  const { imageDataUrl } = req.body || {};
  if (!imageIsSupported(imageDataUrl)) {
    return res.status(400).json({ error: "Please upload a JPEG, PNG, or WebP image." });
  }
  if (Buffer.byteLength(imageDataUrl, "utf8") > 10 * 1024 * 1024) {
    return res.status(413).json({ error: "Please choose an image under 7 MB." });
  }

  try {
    const plant = await identifyPlant(imageDataUrl);
    if (!plant.candidate || !plant.cropId) {
      return res.json({
        status: "unsupported_crop",
        detectedPlant: plant.candidate,
        message: "This image could not be matched to one of the seven supported crops.",
      });
    }
    const crop = getCrop(plant.cropId);
    const allowedSymptoms = listCropVocabulary(plant.cropId);
    const observation = await extractVisibleSymptoms({
      imageDataUrl,
      cropName: crop.scientificName,
      allowedSymptoms,
    });
    const diseases = matchDiseases({
      cropId: plant.cropId,
      symptoms: observation.symptoms,
      symptomConfidence: observation.symptomConfidence,
    });
    return res.json({
      status: diseases.length ? "matched" : "inconclusive",
      crop,
      detectedPlant: plant.candidate,
      observation,
      diseases,
      privacy: "The uploaded image is analysed for this request and is not saved in CropGuide.",
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
