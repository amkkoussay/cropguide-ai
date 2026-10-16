import React, { useMemo, useRef, useState } from "react";
import {
  ArrowRight, ArrowUpRight, Camera, Check, ChevronDown, CircleHelp, Download,
  Eye, FileSearch, Globe2, Leaf, Menu, Microscope, RotateCcw, Search, ShieldCheck,
  Sparkles, Upload, X
} from "lucide-react";

const copy = {
  ar: {
    dir:"rtl", language:"العربية", navHome:"الرئيسية", navHow:"كيف يعمل", navCrops:"المحاصيل", navGuide:"الدليل",
    eyebrow:"دليل صحة النبات الرقمي", title:"شوف العلامات. اعرف الخطوة التالية.", subtitle:"ارفع صورة للنبات، وسنحدد المحصول ونقرأ العلامات المرئية ثم نطابقها مع قاعدة أمراض موثقة.",
    cta:"اختر صورة نبات", secondary:"كيف يعمل؟", supported:"40 محصولاً مدعوماً", languages:"3 لغات", sources:"مصادر موثوقة",
    specimen:"عينة نباتية", photoHint:"صورة ورقة أو ثمرة واضحة", accepted:"JPEG · PNG · WEBP · حتى 7 MB", drop:"اسحب الصورة هنا أو اخترها من جهازك", replace:"استبدل الصورة", analyze:"حلّل الصورة",
    preparing:"نجهّز الصورة…", analyzing:"نحلل العلامات…", result:"مذكرة الحقل", fieldNote:"FIELD NOTE", identified:"المحصول المحدد", confidence:"الثقة", evidence:"الدليل المرئي", possible:"المرض المحتمل",
    visible:"العلامات المرئية", supports:"ما الذي يدعم هذه النتيجة؟", field:"ما الذي تفحصه في الحقل؟", next:"ماذا تفعل الآن؟", safety:"السلامة أولاً", source:"المصدر", sourceSpecific:"مرجع خاص بهذا السجل", sourceGroup:"مرجع لمجموعة المحصول",
    disclaimer:"هذه نتيجة فرز أولي من صورة واحدة وليست تشخيصاً مخبرياً أو احتمالاً إحصائياً. تأكد ميدانياً قبل أي علاج ولا تعتمد على التطبيق وحده لاختيار مبيد أو جرعة.",
    noMatch:"لا توجد مطابقة كافية", noMatchLead:"الصورة لا تُظهر علامة مميزة بما يكفي. جرّب صورة أقرب وأوضح للجزء المصاب.", unsupported:"المحصول غير مدعوم حالياً", uncertain:"تعذر تحديد المحصول بأمان", invalid:"الصورة لا تصلح للفحص الآمن", clearNone:"لا تظهر أعراض واضحة", limited:"الصورة لا تعطي دليلاً كافياً",
    retry:"صورة أخرى", download:"تنزيل الملخص", analyzeAgain:"حلّل صورة جديدة", quality:"جودة الصورة", adequate:"مناسبة", limitedShort:"محدودة",
    workflowTitle:"من الصورة إلى دليل عملي", workflowLead:"واجهة واحدة، أربع طبقات من الفهم.", step1:"حدد المحصول", step1d:"نبدأ بتحديد النبات قبل ترتيب الأمراض.", step2:"اقرأ العلامات", step2d:"نبحث عن الأنماط المرئية التي تظهر في الصورة.", step3:"قارن الأدلة", step3d:"نطابق العلامات مع قاعدة معرفة موثقة.", step4:"وجّه الخطوة التالية", step4d:"نعرض ما ينبغي التحقق منه قبل أي علاج.",
    guideTitle:"مصمم ليقول: لا أعرف، عندما لا يكون الدليل كافياً.", guideLead:"CropGuide لا يحاول إجبار كل صورة على اسم مرض. عدم اليقين جزء من التصميم، وليس خطأ يجب إخفاؤه.", honest:"دليل حقيقي", honestD:"الأدلة المرئية تبقى واضحة داخل النتيجة.", safe:"آمن قبل العلاج", safeD:"التأكيد الحقلي يسبق أي قرار علاجي.", grounded:"مبني على مصادر", groundedD:"كل مطابقة مرتبطة بمرجع في قاعدة المعرفة.",
    cropsTitle:"أمثلة من عالم المحاصيل", cropsLead:"الهوية البصرية تتعامل مع كل محصول كعينة في دليل ميداني.", tomato:"طماطم", olive:"زيتون", potato:"بطاطا", wheat:"قمح", pepper:"فلفل", cucumber:"خيار", viewCrops:"استكشف المحاصيل", footer:"طبيعة · علم · قرارات أفضل",
    menu:"القائمة", close:"إغلاق", search:"ابحث عن محصول…", languageLabel:"اللغة", uploadFirst:"ارفع صورة أولاً", error:"تعذر إكمال التحليل"
  },
  fr: {
    dir:"ltr", language:"Français", navHome:"Accueil", navHow:"Comment ça marche", navCrops:"Cultures", navGuide:"Guide",
    eyebrow:"Guide numérique de santé végétale", title:"Voir les signes. Savoir quoi faire ensuite.", subtitle:"Importez une photo de la plante. Nous identifions la culture, lisons les signes visibles et les rapprochons d’une base documentée.",
    cta:"Choisir une photo", secondary:"Comment ça marche ?", supported:"40 cultures prises en charge", languages:"3 langues", sources:"Sources fiables",
    specimen:"Spécimen végétal", photoHint:"Photo nette d’une feuille ou d’un fruit", accepted:"JPEG · PNG · WEBP · jusqu’à 7 Mo", drop:"Glissez la photo ici ou choisissez-la", replace:"Remplacer la photo", analyze:"Analyser la photo",
    preparing:"Préparation…", analyzing:"Lecture des signes…", result:"Note de terrain", fieldNote:"FIELD NOTE", identified:"Culture identifiée", confidence:"Confiance", evidence:"Élément visible", possible:"Maladie possible",
    visible:"Signes visibles", supports:"Qu’est-ce qui soutient ce résultat ?", field:"Que vérifier au champ ?", next:"Que faire maintenant ?", safety:"Sécurité d’abord", source:"Source", sourceSpecific:"Référence propre à cette fiche", sourceGroup:"Référence du groupe de cultures",
    disclaimer:"Il s’agit d’un tri initial depuis une image, pas d’un diagnostic de laboratoire ni d’une probabilité statistique. Vérifiez au champ avant tout traitement et ne choisissez pas un pesticide ou une dose avec l’application seule.",
    noMatch:"Aucune correspondance suffisante", noMatchLead:"La photo ne montre pas un signe assez distinctif. Essayez une image plus proche et plus nette.", unsupported:"Culture non prise en charge", uncertain:"Culture non identifiée avec assez de certitude", invalid:"Photo non adaptée à un tri sûr", clearNone:"Aucun symptôme clair", limited:"La photo ne donne pas assez d’éléments",
    retry:"Nouvelle photo", download:"Télécharger le résumé", analyzeAgain:"Analyser une nouvelle photo", quality:"Qualité de l’image", adequate:"Adéquate", limitedShort:"Limitée",
    workflowTitle:"De la photo au guide pratique", workflowLead:"Une interface, quatre couches de compréhension.", step1:"Identifier la culture", step1d:"Nous commençons par le végétal avant de classer les maladies.", step2:"Lire les signes", step2d:"Nous recherchons les motifs visibles dans la photo.", step3:"Comparer les éléments", step3d:"Nous rapprochons les signes d’une base documentée.", step4:"Guider la prochaine étape", step4d:"Nous indiquons quoi vérifier avant tout traitement.",
    guideTitle:"Conçu pour dire « je ne sais pas » quand les preuves sont insuffisantes.", guideLead:"CropGuide ne force pas chaque photo à produire un nom de maladie. L’incertitude fait partie du produit.", honest:"Preuves visibles", honestD:"Les signes restent lisibles dans le résultat.", safe:"Sécurité avant traitement", safeD:"La confirmation au champ précède toute décision.", grounded:"Ancré dans les sources", groundedD:"Chaque rapprochement pointe vers une référence.",
    cropsTitle:"Quelques cultures", cropsLead:"Chaque culture devient un spécimen dans un guide de terrain.", tomato:"Tomate", olive:"Olivier", potato:"Pomme de terre", wheat:"Blé", pepper:"Poivron", cucumber:"Concombre", viewCrops:"Voir les cultures", footer:"Nature · Science · Décisions éclairées",
    menu:"Menu", close:"Fermer", search:"Rechercher une culture…", languageLabel:"Langue", uploadFirst:"Choisissez d’abord une image", error:"Impossible de terminer l’analyse"
  },
  en: {
    dir:"ltr", language:"English", navHome:"Home", navHow:"How it works", navCrops:"Crops", navGuide:"Guide",
    eyebrow:"Digital plant health field guide", title:"See the signs. Know the next step.", subtitle:"Upload a plant photo. We identify the crop, read visible signs, then compare them with a documented disease knowledge base.",
    cta:"Choose a plant photo", secondary:"How it works", supported:"40 supported crops", languages:"3 languages", sources:"Trusted sources",
    specimen:"Plant specimen", photoHint:"A clear leaf or fruit photo", accepted:"JPEG · PNG · WEBP · up to 7 MB", drop:"Drop a photo here or choose one from your device", replace:"Replace photo", analyze:"Analyse photo",
    preparing:"Preparing…", analyzing:"Reading visible signs…", result:"Field note", fieldNote:"FIELD NOTE", identified:"Identified crop", confidence:"Confidence", evidence:"Visible evidence", possible:"Possible disease",
    visible:"Visible signs", supports:"What supports this result?", field:"What to check in the field?", next:"What to do now?", safety:"Safety first", source:"Source", sourceSpecific:"Record-specific reference", sourceGroup:"Crop-group reference",
    disclaimer:"This is candidate triage from one image, not a laboratory diagnosis or statistical probability. Confirm in the field before treatment and never choose a pesticide or dose from the app alone.",
    noMatch:"No sufficient match", noMatchLead:"The photo does not show a distinctive enough sign. Try a closer, sharper image of the affected area.", unsupported:"Crop not supported yet", uncertain:"Crop could not be identified safely", invalid:"Photo not suitable for safe triage", clearNone:"No clear symptoms", limited:"The photo does not provide enough evidence",
    retry:"New photo", download:"Download summary", analyzeAgain:"Analyse a new photo", quality:"Image quality", adequate:"Adequate", limitedShort:"Limited",
    workflowTitle:"From photo to practical guidance", workflowLead:"One interface, four layers of understanding.", step1:"Identify the crop", step1d:"We identify the plant before ranking diseases.", step2:"Read the signs", step2d:"We look for visible patterns in the image.", step3:"Compare evidence", step3d:"We compare those signs with a documented knowledge base.", step4:"Guide the next step", step4d:"We show what to verify before any treatment.",
    guideTitle:"Designed to say “I don’t know” when the evidence is not enough.", guideLead:"CropGuide does not force every image into a disease name. Uncertainty is part of the product, not something to hide.", honest:"Real evidence", honestD:"Visible signs stay clear inside the result.", safe:"Safe before treatment", safeD:"Field confirmation comes before treatment decisions.", grounded:"Grounded in sources", groundedD:"Each match connects back to a knowledge-base reference.",
    cropsTitle:"A few crops from the field", cropsLead:"Every crop becomes a specimen in a digital field guide.", tomato:"Tomato", olive:"Olive", potato:"Potato", wheat:"Wheat", pepper:"Pepper", cucumber:"Cucumber", viewCrops:"Explore crops", footer:"Nature · Science · Better decisions",
    menu:"Menu", close:"Close", search:"Search for a crop…", languageLabel:"Language", uploadFirst:"Choose an image first", error:"Analysis could not be completed"
  }
};

const languageOptions = ["ar", "fr", "en"];
const cropExamples = [
  ["tomato","cropguide-tomato.jpg","Solanum lycopersicum"],
  ["potato","cropguide-leaf.jpg","Solanum tuberosum"],
  ["olive","cropguide-specimen.jpg","Olea europaea"],
  ["wheat","cropguide-leaf.jpg","Triticum aestivum"],
  ["pepper","cropguide-tomato.jpg","Capsicum annuum"],
  ["cucumber","cropguide-leaf.jpg","Cucumis sativus"]
];

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
        const width = Math.round(image.width * scale), height = Math.round(image.height * scale);
        const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
        canvas.getContext("2d").drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
function evidenceBandKey(value) { if (value >= 70) return "strong"; if (value >= 45) return "medium"; return "limited"; }

function BrandMark({ className="" }) { return <img className={`brand-mark ${className}`} src="/assets/cropguide-mark.svg" alt="" />; }

function CandidateCard({ disease, text, language, index }) {
  const band = evidenceBandKey(disease.evidenceScore);
  return <article className="disease-card">
    <div className="disease-number">0{index + 1}</div>
    <div className="disease-main">
      <div className="disease-heading">
        <div><span className="micro-label">{text.possible}</span><h3>{disease.name?.[language] || disease.id}</h3><p className="latin">{disease.scientificName}</p></div>
        <span className={`evidence-pill ${band}`}>{text.evidence} · {text[band === "strong" ? "adequate" : "limitedShort"]}</span>
      </div>
      <div className="evidence-meter" aria-label={text.evidence}><span className={band} style={{width:`${Math.max(8, Math.min(100, disease.evidenceScore || 0))}%`}} /></div>
      <div className="care-grid">
        {disease.decision === "field_confirmation_required" && <section><h4><Eye size={15}/>{text.field}</h4><p>{disease.fieldCheck?.[language]}</p></section>}
        <section><h4><Check size={15}/>{text.next}</h4><p>{disease.immediateCare?.[language]}</p></section>
        <section><h4><ShieldCheck size={15}/>{text.safety}</h4><p>{disease.safety?.[language]}</p></section>
      </div>
      <a className="source-link" href={disease.sourceUrl} target="_blank" rel="noreferrer">{text.source} <ArrowUpRight size={14}/></a>
      <p className="source-status">{disease.sourceScope === "record_specific" ? text.sourceSpecific : text.sourceGroup}</p>
    </div>
  </article>;
}

export default function App() {
  const [language,setLanguage]=useState("en");
  const [preview,setPreview]=useState(""); const [phase,setPhase]=useState("idle"); const [result,setResult]=useState(null); const [error,setError]=useState(""); const [mobileNav,setMobileNav]=useState(false);
  const inputRef=useRef(null); const text=copy[language]; const isBusy=phase !== "idle";
  const resultState = result ? ({unsupported_crop:{title:text.unsupported,lead:text.unsupported,showCrop:false},crop_uncertain:{title:text.uncertain,lead:text.uncertain,showCrop:false},image_invalid:{title:text.invalid,lead:text.invalid,showCrop:true},no_clear_symptoms:{title:text.clearNone,lead:text.clearNone,showCrop:true},image_limited:{title:text.limited,lead:text.limited,showCrop:true},inconclusive:{title:text.noMatch,lead:text.noMatchLead,showCrop:true}}[result.status]) : null;
  const steps=useMemo(()=>[text.step1,text.step2,text.step3], [text]);

  async function onFileChange(event){
    const file=event.target.files?.[0]; if(!file)return;
    if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>7*1024*1024){setError(text.accepted);return;}
    setError("");setResult(null);setPhase("preparing");
    try{setPreview(await clampImage(file));setPhase("idle");}catch(e){setError(e.message||text.error);setPhase("idle");}
  }
  async function analyze(){
    if(!preview||isBusy)return; setError("");setResult(null);setPhase("analyzing");
    try{const response=await fetch("/api/analyze",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({imageDataUrl:preview})}); const body=await response.json(); if(!response.ok)throw new Error(body.error||text.error); setResult(body); document.getElementById("results")?.scrollIntoView({behavior:"smooth",block:"start"});}
    catch(e){setError(e.message||text.error);}finally{setPhase("idle");}
  }
  function reset(){setPreview("");setResult(null);setError("");if(inputRef.current)inputRef.current.value="";document.getElementById("analyzer")?.scrollIntoView({behavior:"smooth"});}
  function downloadSummary(){
    if(!result)return; const cropName=result.crop?.name?.[language]||"—"; const list=(result.diseases||[]).map((d,i)=>`${i+1}. ${d.name?.[language]||d.id} — ${diseaseBandLabel(d.evidenceScore,text)}`).join("\n");
    const body=["CropGuide — Field Note",new Date().toLocaleString(),`${text.identified}: ${cropName}`,`${text.evidence}: ${result.message||"—"}`,"",list,"",text.disclaimer].join("\n"); const url=URL.createObjectURL(new Blob([body],{type:"text/plain;charset=utf-8"})); const a=document.createElement("a");a.href=url;a.download="cropguide-field-note.txt";a.click();URL.revokeObjectURL(url);
  }
  function diseaseBandLabel(score,t){const band=evidenceBandKey(score);return band==="strong"?t.adequate:band==="medium"?t.evidence:t.limitedShort;}

  return <div className="site" lang={language} dir={text.dir}>
    <header className="nav-shell">
      <a className="brand" href="#top"><BrandMark/><span>CropGuide</span></a>
      <nav className={mobileNav?"nav-links open":"nav-links"}>
        <a href="#top" onClick={()=>setMobileNav(false)}>{text.navHome}</a><a href="#how" onClick={()=>setMobileNav(false)}>{text.navHow}</a><a href="#crops" onClick={()=>setMobileNav(false)}>{text.navCrops}</a><a href="#guide" onClick={()=>setMobileNav(false)}>{text.navGuide}</a>
      </nav>
      <div className="nav-actions"><div className="language-switch">{languageOptions.map(l=><button key={l} className={language===l?"active":""} onClick={()=>setLanguage(l)}>{l.toUpperCase()}</button>)}</div><button className="menu-btn" aria-label={mobileNav?text.close:text.menu} onClick={()=>setMobileNav(v=>!v)}>{mobileNav?<X/>:<Menu/>}</button></div>
    </header>

    <main id="top">
      <section className="hero section-wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot"/>{text.eyebrow}</div>
          <h1>{text.title}</h1>
          <p className="hero-lead">{text.subtitle}</p>
          <div className="hero-actions"><button className="btn btn-primary" onClick={()=>document.getElementById("photo-input")?.click()}>{text.cta}<ArrowRight size={18}/></button><a className="btn btn-ghost" href="#how">{text.secondary}<ArrowUpRight size={17}/></a></div>
          <div className="hero-stats"><span><Leaf size={19}/><b>40</b>{text.supported}</span><span><Globe2 size={19}/><b>3</b>{text.languages}</span><span><ShieldCheck size={19}/><b>100%</b>{text.sources}</span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo"><img src="/assets/cropguide-specimen.jpg" alt="Plant leaf specimen with visible symptoms"/><div className="focus-box"/><div className="focus-ring"><span>VISIBLE SIGNS</span></div><div className="photo-caption"><span>{text.specimen}</span><b>01 / 04</b></div></div>
          <div className="botanical botanical-one"/><div className="hero-note"><Microscope size={17}/><span>{text.photoHint}</span></div>
        </div>
      </section>

      <section className="analyzer section-wrap" id="analyzer">
        <div className="section-kicker"><span>01</span><span>{text.specimen}</span><i/></div>
        {!result ? <div className="analyzer-grid">
          <div className="upload-side">
            <div className="section-heading"><span className="micro-label">FIELD INPUT</span><h2>{text.drop}</h2><p>{text.photoHint}</p></div>
            <div className={`specimen-uploader ${preview?"has-preview":""}`}>
              {preview ? <><img src={preview} alt="Selected plant"/><div className="preview-overlay"><span>{text.specimen}</span><button onClick={()=>{setPreview("");if(inputRef.current)inputRef.current.value=""}} aria-label="Remove image"><X size={16}/></button></div></> : <div className="empty-upload"><div className="upload-symbol"><Camera size={30}/></div><strong>{text.cta}</strong><span>{text.accepted}</span><small>{text.drop}</small></div>}
              <input ref={inputRef} id="photo-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange}/>
              <label htmlFor="photo-input">{preview?text.replace:text.cta}<Upload size={16}/></label>
            </div>
            {error&&<p className="error-message"><CircleHelp size={16}/>{error}</p>}
            <button className="btn btn-primary analyze-btn" disabled={!preview||isBusy} onClick={analyze}>{phase==="preparing"?text.preparing:phase==="analyzing"?text.analyzing:text.analyze}<ArrowRight size={18}/></button>
          </div>
          <div className="process-side">
            <div className="process-head"><span className="micro-label">THE FIELD CHECK</span><span>01 — 03</span></div>
            <div className="process-list">{steps.map((s,i)=><div className={phase==="analyzing"&&i===1?"process-step active":"process-step"} key={s}><span className="step-dot">{i+1}</span><div><b>{s}</b><p>{[text.step1d,text.step2d,text.step3d][i]}</p></div>{i<2&&<ArrowRight size={17}/>}</div>)}</div>
            <div className="trust-note"><ShieldCheck size={20}/><div><b>{text.grounded}</b><p>{text.groundedD}</p></div></div>
          </div>
        </div> : <ResultView result={result} resultState={resultState} text={text} language={language} preview={preview} onReset={reset} onDownload={downloadSummary}/>} 
      </section>

      <section className="workflow section-wrap" id="how">
        <div className="workflow-heading"><div><span className="micro-label">02 / METHOD</span><h2>{text.workflowTitle}</h2></div><p>{text.workflowLead}</p></div>
        <div className="workflow-grid">{[[Leaf,text.step1,text.step1d],[Eye,text.step2,text.step2d],[FileSearch,text.step3,text.step3d],[Sparkles,text.step4,text.step4d]].map(([Icon,title,desc],i)=><article key={title}><span className="workflow-index">0{i+1}</span><div className="workflow-icon"><Icon size={22}/></div><h3>{title}</h3><p>{desc}</p></article>)}</div>
      </section>

      <section className="guide-band section-wrap" id="guide">
        <div className="guide-copy"><span className="micro-label">03 / PRINCIPLE</span><h2>{text.guideTitle}</h2><p>{text.guideLead}</p></div>
        <div className="principles"><article><Leaf/><b>{text.honest}</b><p>{text.honestD}</p></article><article><ShieldCheck/><b>{text.safe}</b><p>{text.safeD}</p></article><article><FileSearch/><b>{text.grounded}</b><p>{text.groundedD}</p></article></div>
      </section>

      <section className="crops section-wrap" id="crops">
        <div className="workflow-heading"><div><span className="micro-label">04 / FIELD INDEX</span><h2>{text.cropsTitle}</h2></div><p>{text.cropsLead}</p></div>
        <div className="crop-grid">{cropExamples.map(([key,img,latin])=><article className="crop-tile" key={key}><img src={`/assets/${img}`} alt=""/><div><b>{text[key]}</b><span>{latin}</span></div></article>)}</div>
        <button className="index-link">{text.viewCrops}<ArrowRight size={17}/></button>
      </section>
    </main>

    <footer className="footer"><div className="footer-inner"><div className="footer-brand"><BrandMark/><div><b>CropGuide</b><span>{text.footer}</span></div></div><div className="footer-copy">{text.disclaimer}</div><div className="footer-meta"><span>© 2026 CropGuide</span><span>EN · AR · FR</span></div></div></footer>
  </div>;
}

function ResultView({result,resultState,text,language,preview,onReset,onDownload}){
  const crop=result.crop?.name?.[language]||"—"; const confidence=Math.round((result.detectedPlant?.probability||0)*100); const signs=result.visibleSigns?.[language]||result.message||"";
  return <div className="result-view" id="results">
    <div className="result-toolbar"><div><span className="micro-label">{text.fieldNote} / 01</span><h2>{resultState?.title||text.possible}</h2></div><div className="result-actions"><button className="btn btn-small" onClick={onDownload}><Download size={15}/>{text.download}</button><button className="btn btn-small dark" onClick={onReset}><RotateCcw size={15}/>{text.retry}</button></div></div>
    <div className="result-layout">
      <div className="result-photo"><img src={preview} alt="Analyzed plant"/><span className="photo-tag">{text.specimen} / 01</span></div>
      <div className="result-main">
        {resultState && !resultState.showCrop ? <div className="result-empty"><div className="empty-symbol"><Eye size={25}/></div><h3>{resultState.title}</h3><p>{resultState.lead}</p><button className="btn btn-primary" onClick={onReset}>{text.analyzeAgain}<ArrowRight size={17}/></button></div> : <>
          <div className="crop-identity"><div className="identity-icon"><Leaf/></div><div><span>{text.identified}</span><strong>{crop}</strong><em>{result.crop?.scientificName}</em></div><div className="confidence"><span>{text.confidence}</span><b>{confidence}%</b></div></div>
          <div className="visible-signs"><div className="result-label"><span>{text.visible}</span><i/></div><p>{signs}</p></div>
          <div className="disease-results">{(result.diseases||[]).map((d,i)=><CandidateCard key={d.id||i} disease={d} text={text} language={language} index={i}/>)}</div>
          {!result.diseases?.length && <div className="result-empty compact"><h3>{text.noMatch}</h3><p>{text.noMatchLead}</p></div>}
        </>}
        <p className="result-disclaimer"><ShieldCheck size={16}/>{text.disclaimer}</p>
      </div>
    </div>
  </div>;
}
