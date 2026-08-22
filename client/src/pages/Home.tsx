import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPreparedImageSize, prepareFieldImage } from "@/lib/imagePreparation";
import { enqueueScan, queuedScans, subscribeToQueue, type QueuedScanPayload } from "@/lib/offlineQueue";
import { resolveWithin } from "@/lib/resolveWithin";
import { trpc } from "@/lib/trpc";
import { getVisitorId } from "@/lib/visitor";
import { fieldSpecies, type FieldSpecies } from "@shared/species";
import { CheckCircle2, CloudOff, ImageUp, Leaf, LocateFixed, MapPin, ScanLine, Sprout, Upload, WifiOff } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

type Coordinates = { latitude: number; longitude: number };

function captureCoordinates(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) return reject(new Error("GPS unavailable"));
    navigator.geolocation.getCurrentPosition(
      position => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      error => reject(error),
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 4_000 },
    );
  });
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { speciesLabel, t } = useLanguage();
  const analyze = trpc.observation.analyze.useMutation();
  const [fileName, setFileName] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [detailImageDataUrls, setDetailImageDataUrls] = useState<string[]>([]);
  const [preparingImage, setPreparingImage] = useState(false);
  const [imageQualityNote, setImageQualityNote] = useState("");
  const [preparedImageNote, setPreparedImageNote] = useState("");
  const [species, setSpecies] = useState<FieldSpecies>("olive");
  const [locationState, setLocationState] = useState<"idle" | "locating" | "captured" | "unavailable">("idle");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [queueCount, setQueueCount] = useState(0);
  const preview = useMemo(() => imageDataUrl, [imageDataUrl]);

  useEffect(() => {
    const refreshQueue = () => void queuedScans().then(items => setQueueCount(items.length)).catch(() => undefined);
    refreshQueue();
    return subscribeToQueue(refreshQueue);
  }, []);

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    if (!nextFile) return;
    if (!/^image\/(jpeg|png|webp)$/.test(nextFile.type)) return void toast.error(t("toast.unsupported"));
    if (nextFile.size > 16 * 1024 * 1024) return void toast.error(t("toast.tooLarge"));
    try {
      setPreparingImage(true);
      const prepared = await prepareFieldImage(nextFile);
      setImageDataUrl(prepared.dataUrl);
      setDetailImageDataUrls(prepared.detailDataUrls);
      setImageQualityNote(prepared.dimensions);
      setPreparedImageNote(t("home.preparedImage", { dimensions: prepared.dimensions, size: formatPreparedImageSize(prepared.byteSize) }));
      setFileName(`${nextFile.name.replace(/\.[^.]+$/, "")}.jpg`);
    } catch {
      setPreparedImageNote("");
      toast.error(t("toast.unreadable"));
    } finally {
      setPreparingImage(false);
    }
  }

  async function captureGps() {
    setLocationState("locating");
    try {
      const nextCoordinates = await captureCoordinates();
      setCoordinates(nextCoordinates);
      setLocationState("captured");
      return nextCoordinates;
    } catch {
      setCoordinates(null);
      setLocationState("unavailable");
      return undefined;
    }
  }

  async function submitScan(event: FormEvent) {
    event.preventDefault();
    if (!fileName || !imageDataUrl) return void toast.error(t("toast.addPhoto"));
    const latestCoordinates = coordinates ?? await resolveWithin(captureGps(), 2_500);
    const payload: QueuedScanPayload = { imageDataUrl, detailImageDataUrls, fileName, visitorId: getVisitorId(), species, latitude: latestCoordinates?.latitude, longitude: latestCoordinates?.longitude, capturedAt: Date.now() };

    if (!navigator.onLine) {
      await enqueueScan(payload);
      toast.success(t("toast.offlineSaved"));
      setFileName("");
      setImageDataUrl("");
      setDetailImageDataUrls([]);
      setPreparedImageNote("");
      return;
    }

    try {
      const observation = await analyze.mutateAsync(payload);
      toast.success(t("toast.completed"));
      setLocation(`/results/${observation.id}`);
    } catch (error) {
      const trpcError = error as { data?: { code?: string }; message?: string };
      if (trpcError.data?.code === "BAD_REQUEST" || trpcError.data?.code === "PAYLOAD_TOO_LARGE") return void toast.error(trpcError.message ?? t("toast.badPhoto"));
      await enqueueScan(payload);
      toast.message(t("toast.retry"));
      setFileName("");
      setImageDataUrl("");
      setDetailImageDataUrls([]);
      setPreparedImageNote("");
    }
  }

  const locationTitle = locationState === "captured" ? t("home.gpsCaptured") : locationState === "locating" ? t("home.findingLocation") : locationState === "unavailable" ? t("home.gpsUnavailable") : t("home.gpsAtScan");

  return (
    <div className="scan-page mx-auto max-w-6xl">
      <section className="scan-intro">
        <div className="intro-copy">
          <p className="eyebrow">{t("home.eyebrow")}</p>
          <h1>{t("home.title")}<br /><span>{t("home.titleAccent")}</span></h1>
          <p className="intro-lead">{t("home.lead")}</p>
          <div className="intro-notes"><span><Sprout size={16} />{t("home.madeForField")}</span><span><CloudOff size={16} />{t("home.offlineReady")}</span></div>
        </div>
        <div className="intro-orb" aria-hidden="true"><Leaf size={70} /></div>
      </section>

      {queueCount > 0 ? <div className="queue-banner"><WifiOff size={18} /><span>{t(queueCount === 1 ? "home.queueOne" : "home.queueMany", { count: queueCount })}</span></div> : null}

      <div className="scan-grid">
        <Card className="scan-card">
          <div className="scan-card-heading"><div className="step-number">01</div><div><p className="eyebrow">{t("home.newNote")}</p><h2>{t("home.readLeaf")}</h2></div></div>
          <form onSubmit={submitScan} className="scan-form">
            <div>
              <Label htmlFor="leaf-photo">{t("home.leafPhoto")}</Label>
              <label className={`photo-dropzone ${preview ? "has-preview" : ""}`} htmlFor="leaf-photo">
                {preview ? <img src={preview} alt={t("home.choosePhoto")} /> : <><span className="photo-icon"><ImageUp size={25} /></span><strong>{preparingImage ? t("home.preparing") : t("home.choosePhoto")}</strong><span>{t("home.uploadHint")}</span></>}
                <input id="leaf-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange} />
                {preview ? <span className="replace-photo"><Upload size={15} />{t("home.replacePhoto")}</span> : null}
              </label>
              {preview && imageQualityNote ? <p className="image-quality-note">{imageQualityNote}</p> : null}
              {preview && preparedImageNote ? <p className="image-quality-note" aria-live="polite">{preparedImageNote}</p> : null}
            </div>
            <div className="field-block">
              <Label htmlFor="species">{t("home.species")}</Label>
              <Select value={species} onValueChange={value => setSpecies(value as FieldSpecies)}><SelectTrigger id="species" className="organic-select"><SelectValue /></SelectTrigger><SelectContent>{fieldSpecies.map(option => <SelectItem key={option} value={option}>{speciesLabel(option)}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="location-row">
              <div><MapPin size={18} /><div><strong>{locationTitle}</strong><span>{coordinates ? `${coordinates.latitude.toFixed(5)}, ${coordinates.longitude.toFixed(5)}` : t("home.gpsAuto")}</span></div></div>
              <Button type="button" variant="ghost" size="sm" onClick={() => void captureGps()} disabled={locationState === "locating"}><LocateFixed size={16} />{locationState === "captured" ? t("home.refresh") : t("home.capture")}</Button>
            </div>
            <Button type="submit" className="scan-submit" disabled={analyze.isPending || preparingImage}><ScanLine size={18} />{preparingImage ? t("home.preparing") : analyze.isPending ? t("home.analyse") : t("home.analyse")}</Button>
            <p className="experimental-note"><CheckCircle2 size={15} />{t("home.experimental")}</p>
          </form>
        </Card>
        <aside className="field-guide">
          <div className="guide-mark">{t("home.guideMark")}</div>
          <h2>{t("home.guideTitle")}</h2>
          <ol><li><span>1</span>{t("home.stepOne")}</li><li><span>2</span>{t("home.stepTwo")}</li><li><span>3</span>{t("home.stepThree")}</li></ol>
          <div className="guide-disclaimer"><Leaf size={18} /><p><strong>{t("result.experimental")}</strong><br />{t("home.guideWarning")}</p></div>
        </aside>
      </div>
    </div>
  );
}
