# Pepper sources — batch 2026-10-25

Every record in `batches/pepper.jsonl` cites one actually-opened authoritative page about that exact disease on pepper. No record rests on model memory or on a search snippet alone.

## Records and their sources

1. **Bacterial spot** (`pepper_bacterial_spot`, Xanthomonas euvesicatoria)
   - Source: UF/IFAS EDIS PP362, "Bacterial Spot of Pepper"
   - URL: https://edis.ifas.ufl.edu/publication/pp362
   - Used: three Xanthomonas species with X. euvesicatoria predominant on pepper in the US; water-soaked spots on the lower leaf surface within 3–4 days, turning tan to brown and greasy above; coalescing lesions; premature defoliation; raised fruit blemishes turning into brown-to-black warts/scabs; seed transmission; spread by water droplets and aerosols; warm weather with wind-driven rain and nights above 65 °F favouring outbreaks; copper-tolerance limiting bactericide effectiveness.

2. **Phytophthora blight** (`pepper_phytophthora_blight`, Phytophthora capsici)
   - Source: UF/IFAS CIR946, "Some Common Diseases of Pepper in Florida"
   - URL: https://ask.ifas.ufl.edu/publication/VH054.pdf
   - Used: Phytophthora section — general wilting only after stem lesions form; dark-green water-soaked stem spots/streaks turning dark brown; wilting above girdling lesions; lemon-shaped sporangia; thick-walled oospores surviving in soil and on seed; activity 46–91 °F, optimum 68–86 °F; heavy rain in warm periods highly favourable.
   - Note: the same bulletin also covers anthracnose (see record 6 note) and was read in full.

3. **Powdery mildew** (`pepper_powdery_mildew`, Leveillula taurica)
   - Source: Pacific Northwest Pest Management Handbooks, "Pepper (Capsicum spp.)-Powdery Mildew"
   - URL: https://pnwhandbooks.org/plantdisease/host-disease/pepper-capsicum-spp-powdery-mildew
   - Used: Leveillula taurica with synonyms Oidiopsis taurica/sicula; warm semiarid restriction; infection favoured below 86 °F; irregular light-green to bright-yellow blotches on upper surfaces of older leaves; necrotic lesion centres; drooping and upward curling of leaves; defoliation exposing fruit to sunburn; sporulation mainly on the leaf underside.
   - Note: the UC IPM peppers powdery-mildew page (https://ipm.ucanr.edu/agriculture/peppers/powdery-mildew/) was also opened and read, but it names only the Leveillula genus, so PNW is the cited source. UC IPM wording on patchy white growth and leaf drop is corroborated in the record's evidence via the PNW description.

4. **Bacterial wilt** (`pepper_bacterial_wilt`, Ralstonia solanacearum)
   - Source: NC State Extension, "Southern Bacterial Wilt on Herbaceous Ornamental Plants"
   - URL: https://content.ces.ncsu.edu/southern-bacterial-wilt-on-herbaceous-ornamental-plants/
   - Used: race 1 as the US-endemic race, explicitly listing peppers among its hosts; rapid wilting while foliage is still green; overnight recovery then re-wilting; dark vascular streaks in main stem/petioles; brown necrotic stems/roots; death in 7–14 days; favoured above 85 °F in wet soils; survival for years in soil; entry through microscopic wounds; vascular clogging.
   - Note: the Hawaii CTAHR bell-pepper factsheet (https://www.ctahr.hawaii.edu/nelsons/glossary/Bacterial_wilt.htm) was also opened but consists only of image captions (bell pepper + R. solanacearum + vascular necrosis + root rot) — too thin as a sole source, so it is listed here as pepper-specific confirmation only, NOT as the cited source_url.

5. **Tomato spotted wilt virus** (`pepper_tomato_spotted_wilt`, Tomato spotted wilt virus, TSWV)
   - Source: UC Statewide IPM Program, "Tomato Spotted Wilt / Peppers"
   - URL: https://ipm.ucanr.edu/agriculture/peppers/tomato-spotted-wilt/
   - Used: thrips vectors (western flower, onion, chili thrips); not seedborne, not contact-spread; bronzing, necrotic spots, vein necrosis; bumpy green fruit with concentric rings; distorted ripe fruit with necrotic rings/etching; stunting of early-infected plants; monitoring and testing (ELISA, immunostrips, PCR).

6. **Anthracnose (ripe rot)** (`pepper_anthracnose`, Colletotrichum spp.)
   - Source: UF/IFAS PP316, "Pest Management of Peppers in Miami-Dade County"
   - URL: https://ask.ifas.ufl.edu/publication/PP316/pdf
   - Used: anthracnose section — infection of immature fruit during excessive irrigation/rainfall; symptoms expressed only at maturity/colour change; small water-soaked lesions expanding rapidly; fully expanded lesions sunken, dark red to tan to black; buff/salmon spots scattered or in concentric rings.
   - Note: the PP316 PDF also contains product names in its chemical-control tables. None were copied into the record; care fields use cultural/IPM measures and generic "follow local extension guidance" phrasing only. The VH054 bulletin (record 2 source) also covers anthracnose (C. gloeosporioides on ripe fruit, C. acutatum on green fruit, optimum ~80 °F) and corroborates the record.

7. **Cercospora (frogeye) leaf spot** (`pepper_cercospora_leaf_spot`, Passalora capsicicola)
   - Source: Pacific Northwest Pest Management Handbooks, "Pepper (Capsicum spp.)-Cercospora (Frogeye) Leaf Spot"
   - URL: https://pnwhandbooks.org/plantdisease/host-disease/pepper-capsicum-spp-cercospora-frogeye-leaf-spot
   - Used: synonym Cercospora capsici; round/oblong spots first water-soaked up to 0.5 inch, later tan with a dark marginal ring; centres dropping out; stem/petiole spots; yellowing, drop/wilt; serious defoliation exposing fruit to sunburn; 2-year rotation, pathogen-free seed, drip irrigation.

8. **Southern blight** (`pepper_southern_blight`, Athelia rolfsii)
   - Source: University of Kentucky Vegetable Scouting Guide, "Southern Blight of Pepper"
   - URL: https://veggiescout.mgcafe.uky.edu/southern-blight-pepper
   - Used: synonym Sclerotium rolfsii; sudden yellowing/browning wilting then death; basal stem lesions/cankers near the soil line; dense white mycelium in humidity; 1–2 mm round tan-to-reddish-brown sclerotia on the mycelium; low fruit touching soil developing wet rot and rapid decay; warm wet conditions favoured.
   - Note: the token black_sclerotia was deliberately NOT used here — the source's sclerotia are tan-to-reddish-brown, not black.

9. **Pepper mild mottle virus** (`pepper_mild_mottle_virus`, Pepper mild mottle virus, PMMoV)
   - Source: UF/IFAS HS-808, "Pepper Mild Mottle Virus"
   - URL: https://ask.ifas.ufl.edu/publication/CV275/pdf
   - Used: tobamovirus family; mechanical + contaminated-seed transmission, NOT insects; mild foliar symptoms easily missed until fruit symptoms appear; mottled yellow/light-green leaves, more evident on younger leaves, frequently puckered; stunting especially from early infection; fruit reduced, mottled colour changes, distorted/lumpy most obvious; older fruit brown streaks/splotches; no chemical/biological control once infected; avoidance, clean seed, sanitation.

10. **Tobacco mosaic virus** (`pepper_tobacco_mosaic_virus`, Tobacco mosaic virus, TMV)
    - Source: Pacific Northwest Pest Management Handbooks, "Pepper (Capsicum spp.)-Virus Diseases"
    - URL: https://pnwhandbooks.org/plantdisease/host-disease/pepper-capsicum-spp-virus-diseases
    - Used: TMV section — mechanical spread, possibly seedborne; light-and-dark-green mosaics, brown flecks and blotches, leaf distortion; fruit deformed, small, with light-green yellowish-to-brown areas.
    - Note: PP316's TMV section (raised bumps, mottled light/dark green foliage, seedborne, stable years in debris, mechanical via hands/tools, no insect vector) corroborates the record.

## Opened but not counted
- UC IPM peppers powdery-mildew page (record 3 note): genus only, not the cited source.
- Hawaii CTAHR bacterial wilt factsheet (record 4 note): captions only, confirmation only.
- VH054 anthracnose section (record 6 note): corroboration only.
- PP316 TMV section (record 10 note): corroboration only.

## Dropped candidates
- **Fusarium wilt of pepper** — DROPPED honestly. No dedicated university-extension page about Fusarium wilt specifically on pepper was found. Candidates examined: UMN Extension (tomato/eggplant/pepper general, cites f. sp. lycopersici for tomato, not capsici); USU Extension (Solanaceae-general); Infonet Biovision (pepper-specific for F. oxysporum f. sp. capsici, but Infonet/icipe is NOT in the SPEC accepted-source list). Per SPEC rule zero, no record was written. It was replaced by two virus diseases with opened dedicated sources (records 9 and 10), keeping the pepper count at 10.
