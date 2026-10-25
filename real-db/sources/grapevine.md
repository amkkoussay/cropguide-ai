# Grapevine sources — batch 2026-10-25

Every record in `batches/grapevine.jsonl` cites one actually-opened authoritative page about that exact disease on grapevine. No record rests on model memory or on a search snippet alone.

## Records and their sources

1. **Grapevine downy mildew** (`grapevine_downy_mildew`, Plasmopara viticola)
   - Source: Ohio State University Extension (Ohioline), "Downy Mildew of Grape"
   - URL: https://ohioline.osu.edu/node/646
   - Used: oospores in fallen leaves as primary inoculum; lemon-yellow spots on upper leaf surface with downy white growth beneath; olive-coloured lesions; fruit symptoms (soft watery decay, brownish shrunken fruit); wet weather and prolonged leaf wetness favouring infection.

2. **Grapevine powdery mildew** (`grapevine_powdery_mildew`, Erysiphe necator)
   - Source: UC Statewide IPM Program, "Powdery Mildew / Grape"
   - URL: http://ipm.ucanr.edu/agriculture/grape/powdery-mildew/
   - Used: symptoms (yellow spots on upper surface of young leaves, white powdery growth on both surfaces, berry splitting and scarring, shoot stunting); conditions favouring the disease (moderate temperatures, high humidity, poor air circulation); management (resistant varieties, pruning, sanitation, timing of protectants).
   - Note: the UC ANR printable version of the same guideline (https://ucanr.edu/node/139359/printable/print) was also opened but was too thin — it covered timing, choice and coverage only, with no symptom description — so it is NOT the cited source. The name Erysiphe necator appears in the UC ANR page title.

3. **Grapevine Botrytis bunch rot** (`grapevine_botrytis_bunch_rot`, Botrytis cinerea)
   - Source: Ohio State University Extension (Ohioline), "Botrytis Bunch Rot or Gray Mold of Grape"
   - URL: http://ohioline.osu.edu/factsheet/plpath-fru-03
   - Used: gray fuzzy growth on clusters; blossom blight; berry rot beginning as soft brown spots spreading through the cluster; mummified berries; overwintering in mummies and canes; wet weather and tight clusters favouring the disease.

4. **Grapevine Pierce's disease** (`grapevine_pierces_disease`, Xylella fastidiosa)
   - Source: UC Statewide IPM Program, "Sharpshooters / Grape"
   - URL: https://ipm.ucanr.edu/agriculture/grape/sharpshooters/
   - Used: sharpshooter vectors; leaf scorching and marginal browning; premature fruit drop; vine decline; hot dry conditions worsening symptoms; no cure once infected; vector management and roguing as controls.
   - Note: the opened UC IPM page names only *Xylella fastidiosa*, not a subspecies. A search snippet of a UC ANR handout PDF mentioned subsp. *fastidiosa*, but that PDF was not opened, so the subspecies is deliberately NOT claimed in the record, per SPEC rule zero.

5. **Grapevine Phomopsis cane and leaf spot** (`grapevine_phomopsis`, Diaporthe ampelina)
   - Source: UC Statewide IPM Program, "Phomopsis Cane and Leafspot / Grape"
   - URL: https://ipm.ucanr.edu/agriculture/grape/phomopsis-cane-and-leafspot/
   - Used: small dark spots with yellow halos on leaves; scabby, cracked canes; fruit mummification; overwintering in canes and spurs; wet spring weather favouring infection.

6. **Grapevine black rot** (`grapevine_black_rot`, Guignardia bidwellii)
   - Source: University of Massachusetts Amherst CAFE, "Grape IPM — Black Rot"
   - URL: https://www.umass.edu/agriculture-food-environment/fruit/fact-sheets/grape-ipm-black-rot
   - Used: circular dark spots with tan centres and dark margins on leaves; black pycnidia in lesions; fruit turning black and mummified; overwintering in mummies and canes; warm wet weather favouring the disease.

7. **Grapevine Esca (black measles)** (`grapevine_esca`, Phaeoacremonium spp.)
   - Source: UC Statewide IPM Program, "Esca (Black Measles) / Grape"
   - URL: https://ipm.ucanr.edu/agriculture/grape/esca-black-measles/
   - Used: tiger-stripe leaf symptoms (interveinal chlorosis and necrosis); black measles spots on berries; sudden vine collapse (apoplexy); wood discoloration; pruning-wound infection; no cure, only mitigation.
   - Note: the Esca page itself names no single causal genus. The genus *Phaeoacremonium* spp. comes from a second opened page, the UC IPM archived disease list (https://ipm.ucanr.edu/PMG/diseases/diseaseslist.html), verified via in-page find for "Measles" (row: "grape | Measles | Phaeoacremonium spp. | Fungus"). The record's scientific_name reflects that list entry; the Esca page remains the cited source_url because it is the disease-specific page.

8. **Grapevine crown gall** (`grapevine_crown_gall`, Rhizobium vitis)
   - Source: University of Kentucky Fruit Scouting Guide, "Crown Gall of Grapes"
   - URL: https://fruitscout.mgcafe.uky.edu/crown-gall-grapes
   - Used: rough galls at graft unions and wound sites; synonym Agrobacterium vitis per the source; freeze-injury wounds as entry points; vine decline and shoot dieback; no cure; prevention via clean planting stock and wound avoidance.

9. **Grapevine leafroll** (`grapevine_leafroll`, Grapevine leafroll-associated viruses, GLRaV)
   - Source: Pacific Northwest Pest Management Handbooks, "Grape (Vitis spp.)-Leafroll"
   - URL: https://pnwhandbooks.org/plantdisease/host-disease/grape-vitis-spp-leafroll
   - Used: downward leaf rolling; reddening/purpling in red cultivars, yellowing in white cultivars; delayed ripening and reduced sugar; mealybug and scale vectors; graft transmission; certified virus-free stock as the main control.

10. **Grapevine Eutypa dieback** (`grapevine_eutypa_dieback`, Eutypa lata)
    - Source: UC Statewide IPM Program, "Eutypa Dieback / Grape"
    - URL: https://ipm.ucanr.edu/agriculture/grape/eutypa-dieback/
    - Used: stunted shoots with small chlorotic distorted leaves; wedge-shaped canker in cross-section; shoot dieback; pruning-wound infection during wet weather; delayed pruning and wound protection as controls.

## Opened but not counted
- UC ANR printable powdery-mildew page (see record 2 note): too thin, not cited.
- UC IPM archived disease list (see record 7 note): used only to confirm the Esca causal genus; not a disease-specific source and not cited as a source_url.

## Dropped candidates
None for grapevine — all 10 planned diseases had an opened dedicated accepted source.
