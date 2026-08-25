import React, { useMemo, useRef, useState } from "react";

const copy = {
  ar: {
    dir: "rtl", language: "العربية", eyebrow: "دليل أمراض النبات", title: "اسم المرض المحتمل، لا مجرد وصف البقعة.",
    subtitle: "ارفع صورة عادية للورقة أو الثمرة. نحدد المحصول، نقرأ العلامات المرئية، ثم نطابقها مع قاعدة أمراض موثقة.",
    supported: "تشمل القاعدة الآن 40 محصولاً، مع توسيع منظم للأمراض الشائعة.",
    privacy: "لا نحفظ صورتك أو ننشئ سجلاً ميدانياً.", upload: "اختر صورة نبات", replace: "استبدل الصورة",
    analyze: "حلّل الصورة", preparing: "نجهّز الصورة…", analyzing: "نحلل الصورة…", accepted: "JPEG أو PNG أو WebP — حتى 7 MB",
    direct: "نتيجة مباشرة من الصورة", result: "نتيجة التحليل", detectedCrop: "المحصول المحدد", candidates: "الأمراض المحتملة",
    likely: "احتمال مطابقة", immediate: "إدارة فورية", conditional: "علاج عام مشروط", safety: "سلامة قبل أي مبيد",
    source: "المصدر العلمي", sourceSpecific: "مرجع خاص بهذا السجل", sourceGroup: "مرجع لمجموعة المحصول — قيد تدقيق خاص بالسجل", disclaimer: "هذه نتيجة احتمالية من صورة واحدة وليست تشخيصاً مخبرياً. يطابق التطبيق أمراض النبات فقط ولا يقيّم الآفات أو نقص العناصر. لا تستخدم دواءً أو مبيداً أو جرعة من التطبيق وحده.",
    none: "لم نجد تطابقاً كافياً مع الأمراض المدعومة لهذه الصورة.", noneLead: "الصورة قد لا تُظهر علامة مميزة كفاية. جرّب ورقة أو ثمرة مصابة بوضوح أكبر.",
    unsupported: "المحصول غير مدعوم حالياً", unsupportedLead: "يدعم CropGuide حالياً 40 محصولاً. حاول صورة أوضح للمحصول نفسه.",
    retry: "جرّب صورة أخرى", error: "تعذر إكمال التحليل", cropConfidence: "ثقة تحديد المحصول", stepCrop: "تحديد المحصول", stepSymptoms: "قراءة العلامات", stepMatch: "مطابقة المرض",
    quality: "جودة الصورة", adequate: "مناسبة", limited: "محدودة", evidence: "الدليل المرئي",
  },
  fr: {
    dir: "ltr", language: "Français", eyebrow: "Guide des maladies végétales", title: "Un nom de maladie probable, pas seulement une description de tache.",
    subtitle: "Importez une photo ordinaire d’une feuille ou d’un fruit. Nous identifions la culture, lisons les signes visibles et les rapprochons d’une base documentée.",
    supported: "La base couvre désormais 40 cultures et s’élargit progressivement pour les maladies fréquentes.",
    privacy: "Votre image n’est ni enregistrée ni ajoutée à un historique.", upload: "Choisir une photo", replace: "Remplacer la photo",
    analyze: "Analyser la photo", preparing: "Préparation de l’image…", analyzing: "Analyse en cours…", accepted: "JPEG, PNG ou WebP — jusqu’à 7 Mo",
    direct: "Résultat direct depuis l’image", result: "Résultat de l’analyse", detectedCrop: "Culture identifiée", candidates: "Maladies possibles",
    likely: "Correspondance probable", immediate: "Gestion immédiate", conditional: "Traitement général conditionnel", safety: "Sécurité avant tout pesticide",
    source: "Source scientifique", sourceSpecific: "Référence propre à cette fiche", sourceGroup: "Référence du groupe de cultures — revue spécifique en attente", disclaimer: "Ceci est une hypothèse issue d’une seule image, et non un diagnostic de laboratoire. L’application rapproche uniquement des maladies végétales, pas des ravageurs ni des carences. Ne choisissez ni pesticide ni dose à partir de cette application seule.",
    none: "Aucune correspondance suffisante avec les maladies prises en charge.", noneLead: "La photo ne montre peut-être pas un signe suffisamment distinctif. Essayez une feuille ou un fruit plus clairement atteint.",
    unsupported: "Culture non prise en charge", unsupportedLead: "CropGuide prend actuellement en charge 40 cultures. Essayez une image plus nette de la même culture.",
    retry: "Essayer une autre photo", error: "Impossible de terminer l’analyse", cropConfidence: "Confiance d’identification", stepCrop: "Culture", stepSymptoms: "Signes visibles", stepMatch: "Correspondance",
    quality: "Qualité de l’image", adequate: "Adéquate", limited: "Limitée", evidence: "Élément visible",
  },
  en: {
    dir: "ltr", language: "English", eyebrow: "Plant disease guide", title: "A probable disease name—not only a spot description.",
    subtitle: "Upload an ordinary leaf or fruit photo. We identify the crop, read visible signs, and compare them with a documented disease base.",
    supported: "The base now covers 40 crops and is expanding carefully around common diseases.",
    privacy: "Your image is not saved or added to a field history.", upload: "Choose a plant photo", replace: "Replace photo",
    analyze: "Analyse photo", preparing: "Preparing image…", analyzing: "Analysing image…", accepted: "JPEG, PNG, or WebP — up to 7 MB",
    direct: "Direct result from the image", result: "Analysis result", detectedCrop: "Identified crop", candidates: "Possible diseases",
    likely: "Match likelihood", immediate: "Immediate management", conditional: "Conditional general treatment", safety: "Safety before any pesticide",
    source: "Scientific source", sourceSpecific: "Record-specific reference", sourceGroup: "Crop-group reference — record-specific review pending", disclaimer: "This is a probability from one image, not a laboratory diagnosis. The app matches plant diseases only, not pests or nutrient disorders. Do not select a pesticide or dose from this app alone.",
    none: "No sufficient match was found among the supported diseases.", noneLead: "The image may not show a distinctive enough sign. Try a more clearly affected leaf or fruit.",
    unsupported: "Crop not supported yet", unsupportedLead: "CropGuide currently supports 40 crops. Try a clearer image of the same crop.",
    retry: "Try another photo", error: "Analysis could not be completed", cropConfidence: "Identification confidence", stepCrop: "Crop", stepSymptoms: "Visible signs", stepMatch: "Disease match",
    quality: "Image quality", adequate: "Adequate", limited: "Limited", evidence: "Visible evidence",
  },
};

const languageOptions = ["ar", "fr", "en"];

function clampImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read image."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Unable to process image."));
      image.onload = () => {
        const longest = Math.max(image.width, image.height);
        const scale = Math.min(1, 1600 / longest);
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function confidenceTone(value) {
  if (value >= 70) return "strong";
  if (value >= 45) return "medium";
  return "limited";
}

function CandidateCard({ disease, text, language }) {
  const confidence = confidenceTone(disease.confidence);
  return <article className="disease-card">
    <div className="disease-heading">
      <div>
        <span className="eyebrow">{text.likely}</span>
        <h3>{disease.name[language]}</h3>
        <p className="latin">{disease.scientificName}</p>
      </div>
      <span className={`score ${confidence}`}>{disease.confidence}%</span>
    </div>
    <div className="care-stack">
      <section><h4>{text.immediate}</h4><p>{disease.immediateCare[language]}</p></section>
      <section><h4>{text.conditional}</h4><p>{disease.conditionalCare[language]}</p></section>
      <section className="safety"><h4>{text.safety}</h4><p>{disease.safety[language]}</p></section>
    </div>
    <a className="source-link" href={disease.sourceUrl} target="_blank" rel="noreferrer">{text.source} <span aria-hidden="true">↗</span></a>
    <p className={`source-status ${disease.sourceScope === "record_specific" ? "specific" : "group"}`}>{disease.sourceScope === "record_specific" ? text.sourceSpecific : text.sourceGroup}</p>
  </article>;
}

export default function App() {
  const [language, setLanguage] = useState("ar");
  const [preview, setPreview] = useState("");
  const [phase, setPhase] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const text = copy[language];
  const isBusy = phase === "preparing" || phase === "analyzing";
  const steps = useMemo(() => [text.stepCrop, text.stepSymptoms, text.stepMatch], [text]);

  async function onFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 7 * 1024 * 1024) {
      setError(text.accepted);
      return;
    }
    setError("");
    setResult(null);
    setPhase("preparing");
    try {
      const prepared = await clampImage(file);
      setPreview(prepared);
      setPhase("idle");
    } catch (uploadError) {
      setError(uploadError.message || text.error);
      setPhase("idle");
    }
  }

  async function analyze() {
    if (!preview || isBusy) return;
    setError("");
    setResult(null);
    setPhase("analyzing");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ imageDataUrl: preview }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || text.error);
      setResult(body);
    } catch (analysisError) {
      setError(analysisError.message || text.error);
    } finally {
      setPhase("idle");
    }
  }

  function reset() {
    setPreview(""); setResult(null); setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return <main className="app-shell" lang={language} dir={text.dir}>
    <section className="intro-panel">
      <div className="top-row"><a className="brand" href="/" aria-label="CropGuide home"><span className="brand-mark"><img src="/manus-storage/cropguide-brand-mark-v2_c9b1a7b7.png" alt="" /></span><span className="brand-wordmark">CropGuide</span></a>
        <select aria-label="Language" value={language} onChange={event => setLanguage(event.target.value)}>{languageOptions.map(option => <option key={option} value={option}>{copy[option].language}</option>)}</select>
      </div>
      <div className="hero"><div className="diagnostic-seal" aria-hidden="true"><span></span><i></i></div><p className="eyebrow">{text.eyebrow}</p><h1>{text.title}</h1><p className="lead">{text.subtitle}</p></div>
      <div className="supported"><span className="plant-glyph">⌁</span><div><strong>{text.direct}</strong><p>{text.supported}</p></div></div>
      <p className="privacy-note">{text.privacy}</p>
    </section>

    <section className="scan-panel" aria-busy={isBusy}>
      {!result && <>
        <div className="progress-steps">{steps.map((step, index) => <div key={step} className={isBusy ? "active" : ""}><span>{index + 1}</span>{step}</div>)}</div>
        <div className={`uploader ${preview ? "has-image" : ""}`}>
          {preview ? <img src={preview} alt="Selected plant" /> : <div className="upload-empty"><div className="leaf-icon">⌁</div><p>{text.upload}</p><small>{text.accepted}</small></div>}
          <input ref={inputRef} id="plant-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange} />
          <label htmlFor="plant-photo">{preview ? text.replace : text.upload}</label>
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
        <button className="primary-action" onClick={analyze} disabled={!preview || isBusy}>{phase === "preparing" ? text.preparing : phase === "analyzing" ? text.analyzing : text.analyze}<span aria-hidden="true">→</span></button>
      </>}

      {result && <div className="result-panel">
        <div className="result-top"><div><p className="eyebrow">{text.result}</p><h2>{result.status === "unsupported_crop" ? text.unsupported : result.status === "inconclusive" ? text.none : text.candidates}</h2></div><button className="text-button" onClick={reset}>{text.retry}</button></div>
        {result.status === "unsupported_crop" ? <p className="empty-copy">{text.unsupportedLead}</p> : <>
          <div className="crop-card"><div className="crop-icon">⌁</div><div><span>{text.detectedCrop}</span><strong>{result.crop.name[language]}</strong><em>{result.crop.scientificName}</em></div><div className="crop-score"><span>{text.cropConfidence}</span><strong>{Math.round((result.detectedPlant?.probability || 0) * 100)}%</strong></div></div>
          {result.status === "inconclusive" ? <div className="empty-state"><h3>{text.none}</h3><p>{text.noneLead}</p></div> : <div className="disease-list">{result.diseases.map(disease => <CandidateCard key={disease.id} disease={disease} text={text} language={language} />)}</div>}
          <p className="result-disclaimer">{text.disclaimer}</p>
        </>}
      </div>}
    </section>
  </main>;
}
