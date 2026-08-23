export function extractTextContent(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter(part => part && part.type === "text" && typeof part.text === "string")
    .map(part => part.text)
    .join("\n");
}

function boundedNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

function safeStructuredSymptoms(value, allowedSymptoms) {
  return Array.isArray(value) ? value.filter(symptom => typeof symptom === "string" && allowedSymptoms.includes(symptom)) : [];
}

function recoverTruncatedPayload(text, allowedSymptoms) {
  const symptomSection = text.match(/"symptoms"\s*:\s*\[([\s\S]*?)(?:\]|$)/)?.[1] || "";
  const symptoms = [...symptomSection.matchAll(/"([^"\\]+)"/g)]
    .map(match => match[1])
    .filter(symptom => allowedSymptoms.includes(symptom));
  const quality = text.match(/"imageQuality"\s*:\s*"(adequate|limited)"/)?.[1];
  const confidenceText = text.match(/"symptomConfidence"\s*:\s*(-?(?:\d+(?:\.\d*)?|\.\d+))/)?.[1];
  return {
    imageQuality: quality === "adequate" ? "adequate" : "limited",
    symptoms,
    symptomConfidence: boundedNumber(Number(confidenceText)),
    // Do not preserve incomplete raw model prose in a response that will reach the browser.
    visibleEvidence: "",
  };
}

export function parseVisibleSymptoms(content, allowedSymptoms) {
  const text = extractTextContent(content).trim().replace(/^```(?:json)?\s*|\s*```$/g, "");
  if (!text) return recoverTruncatedPayload("", allowedSymptoms);
  try {
    const parsed = JSON.parse(text);
    return {
      imageQuality: parsed.imageQuality === "adequate" ? "adequate" : "limited",
      symptoms: safeStructuredSymptoms(parsed.symptoms, allowedSymptoms),
      symptomConfidence: boundedNumber(parsed.symptomConfidence),
      visibleEvidence: typeof parsed.visibleEvidence === "string" ? parsed.visibleEvidence.slice(0, 240) : "",
    };
  } catch {
    return recoverTruncatedPayload(text, allowedSymptoms);
  }
}

export async function extractVisibleSymptoms({ imageDataUrl, cropName, allowedSymptoms }) {
  const apiUrl = `${(process.env.BUILT_IN_FORGE_API_URL || "https://forge.manus.im").replace(/\/$/, "")}/v1/chat/completions`;
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY;
  if (!apiKey) throw new Error("Visual symptom analysis is not configured.");

  const schema = {
    type: "object",
    properties: {
      imageQuality: { type: "string", enum: ["adequate", "limited"] },
      symptoms: { type: "array", items: { type: "string", enum: allowedSymptoms }, maxItems: 7 },
      symptomConfidence: { type: "number", minimum: 0, maximum: 1 },
      visibleEvidence: { type: "string", maxLength: 240 },
    },
    required: ["imageQuality", "symptoms", "symptomConfidence", "visibleEvidence"],
    additionalProperties: false,
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gemini-3-flash-preview",
      max_tokens: 700,
      response_format: { type: "json_schema", json_schema: { name: "visible_plant_symptoms", strict: true, schema } },
      messages: [
        {
          role: "system",
          content: "You are a cautious agricultural visual-observation extractor. Report only what is visible in the supplied image. Never name a disease, pathogen, pest, treatment, crop variety, or diagnosis. If evidence is unclear, return an empty symptoms list and limited image quality.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: `The Plant.id crop label is ${cropName}. Select only visible symptom codes from this allowed vocabulary: ${allowedSymptoms.join(", ")}. Do not infer symptoms that are not visible.` },
            { type: "image_url", image_url: { url: imageDataUrl, detail: "high" } },
          ],
        },
      ],
    }),
  });
  if (!response.ok) throw new Error("The visual symptom service is temporarily unavailable.");
  const body = await response.json();
  return parseVisibleSymptoms(body?.choices?.[0]?.message?.content, allowedSymptoms);
}
