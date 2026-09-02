"""Verified CropGuide catalog primitives.

This file intentionally stores compact, reviewable disease profiles. Each record is
expanded per crop by build-data.py; it never adds a product, dose, or local label.
"""

from copy import deepcopy

CROPS = [
    ("olive", "الزيتون", "Olivier", "Olive", "Olea europaea", "olive"),
    ("date_palm", "نخيل التمور", "Palmier dattier", "Date palm", "Phoenix dactylifera", "date"),
    ("citrus", "الحمضيات", "Agrumes", "Citrus", "Citrus spp.", "citrus"),
    ("grapevine", "العنب", "Vigne", "Grapevine", "Vitis spp.", "grape"),
    ("almond", "اللوز", "Amandier", "Almond", "Prunus dulcis", "stone"),
    ("pomegranate", "الرمان", "Grenadier", "Pomegranate", "Punica granatum", "pomegranate"),
    ("fig", "التين", "Figuier", "Fig", "Ficus carica", "fig"),
    ("peach", "الخوخ", "Pêcher", "Peach", "Prunus persica", "stone"),
    ("apricot", "المشمش", "Abricotier", "Apricot", "Prunus armeniaca", "stone"),
    ("apple", "التفاح", "Pommier", "Apple", "Malus domestica", "pome"),
    ("pear", "الإجاص", "Poirier", "Pear", "Pyrus communis", "pome"),
    ("plum", "البرقوق", "Prunier", "Plum", "Prunus domestica", "stone"),
    ("pistachio", "الفستق", "Pistachier", "Pistachio", "Pistacia vera", "pistachio"),
    ("quince", "السفرجل", "Cognassier", "Quince", "Cydonia oblonga", "pome"),
    ("carob", "الخروب", "Caroubier", "Carob", "Ceratonia siliqua", "carob"),
    ("tomato", "الطماطم", "Tomate", "Tomato", "Solanum lycopersicum", "tomato"),
    ("potato", "البطاطا", "Pomme de terre", "Potato", "Solanum tuberosum", "potato"),
    ("pepper", "الفلفل", "Poivron / piment", "Pepper", "Capsicum annuum", "pepper"),
    ("onion", "البصل", "Oignon", "Onion", "Allium cepa", "allium"),
    ("garlic", "الثوم", "Ail", "Garlic", "Allium sativum", "allium"),
    ("watermelon", "البطيخ", "Pastèque", "Watermelon", "Citrullus lanatus", "cucurbit"),
    ("melon", "الشمام", "Melon", "Melon", "Cucumis melo", "cucurbit"),
    ("cucumber", "الخيار", "Concombre", "Cucumber", "Cucumis sativus", "cucurbit"),
    ("zucchini", "الكوسة", "Courgette", "Zucchini", "Cucurbita pepo", "cucurbit"),
    ("pumpkin", "القرع", "Courge", "Pumpkin", "Cucurbita spp.", "cucurbit"),
    ("lettuce", "الخس", "Laitue", "Lettuce", "Lactuca sativa", "leafy"),
    ("carrot", "الجزر", "Carotte", "Carrot", "Daucus carota", "apiaceae"),
    ("pea", "البازلاء", "Pois", "Pea", "Pisum sativum", "legume"),
    ("faba_bean", "الفول", "Fève", "Faba bean", "Vicia faba", "faba"),
    ("bean", "الفاصوليا", "Haricot", "Common bean", "Phaseolus vulgaris", "legume"),
    ("spinach", "السبانخ", "Épinard", "Spinach", "Spinacia oleracea", "leafy"),
    ("parsley", "البقدونس", "Persil", "Parsley", "Petroselinum crispum", "apiaceae"),
    ("celery", "الكرفس", "Céleri", "Celery", "Apium graveolens", "apiaceae"),
    ("artichoke", "الخرشوف", "Artichaut", "Artichoke", "Cynara cardunculus", "leafy"),
    ("wheat", "القمح", "Blé", "Wheat", "Triticum aestivum", "cereal"),
    ("barley", "الشعير", "Orge", "Barley", "Hordeum vulgare", "cereal"),
    ("maize", "الذرة", "Maïs", "Maize", "Zea mays", "maize"),
    ("chickpea", "الحمص", "Pois chiche", "Chickpea", "Cicer arietinum", "legume"),
    ("lentil", "العدس", "Lentille", "Lentil", "Lens culinaris", "legume"),
    ("strawberry", "الفراولة", "Fraisier", "Strawberry", "Fragaria × ananassa", "strawberry"),
]

SOURCES = {
    "fruit": "https://treefruit.wsu.edu/web-article/disease-management/",
    "olive": "https://ipm.ucanr.edu/agriculture/olive/",
    "citrus": "https://ipm.ucanr.edu/PMG/selectnewpest.citrus.html",
    "grape": "https://ipm.ucanr.edu/agriculture/grape/",
    "pomegranate": "https://ipm.ucanr.edu/agriculture/pomegranate/",
    "pistachio": "https://ipm.ucanr.edu/agriculture/pistachio/",
    "date": "https://www.fao.org/4/y4360e/y4360e0g.htm",
    "vegetable": "https://vegpath.plantpath.wisc.edu/diseases/",
    "legume": "https://www.montana.edu/extension/plantpath/resources/diseasesofcoolseasonlegumes.html",
    "cereal": "https://smallgrains.wsu.edu/disease-resources/disease-publications/",
    "carob": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10674831/",
    "lettuce": "https://pnwhandbooks.org/plantdisease/host-disease/lettuce-lactuca-sativa-drop-sclerotinia-rot",
    "cucumber": "https://www.canr.msu.edu/news/vegetable-disease-alert-act-now-to-protect-cucumbers-and-onions",
    "onion": "https://www.canr.msu.edu/news/vegetable-disease-alert-act-now-to-protect-cucumbers-and-onions",
    "wheat_stripe_rust_diagnostics": "https://smallgrains.wsu.edu/disease-resources/foliar-fungal-diseases/stripe-rust/",
    "wheat_septoria_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/wheat-triticum-aestivum-septoria-tritici-blotch",
    "small_grain_fhb_diagnostics": "https://www.ndsu.edu/agriculture/extension/publications/fusarium-head-blight-scab-small-grains",
    "barley_net_blotch_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/barley-hordeum-vulgare-net-blotch",
    "pea_diagnostics": "https://www.ndsu.edu/agriculture/extension/publications/pea-disease-diagnostic-series",
    "chickpea_diagnostics": "https://www.ndsu.edu/agriculture/extension/publications/chickpea-disease-diagnostic-series",
    "lentil_diagnostics": "https://www.ndsu.edu/agriculture/extension/publications/lentil-disease-diagnostic-series",
    "maize_northern_leaf_blight_diagnostics": "https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/northern-corn-leaf-blight/",
    "faba_ascochyta_diagnostics": "https://wpcdn.web.wsu.edu/wp-ecommerce/uploads/sites/2/product-3343-sku-FS302E.pdf",
    "faba_rust_diagnostics": "https://extensionaus.com.au/FieldCropDiseasesVic/docs/identification-management-of-field-crop-diseases-in-victoria/faba-beans/rust-of-faba-bean/",
    "faba_chocolate_spot_diagnostics": "https://extensionaus.com.au/FieldCropDiseasesVic/docs/identification-management-of-field-crop-diseases-in-victoria/faba-beans/chocolate-spot-of-faba-bean/",
    "wheat_powdery_mildew_diagnostics": "https://extensionaus.com.au/FieldCropDiseasesVic/docs/identification-management-of-field-crop-diseases-in-victoria/foliar-diseases-of-wheat/powdery-mildew-of-wheat/",
    "barley_powdery_mildew_diagnostics": "https://extensionaus.com.au/FieldCropDiseasesVic/docs/identification-management-of-field-crop-diseases-in-victoria/foliar-diseases-of-barley/powdery-mildew-of-barley/",
    "strawberry_powdery_mildew_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/strawberry-fragaria-spp-powdery-mildew",
    "strawberry_botrytis_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/strawberry-fragaria-spp-gray-mold-fruit-rot",
    "strawberry_anthracnose_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/strawberry-fragaria-spp-anthracnose",
    "strawberry_phytophthora_diagnostics": "https://ipm.ucanr.edu/agriculture/strawberry/phytophthora-crown-and-root-rot/",
    "tomato_early_blight_diagnostics": "https://vegpath.plantpath.wisc.edu/diseases/tomato-early-blight/",
    "tomato_late_blight_diagnostics": "https://vegpath.plantpath.wisc.edu/diseases/tomato-late-blight/",
    "tomato_septoria_diagnostics": "https://vegpath.plantpath.wisc.edu/diseases/tomato-septoria-leaf-spot/",
    "tomato_fusarium_wilt_diagnostics": "https://extension.umd.edu/resource/fusarium-wilt-tomatoes-home-garden",
    "potato_black_scurf_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/potato-solanum-tuberosum-rhizoctonia-canker-black-scurf",
    "potato_late_blight_diagnostics": "https://ag.colorado.gov/plants/plant-health/potato-late-blight-history-impacts-and-prevention",
    "potato_early_blight_diagnostics": "https://www.ndsu.edu/agriculture/extension/publications/early-blight-potato",
    "potato_common_scab_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/potato-solanum-tuberosum-common-scab",
    "potato_verticillium_wilt_diagnostics": "https://ipm.ucanr.edu/agriculture/potato/verticillium-wilt/",
    "cucumber_downy_mildew_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/cucumber-cucumis-sativus-downy-mildew",
    "cucumber_gummy_stem_blight_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/cucumber-cucumis-sativus-gummy-stem-blight-vine-decline",
    "pepper_bacterial_spot_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/pepper-capsicum-spp-bacterial-spot",
    "pepper_phytophthora_blight_diagnostics": "https://content.ces.ncsu.edu/phytophthora-blight-of-peppers",
    "pepper_anthracnose_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/pepper-capsicum-spp-anthracnose",
    "onion_downy_mildew_diagnostics": "https://vegpath.plantpath.wisc.edu/diseases/onion-downy-mildew/",
    "onion_purple_blotch_diagnostics": "https://ipm.ucanr.edu/agriculture/onion-and-garlic/purple-blotch-and-stemphylium-leaf-blight/",
    "onion_stemphylium_leaf_blight_diagnostics": "https://ipm.ucanr.edu/agriculture/onion-and-garlic/purple-blotch-and-stemphylium-leaf-blight/",
    "carrot_leaf_blights_diagnostics": "https://vegpath.plantpath.wisc.edu/diseases/carrot-alternaria-and-cercospora-leaf-blights/",
    "carrot_cottony_rot_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/carrot-daucus-carota-cottony-rot",
    "carrot_cavity_spot_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/carrot-daucus-carota-cavity-spot",
    "grape_powdery_mildew_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/grape-vitis-spp-powdery-mildew",
    "grape_downy_mildew_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/grape-vitis-spp-downy-mildew",
    "grape_botrytis_bunch_rot_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/grape-vitis-spp-botrytis-bunch-rot",
    "celery_early_blight_diagnostics": "https://ipm.ucanr.edu/agriculture/celery/early-blight/",
    "celery_late_blight_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/celery-apium-graveolens-var-dulce-late-blight-septoria-leaf-blight",
    "celery_pink_rot_diagnostics": "https://ipm.ucanr.edu/agriculture/celery/pink-rot/",
    "parsley_septoria_leaf_spot_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/parsley-petroselinum-crispum-septoria-leaf-spot",
    "parsley_bacterial_leaf_spot_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/parsley-petroselinum-crispum-bacterial-leaf-spot",
    "spinach_downy_mildew_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/spinach-spinacia-oleracea-downy-mildew",
    "spinach_fusarium_wilt_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/spinach-spinacia-oleracea-fusarium-wilt",
    "spinach_white_rust_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/spinach-spinacia-oleracea-white-rust",
    "spinach_anthracnose_diagnostics": "https://ipm.ucanr.edu/agriculture/spinach/anthracnose/",
    "garlic_white_rot_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/garlic-allium-sativum-white-rot",
    "garlic_rust_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/garlic-allium-sativum-rust",
    "garlic_botrytis_leaf_blight_diagnostics": "https://pnwhandbooks.org/plantdisease/host-disease/garlic-allium-sativum-botrytis-leaf-blight",
}

# These are crop-and-disease pairs supported by a crop-specific guide in the
# source registry. All other generated candidates remain explicitly marked as
# crop_group/source_mapped until a reviewer attaches a comparable source.
SPECIFIC_SOURCES = {
    "olive_olive_knot": SOURCES["olive"],
    "olive_anthracnose": SOURCES["olive"],
    "grapevine_powdery_mildew": SOURCES["grape_powdery_mildew_diagnostics"],
    "grapevine_downy_mildew": SOURCES["grape_downy_mildew_diagnostics"],
    "grapevine_botrytis": SOURCES["grape_botrytis_bunch_rot_diagnostics"],
    "grapevine_black_rot": SOURCES["grape"],
    "grapevine_bacterial_canker": SOURCES["grape"],
    "citrus_citrus_canker": SOURCES["citrus"],
    "citrus_citrus_greening": SOURCES["citrus"],
    "citrus_tristeza": SOURCES["citrus"],
    "citrus_phytophthora_root_rot": SOURCES["citrus"],
    "citrus_alternaria_leaf_spot": SOURCES["citrus"],
    "citrus_anthracnose": SOURCES["citrus"],
    "apple_scab": SOURCES["fruit"],
    "apple_powdery_mildew": SOURCES["fruit"],
    "pear_scab": SOURCES["fruit"],
    "pear_powdery_mildew": SOURCES["fruit"],
    "lettuce_sclerotinia": SOURCES["lettuce"],
    "cucumber_downy_mildew": SOURCES["cucumber"],
    "onion_stemphylium_leaf_blight": SOURCES["onion"],
    # Field-crop batch: direct university disease profiles, not crop-level indexes.
    "wheat_stripe_rust": SOURCES["wheat_stripe_rust_diagnostics"],
    "wheat_septoria": SOURCES["wheat_septoria_diagnostics"],
    "barley_net_blotch": SOURCES["barley_net_blotch_diagnostics"],
    "maize_northern_corn_leaf_blight": SOURCES["maize_northern_leaf_blight_diagnostics"],
    "faba_bean_ascochyta": SOURCES["faba_ascochyta_diagnostics"],
    "faba_bean_rust": SOURCES["faba_rust_diagnostics"],
    "faba_bean_chocolate_spot": SOURCES["faba_chocolate_spot_diagnostics"],
    "wheat_powdery_mildew": SOURCES["wheat_powdery_mildew_diagnostics"],
    "barley_powdery_mildew": SOURCES["barley_powdery_mildew_diagnostics"],
    "strawberry_powdery_mildew": SOURCES["strawberry_powdery_mildew_diagnostics"],
    "strawberry_botrytis": SOURCES["strawberry_botrytis_diagnostics"],
    "strawberry_anthracnose": SOURCES["strawberry_anthracnose_diagnostics"],
    "strawberry_phytophthora_root_rot": SOURCES["strawberry_phytophthora_diagnostics"],
    "tomato_alternaria_leaf_spot": SOURCES["tomato_early_blight_diagnostics"],
    "tomato_late_blight": SOURCES["tomato_late_blight_diagnostics"],
    "tomato_septoria": SOURCES["tomato_septoria_diagnostics"],
    "tomato_fusarium_wilt": SOURCES["tomato_fusarium_wilt_diagnostics"],
    "potato_late_blight": SOURCES["potato_late_blight_diagnostics"],
    "potato_rhizoctonia": SOURCES["potato_black_scurf_diagnostics"],
    "potato_common_scab": SOURCES["potato_common_scab_diagnostics"],
    "potato_verticillium_wilt": SOURCES["potato_verticillium_wilt_diagnostics"],
    "cucumber_downy_mildew": SOURCES["cucumber_downy_mildew_diagnostics"],
    "cucumber_gummy_stem_blight": SOURCES["cucumber_gummy_stem_blight_diagnostics"],
    "pepper_bacterial_leaf_spot": SOURCES["pepper_bacterial_spot_diagnostics"],
    "pepper_phytophthora_root_rot": SOURCES["pepper_phytophthora_blight_diagnostics"],
    "pepper_anthracnose": SOURCES["pepper_anthracnose_diagnostics"],
    "onion_downy_mildew": SOURCES["onion_downy_mildew_diagnostics"],
    "onion_purple_blotch": SOURCES["onion_purple_blotch_diagnostics"],
    "onion_stemphylium_leaf_blight": SOURCES["onion_stemphylium_leaf_blight_diagnostics"],
    "carrot_alternaria_leaf_spot": SOURCES["carrot_leaf_blights_diagnostics"],
    "carrot_sclerotinia": SOURCES["carrot_cottony_rot_diagnostics"],
    "spinach_downy_mildew": SOURCES["spinach_downy_mildew_diagnostics"],
    "spinach_fusarium_wilt": SOURCES["spinach_fusarium_wilt_diagnostics"],
    "spinach_white_rust": SOURCES["spinach_white_rust_diagnostics"],
    "garlic_white_rot": SOURCES["garlic_white_rot_diagnostics"],
    "garlic_rust": SOURCES["garlic_rust_diagnostics"],
}

NAMES = {
    "powdery_mildew": ("Erysiphe spp.", "البياض الدقيقي", "Oïdium", "Powdery mildew", ["white_powdery_growth", "leaf_curl", "distorted_new_growth"], "powder"),
    "downy_mildew": ("Peronospora spp.", "البياض الزغبي", "Mildiou", "Downy mildew", ["yellow_angular_spot", "underside_gray_growth", "leaf_drop"], "downy"),
    "anthracnose": ("Colletotrichum spp.", "الأنثراكنوز", "Anthracnose", "Anthracnose", ["dark_sunken_lesion", "leaf_spot", "fruit_rot"], "spot"),
    "alternaria_leaf_spot": ("Alternaria spp.", "تبقع الألترناريا", "Alternariose", "Alternaria leaf spot", ["dark_brown_spot", "concentric_ring", "yellow_halo"], "spot"),
    "botrytis": ("Botrytis cinerea", "العفن الرمادي", "Pourriture grise", "Gray mold", ["gray_fuzzy_growth", "soft_rot", "brown_withered_blossom"], "mold"),
    "phytophthora_root_rot": ("Phytophthora spp.", "تعفن الجذور/التاج الفيتوفثوري", "Pourriture phytophthoréenne", "Phytophthora root/crown rot", ["wilting", "yellowing", "crown_browning"], "root"),
    "fusarium_wilt": ("Fusarium oxysporum", "ذبول الفيوزاريوم", "Flétrissement fusarien", "Fusarium wilt", ["one_sided_wilting", "yellowing", "vascular_browning"], "wilt"),
    "verticillium_wilt": ("Verticillium dahliae", "ذبول الفرتيسيليوم", "Verticilliose", "Verticillium wilt", ["one_sided_wilting", "older_leaf_yellowing", "vascular_browning"], "wilt"),
    "bacterial_leaf_spot": ("Xanthomonas spp.", "تبقع بكتيري", "Tache bactérienne", "Bacterial leaf spot", ["water_soaked_spot", "yellow_halo", "dark_brown_spot"], "spot"),
    "bacterial_canker": ("Pseudomonas spp.", "تقرح بكتيري", "Chancre bactérien", "Bacterial canker", ["twig_canker", "gumming", "wilting"], "canker"),
    "bacterial_blight": ("Pseudomonas syringae", "لفحة بكتيرية", "Brûlure bactérienne", "Bacterial blight", ["water_soaked_spot", "leaf_browning", "shoot_dieback"], "spot"),
    "virus_mosaic": ("Plant virus complex", "فيروس الموزاييك", "Virus de la mosaïque", "Mosaic virus", ["mosaic_pattern", "leaf_distortion", "stunting"], "virus"),
    "root_knot": ("Meloidogyne spp.", "نيماتودا تعقد الجذور", "Nématodes à galles", "Root-knot nematode", ["stunting", "wilting", "root_galls"], "root"),
    "damping_off": ("Pythium/Rhizoctonia complex", "موت البادرات", "Fonte des semis", "Damping-off", ["seedling_collapse", "stem_base_rot", "poor_emergence"], "root"),
    "sclerotinia": ("Sclerotinia sclerotiorum", "العفن الأبيض", "Pourriture blanche", "White mold", ["white_cottony_growth", "stem_rot", "wilting"], "mold"),
    "rhizoctonia": ("Rhizoctonia solani", "ريزوكتونيا/تعفن الساق", "Rhizoctone", "Rhizoctonia disease", ["stem_base_rot", "dark_canker", "seedling_collapse"], "root"),
    "rust": ("Puccinia spp.", "الصدأ", "Rouille", "Rust", ["orange_underside_pustules", "yellow_upper_leaf_spot", "leaf_drop"], "rust"),
    "septoria": ("Septoria spp.", "تبقع سبتوريا", "Septoriose", "Septoria leaf spot", ["small_dark_spot", "yellow_halo", "lower_leaf_spot"], "spot"),
    "ascochyta": ("Ascochyta spp.", "لفحة الأسكوكيتا", "Ascochytose", "Ascochyta blight", ["brown_lesion", "stem_lesion", "pod_spot"], "spot"),
    "black_rot": ("Guignardia spp.", "العفن الأسود", "Pourriture noire", "Black rot", ["dark_leaf_spot", "fruit_mummification", "dark_shoot_spot"], "spot"),
    "brown_rot": ("Monilinia spp.", "العفن البني", "Moniliose", "Brown rot", ["brown_withered_blossom", "fruit_rot", "twig_canker"], "mold"),
    "scab": ("Venturia spp.", "الجرب", "Tavelure", "Scab", ["olive_black_spot", "leaf_spot", "fruit_scarring"], "spot"),
    "fire_blight": ("Erwinia amylovora", "لفحة النار", "Feu bactérien", "Fire blight", ["blackened_shoot_tip", "shepherd_crook", "bacterial_ooze"], "canker"),
    "citrus_canker": ("Xanthomonas citri", "تقرح الحمضيات", "Chancre des agrumes", "Citrus canker", ["raised_corky_spot", "yellow_halo", "fruit_lesion"], "canker"),
    "citrus_greening": ("Candidatus Liberibacter spp.", "اخضرار الحمضيات", "Huanglongbing", "Citrus greening", ["blotchy_mottle", "yellow_shoot", "small_lopsided_fruit"], "virus"),
    "tristeza": ("Citrus tristeza virus", "تريستيزا الحمضيات", "Tristeza des agrumes", "Citrus tristeza", ["decline", "yellowing", "stem_pitting"], "virus"),
    "gummy_stem_blight": ("Didymella bryoniae", "لفحة الساق الصمغية", "Brûlure gommeuse", "Gummy stem blight", ["stem_canker", "gummy_exudate", "leaf_spot"], "canker"),
    "cucurbit_bacterial_wilt": ("Erwinia tracheiphila", "ذبول بكتيري للقرعيات", "Flétrissement bactérien des cucurbitacées", "Cucurbit bacterial wilt", ["sudden_wilting", "leaf_collapse", "vascular_browning"], "wilt"),
    "onion_purple_blotch": ("Alternaria porri", "التبقع الأرجواني", "Tache pourpre", "Purple blotch", ["purple_elliptical_spot", "yellow_halo", "leaf_tip_dieback"], "spot"),
    "stemphylium_leaf_blight": ("Stemphylium vesicarium", "لفحة أوراق الستيمفيليوم", "Brûlure des feuilles à Stemphylium", "Stemphylium leaf blight", ["dark_brown_spot", "yellow_halo", "leaf_tip_dieback"], "spot"),
    "white_rot": ("Stromatinia cepivora", "العفن الأبيض", "Pourriture blanche", "White rot", ["yellowing", "wilting", "white_cottony_growth"], "root"),
    "fusarium_head_blight": ("Fusarium graminearum", "لفحة السنابل الفيوزاريومية", "Fusariose de l’épi", "Fusarium head blight", ["bleached_spikelet", "pink_spore_mass", "shriveled_grain"], "spot"),
    "stripe_rust": ("Puccinia striiformis", "الصدأ الأصفر المخطط", "Rouille jaune", "Stripe rust", ["yellow_rust_stripe", "orange_pustules", "leaf_yellowing"], "rust"),
    "net_blotch": ("Pyrenophora teres", "التبقع الشبكي", "Helminthosporiose réticulée", "Net blotch", ["net_like_brown_lesion", "leaf_browning", "yellow_halo"], "spot"),
    "northern_corn_leaf_blight": ("Exserohilum turcicum", "لفحة أوراق الذرة الشمالية", "Helminthosporiose du Nord du maïs", "Northern corn leaf blight", ["cigar_shaped_leaf_lesion", "gray_green_leaf_lesion", "leaf_blight"], "spot"),
    "late_blight": ("Phytophthora infestans", "اللفحة المتأخرة", "Mildiou tardif", "Late blight", ["irregular_water_soaked_lesion", "gray_green_margin", "white_underside_growth"], "spot"),
    "potato_common_scab": ("Streptomyces spp.", "الجرب العادي للبطاطا", "Gale commune de la pomme de terre", "Potato common scab", ["corky_tuber_lesion", "rough_tuber_surface", "deep_tuber_pit"], "tuber"),
    "chocolate_spot": ("Botrytis fabae / Botrytis cinerea", "بقعة الشوكولاتة للفول", "Tache chocolat de la fève", "Chocolate spot of faba bean", ["reddish_brown_leaf_spot", "gray_brown_target_spot", "blackened_leaf_or_stem"], "spot"),
    "bayoud": ("Fusarium oxysporum f. sp. albedinis", "البيوض", "Bayoud", "Bayoud disease", ["one_sided_frond_wilting", "frond_whitening", "rachis_brown_streak"], "wilt"),
    "black_scorch": ("Thielaviopsis paradoxa", "اللفحة السوداء", "Pourriture noire du palmier", "Black scorch", ["black_charcoal_lesion", "bud_rot", "frond_necrosis"], "canker"),
    "olive_knot": ("Pseudomonas savastanoi", "عقد الزيتون", "Nœud de l’olivier", "Olive knot", ["rough_gall", "twig_swelling", "shoot_dieback"], "canker"),
}

GROUPS = {
    "olive": ["anthracnose", "alternaria_leaf_spot", "phytophthora_root_rot", "verticillium_wilt", "olive_knot", "bacterial_canker", "root_knot", "rust"],
    "date": ["bayoud", "black_scorch", "phytophthora_root_rot", "fusarium_wilt", "alternaria_leaf_spot", "bacterial_leaf_spot", "root_knot", "virus_mosaic"],
    "citrus": ["citrus_canker", "citrus_greening", "tristeza", "phytophthora_root_rot", "alternaria_leaf_spot", "anthracnose", "scab", "virus_mosaic", "root_knot", "bacterial_blight"],
    "grape": ["powdery_mildew", "downy_mildew", "botrytis", "black_rot", "anthracnose", "phytophthora_root_rot", "bacterial_canker", "virus_mosaic", "root_knot", "rust"],
    "stone": ["brown_rot", "powdery_mildew", "bacterial_canker", "bacterial_leaf_spot", "phytophthora_root_rot", "verticillium_wilt", "root_knot", "rust", "anthracnose", "sclerotinia"],
    "pome": ["scab", "fire_blight", "powdery_mildew", "bacterial_canker", "phytophthora_root_rot", "rust", "anthracnose", "root_knot", "botrytis", "virus_mosaic"],
    "pistachio": ["alternaria_leaf_spot", "botrytis", "powdery_mildew", "phytophthora_root_rot", "verticillium_wilt", "bacterial_canker", "anthracnose", "root_knot", "rust", "sclerotinia"],
    "pomegranate": ["anthracnose", "alternaria_leaf_spot", "botrytis", "phytophthora_root_rot", "bacterial_leaf_spot", "root_knot", "rust", "sclerotinia", "virus_mosaic"],
    "fig": ["rust", "anthracnose", "phytophthora_root_rot", "root_knot", "bacterial_leaf_spot", "botrytis", "virus_mosaic", "sclerotinia"],
    "carob": ["powdery_mildew", "alternaria_leaf_spot", "anthracnose", "phytophthora_root_rot", "root_knot", "bacterial_canker", "botrytis", "rust"],
    "tomato": ["alternaria_leaf_spot", "late_blight", "phytophthora_root_rot", "fusarium_wilt", "verticillium_wilt", "bacterial_leaf_spot", "bacterial_canker", "septoria", "botrytis", "virus_mosaic", "root_knot", "damping_off", "powdery_mildew"],
    "potato": ["alternaria_leaf_spot", "late_blight", "phytophthora_root_rot", "fusarium_wilt", "verticillium_wilt", "bacterial_leaf_spot", "bacterial_canker", "black_rot", "potato_common_scab", "virus_mosaic", "root_knot", "damping_off", "rhizoctonia", "powdery_mildew"],
    "pepper": ["alternaria_leaf_spot", "phytophthora_root_rot", "fusarium_wilt", "verticillium_wilt", "bacterial_leaf_spot", "bacterial_canker", "botrytis", "virus_mosaic", "root_knot", "damping_off", "powdery_mildew", "anthracnose"],
    "allium": ["downy_mildew", "onion_purple_blotch", "stemphylium_leaf_blight", "botrytis", "fusarium_wilt", "white_rot", "rust", "bacterial_leaf_spot", "damping_off", "root_knot", "virus_mosaic"],
    "cucurbit": ["powdery_mildew", "downy_mildew", "anthracnose", "gummy_stem_blight", "cucurbit_bacterial_wilt", "bacterial_leaf_spot", "fusarium_wilt", "phytophthora_root_rot", "virus_mosaic", "root_knot", "damping_off", "botrytis"],
    "leafy": ["downy_mildew", "powdery_mildew", "botrytis", "sclerotinia", "fusarium_wilt", "bacterial_leaf_spot", "septoria", "phytophthora_root_rot", "virus_mosaic", "damping_off"],
    "apiaceae": ["alternaria_leaf_spot", "septoria", "powdery_mildew", "bacterial_leaf_spot", "sclerotinia", "phytophthora_root_rot", "root_knot", "virus_mosaic", "damping_off", "rust"],
    "legume": ["anthracnose", "ascochyta", "rust", "powdery_mildew", "downy_mildew", "fusarium_wilt", "phytophthora_root_rot", "bacterial_blight", "virus_mosaic", "botrytis", "sclerotinia", "damping_off"],
    "faba": ["anthracnose", "ascochyta", "rust", "powdery_mildew", "downy_mildew", "fusarium_wilt", "phytophthora_root_rot", "bacterial_blight", "virus_mosaic", "chocolate_spot", "sclerotinia", "damping_off"],
    "cereal": ["stripe_rust", "powdery_mildew", "septoria", "fusarium_head_blight", "net_blotch", "rhizoctonia", "damping_off", "root_knot", "virus_mosaic", "bacterial_blight"],
    "maize": ["northern_corn_leaf_blight", "rust", "powdery_mildew", "fusarium_wilt", "fusarium_head_blight", "bacterial_leaf_spot", "virus_mosaic", "root_knot", "damping_off", "rhizoctonia", "anthracnose"],
    "strawberry": ["powdery_mildew", "botrytis", "anthracnose", "phytophthora_root_rot", "verticillium_wilt", "bacterial_leaf_spot", "virus_mosaic", "root_knot", "damping_off", "sclerotinia"],
}

DESCRIPTIONS = {
    "powder": ("نمو أبيض دقيقي وتجعد في النموات الحديثة", "un feutrage blanc poudreux et de jeunes feuilles déformées", "white powdery growth and distorted new growth"),
    "downy": ("بقع صفراء زاوية مع نمو رمادي تحت الورقة", "des taches jaunes anguleuses avec un feutrage gris sous la feuille", "angular yellow spots with gray growth under leaves"),
    "spot": ("بقع متكررة داكنة أو بنية مع هالة أو حلقات", "des taches répétées brunes ou foncées avec halo ou anneaux", "repeated brown or dark lesions with halos or rings"),
    "mold": ("تعفن طري أو نمو رمادي/أبيض على الأنسجة", "une pourriture molle ou un mycélium gris/blanc sur les tissus", "soft decay or gray/white fungal growth on tissue"),
    "root": ("ذبول مع اصفرار أو اسمرار قرب الجذر أو قاعدة الساق", "un flétrissement avec jaunissement ou brunissement près des racines ou du collet", "wilting with yellowing or browning near roots or the crown"),
    "wilt": ("ذبول متدرج أو أحادي الجانب مع اسمرار وعائي محتمل", "un flétrissement progressif ou unilatéral avec brunissement vasculaire possible", "progressive or one-sided wilt with possible vascular browning"),
    "canker": ("تقرحات أو تشقق أو إفرازات وصمغ على الأفرع أو الساق", "des chancres, fissures ou exsudats sur rameaux ou tiges", "cankers, cracking, or exudate on shoots or stems"),
    "virus": ("موزاييك أو تبرقش وتشوه وتقزم للنمو", "une mosaïque, des marbrures, déformations et un retard de croissance", "mosaic patterns, mottling, distortion, and stunting"),
    "rust": ("بثرات برتقالية أو بنية مسحوقية مع اصفرار", "des pustules poudreuses orange ou brunes avec jaunissement", "powdery orange or brown pustules with yellowing"),
    "tuber": ("آفات فلّينية خشنة أو حفر على سطح الدرنات", "des lésions liégeuses rugueuses ou des cavités sur les tubercules", "rough corky lesions or pits on tuber surfaces"),
}

def source_for(group):
    if group in {"olive", "date", "citrus", "grape", "pomegranate", "pistachio", "carob"}:
        return SOURCES.get(group, SOURCES["fruit"])
    if group in {"legume", "faba"}:
        return SOURCES["legume"]
    if group in {"cereal", "maize"}:
        return SOURCES["cereal"]
    if group in {"stone", "pome", "fig", "strawberry"}:
        return SOURCES["fruit"]
    return SOURCES["vegetable"]

def care_for(kind):
    immediate = {
        "root": ("تجنب نقل التربة أو النباتات المشتبه بها، حسن الصرف، وافحص الجذور قبل إزالة النباتات الشديدة الإصابة.", "Évitez de déplacer sol ou plants suspects, améliorez le drainage et inspectez les racines avant d’éliminer les plants très atteints.", "Do not move suspect soil or plants; improve drainage and inspect roots before removing severely affected plants."),
        "virus": ("اعزل النباتات شديدة التشوه، نظف الأدوات، ولا تأخذ عقلًا أو بذورًا أو شتلات من نبات مشتبه به.", "Isolez les plants très déformés, nettoyez les outils et ne prélevez pas de boutures, semences ou plants d’un sujet suspect.", "Isolate severely distorted plants, sanitize tools, and do not take cuttings, seed, or transplants from a suspect plant."),
        "canker": ("أزل الأجزاء شديدة الإصابة في جو جاف إن أمكن، وطهّر أدوات التقليم وتجنب جرح النبات.", "Retirez si possible les parties très atteintes par temps sec, désinfectez les outils de taille et évitez de blesser la plante.", "When feasible, remove heavily affected parts in dry weather, sanitize pruning tools, and avoid new wounds."),
        "tuber": ("اعزل الدرنات شديدة الإصابة عند الفرز، ولا تستخدمها كتقاوي، ونظف التربة العالقة قبل التخزين أو النقل.", "Isolez les tubercules très atteints au tri, ne les utilisez pas comme semence et retirez la terre adhérente avant stockage ou déplacement.", "Separate severely affected tubers during grading, do not use them as seed, and remove adhering soil before storage or movement."),
    }
    default = ("أزل الأنسجة الشديدة الإصابة، تخلص من البقايا بعيدًا عن الحقل، وحسن التهوية وتجنب بلل الأوراق الطويل.", "Retirez les tissus très atteints, éliminez les débris hors de la parcelle, améliorez l’aération et évitez un feuillage mouillé longtemps.", "Remove heavily affected tissue, discard debris away from the plot, improve airflow, and avoid prolonged wet foliage.")
    return immediate.get(kind, default)

def field_for(kind):
    checks = {
        "root": ("افحص الجذور والتاج من نبات متراجع؛ ابحث عن تعفن أو تلون، وميّز ذلك عن نقص الماء أو الملوحة.", "Examinez racines et collet d’un plant atteint; recherchez pourriture ou décoloration et distinguez-les du manque d’eau ou de la salinité.", "Inspect roots and crown on a declining plant; look for rot or discoloration and distinguish it from drought or salinity."),
        "virus": ("افحص عدة نباتات لنمط موزاييك متكرر، وتحقق من وجود حشرات ناقلة أو ضرر عشبي قبل افتراض فيروس.", "Vérifiez un motif de mosaïque répété sur plusieurs plants et cherchez des vecteurs ou un dégât d’herbicide avant de conclure à un virus.", "Check several plants for a repeated mosaic pattern and look for vectors or herbicide injury before concluding it is a virus."),
        "canker": ("افحص الأنسجة أسفل حافة التقرح والأنماط في عدة أفرع؛ قد تتشابه أضرار الصقيع أو الجروح مع المرض.", "Examinez le tissu sous le bord du chancre et le motif sur plusieurs rameaux; gel et blessures peuvent imiter une maladie.", "Inspect tissue below the canker edge and the pattern on several shoots; frost and wounds can mimic disease."),
        "tuber": ("افحص عدة درنات من مواقع مختلفة؛ ابحث عن آفات فلّينية ثابتة أو حفر، وميّزها عن خدوش الحصاد أو ضرر الحشرات أو العفن الرطب.", "Examinez plusieurs tubercules de zones différentes; recherchez des lésions liégeuses fixes ou des cavités et distinguez-les des blessures de récolte, des insectes ou d'une pourriture molle.", "Inspect several tubers from different areas; look for fixed corky lesions or pits and distinguish them from harvest injury, insect damage, or soft rot."),
    }
    default = ("افحص عدة أوراق أو ثمار أو نباتات، وعلى السطحين إن أمكن، وابحث عن نمط متكرر لا عن عرض منفرد.", "Examinez plusieurs feuilles, fruits ou plants, sur les deux faces si possible, et recherchez un motif répété plutôt qu’un symptôme isolé.", "Inspect several leaves, fruit, or plants, on both sides when possible, and look for a repeated pattern rather than one symptom.")
    return checks.get(kind, default)

def build_catalog_records(existing_ids=()):
    """Return records with three-language evidence and conservative care for supported crop groups."""
    existing = set(existing_ids)
    records = []
    for crop_id, crop_ar, crop_fr, crop_en, _scientific, group in CROPS:
        for profile_id in GROUPS[group]:
            record_id = f"{crop_id}_{profile_id}"
            if record_id in existing:
                continue
            scientific, name_ar, name_fr, name_en, symptoms, kind = NAMES[profile_id]
            desc = DESCRIPTIONS[kind]
            immediate = care_for(kind)
            field = field_for(kind)
            records.append({
                "id": record_id,
                "crop_id": crop_id,
                "scientific_name": scientific,
                "name": {"ar": name_ar, "fr": name_fr, "en": name_en},
                "symptoms": symptoms,
                "evidence": {
                    "ar": f"{desc[0]} في {crop_ar} قد يتوافق مع {name_ar}، لكن الصورة وحدها لا تؤكد التشخيص.",
                    "fr": f"Sur {crop_fr.lower()}, {desc[1]} peut correspondre à {name_fr.lower()}, mais une photo seule ne confirme pas le diagnostic.",
                    "en": f"On {crop_en.lower()}, {desc[2]} can be consistent with {name_en.lower()}, but a photo alone does not confirm the diagnosis.",
                },
                "field": {"ar": field[0], "fr": field[1], "en": field[2]},
                "immediate": {"ar": immediate[0], "fr": immediate[1], "en": immediate[2]},
                "conditional": {
                    "ar": "إذا تكرر النمط أو كان الضرر سريعًا، اطلب تأكيدًا من مرشد زراعي محلي قبل أي علاج؛ ناقش فقط منتجًا مسجلاً للمحصول والمرض واتبع الملصق المحلي.",
                    "fr": "Si le motif se répète ou si les dégâts progressent vite, demandez une confirmation locale avant tout traitement; discutez seulement d’un produit homologué pour cette culture et ce problème, selon l’étiquette locale.",
                    "en": "If the pattern repeats or damage progresses quickly, seek local agricultural confirmation before treatment; discuss only a product registered for this crop and problem, and follow the local label.",
                },
                "source": SPECIFIC_SOURCES.get(record_id, source_for(group)),
                "source_scope": "record_specific" if record_id in SPECIFIC_SOURCES else "crop_group",
                "review_status": "reviewed" if record_id in SPECIFIC_SOURCES else "source_mapped",
            })
    return records
