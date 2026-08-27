import json
import sqlite3
from pathlib import Path
from catalog import CROPS as CATALOG_CROPS, build_catalog_records

ROOT = Path(__file__).resolve().parents[1]
DATABASE_PATH = ROOT / "data" / "cropguide.sqlite"

CROPS = [crop[:5] for crop in CATALOG_CROPS]

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
    {
        "id": "onion_botrytis_leaf_blight", "crop_id": "onion", "scientific_name": "Botrytis squamosa",
        "name": {"ar": "لفحة أوراق البوتريتس في البصل", "fr": "Brûlure des feuilles à Botrytis de l’oignon", "en": "Onion Botrytis leaf blight"},
        "symptoms": ["water_soaked_spot", "yellow_halo", "leaf_tip_dieback"],
        "evidence": {"ar": "نقاط صغيرة بيضاء بيضوية مع هالة خضراء أو فضية قد تصبح مائية، ثم تصفر الأوراق أو تموت أطرافها، قد تتوافق مع لفحة بوتريتس الورقية في البصل.", "fr": "De petites taches ovales blanchâtres, avec un halo vert pâle ou argenté, devenant parfois imbibées d’eau puis suivies de jaunissement ou de dessèchement des pointes, peuvent correspondre à la brûlure des feuilles à Botrytis.", "en": "Small whitish oval spots with light green or silvery halos that may become water-soaked, followed by yellowing or tip dieback, can match onion Botrytis leaf blight."},
        "field": {"ar": "افحص عدة أوراق بحثاً عن بقع بيضاء صغيرة متكررة بهالة رقيقة؛ في الرطوبة، ميّزها عن البياض الزغبي الذي يكوّن نمواً زغبياً رمادياً إلى بنفسجي على الورقة.", "fr": "Examinez plusieurs feuilles pour des petites taches blanches répétées à halo fin; par temps humide, distinguez-les du mildiou qui forme un duvet gris à violet sur la feuille.", "en": "Inspect several leaves for repeated small white haloed spots; in humid weather, distinguish them from downy mildew, which forms gray-to-violet fuzzy growth on leaves."},
        "immediate": {"ar": "أزل الأوراق الشديدة الإصابة والبقايا وأكوام البصل التالفة، تجنب العمل بين النباتات وهي مبللة، طهّر الأدوات، وحسن التباعد والتهوية.", "fr": "Retirez les feuilles très atteintes, les débris et les tas de bulbes rebutés; évitez de travailler sur plantes mouillées, désinfectez les outils et améliorez l’espacement et l’aération.", "en": "Remove heavily affected leaves, debris, and cull piles; avoid working among wet plants, sanitize tools, and improve spacing and airflow."},
        "conditional": {"ar": "بعد تأكيد محلي، ناقش برنامج وقاية مسجلاً للبصل مع مرشد زراعي، مع اعتماد التناوب والنظافة وإدارة الرطوبة بدلاً من الاعتماد على الرش وحده.", "fr": "Après confirmation locale, discutez d’un programme préventif homologué pour l’oignon avec un conseiller; privilégiez aussi rotation, hygiène et gestion de l’humidité plutôt que les traitements seuls.", "en": "After local confirmation, discuss a registered onion preventive program with an adviser; use rotation, sanitation, and moisture management rather than relying on sprays alone."},
        "source": "https://vegpath.plantpath.wisc.edu/diseases/onion-botrytis/",
    },
    {
        "id": "carrot_cercospora_leaf_blight", "crop_id": "carrot", "scientific_name": "Cercospora carotae",
        "name": {"ar": "لفحة أوراق السركسبورا في الجزر", "fr": "Brûlure cercosporienne de la carotte", "en": "Carrot Cercospora leaf blight"},
        "symptoms": ["water_soaked_spot", "yellow_halo", "pale_gray_underside_growth", "tan_elliptical_petioles"],
        "evidence": {"ar": "بقع صغيرة خضراء إلى بنية مائية بهالة صفراء على أوراق أو أعناق الجزر، مع سطح سفلي رمادي شاحب ونقاط سوداء دقيقة في الرطوبة، قد تتوافق مع لفحة السركسبورا.", "fr": "De petites taches vert-brun imbibées d’eau avec halo jaune sur feuilles ou pétioles de carotte, avec un revers gris pâle et de minuscules points noirs par temps humide, peuvent correspondre à la cercosporiose.", "en": "Small greenish-brown water-soaked spots with yellow halos on carrot leaves or petioles, with pale-gray undersides and tiny black dots in humid weather, can match Cercospora leaf blight."},
        "field": {"ar": "افحص نباتات فتية متعددة وأسفل الأوراق في جو رطب؛ أعناق Cercospora تكون بيضوية بمركز فاتح وحافة بنية. لا تفرق الصورة وحدها بأمان بينها وبين Alternaria أو اللفحة البكتيرية.", "fr": "Examinez plusieurs jeunes plants et le dessous des feuilles par temps humide; les lésions de pétiole de Cercospora sont elliptiques, à centre clair et bord brun. Une photo seule ne la distingue pas fiablement d’Alternaria ou d’une brûlure bactérienne.", "en": "Inspect several young plants and leaf undersides in humid weather; Cercospora petiole lesions are elliptical with tan centers and brown borders. A photo alone cannot reliably separate it from Alternaria or bacterial blight."},
        "immediate": {"ar": "أزل البقايا الشديدة الإصابة، تجنب العمل أو الري العلوي عندما يكون المجموع الخضري مبللاً، ونظف الأدوات وحدد مواضع البقع في الحقل.", "fr": "Retirez les débris très atteints, évitez de travailler ou d’arroser par aspersion lorsque le feuillage est mouillé, désinfectez les outils et repérez les foyers dans la parcelle.", "en": "Remove heavily affected debris, avoid working or overhead watering while foliage is wet, sanitize tools, and mark disease patches in the field."},
        "conditional": {"ar": "بعد التأكيد المحلي، ناقش مع مرشد زراعي تناوباً وبذوراً نظيفة وخياراً وقائياً مسجلاً للجزر عند الحاجة، وفق الملصق المحلي فقط.", "fr": "Après confirmation locale, discutez avec un conseiller de rotation, de semences saines et d’une option préventive homologuée pour carotte si nécessaire, uniquement selon l’étiquette locale.", "en": "After local confirmation, discuss rotation, clean seed, and a registered preventive option for carrot if needed, following the local label only."},
        "source": "https://vegpath.plantpath.wisc.edu/diseases/carrot-alternaria-and-cercospora-leaf-blights/",
    },
    {
        "id": "carrot_cavity_spot", "crop_id": "carrot", "scientific_name": "Pythium/Globisporangium complex",
        "name": {"ar": "التبقع التجويفي في الجزر", "fr": "Taches cavitaires de la carotte", "en": "Carrot cavity spot"},
        "symptoms": ["small_horizontal_root_cavity", "darkened_root_lesion", "no_secondary_soft_rot"],
        "evidence": {"ar": "تجاويف صغيرة أفقية على جذر الجزر قرب الحصاد، قد تصبح داكنة وتتسع من دون عفن طري ثانوي واضح، قد تتوافق مع التبقع التجويفي.", "fr": "De petites cavités horizontales sur une racine de carotte près de la récolte, pouvant foncer et s’élargir sans pourriture molle secondaire évidente, peuvent correspondre aux taches cavitaires.", "en": "Small horizontal cavities on carrot roots near harvest that may darken and enlarge without obvious secondary soft rot can match cavity spot."},
        "field": {"ar": "افحص جذوراً متعددة عند الحصاد: يجب أن تتكرر التجاويف السطحية الصغيرة أفقياً. ميّزها عن الجروح أو القضم أو العفن الطري المنتشر، وسجل تاريخ الحقل والصرف.", "fr": "Examinez plusieurs racines à la récolte: de petites cavités superficielles horizontales doivent se répéter. Distinguez-les des blessures, morsures ou pourriture molle étendue, et notez l’historique et le drainage de la parcelle.", "en": "Inspect several roots at harvest: small, horizontal, shallow cavities should repeat. Distinguish them from injury, feeding, or spreading soft rot, and record field history and drainage."},
        "immediate": {"ar": "افصل الجذور شديدة الإصابة عند الفرز ولا تستخدمها للإكثار، وتجنب نقل تربة ملتصقة من الحقل المشتبه به. خطط لأحواض مرتفعة وصرف أفضل للموسم التالي.", "fr": "Écartez les racines très atteintes au tri et ne les utilisez pas pour la multiplication; évitez de déplacer de la terre adhérente depuis la parcelle suspecte. Prévoyez des planches surélevées et un meilleur drainage pour la saison suivante.", "en": "Separate heavily affected roots during grading and do not use them for propagation; avoid moving adhering soil from a suspect field. Plan raised beds and improved drainage for the next season."},
        "conditional": {"ar": "إذا تكرر الضرر في حقل أو موسم لاحق، اطلب تأكيداً مخبرياً أو محلياً قبل أي معالجة تربة، وناقش فقط خياراً مسجلاً للجزر ومرضه في تونس.", "fr": "Si les dégâts se répètent dans une parcelle ou une saison ultérieure, demandez une confirmation locale ou de laboratoire avant tout traitement du sol, et ne discutez que d’une option homologuée en Tunisie pour la carotte et ce problème.", "en": "If damage recurs in a field or later season, seek local or laboratory confirmation before any soil treatment, and discuss only an option registered in Tunisia for carrot and this problem."},
        "source": "https://pnwhandbooks.org/plantdisease/host-disease/carrot-daucus-carota-cavity-spot",
    },
    {
        "id": "grapevine_phomopsis_cane_leaf_spot", "crop_id": "grapevine", "scientific_name": "Phomopsis viticola (Diaporthe ampelina)",
        "name": {"ar": "فوموبسيس الساق وتبقع أوراق العنب", "fr": "Phomopsis des rameaux et des feuilles de vigne", "en": "Grape Phomopsis cane and leaf spot"},
        "symptoms": ["tiny_dark_leaf_spot", "yellowish_leaf_margin", "black_centered_shoot_spot", "scabby_cane", "mummified_berry"],
        "evidence": {"ar": "نقاط داكنة صغيرة بهوامش مصفرة على الأوراق أو العروق، مع بقع سوداء على قاعدة الأفرع قد تتشقق وتصبح خشنة، قد تتوافق مع فوموبسيس العنب.", "fr": "De très petites taches sombres à marge jaunâtre sur les feuilles ou les nervures, avec des taches noires à la base des rameaux pouvant se fissurer et devenir rugueuses, peuvent correspondre au Phomopsis de la vigne.", "en": "Tiny dark spots with yellowish margins on leaves or veins, with black-centered basal shoot spots that can crack and become scabby, can match grape Phomopsis."},
        "field": {"ar": "افحص الأوراق القاعدية والأفرع في عدة كروم: تكرار البقع السوداء المتشققة على قواعد الأفرع، وقصب مبيض في السكون مع نقط سوداء دقيقة، يقوي الفرضية. ميّزه عن أضرار ميكانيكية أو لفحات خشب أخرى.", "fr": "Examinez les feuilles basales et les rameaux sur plusieurs ceps: la répétition de taches noires fissurées à la base des rameaux, puis de sarments blanchis avec de petits points noirs en dormance, renforce l’hypothèse. Distinguez-la de blessures mécaniques ou d’autres maladies du bois.", "en": "Inspect basal leaves and shoots across several vines: repeated cracked black basal shoot spots, then bleached dormant canes with tiny black dots, strengthen the match. Distinguish it from mechanical injury or other wood diseases."},
        "immediate": {"ar": "حدد الأفرع الشديدة الإصابة لإزالتها خلال السكون، اجمع بقايا التقليم، وطهّر أدوات التقليم بين النباتات المشتبه بها. حسّن التهوية وتجنب العمل في الكرم وهو مبلل.", "fr": "Repérez les rameaux très atteints pour les supprimer durant la dormance, ramassez les résidus de taille et désinfectez les outils entre ceps suspects. Améliorez l’aération et évitez de travailler dans la vigne lorsqu’elle est mouillée.", "en": "Mark heavily affected shoots for removal during dormancy, collect pruning debris, and sanitize pruning tools between suspect vines. Improve airflow and avoid working in wet vines."},
        "conditional": {"ar": "بعد تأكيد محلي، ناقش مع مرشد زراعي توقيت برنامج وقائي مسجل للعنب، خصوصاً بعد فترات المطر في بداية الموسم، ولا تعتمد على الصورة وحدها لاتخاذ قرار معالجة.", "fr": "Après confirmation locale, discutez avec un conseiller du calendrier d’un programme préventif homologué pour vigne, surtout après les pluies de début de saison; ne fondez pas une décision de traitement sur la photo seule.", "en": "After local confirmation, discuss timing for a registered grape preventive program, especially after early-season rain; do not base a treatment decision on the photo alone."},
        "source": "https://ipm.ucanr.edu/agriculture/grape/phomopsis-cane-and-leafspot/",
    },
    {
        "id": "celery_early_blight", "crop_id": "celery", "scientific_name": "Cercospora apii",
        "name": {"ar": "اللفحة المبكرة في الكرفس", "fr": "Brûlure précoce du céleri", "en": "Celery early blight"},
        "symptoms": ["small_yellow_spot", "gray_circular_lesion", "papery_cracked_lesion", "coalescing_leaf_blight"],
        "evidence": {"ar": "بقع صفراء صغيرة على سطحي أوراق الكرفس تكبر إلى آفات رمادية دائرية؛ الآفات الجافة قد تصبح ورقية وتتشقّق ثم تتحد لتسبب لفحة ورقية، وقد تتوافق مع اللفحة المبكرة.", "fr": "De petites taches jaunes sur les deux faces des feuilles de céleri s’agrandissent en lésions circulaires grises; les lésions sèches peuvent devenir papyracées, se fissurer puis fusionner en brûlure foliaire, ce qui peut correspondre à la brûlure précoce.", "en": "Small yellow spots on both celery leaf surfaces enlarge into gray circular lesions; dry lesions can become papery, crack, and coalesce into leaf blight, which can match early blight."},
        "field": {"ar": "افحص عدة نباتات وأعناق الأوراق: غياب نقاط سوداء دقيقة داخل البقع يدعم اللفحة المبكرة، لكنه لا يؤكدها من الصورة وحدها. قارنها مع اللفحة المتأخرة التي تكوّن بيكنيديا سوداء صغيرة.", "fr": "Examinez plusieurs plants et pétioles: l’absence de minuscules points noirs dans les lésions soutient l’hypothèse de brûlure précoce, sans confirmation sur photo seule. Comparez avec la brûlure tardive, qui forme de petites pycnides noires.", "en": "Inspect several plants and petioles: the absence of tiny black dots in lesions supports early blight but does not confirm it from a photo alone. Compare with late blight, which forms small black pycnidia."},
        "immediate": {"ar": "أزل الأوراق والبقايا شديدة الإصابة، تجنب العمل أو الري العلوي حين تكون النباتات مبللة، ونظف الأدوات وحسن التهوية.", "fr": "Retirez les feuilles et débris très atteints, évitez le travail ou l’arrosage par aspersion lorsque les plantes sont mouillées, désinfectez les outils et améliorez l’aération.", "en": "Remove heavily affected leaves and debris, avoid working or overhead watering while plants are wet, sanitize tools, and improve airflow."},
        "conditional": {"ar": "بعد تأكيد محلي، ناقش تناوب المحاصيل وبذوراً أو شتلات سليمة وخياراً وقائياً مسجلاً للكرفس عند الحاجة، وفق الملصق المحلي فقط.", "fr": "Après confirmation locale, discutez de rotation, de semences ou plants sains, et d’une option préventive homologuée pour le céleri si nécessaire, uniquement selon l’étiquette locale.", "en": "After local confirmation, discuss rotation, healthy seed or transplants, and a registered preventive option for celery if needed, following the local label only."},
        "source": "https://ipm.ucanr.edu/agriculture/celery/early-blight/",
    },
    {
        "id": "celery_late_blight", "crop_id": "celery", "scientific_name": "Septoria apiicola",
        "name": {"ar": "اللفحة المتأخرة (سيبتوريا) في الكرفس", "fr": "Brûlure tardive (septoriose) du céleri", "en": "Celery late blight (Septoria leaf blight)"},
        "symptoms": ["light_yellow_leaf_spot", "brown_petiolar_spot", "black_pycnidia", "coalescing_leaf_blight"],
        "evidence": {"ar": "بقع صفراء فاتحة صغيرة على أوراق وأعناق الكرفس تتحول تدريجياً إلى بنية، وقد تتحد. ظهور نقاط سوداء صغيرة متصلبة داخل البقع قد يتوافق مع لفحة سيبتوريا المتأخرة.", "fr": "De petites taches jaune clair sur les feuilles et pétioles de céleri deviennent progressivement brunes et peuvent fusionner. De minuscules points noirs épaissis dans les lésions peuvent correspondre à la brûlure tardive à Septoria.", "en": "Small light-yellow spots on celery leaves and petioles gradually turn brown and may coalesce. Minute thickened black dots within lesions can match late blight caused by Septoria."},
        "field": {"ar": "افحص الأوراق والأعناق على نباتات متعددة، خصوصاً في الطقس الرطب، وابحث عن البيكنيديا السوداء الدقيقة. لا تخلطها مع اللفحة المبكرة التي لا تُظهر هذه النقاط.", "fr": "Examinez feuilles et pétioles sur plusieurs plants, surtout par temps humide, à la recherche de petites pycnides noires. Ne la confondez pas avec la brûlure précoce, qui ne présente pas ces points.", "en": "Inspect leaves and petioles across several plants, especially in humid weather, for tiny black pycnidia. Do not confuse it with early blight, which lacks these dots."},
        "immediate": {"ar": "أوقف العمل وسط المجموع الخضري وهو مبلل، أزل البقايا المصابة بعد الحصاد، ونظف الأدوات وحدد البقع المصابة لتقليل انتقالها بالماء أو المعدات.", "fr": "Évitez de travailler dans un feuillage mouillé, retirez les résidus atteints après récolte, désinfectez les outils et repérez les foyers pour limiter la dissémination par l’eau ou le matériel.", "en": "Avoid working in wet foliage, remove infected residue after harvest, sanitize tools, and mark disease patches to limit spread by water or equipment."},
        "conditional": {"ar": "بعد التأكيد المحلي، ناقش بذوراً نظيفة وتناوباً وخياراً وقائياً مسجلاً للكرفس عند الحاجة؛ لا تستخدم أي منتج أو جرعة بناء على الصورة فقط.", "fr": "Après confirmation locale, discutez de semences saines, de rotation et d’une option préventive homologuée pour le céleri si nécessaire; n’utilisez aucun produit ni dose à partir d’une photo seule.", "en": "After local confirmation, discuss clean seed, rotation, and a registered preventive option for celery if needed; do not use any product or dose based on a photo alone."},
        "source": "https://pnwhandbooks.org/plantdisease/host-disease/celery-apium-graveolens-var-dulce-late-blight-septoria-leaf-blight",
    },
    {
        "id": "celery_pink_rot", "crop_id": "celery", "scientific_name": "Sclerotinia sclerotiorum",
        "name": {"ar": "العفن الوردي في الكرفس", "fr": "Pourriture rose du céleri", "en": "Celery pink rot"},
        "symptoms": ["brown_petiolar_lesion", "soft_watery_decay", "pink_surrounding_tissue", "white_mycelium", "black_sclerotia", "plant_base_collapse"],
        "evidence": {"ar": "آفات بنية على أعناق الكرفس قرب خط التربة أو في المجموع الخضري تتسع سريعاً إلى عفن مائي طري، وقد يتحول النسيج المحيط إلى وردي مع نمو أبيض وأجسام سوداء صلبة لاحقاً، قد تتوافق مع العفن الوردي.", "fr": "Des lésions brunes sur les pétioles de céleri, près du sol ou dans le couvert, s’étendent rapidement en pourriture molle et aqueuse; le tissu voisin peut rosir, avec ensuite mycélium blanc et sclérotes noirs, ce qui peut correspondre à la pourriture rose.", "en": "Brown celery petiole lesions near the soil line or in the canopy rapidly expand into soft watery decay; surrounding tissue can turn pink, followed by white mycelium and black sclerotia, which can match pink rot."},
        "field": {"ar": "افحص قاعدة النبات وأعناقاً متعددة: تحقق من تكرار العفن المائي مع لون وردي وانهيار القاعدة، وابحث عن الأجسام السوداء الصلبة. ميّزه عن إصابات عفن أخرى، واطلب تأكيداً محلياً قبل اتخاذ قرار معالجة.", "fr": "Examinez la base des plants et plusieurs pétioles: vérifiez la répétition de pourriture aqueuse avec teinte rose et effondrement de la base, et recherchez les sclérotes noirs. Distinguez-la d’autres pourritures et demandez une confirmation locale avant un traitement.", "en": "Inspect plant bases and several petioles: verify repeated watery rot with pink tissue and base collapse, and look for black sclerotia. Distinguish it from other rots and seek local confirmation before treatment."},
        "immediate": {"ar": "اعزل النباتات شديدة الإصابة، أزل البقايا من الحقل، تجنب نقل تربة أو أدوات ملوثة بين الأحواض، وحسن الصرف والتهوية.", "fr": "Isolez les plants très atteints, retirez les résidus de la parcelle, évitez de déplacer terre ou outils contaminés entre planches, et améliorez drainage et aération.", "en": "Isolate heavily affected plants, remove residue from the field, avoid moving contaminated soil or tools between beds, and improve drainage and airflow."},
        "conditional": {"ar": "بعد التأكيد المحلي، ناقش تناوباً أطول وإدارة بقايا المحصول وخياراً مسجلاً للكرفس عند الحاجة، مع مراعاة تشخيص العفن والملصق المحلي.", "fr": "Après confirmation locale, discutez d’une rotation plus longue, de la gestion des résidus et d’une option homologuée pour le céleri si nécessaire, selon le diagnostic et l’étiquette locale.", "en": "After local confirmation, discuss a longer rotation, crop-residue management, and a registered option for celery if needed, according to the diagnosis and local label."},
        "source": "https://ipm.ucanr.edu/agriculture/celery/pink-rot/",
    },
    {
        "id": "parsley_septoria_leaf_spot", "crop_id": "parsley", "scientific_name": "Septoria petroselini",
        "name": {"ar": "تبقع أوراق السيبتوريا في البقدونس", "fr": "Tache septorienne du persil", "en": "Parsley Septoria leaf spot"},
        "symptoms": ["grayish_brown_angular_spot", "oval_petiolar_spot", "black_pycnidia", "leaf_yellowing"],
        "evidence": {"ar": "بقع صغيرة رمادية إلى بنية، تميل لأن تكون زاوية بعض الشيء، على أوراق البقدونس مع بقع بيضاوية صغيرة على الأعناق ونقاط داكنة دقيقة قد تتوافق مع تبقع السيبتوريا.", "fr": "De petites taches gris-brun, parfois anguleuses, sur les feuilles de persil avec de petites taches ovales sur les pétioles et de minuscules points sombres peuvent correspondre à la septoriose.", "en": "Small grayish-brown, somewhat angular spots on parsley leaves with small oval petiole spots and minute dark specks can match Septoria leaf spot."},
        "field": {"ar": "افحص عدة أوراق وأعناق بحثاً عن النقاط السوداء الدقيقة داخل البقع الجافة. قارنها مع التبقع البكتيري الذي يبقى مائياً أكثر وقد يصيب البراعم أيضاً؛ لا تؤكد التشخيص من صورة واحدة.", "fr": "Examinez plusieurs feuilles et pétioles à la recherche de minuscules points noirs dans les taches sèches. Comparez avec la tache bactérienne, plus aqueuse et pouvant aussi atteindre les pousses; ne confirmez pas sur une seule photo.", "en": "Inspect several leaves and petioles for minute black dots within dry lesions. Compare with bacterial leaf spot, which is more water-soaked and can also affect shoots; do not confirm from one photo."},
        "immediate": {"ar": "أزل الأوراق والبقايا شديدة الإصابة، قلل بقاء الأوراق مبللة، وتجنب العمل بين النباتات المبتلة أو نقل الأدوات دون تنظيف.", "fr": "Retirez les feuilles et débris très atteints, réduisez la durée de mouillage du feuillage et évitez de travailler dans des plants mouillés ou de déplacer des outils sans les nettoyer.", "en": "Remove heavily affected leaves and debris, shorten leaf-wetness periods, and avoid working among wet plants or moving tools without cleaning them."},
        "conditional": {"ar": "بعد تأكيد محلي، ناقش بذوراً سليمة وتناوباً خارج الفصيلة الخيمية وخياراً وقائياً مسجلاً للبقدونس عند الحاجة، وفق الملصق المحلي فقط.", "fr": "Après confirmation locale, discutez de semences saines, d’une rotation hors Apiacées et d’une option préventive homologuée pour le persil si nécessaire, uniquement selon l’étiquette locale.", "en": "After local confirmation, discuss clean seed, rotation outside Apiaceae, and a registered preventive option for parsley if needed, following the local label only."},
        "source": "https://pnwhandbooks.org/plantdisease/host-disease/parsley-petroselinum-crispum-septoria-leaf-spot",
    },
    {
        "id": "parsley_bacterial_leaf_spot", "crop_id": "parsley", "scientific_name": "Pseudomonas syringae pv. coriandricola and related bacteria",
        "name": {"ar": "التبقع البكتيري في البقدونس", "fr": "Tache bactérienne du persil", "en": "Parsley bacterial leaf spot"},
        "symptoms": ["water_soaked_necrotic_lesion", "brown_leaf_spot", "brown_petiolar_lesion", "shoot_lesion", "stunting_yellowing"],
        "evidence": {"ar": "آفات بنية نخرية تبدو مائية على أوراق وأعناق أو براعم البقدونس، مع اصفرار وتقزم عند الشدة، قد تتوافق مع التبقع البكتيري.", "fr": "Des lésions nécrotiques brunes d’aspect aqueux sur les feuilles, pétioles ou pousses de persil, avec jaunissement et nanisme lors d’atteintes sévères, peuvent correspondre à une tache bactérienne.", "en": "Brown necrotic lesions with a water-soaked appearance on parsley leaves, petioles, or shoots, with yellowing and stunting when severe, can match bacterial leaf spot."},
        "field": {"ar": "افحص مواضع متعددة بما فيها البراعم: تكرار الآفات البنية المائية على الأوراق والأعناق والبراعم يدعم الاحتمال. قارنها مع سيبتوريا التي تميل إلى بقع جافة رمادية ونقاط سوداء دقيقة.", "fr": "Examinez plusieurs sites, y compris les pousses: la répétition de lésions brunes aqueuses sur feuilles, pétioles et pousses soutient l’hypothèse. Comparez avec Septoria, plus sèche, grisâtre et ponctuée de petits points noirs.", "en": "Inspect multiple sites including shoots: repeated water-soaked brown lesions on leaves, petioles, and shoots support the match. Compare with Septoria, which tends to have drier gray lesions with tiny black dots."},
        "immediate": {"ar": "اعزل النباتات شديدة الإصابة، استخدم بذوراً أو شتلات سليمة، لا تعِد استعمال أوساط أو صوانٍ ملوثة، ونظف الأدوات قبل الانتقال بين الأحواض.", "fr": "Isolez les plants très atteints, utilisez des semences ou plants sains, ne réutilisez pas des substrats ou plateaux contaminés, et désinfectez les outils avant de passer d’une planche à l’autre.", "en": "Isolate heavily affected plants, use healthy seed or transplants, do not reuse contaminated media or trays, and sanitize tools before moving between beds."},
        "conditional": {"ar": "بعد تأكيد محلي، ناقش إدارة البذور وخياراً مسجلاً للبقدونس عند الحاجة. لا تختَر منتجاً أو جرعة بناء على الصورة وحدها.", "fr": "Après confirmation locale, discutez de la gestion des semences et d’une option homologuée pour le persil si nécessaire. Ne choisissez aucun produit ni dose sur une photo seule.", "en": "After local confirmation, discuss seed management and a registered option for parsley if needed. Do not choose any product or dose from a photo alone."},
        "source": "https://pnwhandbooks.org/plantdisease/host-disease/parsley-petroselinum-crispum-bacterial-leaf-spot",
    },
    {
        "id": "spinach_anthracnose", "crop_id": "spinach", "scientific_name": "Colletotrichum dematium",
        "name": {"ar": "أنثراكنوز السبانخ", "fr": "Anthracnose de l’épinard", "en": "Spinach anthracnose"},
        "symptoms": ["small_circular_water_soaked_lesion", "brown_tan_papery_spot", "black_acervuli", "coalescing_leaf_blight"],
        "evidence": {"ar": "بقع صغيرة دائرية مائية على أوراق السبانخ الفتية أو الكبيرة تكبر وتصبح بنية إلى سمراء رقيقة وورقية؛ قد تتحد لتسبب لفحة، وتظهر أجسام إثمار سوداء دقيقة بكثرة في النسيج المصاب، ما قد يتوافق مع الأنثراكنوز.", "fr": "De petites lésions circulaires aqueuses sur les jeunes ou vieilles feuilles d’épinard s’agrandissent, deviennent brunes à fauves, minces et papyracées; elles peuvent fusionner en brûlure, avec de minuscules acervules noires abondantes dans le tissu atteint, ce qui peut correspondre à l’anthracnose.", "en": "Small circular water-soaked lesions on young or old spinach leaves enlarge, turn brown to tan, and become thin and papery; they can coalesce into blight, with abundant tiny black acervuli in diseased tissue, which can match anthracnose."},
        "field": {"ar": "افحص عدة أوراق من نباتات مختلفة بحثاً عن الأجسام السوداء الدقيقة داخل البقع الورقية. قارنها مع التبقعات الأخرى؛ وجود الأجسام الثمرية يساعد في التمييز لكنه لا يثبت التشخيص من صورة واحدة.", "fr": "Examinez plusieurs feuilles de plants différents à la recherche de minuscules acervules noires dans les taches. Comparez avec d’autres taches foliaires; leur présence aide à différencier sans confirmer sur une seule photo.", "en": "Inspect several leaves from different plants for tiny black acervuli within lesions. Compare with other leaf spots; their presence helps differentiate but does not confirm from one photo."},
        "immediate": {"ar": "أزل الأوراق والبقايا شديدة الإصابة، قلل تناثر الماء وبقاء الأوراق مبللة، وتجنب المرور أو العمل في النباتات المبتلة ثم نظف الأدوات.", "fr": "Retirez les feuilles et débris très atteints, limitez les éclaboussures et le mouillage du feuillage, évitez de travailler dans des plants mouillés puis désinfectez les outils.", "en": "Remove heavily affected leaves and debris, limit splash and leaf-wetness periods, avoid working in wet plants, then sanitize tools."},
        "conditional": {"ar": "بعد تأكيد محلي، ناقش بذوراً أو شتلات سليمة وتدويراً وإجراءً وقائياً مسجلاً للسبانخ عند الحاجة، وفق الملصق المحلي فقط.", "fr": "Après confirmation locale, discutez de semences ou plants sains, de rotation et d’une mesure préventive homologuée pour l’épinard si nécessaire, uniquement selon l’étiquette locale.", "en": "After local confirmation, discuss healthy seed or transplants, rotation, and a registered preventive measure for spinach if needed, following the local label only."},
        "source": "https://ipm.ucanr.edu/agriculture/spinach/anthracnose/",
    },
    {
        "id": "garlic_botrytis_leaf_blight", "crop_id": "garlic", "scientific_name": "Botrytis squamosa",
        "name": {"ar": "لفحة أوراق البوتريتس في الثوم", "fr": "Brûlure des feuilles à Botrytis de l’ail", "en": "Garlic Botrytis leaf blight"},
        "symptoms": ["small_white_leaf_spot", "yellow_halo", "water_soaked_leaf_lesion", "leaf_tip_dieback"],
        "evidence": {"ar": "تبدأ لفحة بوتريتس الثوم كنقاط أو بقع بيضاء صغيرة على الأوراق، وقد تتسع وتتحد مع هالات مصفرة أو نسيج مائي، ثم تصفر الأوراق أو تموت أطرافها، ما قد يتوافق مع لفحة الأوراق.", "fr": "La brûlure à Botrytis de l’ail commence par de petites taches blanches sur les feuilles; elles peuvent s’agrandir et fusionner avec des halos jaunes ou des tissus aqueux, puis les feuilles jaunissent ou sèchent par l’extrémité, ce qui peut correspondre à la brûlure foliaire.", "en": "Garlic Botrytis leaf blight begins as small white leaf spots that may enlarge and merge with yellow halos or water-soaked tissue, followed by yellowing or tip dieback, which can match leaf blight."},
        "field": {"ar": "افحص أوراقاً متعددة في الطقس الرطب وابحث عن بقع بيضاء صغيرة متكررة قبل اصفرار الأطراف. قارنها مع البياض الزغبي الذي يظهر غالباً بنمو رمادي إلى بنفسجي، ولا تؤكد التشخيص من صورة واحدة.", "fr": "Examinez plusieurs feuilles par temps humide et recherchez de petites taches blanches répétées avant le jaunissement des pointes. Comparez avec le mildiou, qui montre souvent un duvet gris à violet, et ne confirmez pas sur une seule photo.", "en": "Inspect several leaves in humid conditions for repeated small white spots before tip yellowing. Compare with downy mildew, which often shows gray-to-violet fuzzy growth, and do not confirm from one photo."},
        "immediate": {"ar": "أزل البقايا والأوراق شديدة الإصابة، تجنب العمل أو الري العلوي حين يكون النبات مبللاً، ونظف الأدوات وحسن التباعد والتهوية.", "fr": "Retirez les débris et feuilles très atteintes, évitez de travailler ou d’arroser par aspersion lorsque les plantes sont mouillées, désinfectez les outils et améliorez l’espacement et l’aération.", "en": "Remove debris and heavily affected leaves, avoid working or overhead watering while plants are wet, sanitize tools, and improve spacing and airflow."},
        "conditional": {"ar": "بعد تأكيد محلي، ناقش تناوباً وإدارة الرطوبة وخياراً وقائياً مسجلاً للثوم عند الحاجة، وفق الملصق المحلي فقط.", "fr": "Après confirmation locale, discutez de rotation, de gestion de l’humidité et d’une option préventive homologuée pour l’ail si nécessaire, uniquement selon l’étiquette locale.", "en": "After local confirmation, discuss rotation, moisture management, and a registered preventive option for garlic if needed, following the local label only."},
        "source": "https://pnwhandbooks.org/plantdisease/host-disease/garlic-allium-sativum-botrytis-leaf-blight",
    },
]

# Preserve the hand-reviewed first-release records, then supplement them with
# conservative profiles generated from the documented crop catalog.
DISEASES.extend(build_catalog_records(disease["id"] for disease in DISEASES))

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
        source_url TEXT NOT NULL,
        source_scope TEXT NOT NULL CHECK(source_scope IN ('record_specific', 'crop_group')),
        review_status TEXT NOT NULL CHECK(review_status IN ('reviewed', 'source_mapped', 'pending_evidence'))
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
            :safety_ar, :safety_fr, :safety_en, :source_url, :source_scope, :review_status
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
          "source_scope": disease.get("source_scope", "record_specific"),
          "review_status": disease.get("review_status", "reviewed"),
        })
    connection.commit()
    connection.close()
    print(f"Built {DATABASE_PATH} with {len(CROPS)} crops and {len(DISEASES)} disease records.")

if __name__ == "__main__":
    build_database()
