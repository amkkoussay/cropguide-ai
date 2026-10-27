# Watermelon sources — batch 2026-10-27

Every record in `batches/watermelon.jsonl` cites one actually-opened authoritative page about that exact disease on watermelon. No record rests on model memory or on a search snippet alone. EPPO codes are "" throughout — none of the opened pages showed one, and none was invented.

## Records and their sources

1. **Fusarium wilt** (`watermelon_fusarium_wilt`, Fusarium oxysporum f. sp. niveum)
   - Source: UC Statewide IPM Program, "Fusarium Wilt (Watermelon)"
   - URL: https://ipm.ucanr.edu/agriculture/cucurbits/fusarium-wilt-watermelon/
   - Used: F. oxysporum f. sp. niveum; seedlings wilt at high inoculum; after fruit set, yellowing/wilting of one runner or one side, bright yellow runner tip, other runners collapse, plant dies; root lesions with red gumming; dark vascular discoloration; three races, race 1 in California; polygenic race-1 resistance overcome by high inoculum; 10-year rotation out of watermelon; note infections for next-crop decisions.

2. **Downy mildew** (`watermelon_downy_mildew`, Pseudoperonospora cubensis)
   - Source: LSU AgCenter, "Vegetables and Herbs" — Disease Spotlight: Cucurbit Downy Mildew
   - URL: https://www.LSUAGCenter.com/portals/our_offices/departments/plant-pathology-crop-physiology/hort-path-lab/for-growers/vegetables-and-herbs705386019214
   - Used: P. cubensis water mold; devastating on cucumber, pumpkin, squash, watermelon, cantaloupe; favors cool nights 55–75 °F with prolonged high humidity; upper-leaf yellow spots turning brown; gray spores on underside giving a downy look; spores airborne over long distances; no resistant watermelon varieties; avoid overhead irrigation; full-sun sites.

3. **Powdery mildew** (`watermelon_powdery_mildew`, Podosphaera xanthii)
   - Source: University of Minnesota Extension, "Powdery mildew of cucurbits"
   - URL: https://extension.umn.edu/disease-management/powdery-mildew-cucurbits
   - Used: mainly caused by P. xanthii; infects all cucurbits including watermelons; first sign pale yellow leaf spots, then white powdery spots on both leaf surfaces expanding into large blotches covering leaf, petiole and stem; older leaves infected first; favors humid conditions around 68–81 °F; new spores form and spread easily in warm, dry conditions, wind-blown; weakens plant, fruit ripens prematurely, fewer and smaller fruit, sunburned; resistant varieties, air movement via spacing/staking/weed control, avoiding over-application of nitrogen.
   - Note: the UC IPM cucurbits powdery-mildew page was also opened, but its opened text names only E. cichoracearum as the rare species and does not name the common one, so the UMN page (which explicitly lists watermelons) is the cited source.

4. **Anthracnose** (`watermelon_anthracnose`, Colletotrichum orbiculare)
   - Source: New Mexico State University Extension, "Anthracnose of Cucurbits" (Guide H-247)
   - URL: https://pubs.nmsu.edu/_h/H247/index.html
   - Used: caused by C. orbiculare; especially common on watermelon, melon and cucumber; leaf lesions near veins, roughly circular, light brown to reddish, enlarging beyond 1 cm, leaves distorted, centres crack/drop out (shot hole); fruit lesions circular, sunken, water-soaked, appearing near maturity, blackening with pink spore masses in moist conditions; early fruit infection can abort/malform fruit; humid rainy weather essential, optimum 70–80 °F and 100% relative humidity for 24 h, symptoms within 96 h; disease-free seed, resistant cultivars, deep-plow residue, rotation of at least one year without cucurbits.
   - Note: this is the same NMSU guide URL cited for cucumber anthracnose on 2026-10-26, but the watermelon record is a separate crop record and the guide explicitly names watermelon as an especially common host.

5. **Gummy stem blight** (`watermelon_gummy_stem_blight`, Stagonosporopsis caricae)
   - Source: Pacific Northwest Pest Management Handbooks, "Watermelon (Citrullus sp.)-Gummy Stem Blight (Black Rot)"
   - URL: https://pnwhandbooks.org/plantdisease/host-disease/watermelon-citrullus-sp-gummy-stem-blight-black-rot
   - Used: fungus S. caricae (syns. S. citrulli, S. cucurbitacearum, Didymella bryoniae, Phoma cucurbitacearum); overwinters in infected crop debris at least two years; can be seedborne; affects all plant parts; pseudothecia on debris produce windborne ascospores; conidia in pycnidia in lesion centres disseminated by splashing water; favoured by warm humid conditions, optimum 68–75 °F, no growth below 50 °F; leaf spots brown to black circular, margin-associated; stem infections can girdle the plant; fruit spots circular water-soaked expanding to black leathery appearance; gummy exudate usually in lesion centres; white mycelium and tiny black fruiting structures at higher relative humidity; pathogen-free seed, rotation out of cucurbits at least 2 years, avoiding injuring fruit at harvest, storing only healthy fruit, avoiding overhead irrigation.
   - Note for the Oct 30 merge: unlike the cucumber record (which kept S. cucurbitacearum per its PNW page), this watermelon record uses the PNW watermelon page's primary name S. caricae and states the synonyms in its evidence.

6. **Bacterial fruit blotch** (`watermelon_bacterial_fruit_blotch`, Acidovorax avenae subsp. citrulli)
   - Source: Texas AgriLife Extension Service, "Bacterial Fruit Blotch" (watermelon foliar diseases)
   - URL: https://aggie-horticulture.tamu.edu/vegetable/watermelon/foliar-diseases/bacterial-fruit-blotch/
   - Used: bacterium A. avenae subsp. citrulli; infected seedlings develop water-soaking on lower surface of cotyledons and leaves, then necrotic areas; non-distinctive necrotic leaf spots on transplants; mature leaves large circular brown lesions near leaf edge (not reliable for diagnosis); unique symptoms are irregular rust-colored lesions along leaf ribs with the rib water-soaked on the underside; leaf lesions can serve as a source of bacteria infecting fruit; field leaf lesions often difficult to find and may be confused with fungal lesions; do not replant watermelon/cucurbits in affected field for at least one season, plow debris under, destroy volunteers, control citron melon weeds.
   - Note: the record keeps the page's name A. avenae subsp. citrulli and does not assert the modern A. citrulli renaming, which the opened page does not state.

7. **Cercospora leaf spot** (`watermelon_cercospora_leaf_spot`, Cercospora citrullina)
   - Source: High Plains IPM (Schwartz and Gent), "HPIPM: Cercospora Leaf Spot Cucurbits"
   - URL: https://wiki.bugwood.org/HPIPM:Crops/Cucurbits/Cercospora_Leaf_Spot
   - Used: caused by C. citrullina; most damaging to watermelon, other melons, cucumber; conidia deposited by wind/splashing water, germinate at 78–90 °F with free moisture; new infection/sporulation cycles every 7–10 days in warm wet weather; disseminated by wind and splashing rain/irrigation water; survives on weeds and infested debris; symptoms primarily on foliage, petiole/stem lesions only when highly favorable, no fruit lesions known; older leaves small circular to irregular tan to light brown spots, coalescing, margins dark purple/black with yellow halos; severely infected leaves yellow, senesce, fall off; on watermelon lesions often on younger rather than older foliage; reduces fruit size/quality, rarely severe losses; debris and weed-host elimination essential; 2–3 year rotation to nonhosts; no resistant commercial varieties identified.

8. **Watermelon mosaic virus** (`watermelon_mosaic_virus`, Watermelon mosaic virus)
   - Source: Texas AgriLife Extension Service, "Watermelon Mosaic"
   - URL: https://aggie-horticulture.tamu.edu/vegetable/problem-solvers/cucurbit-problem-solver/leaf-disorders/watermelon-mosaic/
   - Used: page covers Watermelon mosaic virus 2 and Papaya ringspot virus type W under the watermelon mosaic heading; severe interveinal chlorosis with characteristic green/yellow mosaic pattern; leaves stunted and misshapen; fruit bumpy and distorted, may fail to develop normal coloration; spread by aphids and leaf miners, mechanically by picking after development; plowing down residues, field rotations, sanitation, early insect control.
   - Note: the record's scientific name is the plain "Watermelon mosaic virus" and its evidence states that the cited page groups WMV-2 and PRSV-W together; it does not claim the two are the same virus.

9. **Alternaria leaf blight** (`watermelon_alternaria_leaf_blight`, Alternaria cucumerina)
   - Source: University of Wisconsin-Madison Vegetable Pathology, "Cucurbit Alternaria Leaf Blight"
   - URL: https://vegpath.plantpath.wisc.edu/diseases/cucurbit-alternaria-leaf-blight/
   - Used: caused by A. cucumerina; cucurbit crops listed include watermelon, cantaloupe, cucumber, zucchini, pumpkin, winter squashes; brown leaf lesions developing concentric target-like rings and a yellow halo; fruit lesions first sunken brown spots becoming dark and fuzzy with sporulation; fruit sunscald from leaf loss and reduced yield; survives on infected soil-bound debris up to two years as mycelia; spores spread by wind, splashing water, workers, equipment or insects; favourable conditions 70–90 °F, high prolonged leaf wetness, early/late-season plants, poor nutrition especially low nitrogen; resistant varieties, certified disease-free seed, rotation away from susceptible cucurbits >2 years, destroying or deep-plowing debris, avoiding overhead irrigation and working wet fields, maintaining nutrition.
   - Note: this is the same UW guide URL cited for cucumber Alternaria leaf blight on 2026-10-26, but the watermelon record is a separate crop record and the guide explicitly lists watermelon among its cucurbit crops.

10. **Southern blight** (`watermelon_southern_blight`, Sclerotium rolfsii)
    - Source: Bugwood Wiki, "Sclerotium rolfsii (Southern blight of vegetables and melons)" (authors: Garrett Ridge and Barbara Shew, North Carolina State University)
    - URL: http://wiki.bugwood.org/Sclerotium_rolfsii_%28Southern_blight_of_vegetables_and_melons%29
    - Used: necrotrophic soilborne pathogen S. rolfsii, listed on the page under the current scientific name Agroathelia rolfsii; abundant white mycelium, fan-shaped coarse strands on lower stems, leaf litter and soil; tan-to-brown mustard-seed-sized sclerotia 0.5–1.5 mm after 7–14 days; disease usually restricted to plant parts in contact with soil; early water-soaked crown/lower-stem lesions; yellowing and wilting of foliage then complete collapse; watermelon infection normally restricted to soil-contact fruit and runners with deposited soil, one or more runners turning yellow; fruit soft water-soaked sunken slightly yellowish lesions spreading through most or all of the fruit, collapse within 3–4 days, skin cracking, white mycelium and developing sclerotia filling lesion cavities; favours 27–35 °C, humid conditions, acidic soil; sclerotia survive several years; field selection as most successful control, rotations of 2+ years to non-hosts like corn or small grains, avoiding peanuts/soybeans/cabbage/carrots rotations, weed control, avoiding close spacing and over-irrigation, black plastic mulch or row covers as fruit-soil barrier; few if any resistant cucurbit cultivars commercially available.
    - Note: the record keeps the common name S. rolfsii and states the page's current-name listing (Agroathelia rolfsii) in its evidence. The Texas A&M southern-blight page (cucurbit fruit disorders) was also opened and agrees on stem girdling, mustard-seed sclerotia and fruit rot, but the Bugwood page is cited because it states watermelon runner symptoms explicitly.
