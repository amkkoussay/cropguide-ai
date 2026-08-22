export type Candidate = {
  name: string;
  probability: number;
  commonNames?: string[];
};

export type ObservationSummary = {
  isPlant: boolean | null;
  isHealthy: boolean | null;
  topPlant: Candidate | null;
  topHealth: Candidate | null;
  plantCandidates: Candidate[];
  healthCandidates: Candidate[];
};

type UnknownRecord = Record<string, unknown>;
const providerSecretKeys = new Set(["access_token", "api_key", "authorization"]);

export class PlantIdRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "PlantIdRequestError";
  }
}

/** Plant.id v3 expects raw Base64 strings inside `images`, not browser data URLs. */
export function buildPlantIdPayload(imageBase64: string | string[]) {
  const images = (Array.isArray(imageBase64) ? imageBase64 : [imageBase64])
    .map(image => image.startsWith("data:image/") ? image.slice(image.indexOf(",") + 1) : image)
    .filter(Boolean);
  return { images };
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Removes credentials from a provider response before the response is stored with an observation. */
export function redactProviderResponse(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactProviderResponse);
  if (!isRecord(value)) return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !providerSecretKeys.has(key.toLowerCase()))
      .map(([key, child]) => [key, redactProviderResponse(child)]),
  );
}

function asCandidate(value: unknown): Candidate | null {
  if (!isRecord(value) || typeof value.name !== "string") return null;
  const probability = typeof value.probability === "number" ? value.probability : 0;
  const details = isRecord(value.details) ? value.details : undefined;
  const commonNames = Array.isArray(details?.common_names)
    ? details.common_names.filter((name): name is string => typeof name === "string")
    : undefined;
  return { name: value.name, probability, ...(commonNames?.length ? { commonNames } : {}) };
}

function candidatesFrom(value: unknown): Candidate[] {
  if (!Array.isArray(value)) return [];
  return value.map(asCandidate).filter((candidate): candidate is Candidate => candidate !== null).slice(0, 5);
}

function nullableBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

export function summarizePlantIdResponse(response: unknown): ObservationSummary {
  const result = isRecord(response) && isRecord(response.result) ? response.result : {};
  const classification = isRecord(result.classification) ? result.classification : {};
  const disease = isRecord(result.disease) ? result.disease : {};
  const isPlantResult = isRecord(result.is_plant) ? result.is_plant : {};
  const isHealthyResult = isRecord(result.is_healthy) ? result.is_healthy : {};
  const plantCandidates = candidatesFrom(classification.suggestions);
  const healthCandidates = candidatesFrom(disease.suggestions);

  return {
    isPlant: nullableBoolean(isPlantResult.binary),
    isHealthy: nullableBoolean(isHealthyResult.binary),
    topPlant: plantCandidates[0] ?? null,
    topHealth: healthCandidates[0] ?? null,
    plantCandidates,
    healthCandidates,
  };
}

export async function requestPlantAnalysis(input: { imageBase64s: string[] }): Promise<{ raw: unknown; summary: ObservationSummary }> {
  const apiKey = process.env.PLANT_ID_API_KEY;
  if (!apiKey) throw new Error("Plant.id is not configured on the server.");

  const query = new URLSearchParams({
    health: "all",
    details: "common_names,url,description,treatment",
    language: "en",
  });
  const response = await fetch(`https://api.plant.id/v3/identification?${query.toString()}`, {
    method: "POST",
    headers: { "Api-Key": apiKey, "Content-Type": "application/json" },
    // In v3, `custom_id` is an optional integer. CropGuide's species value is a
    // string and is already persisted in our own observation record, so do not
    // forward it as an invalid provider field.
    body: JSON.stringify(buildPlantIdPayload(input.imageBase64s)),
  });

  const rawText = await response.text();
  let raw: unknown = rawText;
  try {
    raw = JSON.parse(rawText);
  } catch {
    // Preserve an unexpected non-JSON provider response for diagnostics.
  }
  if (!response.ok) {
    const providerMessage = isRecord(raw) && typeof raw.message === "string" ? raw.message : "The provider rejected the image request.";
    throw new PlantIdRequestError(response.status, `Plant.id analysis failed (${response.status}): ${providerMessage}`);
  }

  return { raw: redactProviderResponse(raw), summary: summarizePlantIdResponse(raw) };
}
