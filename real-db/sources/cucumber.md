# Cucumber sources — batch 2026-10-26

Every record in `batches/cucumber.jsonl` cites one actually-opened authoritative page about that exact disease on cucumber. No record rests on model memory or on a search snippet alone. EPPO codes are "" throughout — none of the opened pages showed one, and none was invented.

## Records and their sources

1. **Downy mildew** (`cucumber_downy_mildew`, Pseudoperonospora cubensis)
   - Source: University of Wisconsin-Madison Vegetable Pathology, "Cucurbit Downy Mildew"
   - URL: https://vegpath.plantpath.wisc.edu/diseases/cucurbit-downy-mildew/
   - Used: oomycete P. cubensis; upper-leaf angular vein-bounded yellow to pale-green spots turning brown and coalescing; fuzzy underside sporulation in very humid conditions; spread by windborne spores, rain/irrigation splash, human contact; favours very wet, humid conditions at 59–68 °F; foliage loss exposes fruit to sunscald/secondary infection; Clade 2 infects cucumber and melon and is more aggressive on them; resistant varieties, avoiding overhead irrigation, spacing, airflow, regular scouting.

2. **Powdery mildew** (`cucumber_powdery_mildew`, Podosphaera xanthii)
   - Source: University of Minnesota Extension, "Powdery mildew of cucurbits"
   - URL: https://extension.umn.edu/disease-management/powdery-mildew-cucurbits
   - Used: mainly caused by P. xanthii, infects all cucurbits including cucumber; first sign pale yellow leaf spots, then white powdery spots on both leaf surfaces expanding into large blotches covering leaf, petiole and stem; older leaves infected first; favours humid conditions around 68–81 °F; new spores form and spread easily in warm, dry conditions, wind-blown; weakens plant, fruit ripens prematurely, fewer and smaller fruit, sunburned; complete/partial resistance, air movement via spacing/staking/weed control, avoiding over-application of nitrogen.
   - Note: the PNW cucumber powdery-mildew page was also opened but its extracted text showed cause and cultural control only, with no symptom description, so the UMN page (which explicitly covers cucumber) is the cited source.

3. **Anthracnose** (`cucumber_anthracnose`, Colletotrichum orbiculare)
   - Source: New Mexico State University Extension, "Anthracnose of Cucurbits" (Guide H-247)
   - URL: https://pubs.nmsu.edu/_h/H247/index.html
   - Used: caused by C. orbiculare, affects all aboveground parts, especially common on watermelon, melon and cucumber; leaf lesions near veins, roughly circular, light brown to reddish, enlarging beyond 1 cm, leaves distorted, centres crack/drop out (shot hole); fruit lesions circular, sunken, water-soaked, appearing near maturity, blackening with pink spore masses in moist conditions; early fruit infection can abort/malform fruit; humid rainy weather essential, optimum 70–80 °F and 100% relative humidity for 24 h, symptoms within 96 h; disease-free seed, resistant cultivars, deep-plow residue, rotation of at least one year without cucurbits.

4. **Angular leaf spot** (`cucumber_angular_leaf_spot`, Pseudomonas syringae pv. lachrymans)
   - Source: Pacific Northwest Pest Management Handbooks, "Cucumber (Cucumis sativus)-Angular Leaf Spot"
   - URL: https://pnwhandbooks.org/plantdisease/host-disease/cucumber-cucumis-sativus-angular-leaf-spot
   - Used: bacterium overwinters in diseased material and on seed, spread by rain, sprinkler irrigation, workers' hands/clothing; leaves, stems, fruit affected; irregular water-soaked leaf spot bounded by veins so angular; bacteria ooze in droplets drying to white residue; water-soaked area turns gray and dies; dead tissue tears away leaving large irregular holes; fruit spots smaller, circular, usually superficial, may admit soft-rot organisms; clean bacteria-free seed, 2-year rotation, resistant varieties, staying out of wet infected fields.

5. **Bacterial wilt** (`cucumber_bacterial_wilt`, Erwinia tracheiphila)
   - Source: University of Illinois Extension, "Bacterial Wilt of Cucurbits"
   - URL: https://extension.illinois.edu/plant-problems/bacterial-wilt-cucurbits
   - Used: caused by E. tracheiphila, serious threat to melon and cucumber nationwide; individual runners or whole cucumber/melon plants wilt and die rapidly, most often noticed early in the season during rapid growth, affected runners first dark green then wilting; diagnosis by severing a runner near the crown, rejoining cut surfaces, then pulling apart slowly to reveal sticky strands; spread by contaminated striped and spotted cucumber beetles feeding; not seedborne, no evidence of soil survival.

6. **Fusarium wilt** (`cucumber_fusarium_wilt`, Fusarium oxysporum f. sp. cucumerinum)
   - Source: Pacific Northwest Pest Management Handbooks, "Cucumber (Cucumis sativus)-Fusarium Wilt"
   - URL: https://pnwhandbooks.org/plantdisease/host-disease/cucumber-cucumis-sativus-fusarium-wilt
   - Used: caused by F. oxysporum f. sp. cucumerinum, persists in soil as chlamydospores or in plant debris, seed transmission usually by seed-coat contamination; attacks at any growth stage; hypocotyl infection of young plants gives pre/post-emergence damping-off; older plants yellow starting in older leaves, stunt or wilt, death 3–5 days after wilting; vascular browning evident in lower stem, crown or tap root; white mycelium mat may form on external surfaces after death; no root rot observed; clean quality seed of resistant varieties, land not previously cropped with the cucurbit species, liming to pH 6.5–7.0, not moving soil from infested fields.

7. **Gummy stem blight** (`cucumber_gummy_stem_blight`, Stagonosporopsis cucurbitacearum)
   - Source: Pacific Northwest Pest Management Handbooks, "Cucumber (Cucumis sativus)-Gummy Stem Blight (Vine Decline)"
   - URL: https://pnwhandbooks.org/plantdisease/host-disease/cucumber-cucumis-sativus-gummy-stem-blight-vine-decline
   - Used: fungus S. caricae with S. cucurbitacearum listed as a synonym; overwinters in infected crop debris at least two years, can be seedborne, affects all plant parts; pseudothecia on debris produce windborne ascospores; conidia in pycnidia in lesion centres disseminated by splashing water; favoured by warm humid conditions, optimum 68–75 °F, no growth below 50 °F; leaf spots brown to black circular, margin-associated; stem infections can girdle the plant; fruit spots circular water-soaked expanding to black leathery appearance; gummy exudate usually in lesion centres; pathogen-free seed, rotation out of cucurbits at least 2 years, avoiding injuring fruit at harvest, avoiding overhead irrigation.
   - Note for the Oct 30 merge: the record keeps the assigned name S. cucurbitacearum and states the synonym situation in its evidence; the cited page's primary name is S. caricae.

8. **Cucumber mosaic virus** (`cucumber_mosaic_virus`, Cucumber mosaic virus)
   - Source: Utah State University Extension, "Cucumber Mosaic Virus"
   - URL: https://extension.usu.edu/vegetableguide/cucurbits/cucumber-mosaic-virus
   - Used: CMV is an RNA strand surrounded by a protein coat; symptoms vary by host and environment; stunted growth; light green/yellow mosaic pattern on foliage with yellow streaking and spotting; fruit ring spots or line patterns; symptoms aggravated by high temperatures, herbicides, mineral deficiencies or insect feeding; spreads mechanically (hands/tools), by aphid feeding, dodder or grafting; sanitation/disinfecting propagation tools, removing and discarding infected plants, controlling aphid populations, removing weeds as alternate hosts.
   - Note: the cited page sits in the cucurbits vegetable guide and is titled "Cucumber Mosaic Virus"; its symptom/management text is written for cucurbits generally.

9. **Alternaria leaf blight** (`cucumber_alternaria_leaf_blight`, Alternaria cucumerina)
   - Source: University of Wisconsin-Madison Vegetable Pathology, "Cucurbit Alternaria Leaf Blight"
   - URL: https://vegpath.plantpath.wisc.edu/diseases/cucurbit-alternaria-leaf-blight/
   - Used: caused by A. cucumerina; cucurbit crops listed include cucumber; brown leaf lesions developing concentric target-like rings and a yellow halo; fruit lesions first sunken brown spots becoming dark and fuzzy with sporulation; fruit sunscald from leaf loss and reduced yield; survives on infected soil-bound debris up to two years as mycelia; spores spread by wind, splashing water, workers, equipment or insects; favourable conditions 70–90 °F, high prolonged leaf wetness, poor nutrition especially low nitrogen; resistant varieties, certified disease-free seed, rotation away from susceptible cucurbits >2 years, destroying or deep-plowing debris, avoiding overhead irrigation and working wet fields.
   - Note: the PNW cucumber-specific page names Alternaria alternata f. sp. cucumerina, while the cited UW page (which explicitly lists cucumber among its hosts) names A. cucumerina; the record keeps the assigned name and cites the UW page.

10. **Scab** (`cucumber_scab`, Cladosporium cucumerinum)
    - Source: Pacific Northwest Pest Management Handbooks, "Cucumber (Cucumis sativus)-Scab (Gummosis)"
    - URL: https://pnwhandbooks.org/plantdisease/host-disease/cucumber-cucumis-sativus-scab-gummosis
    - Used: caused by C. cucumerinum, overwinters in cucumber debris and on seed; spores disseminated by insects, clothing, tools, blown long distances in moist air; host penetration under 9 hours after germination, infection visible in 3 days, spore production possible day 4; fruit severely injured, infectable at all stages but most susceptible young; first sticky drops as if from insect puncture, then spots turn gray, slightly sunken, enlarging to ~0.375 inch, canker darkens, tissue collapses into a pronounced cavity lined with dark green velvety fruiting fungus; foliage symptom slightly water-soaked paler-green area, spots turning gray-to-white and angular often with yellow margins, dead tissue cracking away leaving ragged leaf; 2–3 year rotation with non-cucurbits, plowing under debris after harvest, resistant varieties.

## Dropped: none
All 10 target diseases had an accepted authoritative source page actually opened and read. Nothing was invented to fill a gap; no record uses a search snippet as its source.
