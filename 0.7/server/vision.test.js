import { describe, expect, it } from "vitest";
import { parseVisibleSymptoms } from "./vision.js";

const allowed = ["circular_dark_spots", "yellow_halos", "white_powdery_growth"];

describe("parseVisibleSymptoms", () => {
  it("reads a strict complete response and limits symptom codes to the crop vocabulary", () => {
    const result = parseVisibleSymptoms(JSON.stringify({
      imageQuality: "adequate",
      symptoms: ["circular_dark_spots", "not-an-allowed-code"],
      symptomConfidence: 0.76,
      visibleEvidence: "Round dark marks are visible on the leaf.",
      opaqueModelField: "must not persist",
    }), allowed);

    expect(result).toEqual({
      imageQuality: "adequate",
      imageValidity: "uncertain",
      symptoms: ["circular_dark_spots"],
      symptomConfidence: 0.76,
      visibleEvidence: "Round dark marks are visible on the leaf.",
      unfamiliarObservation: "",
    });
  });

  it("recovers safe fields from multipart truncated content without exposing partial prose", () => {
    const result = parseVisibleSymptoms([
      { type: "text", text: '{"imageQuality":"adequate","symptoms":["circular_dark_spots","yellow_halos"],"symptomConfidence":0.6,"visibleEvidence":"A partially returned ' },
      { type: "image_url", image_url: { url: "data:image/jpeg;base64,secret-image-bytes" } },
    ], allowed);

    expect(result).toEqual({
      imageQuality: "adequate",
      imageValidity: "uncertain",
      symptoms: ["circular_dark_spots", "yellow_halos"],
      symptomConfidence: 0.6,
      visibleEvidence: "",
    });
  });

  it("preserves a non-diagnostic image-validity gate and unfamiliar visible sign", () => {
    const result = parseVisibleSymptoms(JSON.stringify({
      imageQuality: "adequate", imageValidity: "healthy_or_no_clear_symptoms", symptoms: [], symptomConfidence: 0.3,
      visibleEvidence: "Leaf appears intact.", unfamiliarObservation: "A pale edge is visible but has no listed code.",
    }), allowed);
    expect(result).toMatchObject({ imageValidity: "healthy_or_no_clear_symptoms", symptoms: [], unfamiliarObservation: "A pale edge is visible but has no listed code." });
  });
});
