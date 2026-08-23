const cropAliases = {
  olive: ["olea europaea", "olive", "olive tree", "european olive", "african olive", "wild olive"],
  almond: ["prunus dulcis", "almond", "almond tree"],
  pomegranate: ["punica granatum", "pomegranate"],
  fig: ["ficus carica", "fig", "common fig"],
  grapevine: ["vitis", "grape", "grapevine", "grape vine"],
  tomato: ["solanum lycopersicum", "tomato"],
  potato: ["solanum tuberosum", "potato"],
};

function candidateFrom(value) {
  if (!value || typeof value.name !== "string") return null;
  const commonNames = Array.isArray(value.details?.common_names)
    ? value.details.common_names.filter(name => typeof name === "string")
    : [];
  return {
    name: value.name,
    probability: typeof value.probability === "number" ? value.probability : 0,
    commonNames,
  };
}

export function cropFromPlantCandidate(candidate) {
  if (!candidate) return null;
  const descriptor = [candidate.name, ...candidate.commonNames].join(" ").toLowerCase();
  for (const [cropId, aliases] of Object.entries(cropAliases)) {
    if (aliases.some(alias => descriptor.includes(alias))) return cropId;
  }
  return null;
}

export async function identifyPlant(imageDataUrl) {
  const apiKey = process.env.PLANT_ID_API_KEY;
  if (!apiKey) throw new Error("Plant identification is not configured.");
  const imageBase64 = imageDataUrl.slice(imageDataUrl.indexOf(",") + 1);
  const response = await fetch("https://api.plant.id/v3/identification?details=common_names&language=en", {
    method: "POST",
    headers: { "Api-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ images: [imageBase64] }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error("Plant.id could not identify this image.");
  const suggestions = body?.result?.classification?.suggestions;
  const candidate = Array.isArray(suggestions) ? candidateFrom(suggestions[0]) : null;
  return { candidate, cropId: cropFromPlantCandidate(candidate) };
}
