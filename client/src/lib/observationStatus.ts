export type ObservationHealthSummary = {
  topHealth?: { name: string; probability: number } | null;
  isHealthy?: boolean | null;
  healthCandidates?: Array<{ name: string; probability: number }>;
};

export function healthStatusKey(summary: ObservationHealthSummary) {
  if (summary.isHealthy === true) return "status.healthy";
  if (summary.topHealth?.name) return "status.pending";
  if (Array.isArray(summary.healthCandidates)) return "status.none";
  return "status.pending";
}

export function healthStatusLabel(summary: ObservationHealthSummary) {
  if (summary.isHealthy === true) return "likely healthy";
  if (summary.topHealth?.name) return summary.topHealth.name;
  if (Array.isArray(summary.healthCandidates)) return "no health signal returned";
  return "assessment pending";
}
