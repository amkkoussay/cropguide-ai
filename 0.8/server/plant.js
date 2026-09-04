const cropAliases = {
  olive: ["olea europaea", "olive", "olive tree", "european olive", "african olive", "wild olive"],
  date_palm: ["phoenix dactylifera", "date palm", "date tree"],
  citrus: ["citrus", "orange", "lemon", "mandarin", "clementine", "lime", "grapefruit"],
  grapevine: ["vitis", "grape", "grapevine", "grape vine"],
  almond: ["prunus dulcis", "almond", "almond tree"],
  pomegranate: ["punica granatum", "pomegranate"],
  fig: ["ficus carica", "fig", "common fig"],
  peach: ["prunus persica", "peach", "peach tree"],
  apricot: ["prunus armeniaca", "apricot", "apricot tree"],
  apple: ["malus domestica", "apple", "apple tree"],
  pear: ["pyrus communis", "pear", "pear tree"],
  plum: ["prunus domestica", "plum", "plum tree"],
  pistachio: ["pistacia vera", "pistachio", "pistachio tree"],
  quince: ["cydonia oblonga", "quince"],
  carob: ["ceratonia siliqua", "carob"],
  tomato: ["solanum lycopersicum", "tomato"],
  potato: ["solanum tuberosum", "potato"],
  pepper: ["capsicum annuum", "pepper", "chili pepper", "bell pepper"],
  onion: ["allium cepa", "onion"], garlic: ["allium sativum", "garlic"],
  watermelon: ["citrullus lanatus", "watermelon"], melon: ["cucumis melo", "melon", "cantaloupe"],
  cucumber: ["cucumis sativus", "cucumber"], zucchini: ["cucurbita pepo", "zucchini", "courgette", "summer squash"],
  pumpkin: ["cucurbita", "pumpkin", "winter squash"], lettuce: ["lactuca sativa", "lettuce"],
  carrot: ["daucus carota", "carrot"], pea: ["pisum sativum", "pea"], faba_bean: ["vicia faba", "faba bean", "broad bean"],
  bean: ["phaseolus vulgaris", "common bean", "green bean", "snap bean"], spinach: ["spinacia oleracea", "spinach"],
  parsley: ["petroselinum crispum", "parsley"], celery: ["apium graveolens", "celery"],
  artichoke: ["cynara cardunculus", "artichoke", "globe artichoke"], wheat: ["triticum aestivum", "wheat"],
  barley: ["hordeum vulgare", "barley"], maize: ["zea mays", "maize", "corn"], chickpea: ["cicer arietinum", "chickpea", "garbanzo"],
  lentil: ["lens culinaris", "lentil"], strawberry: ["fragaria", "strawberry"],
};

export const CROP_SELECTION_POLICY = Object.freeze({
  minimumSupportedProbability: 0.55,
  minimumMargin: 0.12,
  maxSuggestionsConsidered: 10,
});

function clampProbability(value) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

function candidateFrom(value) {
  if (!value || typeof value.name !== "string") return null;
  const commonNames = Array.isArray(value.details?.common_names)
    ? value.details.common_names.filter(name => typeof name === "string") : [];
  return { name: value.name, probability: clampProbability(value.probability), commonNames };
}

function normalizedText(value) {
  return String(value || "").toLowerCase().normalize("NFKD").replace(/[×]/g, "x").replace(/[^a-z0-9]+/g, " ").trim();
}

function matchesAlias(text, alias) {
  const normalizedAlias = normalizedText(alias);
  if (!normalizedAlias) return false;
  const escaped = normalizedAlias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(^|\\s)${escaped}(?=\\s|$)`, "i").test(normalizedText(text));
}

export function cropFromPlantCandidate(candidate) {
  if (!candidate) return null;
  const descriptors = [candidate.name, ...candidate.commonNames];
  for (const [cropId, aliases] of Object.entries(cropAliases)) {
    if (aliases.some(alias => descriptors.some(descriptor => matchesAlias(descriptor, alias)))) return cropId;
  }
  return null;
}

/**
 * Maps Plant.id suggestions to supported crops before deciding. It never lets the
 * first raw suggestion silently choose a crop when another supported crop is close.
 */
export function selectSupportedCrop(suggestions, policy = CROP_SELECTION_POLICY) {
  const byCrop = new Map();
  const rawCandidates = [];
  for (const rawSuggestion of Array.isArray(suggestions) ? suggestions.slice(0, policy.maxSuggestionsConsidered) : []) {
    const candidate = candidateFrom(rawSuggestion);
    const cropId = cropFromPlantCandidate(candidate);
    if (candidate) rawCandidates.push({ ...candidate, cropId });
    if (!candidate || !cropId) continue;
    const current = byCrop.get(cropId);
    if (!current || candidate.probability > current.probability) byCrop.set(cropId, { cropId, ...candidate });
  }
  const ranked = [...byCrop.values()].sort((a, b) => b.probability - a.probability || a.cropId.localeCompare(b.cropId));
  const top = ranked[0] || null;
  const runnerUp = top ? rawCandidates
    .filter(candidate => candidate.cropId !== top.cropId)
    .sort((a, b) => b.probability - a.probability || a.name.localeCompare(b.name))[0] || null : null;
  const margin = top && runnerUp ? top.probability - runnerUp.probability : 1;
  const cropCandidates = ranked.map(({ cropId, name, probability }) => ({ cropId, name, support: probability }));

  if (!top) return { status: "unsupported", candidate: null, cropId: null, cropConfidence: 0, margin: 0, cropCandidates };
  if (top.probability < policy.minimumSupportedProbability) {
    return { status: "low_confidence", candidate: top, cropId: null, cropConfidence: top.probability, margin, cropCandidates };
  }
  if (runnerUp && margin < policy.minimumMargin) {
    return { status: "ambiguous", candidate: top, cropId: null, cropConfidence: top.probability, margin, cropCandidates };
  }
  return { status: "resolved", candidate: top, cropId: top.cropId, cropConfidence: top.probability, margin, cropCandidates };
}

export async function identifyPlant(imageDataUrl) {
  const apiKey = process.env.PLANT_ID_API_KEY;
  if (!apiKey) throw new Error("Plant identification is not configured.");
  const imageBase64 = imageDataUrl.slice(imageDataUrl.indexOf(",") + 1);
  const response = await fetch("https://api.plant.id/v3/identification?details=common_names&language=en", {
    method: "POST", headers: { "Api-Key": apiKey, "Content-Type": "application/json" }, body: JSON.stringify({ images: [imageBase64] }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error("Plant.id could not identify this image.");
  return selectSupportedCrop(body?.result?.classification?.suggestions);
}
