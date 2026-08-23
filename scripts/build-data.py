import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATABASE_PATH = ROOT / "data" / "cropguide.sqlite"

CROPS = [
    ("olive", "الزيتون", "Olivier", "Olive", "Olea europaea"),
    ("almond", "اللوز", "Amandier", "Almond", "Prunus dulcis"),
    ("pomegranate", "الرمان", "Grenadier", "Pomegranate", "Punica granatum"),
    ("fig", "التين", "Figuier", "Fig", "Ficus carica"),
    ("grapevine", "العنب", "Vigne", "Grapevine", "Vitis spp."),
    ("tomato", "الطماطم", "Tomate", "Tomato", "Solanum lycopersicum"),
    ("potato", "البطاطا", "Pomme de terre", "Potato", "Solanum tuberosum"),
]

SAFETY = {
    "ar": "لا تستخدم مبيداً أو جرعة من التطبيق وحده. تحقق من ملصق منتج مسجل في تونس واتبع معدات الوقاية وفترة الأمان قبل الحصاد.",
    "fr": "N’utilisez ni pesticide ni dose sur la seule base de l’application. Vérifiez l’étiquette d’un produit homologué en Tunisie, les EPI et le délai avant récolte.",
    "en": "Do not use a pesticide or dose from this app alone. Verify a product registered in Tunisia, PPE, and the pre-harvest interval on its label.",
}

DISEASES = [
    {
        "id": "olive_peacock_spot", "crop_id": "olive", "scientific_name": "Fusicladium oleagineum",
        "name": {"ar": "عين الطاووس (تبقع أوراق الزيتون)", "fr": "Œil de paon de l’olivier", "en": "Olive leaf spot / peacock spot"},
        "symptoms": ["circular_dark_spot", "yellow_halo", "upper_leaf_spot", "leaf_drop"],
        "evidence": {"ar": "بقع دائرية داكنة مع هالة صفراء على الورقة قد تتوافق مع عين الطاووس.", "fr": "Des taches sombres circulaires avec halo jaune peuvent correspondre à l’œil de paon.", "en": "Circular dark spots with yellow halos can match olive leaf spot."},
        "field": {"ar": "افحص الأوراق القديمة من أعلى وأسفل؛ تكرار البقع الدائرية وتساقط الأوراق يقوي الاحتمال.", "fr": "Examinez les feuilles âgées sur les deux faces; la répétition des taches circulaires et la chute des feuilles renforcent l’hypothèse.", "en": "Check older leaves on both sides; repeated circular spots and leaf drop strengthen the match."},
        "immediate": {"ar": "أزل الأوراق المتساقطة الشديدة الإصابة، حسن تهوية التاج، وتجنب بلل الأوراق لفترة طويلة.", "fr": "Retirez les feuilles très atteintes tombées, aérez la frondaison et évitez de garder le feuillage mouillé longtemps.", "en": "Remove heavily affected fallen leaves, improve canopy airflow, and avoid prolonged wet foliage."},
        "conditional": {"ar": "بعد تأكيد محلي، اسأل مهندساً زراعياً عن مبيد فطري وقائي مسجل للزيتون وتوقيت وقائي مناسب للموسم.", "fr": "Après confirmation locale, demandez à un conseiller un fongicide préventif homologué sur olivier et le bon créneau saisonnier.", "en": "After local confirmation, ask an adviser about a registered preventive olive fungicide and the right seasonal timing."},
        "source": "https://pnwhandbooks.org/plantdisease/host-disease/olive-olea-europaea-olive-leaf-spot-peacock-spot-peacocks-eye",
    },
    {
        "id": "almond_shot_hole", "crop_id": "almond", "scientific_name": "Wilsonomyces carpophilus",
        "name": {"ar": "الثقوب الرصاصية في اللوز", "fr": "Criblure de l’amandier", "en": "Almond shot hole"},
        "symptoms": ["purple_red_spot", "yellow_halo", "leaf_hole", "leaf_drop"],
        "evidence": {"ar": "بقع حمراء إلى أرجوانية قد تجف ويسقط مركزها مكوناً ثقوباً في الورقة.", "fr": "Des taches rouges à pourpres peuvent sécher et perdre leur centre, créant des trous dans la feuille.", "en": "Red to purple spots can dry and drop their centers, leaving holes in leaves."},
        "field": {"ar": "تحقق من وجود ثقوب مستديرة محاطة بحافة داكنة على أوراق متعددة، وليس تمزقاً غير منتظم.", "fr": "Vérifiez la présence de trous ronds bordés de sombre sur plusieurs feuilles, et non de déchirures irrégulières.", "en": "Check for round, dark-edged holes across several leaves rather than irregular tears."},
        "immediate": {"ar": "أزل الأوراق أو الأفرع الشديدة الإصابة، نظف البقايا، وحسن حركة الهواء داخل الشجرة.", "fr": "Retirez les feuilles ou rameaux très atteints, nettoyez les débris et améliorez la circulation d’air.", "en": "Remove heavily affected leaves or twigs, clean debris, and improve airflow."},
        "conditional": {"ar": "بعد تأكيد محلي، راجع برنامج وقاية بفطري مسجل للوز، خصوصاً قبل فترات رطوبة مناسبة للعدوى.", "fr": "Après confirmation locale, examinez un programme préventif avec un fongicide homologué pour amandier avant les périodes humides.", "en": "After local confirmation, review a preventive program with a registered almond fungicide before wet infection periods."},
        "source": "https://ipm.ucanr.edu/agriculture/almond/shot-hole/",
    },
    {
        "id": "almond_brown_rot_blossom_blight", "crop_id": "almond", "scientific_name": "Monilinia laxa",
        "name": {"ar": "لفحة أزهار اللوز والعفن البني", "fr": "Moniliose des fleurs de l’amandier", "en": "Almond brown rot blossom blight"},
        "symptoms": ["brown_withered_blossom", "collapsed_spur", "gumming_flower_base", "twig_canker"],
        "evidence": {"ar": "ذبول واسمرار الأزهار مع جفاف الدوابر أو ظهور صمغ قرب قاعدة الزهرة قد يتوافق مع لفحة العفن البني.", "fr": "Des fleurs brunies et flétries, des bouquets desséchés ou une gomme près de leur base peuvent correspondre à la moniliose.", "en": "Brown, withered blossoms with collapsed spurs or gum near their base can match brown rot blossom blight."},
        "field": {"ar": "افحص بقاء الأزهار الجافة ملتصقة بالأفرع ووجود تقرحات أو صمغ على الأغصان القريبة.", "fr": "Vérifiez si les fleurs sèches restent attachées et recherchez des chancres ou de la gomme sur les rameaux proches.", "en": "Check whether dead blossoms remain attached and look for nearby twig cankers or gumming."},
        "immediate": {"ar": "أزل الأزهار والأفرع الشديدة الإصابة ونظف البقايا لتحسين نظافة البستان.", "fr": "Retirez les fleurs et rameaux très atteints et assainissez les débris du verger.", "en": "Remove heavily blighted blossoms and twigs, and sanitize orchard debris."},
        "conditional": {"ar": "بعد تأكيد محلي، اسأل عن برنامج فطري مسجل للوز في مرحلة الإزهار واتبع الملصق المحلي فقط.", "fr": "Après confirmation locale, renseignez-vous sur un programme fongicide homologué sur amandier à la floraison et suivez uniquement l’étiquette locale.", "en": "After local confirmation, ask about a registered almond bloom-stage fungicide program and follow the local label only."},
        "source": "https://ipm.ucanr.edu/agriculture/almond/brown-rot-blossom-blight/",
    },
    {
        "id": "pomegranate_black_heart", "crop_id": "pomegranate", "scientific_name": "Alternaria alternata",
        "name": {"ar": "تعفن القلب الأسود في الرمان", "fr": "Cœur noir du grenadier", "en": "Pomegranate black heart"},
        "symptoms": ["calyx_end_darkening", "premature_fruit_drop", "internal_fruit_decay"],
        "evidence": {"ar": "اسوداد قرب تاج الثمرة أو سقوطها المبكر قد يتوافقان مع تعفن داخلي، لكن الصورة الخارجية وحدها غير كافية.", "fr": "Un assombrissement près du calice ou une chute précoce peut correspondre à une pourriture interne, mais une photo externe seule ne suffit pas.", "en": "Darkening near the calyx or early fruit drop can fit an internal rot, but an external photo alone is insufficient."},
        "field": {"ar": "افتح ثمرة مصابة بحذر: اسوداد الحبوب أو اللب الداخلي هو الفحص الأهم قبل أي قرار.", "fr": "Ouvrez avec précaution un fruit suspect: le noircissement interne des arilles est la vérification clé.", "en": "Carefully open a suspect fruit: internal blackening of arils is the key field check."},
        "immediate": {"ar": "افصل الثمار المشكوك فيها، أزل الثمار المتساقطة، وقلل الجروح أثناء الخدمة والحصاد.", "fr": "Séparez les fruits suspects, retirez les fruits tombés et réduisez les blessures pendant l’entretien et la récolte.", "en": "Separate suspect fruit, remove dropped fruit, and reduce wounds during handling and harvest."},
        "conditional": {"ar": "اطلب تأكيداً محلياً قبل أي برنامج فطري؛ العلاج بعد ظهور التعفن الداخلي قد يكون محدود الفاعلية.", "fr": "Demandez une confirmation locale avant tout programme fongicide; un traitement après pourriture interne peut être limité.", "en": "Seek local confirmation before any fungicide program; treatment after internal rot is visible may be limited."},
        "source": "https://ipm.ucanr.edu/agriculture/pomegranate/alternaria-fruit-rot-black-heart/",
    },
    {
        "id": "fig_rust", "crop_id": "fig", "scientific_name": "Cerotelium fici",
        "name": {"ar": "صدأ التين", "fr": "Rouille du figuier", "en": "Fig rust"},
        "symptoms": ["yellow_upper_leaf_spot", "orange_underside_pustules", "leaf_drop"],
        "evidence": {"ar": "اصفرار أو بقع على السطح العلوي مع بثرات برتقالية على أسفل الورقة قد تتوافق مع صدأ التين.", "fr": "Un jaunissement ou des taches dessus avec des pustules orangées dessous peut correspondre à la rouille du figuier.", "en": "Yellow upper-leaf spots with orange pustules underneath can match fig rust."},
        "field": {"ar": "افحص أسفل الأوراق: البثرات البرتقالية أو البنية المسحوقة علامة أكثر تمييزاً من الاصفرار وحده.", "fr": "Examinez le dessous des feuilles: des pustules poudreuses orange à brunes sont plus distinctives que le jaunissement seul.", "en": "Inspect leaf undersides: powdery orange-brown pustules are more distinctive than yellowing alone."},
        "immediate": {"ar": "أزل الأوراق المتساقطة والمصابة بشدة، حسن التهوية، ولا تسقِ فوق المجموع الخضري.", "fr": "Retirez les feuilles tombées et très atteintes, améliorez l’aération et évitez l’arrosage sur le feuillage.", "en": "Remove fallen and heavily affected leaves, improve airflow, and avoid overhead watering."},
        "conditional": {"ar": "بعد تأكيد محلي، اسأل عن مبيد فطري وقائي مسجل للتين واستخدمه فقط وفق الملصق.", "fr": "Après confirmation locale, demandez un fongicide préventif homologué pour figuier et utilisez-le uniquement selon l’étiquette.", "en": "After local confirmation, ask about a registered preventive fig fungicide and use it only as labeled."},
        "source": "https://www.uaex.uada.edu/yard-garden/plant-health-clinic/disease-notes/posts/fig-rust.aspx",
    },
    {
        "id": "grape_powdery_mildew", "crop_id": "grapevine", "scientific_name": "Erysiphe necator",
        "name": {"ar": "البياض الدقيقي في العنب", "fr": "Oïdium de la vigne", "en": "Grape powdery mildew"},
        "symptoms": ["white_powdery_growth", "leaf_curl", "dark_shoot_spot", "berry_surface_scarring"],
        "evidence": {"ar": "طبقة بيضاء دقيقية على الورقة أو الثمرة قد تتوافق مع البياض الدقيقي.", "fr": "Un revêtement blanc poudreux sur feuille ou baie peut correspondre à l’oïdium.", "en": "White powdery growth on leaves or berries can match powdery mildew."},
        "field": {"ar": "تحقق من وجود مسحوق أبيض قابل للمسح على السطحين ومن تشقق أو ندب الثمار عند الإصابة المتقدمة.", "fr": "Vérifiez un dépôt blanc essuyable sur les deux faces et des cicatrices ou fissures de baies à un stade avancé.", "en": "Check for wipeable white growth on both leaf surfaces and berry scarring or cracking later in infection."},
        "immediate": {"ar": "خفف كثافة الأوراق حول العناقيد، أزل الأجزاء الشديدة الإصابة، ولا تترك بقايا مصابة في الكرم.", "fr": "Aérez le couvert autour des grappes, retirez les parties très atteintes et ne laissez pas de débris contaminés dans la vigne.", "en": "Open the canopy around clusters, remove heavily affected parts, and do not leave infected debris in the vineyard."},
        "conditional": {"ar": "بعد التأكيد، استشر مختصاً عن برنامج وقائي بفطري مسجل للعنب؛ الوقاية المبكرة أهم من الرش بعد الانتشار الشديد.", "fr": "Après confirmation, consultez un spécialiste pour un programme préventif homologué sur vigne; la prévention précoce est plus utile qu’un traitement tardif.", "en": "After confirmation, consult an adviser about a registered grape preventive program; early prevention is more useful than late treatment."},
        "source": "https://pnwhandbooks.org/plantdisease/host-disease/grape-vitis-spp-powdery-mildew",
    },
    {
        "id": "tomato_early_blight", "crop_id": "tomato", "scientific_name": "Alternaria solani",
        "name": {"ar": "اللفحة المبكرة في الطماطم", "fr": "Alternariose de la tomate", "en": "Tomato early blight"},
        "symptoms": ["dark_brown_spot", "concentric_ring", "yellow_halo", "older_leaf_spot", "sunken_fruit_lesion"],
        "evidence": {"ar": "بقع بنية إلى سوداء ذات حلقات متراكزة، غالباً على الأوراق الأقدم، قد تتوافق مع اللفحة المبكرة.", "fr": "Des taches brunes à noires à anneaux concentriques, souvent sur les feuilles âgées, peuvent correspondre à l’alternariose.", "en": "Brown-black spots with concentric rings, often on older leaves, can match early blight."},
        "field": {"ar": "تحقق من شكل عين الثور والحافة الصفراء، وافحص الثمار قرب الكأس بحثاً عن بقع جافة غائرة.", "fr": "Recherchez l’aspect en cible et le halo jaune; contrôlez les fruits près du calice pour des taches sèches et enfoncées.", "en": "Look for bull’s-eye rings and yellow halos; inspect fruit near the calyx for dry, sunken spots."},
        "immediate": {"ar": "أزل الأوراق والثمار المصابة بشدة، حسن التباعد والتهوية، واسقِ قرب التربة بدلاً من تبليل الأوراق.", "fr": "Retirez les feuilles et fruits très atteints, améliorez l’espacement et l’aération, et arrosez près du sol plutôt que le feuillage.", "en": "Remove heavily affected leaves and fruit, improve spacing and airflow, and water near soil rather than foliage."},
        "conditional": {"ar": "بعد تأكيد محلي، اطلب برنامجاً وقائياً بمبيد فطري مسجل للطماطم؛ لا تستخدمه بديلاً عن النظافة وإدارة الرطوبة.", "fr": "Après confirmation locale, demandez un programme fongicide préventif homologué pour tomate; il ne remplace pas l’hygiène et la gestion de l’humidité.", "en": "After local confirmation, ask for a registered preventive tomato fungicide program; it does not replace sanitation and moisture management."},
        "source": "https://ipm.ucanr.edu/agriculture/tomato/early-blight/",
    },
    {
        "id": "potato_late_blight", "crop_id": "potato", "scientific_name": "Phytophthora infestans",
        "name": {"ar": "اللفحة المتأخرة في البطاطا", "fr": "Mildiou de la pomme de terre", "en": "Potato late blight"},
        "symptoms": ["water_soaked_spot", "brown_black_lesion", "white_underside_growth", "stem_lesion", "tuber_rot"],
        "evidence": {"ar": "بقع مائية تتحول سريعاً إلى بنية أو سوداء، مع نمو أبيض على أسفل الورقة عند الرطوبة، قد تتوافق مع اللفحة المتأخرة.", "fr": "Des taches imbibées d’eau devenant vite brunes ou noires, avec une croissance blanche sous la feuille par humidité, peuvent correspondre au mildiou.", "en": "Water-soaked spots that quickly turn brown-black, with white underside growth in humidity, can match late blight."},
        "field": {"ar": "افحص حافة البقعة من أسفل الورقة في الصباح الرطب؛ ظهور نمو أبيض يستدعي تحققاً سريعاً من مختص.", "fr": "Examinez le bord des taches sous la feuille par matin humide; une croissance blanche justifie une vérification rapide.", "en": "Inspect lesion edges on leaf undersides during humid mornings; white growth warrants rapid expert verification."},
        "immediate": {"ar": "أوقف نقل النباتات أو الدرنات المشكوك فيها، تجنب بلل الأوراق الطويل، وأزل المتطوعات وبقايا الدرنات من الحقل.", "fr": "Évitez de déplacer les plants ou tubercules suspects, limitez le feuillage mouillé, et éliminez repousses et tas de déchets.", "en": "Avoid moving suspect plants or tubers, limit prolonged wet foliage, and remove volunteers and cull piles."},
        "conditional": {"ar": "اطلب تأكيداً سريعاً؛ إذا تأكدت، ناقش مع مرشد محلي مبيداً فطرياً وقائياً مسجلاً وخطة عاجلة حسب ملصقه.", "fr": "Demandez une confirmation rapide; si elle est obtenue, discutez avec un conseiller d’un fongicide protectant homologué et d’un plan urgent conforme à l’étiquette.", "en": "Seek rapid confirmation; if confirmed, discuss a registered protectant fungicide and urgent labeled plan with a local adviser."},
        "source": "https://pnwhandbooks.org/plantdisease/host-disease/potato-solanum-tuberosum-late-blight",
    },
]

def build_database():
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    if DATABASE_PATH.exists():
        DATABASE_PATH.unlink()
    connection = sqlite3.connect(DATABASE_PATH)
    cursor = connection.cursor()
    cursor.executescript("""
      PRAGMA journal_mode = DELETE;
      CREATE TABLE crops (
        id TEXT PRIMARY KEY,
        name_ar TEXT NOT NULL,
        name_fr TEXT NOT NULL,
        name_en TEXT NOT NULL,
        scientific_name TEXT NOT NULL
      );
      CREATE TABLE diseases (
        id TEXT PRIMARY KEY,
        crop_id TEXT NOT NULL REFERENCES crops(id),
        scientific_name TEXT NOT NULL,
        name_ar TEXT NOT NULL,
        name_fr TEXT NOT NULL,
        name_en TEXT NOT NULL,
        symptoms_json TEXT NOT NULL,
        evidence_ar TEXT NOT NULL,
        evidence_fr TEXT NOT NULL,
        evidence_en TEXT NOT NULL,
        field_check_ar TEXT NOT NULL,
        field_check_fr TEXT NOT NULL,
        field_check_en TEXT NOT NULL,
        immediate_care_ar TEXT NOT NULL,
        immediate_care_fr TEXT NOT NULL,
        immediate_care_en TEXT NOT NULL,
        conditional_care_ar TEXT NOT NULL,
        conditional_care_fr TEXT NOT NULL,
        conditional_care_en TEXT NOT NULL,
        safety_ar TEXT NOT NULL,
        safety_fr TEXT NOT NULL,
        safety_en TEXT NOT NULL,
        source_url TEXT NOT NULL
      );
      CREATE INDEX diseases_by_crop ON diseases(crop_id);
    """)
    cursor.executemany("INSERT INTO crops VALUES (?, ?, ?, ?, ?)", CROPS)
    for disease in DISEASES:
        cursor.execute("""
          INSERT INTO diseases VALUES (
            :id, :crop_id, :scientific_name, :name_ar, :name_fr, :name_en, :symptoms_json,
            :evidence_ar, :evidence_fr, :evidence_en, :field_check_ar, :field_check_fr, :field_check_en,
            :immediate_care_ar, :immediate_care_fr, :immediate_care_en,
            :conditional_care_ar, :conditional_care_fr, :conditional_care_en,
            :safety_ar, :safety_fr, :safety_en, :source_url
          )
        """, {
          "id": disease["id"], "crop_id": disease["crop_id"], "scientific_name": disease["scientific_name"],
          "name_ar": disease["name"]["ar"], "name_fr": disease["name"]["fr"], "name_en": disease["name"]["en"],
          "symptoms_json": json.dumps(disease["symptoms"]),
          "evidence_ar": disease["evidence"]["ar"], "evidence_fr": disease["evidence"]["fr"], "evidence_en": disease["evidence"]["en"],
          "field_check_ar": disease["field"]["ar"], "field_check_fr": disease["field"]["fr"], "field_check_en": disease["field"]["en"],
          "immediate_care_ar": disease["immediate"]["ar"], "immediate_care_fr": disease["immediate"]["fr"], "immediate_care_en": disease["immediate"]["en"],
          "conditional_care_ar": disease["conditional"]["ar"], "conditional_care_fr": disease["conditional"]["fr"], "conditional_care_en": disease["conditional"]["en"],
          "safety_ar": SAFETY["ar"], "safety_fr": SAFETY["fr"], "safety_en": SAFETY["en"], "source_url": disease["source"],
        })
    connection.commit()
    connection.close()
    print(f"Built {DATABASE_PATH} with {len(CROPS)} crops and {len(DISEASES)} disease records.")

if __name__ == "__main__":
    build_database()
