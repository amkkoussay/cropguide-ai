import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDirectory = path.join(root, "data");
const policy = JSON.parse(fs.readFileSync(path.join(dataDirectory, "symptom-ontology-policy.json"), "utf8"));
const database = new DatabaseSync(path.join(dataDirectory, "cropguide.sqlite"), { readOnly: true });

const featureFamilies = [
  { id: "ff.foliage", labels: { en: "Foliage", ar: "المجموع الورقي", fr: "Feuillage" } },
  { id: "ff.fruit", labels: { en: "Fruit", ar: "الثمرة", fr: "Fruit" } },
  { id: "ff.aerial-structure", labels: { en: "Stem, shoot, or aerial structure", ar: "الساق أو الأفرع أو البنية الهوائية", fr: "Tige, pousse ou structure aérienne" } },
  { id: "ff.root-crown-internal", labels: { en: "Root, crown, or internal tissue", ar: "الجذر أو التاج أو النسيج الداخلي", fr: "Racine, collet ou tissu interne" } },
  { id: "ff.whole-plant", labels: { en: "Whole-plant condition", ar: "حالة النبات الكلية", fr: "État général de la plante" } },
  { id: "ff.reproductive", labels: { en: "Reproductive structure", ar: "البنية التكاثرية", fr: "Structure reproductive" } },
  { id: "ff.palm", labels: { en: "Palm canopy", ar: "مجموع النخيل", fr: "Houppier de palmier" } },
  { id: "ff.tuber", labels: { en: "Tuber", ar: "الدرنة", fr: "Tubercule" } },
  { id: "ff.fungal-structure", labels: { en: "Visible fungal structure", ar: "بنية فطرية مرئية", fr: "Structure fongique visible" } },
  { id: "ff.general", labels: { en: "General observable symptom", ar: "عرض مرئي عام", fr: "Symptôme visible général" } },
];

function familyFor(featureId) {
  if (featureId.startsWith("vf.foliage") || ["vf.pustule", "vf.mosaic"].includes(featureId)) return "ff.foliage";
  if (featureId.startsWith("vf.fruit")) return "ff.fruit";
  if (featureId.startsWith("vf.stem") || featureId === "vf.shoot.decline" || featureId === "vf.exudate") return "ff.aerial-structure";
  if (featureId.startsWith("vf.root") || featureId === "vf.vascular.discoloration") return "ff.root-crown-internal";
  if (["vf.wilt.general", "vf.wilt.unilateral", "vf.seedling.condition", "vf.stunting"].includes(featureId)) return "ff.whole-plant";
  if (featureId === "vf.cereal.reproductive") return "ff.reproductive";
  if (featureId === "vf.palm.frond") return "ff.palm";
  if (featureId === "vf.tuber.surface") return "ff.tuber";
  if (featureId === "vf.fungal.structure") return "ff.fungal-structure";
  return "ff.general";
}

function parseSymptoms(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed.filter(item => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function attributesFor(token) {
  const parts = token.split("_");
  const attributeValues = {
    tissue: parts.filter(part => ["leaf", "fruit", "berry", "stem", "shoot", "twig", "root", "crown", "tuber", "frond", "rachis", "spikelet", "grain", "petiolar"].includes(part)),
    colour: parts.filter(part => ["black", "brown", "dark", "tan", "gray", "grayish", "green", "yellow", "yellowish", "white", "orange", "pink", "purple", "red", "pale", "light"].includes(part)),
    geometry: parts.filter(part => ["angular", "circular", "elliptical", "concentric", "horizontal", "irregular", "net", "rough", "sunken", "raised", "corky", "deep", "small", "tiny", "cigar", "oval"].includes(part)),
    surface: parts.filter(part => ["upper", "underside", "surface", "centered", "base", "tip", "margin", "lower", "older", "new"].includes(part)),
  };
  return Object.fromEntries(Object.entries(attributeValues).filter(([, values]) => values.length));
}

function featureFor(token) {
  const value = token.replaceAll("_", " ");
  if (/(gumming|gummy|ooze|exudate)/.test(value)) return "vf.exudate";
  if (/(root galls|root cavity|root gall|root lesion|darkened root|small horizontal root)/.test(value)) return "vf.root.gall";
  if (/vascular/.test(value)) return "vf.vascular.discoloration";
  if (/(crown browning|crown)/.test(value)) return "vf.root.crown";
  if (/one sided.*wilt/.test(value)) return "vf.wilt.unilateral";
  if (/(sudden wilting|wilting)/.test(value)) return "vf.wilt.general";
  if (/(seedling|emergence|plant base collapse)/.test(value)) return "vf.seedling.condition";
  if (/(frond|rachis)/.test(value)) return "vf.palm.frond";
  if (/tuber/.test(value)) return "vf.tuber.surface";
  if (/(spikelet|grain|yellow rust stripe)/.test(value)) return "vf.cereal.reproductive";
  if (/(pustule|rust stripe)/.test(value)) return "vf.pustule";
  if (/(acervuli|pycnidia|sclerotia)/.test(value)) return "vf.fungal.structure";
  if (/(mosaic|mottle)/.test(value)) return "vf.mosaic";
  if (/(stunting|decline|collapsed spur)/.test(value)) return "vf.stunting";
  if (/(fruit|berry|calyx|mummified)/.test(value)) {
    if (/(rot|decay|soft)/.test(value)) return "vf.fruit.rot";
    if (/(scar|mummif)/.test(value)) return "vf.fruit.scarring";
    return "vf.fruit.lesion";
  }
  if (/(canker|stem lesion|petiolar|shoot lesion|twig|scabby cane|swelling)/.test(value)) return "vf.stem.canker";
  if (/(stem rot|bud rot|stem base)/.test(value)) return "vf.stem.rot";
  if (/(shoot dieback|shoot tip|shoot spot)/.test(value)) return "vf.shoot.decline";
  if (/(powdery)/.test(value)) return "vf.foliage.growth.powdery";
  if (/(underside)/.test(value)) return "vf.foliage.growth.underside";
  if (/(fuzzy|mycelium|cottony)/.test(value)) return "vf.foliage.growth.fuzzy";
  if (/(curl|distortion)/.test(value)) return "vf.foliage.deformation";
  if (/(drop|collapse|hole)/.test(value)) return "vf.foliage.loss";
  if (/(yellowing|yellow shoot|yellow spot|yellow halo|yellow leaf|yellow upper|yellowish)/.test(value)) return "vf.foliage.yellowing";
  if (/(blight|browning|necrotic|blackened|charcoal|papery|withered|necrosis)/.test(value)) return "vf.foliage.necrosis";
  if (/(water soaked)/.test(value)) return "vf.foliage.water-soaked";
  if (/(spot|lesion|ring|halo)/.test(value)) return "vf.foliage.spot";
  return "vf.general.observable";
}

const rows = database.prepare("SELECT id, crop_id, symptoms_json FROM diseases ORDER BY id").all();
database.close();
const occurrences = new Map();
for (const row of rows) {
  for (const rawToken of parseSymptoms(row.symptoms_json)) {
    const canonicalToken = policy.exactAliases[rawToken] || rawToken;
    const entry = occurrences.get(rawToken) || { rawToken, canonicalToken, diseaseIds: [], cropIds: [] };
    entry.diseaseIds.push(row.id);
    if (!entry.cropIds.includes(row.crop_id)) entry.cropIds.push(row.crop_id);
    occurrences.set(rawToken, entry);
  }
}

const features = policy.features.map(feature => ({ ...feature, familyId: familyFor(feature.id) }));
const featureById = new Map(features.map(feature => [feature.id, feature]));
const observations = [...occurrences.values()].map(entry => {
  const featureId = featureFor(entry.canonicalToken);
  if (!featureById.has(featureId)) throw new Error(`No feature policy exists for ${featureId}.`);
  return {
    id: `obs.${entry.rawToken}`,
    legacyToken: entry.rawToken,
    canonicalToken: entry.canonicalToken,
    canonicalFeatureId: featureId,
    attributes: attributesFor(entry.canonicalToken),
    diseaseIds: entry.diseaseIds.sort(),
    cropIds: entry.cropIds.sort(),
  };
}).sort((left, right) => left.legacyToken.localeCompare(right.legacyToken));

const ontology = {
  schemaVersion: policy.schemaVersion,
  generatedAt: new Date().toISOString(),
  scope: policy.scope,
  aliasPolicy: policy.aliasPolicy,
  featureFamilies,
  features,
  observations,
  aliases: Object.entries(policy.exactAliases).map(([alias, canonicalToken]) => ({
    alias,
    canonicalToken,
    policy: "exact_or_near_exact_visible_meaning",
    isUsedByCurrentLegacyToken: occurrences.has(alias),
  })),
  aliasesResolved: observations.filter(observation => observation.legacyToken !== observation.canonicalToken).map(observation => ({
    alias: observation.legacyToken,
    canonicalToken: observation.canonicalToken,
    observationId: observation.id,
  })),
  validation: {
    observationCount: observations.length,
    featureCount: features.length,
    featureFamilyCount: featureFamilies.length,
    featuresWithoutFamilyCount: features.filter(feature => !feature.familyId).length,
    observationsWithoutFeatureCount: observations.filter(observation => !observation.canonicalFeatureId).length,
    currentLegacyTokensResolvedThroughAliasCount: observations.filter(observation => observation.legacyToken !== observation.canonicalToken).length,
    unmappedObservationCount: observations.filter(observation => !observation.canonicalFeatureId).length,
    fieldOnlyObservationCount: observations.filter(observation => featureById.get(observation.canonicalFeatureId).extractability === "field_only").length,
  },
};

fs.writeFileSync(path.join(dataDirectory, "symptom-ontology.json"), `${JSON.stringify(ontology, null, 2)}\n`);
console.log(`Built symptom ontology with ${ontology.validation.observationCount} observations, ${ontology.validation.featureCount} canonical visual features, and ${ontology.validation.featureFamilyCount} feature families.`);
