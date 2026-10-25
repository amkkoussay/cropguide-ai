# Wheat EXTENSION batch — sources opened (2026-10-23)

Extension to this morning's wheat batch (+11 records → wheat total 20, day total +20).
Every page below was actually opened and read with the browser tools on 2026-10-23.
EPPO codes: none of the opened pages displayed an EPPO code, so `eppo_code` is "" on
all 11 records — none invented.

| # | Disease | Scientific name | Source opened (publisher — page) |
|---|---------|-----------------|----------------------------------|
| 1 | Septoria nodorum blotch (Stagonospora leaf & glume blotch) | Parastagonospora nodorum | Crop Protection Network — "Stagonospora Leaf and Glume Blotch of Wheat" — https://cropprotectionnetwork.org/encyclopedia/stagonospora-leaf-and-glume-blotch-of-wheat |
| 2 | Common root rot | Bipolaris sorokiniana | University of Nebraska-Lincoln Extension (CropWatch) — "Crown and Root Rot" — https://cropwatch.unl.edu/plant-disease/wheat/crown-and-root-rot/ |
| 3 | Eyespot (strawbreaker foot rot) | Oculimacula yallundae | Washington State University Extension — "Eyespot \| Wheat & Small Grains" — https://smallgrains.wsu.edu/disease-resources/soilborne-fungal-diseases/eyespot/ |
| 4 | Loose smut | Ustilago tritici | Agriculture Victoria — "Loose Smut of Wheat - Field Crop Diseases Victoria" — https://extensionaus.com.au/FieldCropDiseasesVic/docs/identification-management-of-field-crop-diseases-in-victoria/bunts-and-smuts-of-cereals/loose-smut-of-wheat/ |
| 5 | Common bunt (stinking smut) | Tilletia caries | Crop Protection Network — "Common Bunt of Wheat" — https://cropprotectionnetwork.org/encyclopedia/common-bunt-of-wheat |
| 6 | Ergot | Claviceps purpurea | Pacific Northwest Pest Management Handbooks — "Wheat (Triticum aestivum)-Ergot" — https://pnwhandbooks.org/plantdisease/host-disease/wheat-triticum-aestivum-ergot |
| 7 | Barley yellow dwarf | Barley yellow dwarf virus | Crop Protection Network — "Barley Yellow Dwarf of Wheat" — https://cropprotectionnetwork.org/encyclopedia/barley-yellow-dwarf-of-wheat |
| 8 | Bacterial leaf streak (black chaff) | Xanthomonas translucens pv. undulosa | University of Minnesota Extension — "Bacterial leaf streak and black chaff on small grains" — https://extension.umn.edu/small-grains-pest-management/bacterial-leaf-streak-and-black-chaff-small-grains |
| 9 | Sharp eyespot | Rhizoctonia cerealis | AHDB — "Sharp eyespot symptoms in cereals" — https://mainsitelive.azurewebsites.net/knowledge-library/sharp-eyespot-symptoms-in-cereals |
| 10 | Pink snow mold | Microdochium nivale | Pacific Northwest Pest Management Handbooks — "Wheat (Triticum aestivum)-Snow Molds and Snow Rots" — https://pnwhandbooks.org/plantdisease/host-disease/wheat-triticum-aestivum-snow-molds-snow-rots |
| 11 | Cephalosporium stripe | Cephalosporium gramineum | Pacific Northwest Pest Management Handbooks — "Wheat (Triticum aestivum)-Cephalosporium Stripe" — https://pnwhandbooks.org/plantdisease/host-disease/wheat-triticum-aestivum-cephalosporium-stripe |

## Notes / naming as given by the sources
- #1: CPN page covers both P. nodorum and P. avenae f. sp. triticae; the record is for
  P. nodorum (the brief's species) and says so.
- #2: UNL page treats the root/crown rot complex (Bipolaris + Fusarium spp.); the record
  is scoped to the Bipolaris common-root-rot component and states the complex openly.
- #3: WSU page covers both O. yallundae and O. acuformis; record filed under O. yallundae
  (brief's species), with the pair and their field-indistinguishability stated in the text.
- #4: The Victoria source names the fungus "Ustilago nuda f. sp. tritici (also known as
  U. tritici)"; record uses Ustilago tritici per the brief and gives the synonym in evidence.
- #6: CPN's ergot encyclopedia page was opened first but does not name the fungus, so the
  record's source is the PNW wheat-ergot page, which names Claviceps purpurea explicitly.
- #9: AHDB names the fungus Ceratobasidium cereale (Rhizoctonia cerealis); the record uses
  Rhizoctonia cerealis per the brief and gives the teleomorph name in the evidence.
- #10: PNW page is the wheat snow-molds page covering all four snow molds; the record is
  scoped to pink snow mold (Microdochium nivale) and only uses facts stated for it / the group.

## Result note (2026-10-23)
- Delivered: 11/11 candidate diseases sourced and written — nothing dropped, nothing swapped.
- File: batches/wheat-ext.jsonl (11 lines, full SPEC schema, source_accessed 2026-10-23).
- Validation run before finishing: all lines parse as JSON; zero banned phrases; zero
  duplicate scientific names or ids within the file or against batches/wheat.jsonl;
  all symptom tokens in the allowed list; no repeated EN evidence sentences across the
  combined 20 wheat records; no pesticide product names or dosages.
