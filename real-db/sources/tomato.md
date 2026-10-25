# Tomato — sources opened (batch built 2026-10-22)

Every source below was returned by search and actually opened/read with the browser
tools on 2026-10-22. One source per record; facts in each record come from its page.

| # | Disease (record id) | Scientific name | Source opened | Publisher |
|---|---|---|---|---|
| 1 | Late blight (`tomato_late_blight`) | *Phytophthora infestans* | [Tomato Late Blight - Gardening \| NC State Extension](https://gardening.ces.ncsu.edu/2024/07/tomato-late-blight-2/?src=rss) | NC State Extension (North Carolina State University) |
| 2 | Early blight (`tomato_early_blight`) | *Alternaria solani* | [Early Blight \| USU](https://extension.usu.edu/vegetableguide/tomato-pepper-eggplant/early-blight) | Utah State University Extension |
| 3 | Septoria leaf spot (`tomato_septoria_leaf_spot`) | *Septoria lycopersici* | [Septoria Leaf Spot \| Extension \| West Virginia University](https://extension.wvu.edu/lawn-gardening-pests/plant-disease/fruit-vegetable-diseases/septoria-leaf-spot) | West Virginia University Extension |
| 4 | Bacterial speck (`tomato_bacterial_speck`) | *Pseudomonas syringae* pv. *tomato* | [Bacterial Speck / Tomato / Agriculture: Pest Management Guidelines / UC IPM](https://ipm.ucanr.edu/agriculture/tomato/bacterial-speck/) | UC Statewide IPM Program (University of California) |
| 5 | Bacterial spot (`tomato_bacterial_spot`) | *Xanthomonas* spp. (*X. vesicatoria*, *X. euvesicatoria*, *X. gardneri*, *X. perforans*) | [Bacterial spot of tomato and pepper \| UMN Extension](https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/bacterial-spot-of-tomato-and-pepper) | University of Minnesota Extension |
| 6 | Bacterial canker (`tomato_bacterial_canker`) | *Clavibacter michiganensis* subsp. *michiganensis* | [Bacterial canker of tomato \| UMN Extension](https://extension.umn.edu/agriculture/specialty-crops/vegetable-farming/disease-management/bacterial-canker-of-tomato) | University of Minnesota Extension |
| 7 | Fusarium wilt (`tomato_fusarium_wilt`) | *Fusarium oxysporum* f. sp. *lycopersici* | [Fusarium Wilt of Tomato \| Scouting Guides for Problems of Vegetables](https://veggiescout.mgcafe.uky.edu/fusarium-wilt-tomato) | University of Kentucky Cooperative Extension (VeggieScout) |
| 8 | Gray mold (`tomato_gray_mold`) | *Botrytis cinerea* | [Botrytis Gray Mold of Tomato \| NC State Extension Publications](https://content.ces.ncsu.edu/publication/botrytis-gray-mold-of-tomato) | NC State Extension (North Carolina State University) |
| 9 | Tomato yellow leaf curl virus (`tomato_yellow_leaf_curl_virus`) | *Begomovirus coheni* (TYLCV; EPPO code **TYLCV0**) | [EPPO Datasheet: Begomovirus coheni](https://gd.eppo.int/taxon/TYLCV0/datasheet) | EPPO Global Database |

## Notes
- Also opened while researching (corroboration, not the cited source_url): UConn late
  blight fact sheet, Texas A&M tomato problem-solver late blight page, UF/IFAS TYLCV
  pages, Ontario bacterial diseases of tomato page.
- EPPO codes: only TYLCV carries one (TYLCV0, printed on its EPPO datasheet). No EPPO
  code was confirmed on an opened page for the other eight organisms, so their
  `eppo_code` is "" per SPEC.md — none invented.
- Taxonomy notes: bacterial canker is recorded under the name its UMN source uses
  (*Clavibacter michiganensis* subsp. *michiganensis*); TYLCV is recorded under EPPO's
  preferred name *Begomovirus coheni*. NC State's early-blight page notes the tomato
  early-blight fungus is now often called *Alternaria linariae* (= *A. tomatophila*);
  the record keeps *Alternaria solani*, the name used by its cited USU source and by
  the batch brief.
- Nothing dropped: all 9 candidate diseases were sourced from an opened authoritative
  page and are included.
