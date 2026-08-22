import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Leaf, MapPin, MapPinned, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MapView } from "@/components/Map";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { getVisitorId } from "@/lib/visitor";
import type { FieldSpecies } from "@shared/species";

type Summary = { topHealth?: { name: string } | null; isHealthy?: boolean | null };
type Point = { id: number; species: FieldSpecies; latitude: string | number | null; longitude: string | number | null; summary: unknown };

function FieldPlot({ points, t, speciesLabel }: { points: Point[]; t: (key: string, values?: Record<string, string | number>) => string; speciesLabel: (species: FieldSpecies) => string }) {
  const validPoints = useMemo(() => points.filter(point => point.latitude !== null && point.longitude !== null), [points]);
  const bounds = useMemo(() => {
    const lats = validPoints.map(point => Number(point.latitude));
    const lngs = validPoints.map(point => Number(point.longitude));
    return { minLat: Math.min(...lats), maxLat: Math.max(...lats), minLng: Math.min(...lngs), maxLng: Math.max(...lngs) };
  }, [validPoints]);
  if (!validPoints.length) return <div className="map-empty">{t("map.empty")}</div>;
  return <div className="field-plot" aria-label={t("map.coordinate")}><div className="plot-grid" />{validPoints.map(point => {
    const latRange = bounds.maxLat - bounds.minLat || 1;
    const lngRange = bounds.maxLng - bounds.minLng || 1;
    const x = 9 + ((Number(point.longitude) - bounds.minLng) / lngRange) * 82;
    const y = 91 - ((Number(point.latitude) - bounds.minLat) / latRange) * 82;
    const label = speciesLabel(point.species);
    return <span className="field-pin" key={point.id} style={{ left: `${x}%`, top: `${y}%` }} title={`${label} · ${Number(point.latitude).toFixed(5)}, ${Number(point.longitude).toFixed(5)}`}><MapPin size={21} fill="currentColor" /><b>{label}</b></span>;
  })}<div className="plot-legend"><Leaf size={15} />{t("map.legend")}</div></div>;
}

export default function ObservationMap() {
  const { speciesLabel, t } = useLanguage();
  const points = trpc.observation.mapPoints.useQuery({ visitorId: getVisitorId() });
  const mapRef = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [useFieldPlot, setUseFieldPlot] = useState(false);
  const hasNoPoints = !points.isLoading && (points.data?.length ?? 0) === 0;
  const drawPoints = useCallback((map: google.maps.Map) => {
    markers.current.forEach(marker => { marker.map = null; });
    markers.current = [];
    const validPoints = (points.data ?? []).filter(point => point.latitude !== null && point.longitude !== null);
    if (!validPoints.length || !window.google?.maps?.marker) return;
    const bounds = new window.google.maps.LatLngBounds();
    validPoints.forEach(point => {
      const position = { lat: Number(point.latitude), lng: Number(point.longitude) };
      const summary = point.summary as Summary;
      const health = summary.topHealth?.name ?? (summary.isHealthy ? t("status.healthy") : t("map.fieldScan"));
      const marker = new window.google.maps.marker.AdvancedMarkerElement({ map, position, title: `${speciesLabel(point.species as FieldSpecies)}: ${health}` });
      markers.current.push(marker); bounds.extend(position);
    });
    if (validPoints.length === 1) map.setCenter({ lat: Number(validPoints[0].latitude), lng: Number(validPoints[0].longitude) }); else map.fitBounds(bounds, 48);
  }, [points.data, speciesLabel, t]);
  useEffect(() => { if (mapRef.current) drawPoints(mapRef.current); }, [drawPoints]);
  useEffect(() => { const timeout = window.setTimeout(() => { if (!mapRef.current && !window.google?.maps) setUseFieldPlot(true); }, 2_500); return () => window.clearTimeout(timeout); }, []);
  return <div className="page-shell mx-auto max-w-6xl"><header className="page-header"><p className="eyebrow">{t("map.eyebrow")}</p><h1>{t("map.title")}</h1><p>{t("map.lead")}</p></header><Card className="map-card"><div className="map-card-header"><div><MapPinned size={22} /><span>{t("map.count", { count: points.data?.length ?? 0 })}</span></div><span className="map-caption"><Navigation size={14} />{t("map.private")}</span></div>{useFieldPlot || hasNoPoints ? <FieldPlot points={(points.data ?? []) as Point[]} t={t} speciesLabel={speciesLabel} /> : <MapView className="orchard-map" initialCenter={{ lat: 34, lng: 9 }} initialZoom={6} onMapReady={map => { mapRef.current = map; drawPoints(map); }} />}</Card>{useFieldPlot ? <p className="map-fallback-note">{t("map.fallback")}</p> : null}</div>;
}
