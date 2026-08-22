import { Link } from "wouter";
import { AlertTriangle, ArrowLeft, CheckCircle2, CircleHelp, Download, Leaf, MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { getVisitorId } from "@/lib/visitor";
import type { FieldSpecies } from "@shared/species";

type Candidate = { name: string; probability: number; commonNames?: string[] };
type Summary = { isPlant: boolean | null; isHealthy: boolean | null; topPlant: Candidate | null; topHealth: Candidate | null; plantCandidates: Candidate[]; healthCandidates: Candidate[] };
function CandidateList({ candidates, emptyLabel }: { candidates: Candidate[]; emptyLabel: string }) { return !candidates.length ? <p className="candidate-empty">{emptyLabel}</p> : <div className="candidate-list">{candidates.map(candidate => <div className="candidate" key={`${candidate.name}-${candidate.probability}`}><div><strong>{candidate.name}</strong>{candidate.commonNames?.length ? <span>{candidate.commonNames.join(", ")}</span> : null}</div><div className="candidate-score"><span>{Math.round(candidate.probability * 100)}%</span><Progress value={candidate.probability * 100} /></div></div>)}</div>; }

export default function ObservationResult({ id }: { id: number }) {
  const { formatDateTime, speciesLabel, t } = useLanguage();
  const result = trpc.observation.get.useQuery({ id, visitorId: getVisitorId() });
  if (result.isLoading) return <div className="loading-note">{t("result.loading")}</div>;
  if (!result.data) return <div className="loading-note">{t("result.missing")}</div>;
  const observation = result.data;
  const summary = observation.summary as Summary;
  const species = speciesLabel(observation.species as FieldSpecies);
  const rawHref = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(observation.apiResponse, null, 2))}`;
  const healthState = summary.isHealthy === true ? t("result.likelyHealthy") : summary.topHealth?.name ?? t("result.closerLook");
  return <div className="page-shell result-shell mx-auto max-w-5xl"><Link href="/history" className="back-link"><ArrowLeft size={17} /> {t("result.archive")}</Link><header className="result-heading"><div><p className="eyebrow">{t("history.scan", { id: observation.id })}</p><h1>{t("result.observation", { species })}</h1><p>{formatDateTime(observation.capturedAt)}</p></div><Badge className="experimental-badge"><AlertTriangle size={14} />{t("result.experimental")}</Badge></header><Card className="result-hero"><img src={observation.imageUrl} alt={`${species} ${t("home.leafPhoto")}`} /><div className="result-hero-copy"><p className="eyebrow">{t("result.healthSignal")}</p><h2>{healthState}</h2><p>{summary.isHealthy === true ? t("result.healthyLead") : t("result.inspectLead")}</p><div className="result-facts"><span>{summary.isPlant === true ? <CheckCircle2 size={16} /> : <CircleHelp size={16} />} {summary.isPlant === true ? t("result.plantDetected") : t("result.plantUnavailable")}</span>{observation.latitude !== null && observation.longitude !== null ? <span><MapPin size={16} />{t("result.gps")}</span> : null}</div></div></Card><div className="result-grid"><Card className="result-card"><div className="result-card-title"><Leaf size={19} /><h2>{t("result.identification")}</h2></div><CandidateList candidates={summary.plantCandidates ?? []} emptyLabel={t("result.noIdentification")} /></Card><Card className="result-card"><div className="result-card-title"><Sparkles size={19} /><h2>{t("result.health")}</h2></div><CandidateList candidates={summary.healthCandidates ?? []} emptyLabel={t("result.noHealth")} /></Card></div><Card className="disclaimer-card"><AlertTriangle size={22} /><div><h2>{t("result.experimental")}</h2><p>{t("result.disclaimer")}</p></div></Card><Button asChild variant="outline" className="raw-json-link"><a href={rawHref} download={`cropguide-scan-${observation.id}.json`}><Download size={16} />{t("result.raw")}</a></Button></div>;
}
