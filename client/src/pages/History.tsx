import { useState } from "react";
import { Link } from "wouter";
import { CalendarDays, ChevronLeft, ChevronRight, Filter, Leaf, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { healthStatusKey, type ObservationHealthSummary } from "@/lib/observationStatus";
import { trpc } from "@/lib/trpc";
import { getVisitorId } from "@/lib/visitor";
import { fieldSpecies, type FieldSpecies } from "@shared/species";

type SpeciesFilter = "all" | FieldSpecies;

export default function History() {
  const { formatDateTime, locale, speciesLabel, t } = useLanguage();
  const [species, setSpecies] = useState<SpeciesFilter>("all");
  const [cursors, setCursors] = useState<Array<number | undefined>>([undefined]);
  const cursor = cursors.at(-1);
  const history = trpc.observation.history.useQuery({ species: species === "all" ? undefined : species, cursor, limit: 10, visitorId: getVisitorId() });
  const nextCursor = history.data?.nextCursor;
  const filters: SpeciesFilter[] = ["all", ...fieldSpecies];
  const changeSpecies = (next: SpeciesFilter) => { setSpecies(next); setCursors([undefined]); };

  return <div className="page-shell mx-auto max-w-5xl">
    <header className="page-header"><p className="eyebrow">{t("history.eyebrow")}</p><h1>{t("history.title")}</h1><p>{t("history.lead")}</p></header>
    <div className="toolbar-card"><div className="toolbar-label"><Filter size={16} /> {t("history.filter")}</div><Select value={species} onValueChange={value => changeSpecies(value as SpeciesFilter)}><SelectTrigger className="max-w-52 bg-white/70"><SelectValue /></SelectTrigger><SelectContent>{filters.map(option => <SelectItem key={option} value={option}>{option === "all" ? t("species.all") : speciesLabel(option)}</SelectItem>)}</SelectContent></Select></div>
    {history.isLoading ? <div className="loading-note">{t("history.loading")}</div> : null}
    {history.data?.items.length === 0 ? <Card className="empty-orchard"><Leaf size={28} /><h2>{t("history.emptyTitle")}</h2><p>{t("history.emptyLead")}</p><Button asChild><Link href="/">{t("history.start")}</Link></Button></Card> : null}
    <div className="history-list">{history.data?.items.map(observation => {
      const summary = observation.summary as ObservationHealthSummary;
      const speciesName = speciesLabel(observation.species as FieldSpecies);
      const DetailArrow = locale === "ar" ? ChevronLeft : ChevronRight;
      return <Link href={`/results/${observation.id}`} key={observation.id} className="history-row"><img src={observation.imageUrl} alt={`${speciesName} ${t("home.leafPhoto")}`} /><div className="history-main"><div className="history-title"><span>{speciesName}</span><Badge variant="outline">{t("history.scan", { id: observation.id })}</Badge></div><p>{summary.topHealth?.name ?? t(healthStatusKey(summary))}</p><div className="history-meta"><span><CalendarDays size={14} />{formatDateTime(observation.capturedAt)}</span>{observation.latitude !== null && observation.longitude !== null ? <span><MapPin size={14} />{t("history.gps")}</span> : null}</div></div><DetailArrow className="history-arrow" size={20} /></Link>;
    })}</div>
    <div className="pagination-row"><Button variant="outline" onClick={() => setCursors(current => current.length > 1 ? current.slice(0, -1) : current)} disabled={cursors.length === 1}><ChevronLeft size={17} /> {t("history.previous")}</Button><span>{t("history.page", { page: cursors.length })}</span><Button variant="outline" onClick={() => nextCursor !== null && nextCursor !== undefined && setCursors(current => [...current, nextCursor])} disabled={nextCursor === null || nextCursor === undefined}>{t("history.next")} <ChevronRight size={17} /></Button></div>
  </div>;
}
