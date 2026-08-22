export const fieldSpecies = [
  "olive",
  "pomegranate",
  "fig",
  "almond",
  "citrus",
  "grapevine",
  "date_palm",
  "stone_fruit",
  "unknown",
] as const;

export type FieldSpecies = (typeof fieldSpecies)[number];
