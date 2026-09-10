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
  quince: ["cydonia oblonga", "quince", "quince tree"],
  carob: ["ceratonia siliqua", "carob", "carob tree"],
  tomato: ["solanum lycopersicum", "tomato"],
  potato: ["solanum tuberosum", "potato"],
  pepper: ["capsicum annuum", "pepper", "chili pepper", "bell pepper"],
  onion: ["allium cepa", "onion"],
  garlic: ["allium sativum", "garlic"],
  watermelon: ["citrullus lanatus", "watermelon"],
  melon: ["cucumis melo", "melon", "cantaloupe"],
  cucumber: ["cucumis sativus", "cucumber"],
  zucchini: ["cucurbita pepo", "zucchini", "courgette", "summer squash"],
  pumpkin: ["cucurbita", "pumpkin", "winter squash"],
  lettuce: ["lactuca sativa", "lettuce"],
  carrot: ["daucus carota", "carrot"],
  pea: ["pisum sativum", "pea"],
  faba_bean: ["vicia faba", "faba bean", "broad bean"],
  bean: ["phaseolus vulgaris", "common bean", "green bean", "snap bean"],
  spinach: ["spinacia oleracea", "spinach"],
  parsley: ["petroselinum crispum", "parsley"],
  celery: ["apium graveolens", "celery"],
  artichoke: ["cynara cardunculus", "artichoke", "globe artichoke"],
  wheat: ["triticum aestivum", "wheat"],
  barley: ["hordeum vulgare", "barley"],
  maize: ["zea mays", "maize", "corn"],
  chickpea: ["cicer arietinum", "chickpea", "garbanzo"],
  lentil: ["lens culinaris", "lentil"],
  strawberry: ["fragaria", "strawberry"],
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
