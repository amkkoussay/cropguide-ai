# Field-crop source review notes

> Working notes only. A source becomes `record_specific` in SQLite only after its URL is mapped in `scripts/catalog.py`, links are reviewed, and the full validation suite passes. The original Agriculture Victoria Faba-bean URLs below were **not accepted** because all returned `403` to the automated source review on 2026-08-18. Their accessible disease-specific replacements are recorded after the table.

## Faba bean — Agriculture Victoria

| Candidate record | Direct official page | Confirmed image-match evidence | Safe general management supported |
|---|---|---|---|
| `faba_bean_ascochyta` | [Ascochyta leaf and pod spot of faba bean](https://agriculture.vic.gov.au/biosecurity/plant-diseases/grain-pulses-and-cereal-diseases/ascochyta-leaf-and-pod-spot-of-faba-bean) | Circular dark-brown leaf spots that become irregular grey lesions with black pycnidia; elongated sunken stem lesions; pale-centred, dark-margined pod lesions. | Resistant varieties, cleaner seed, a multi-year break, separation from old residue, crop monitoring. |
| `faba_bean_rust` | [Rust of faba bean](https://agriculture.vic.gov.au/biosecurity/plant-diseases/grain-pulses-and-cereal-diseases/rust-of-faba-bean) | Numerous small orange-brown pustules with light-yellow halos; severe infection may cause defoliation. | Resistant varieties and crop monitoring; application guidance stays generic and conditional in the product. |
| `faba_bean_botrytis` | [Chocolate spot of faba bean](https://agriculture.vic.gov.au/biosecurity/plant-diseases/grain-pulses-and-cereal-diseases/chocolate-spot-of-faba-bean) | Reddish-brown leaf and stem spots that darken and coalesce into grey-brown target spots; severe cases blacken the plant. | Resistant varieties, clean seed, a multi-year break, spacing from old pulse residue, and early monitoring. |

The sources were opened on 2026-08-18 and are disease-specific official Agriculture Victoria pages, not crop-level indexes. The chocolate-spot page identifies chocolate spot as being caused by *Botrytis fabae* and *B. cinerea*. However, the automated review received `403` for all three URLs, so no `faba_bean_*` row is currently mapped as `record_specific`.

## Faba bean — accessible replacement links

| Accepted record | Direct source | Confirmed image-match evidence | Acceptance basis |
|---|---|---|---|
| `faba_bean_ascochyta` | [WSU: Ascochyta Blight of Faba Bean (PDF)](https://wpcdn.web.wsu.edu/wp-ecommerce/uploads/sites/2/product-3343-sku-FS302E.pdf) | Leaf, stem and pod lesions, with dark pycnidia in mature lesions. | WSU-hosted disease publication returned `200` by direct availability check on 2026-08-18. |
| `faba_bean_rust` | [Field Crop Diseases Victoria: Rust of Faba Bean](https://extensionaus.com.au/FieldCropDiseasesVic/docs/identification-management-of-field-crop-diseases-in-victoria/faba-beans/rust-of-faba-bean/) | Orange-brown pustules and yellowing; severe infection can cause leaf loss. | Direct disease page returned `200` by direct availability check on 2026-08-18. |
| `faba_bean_chocolate_spot` | [Field Crop Diseases Victoria: Chocolate Spot of Faba Bean](https://extensionaus.com.au/FieldCropDiseasesVic/docs/identification-management-of-field-crop-diseases-in-victoria/faba-beans/chocolate-spot-of-faba-bean/) | Discrete reddish-brown spots, then coalescing grey-brown target spots and possible blackened foliage or stems. | Direct disease page returned `200` by direct availability check on 2026-08-18. It is represented by a dedicated chocolate-spot profile rather than generic gray mold. |

## Maize — University of Delaware candidate

| Candidate record | Direct university page | Status |
|---|---|---|
| `maize_northern_corn_leaf_blight` | [University of Delaware: Northern Corn Leaf Blight](https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/northern-corn-leaf-blight/) | Page opened on 2026-08-18; it is a disease-specific Cooperative Extension fact sheet. Accepted after the automated source review returned 200, with a matching profile, visual symptom tokens, a three-language field check, and safe conditional guidance. |

## Wheat and barley — next direct-page candidates

| Candidate record | Direct source | Initial evidence observed | Status |
|---|---|---|---|
| `wheat_powdery_mildew` | [Field Crop Diseases Victoria: Powdery Mildew of Wheat](https://extensionaus.com.au/FieldCropDiseasesVic/docs/identification-management-of-field-crop-diseases-in-victoria/foliar-diseases-of-wheat/powdery-mildew-of-wheat/) | Disease-specific page; search result identifies humidity, mild temperatures, and the named wheat disease. | Candidate; await direct source-availability and content review. |
| `barley_powdery_mildew` | [Field Crop Diseases Victoria: Powdery Mildew of Barley](https://extensionaus.com.au/FieldCropDiseasesVic/docs/identification-management-of-field-crop-diseases-in-victoria/foliar-diseases-of-barley/powdery-mildew-of-barley/) | Disease-specific page; search result identifies masses of tiny white spores on barley. | Candidate; await direct source-availability and content review. |
| Wheat/barley rust profiles | [Oklahoma State University Extension: Identifying Rust Diseases of Wheat and Barley](https://extension.okstate.edu/fact-sheets/identifying-rust-diseases-of-wheat-and-barley) | University fact sheet distinguishes leaf, stripe, and stem rust across wheat and barley. | Candidate-discovery source; map only a profile whose symptom definition and crop match directly. |

## Strawberry — direct PNW disease pages

| Candidate record | Direct university source | Confirmed image-match evidence | Initial decision |
|---|---|---|---|
| `strawberry_anthracnose` | [PNW Plant Disease Management Handbook: Strawberry Anthracnose](https://pnwhandbooks.org/plantdisease/host-disease/strawberry-fragaria-spp-anthracnose) | Crown infection can present as whole-plant wilting with a firm reddish-brown crown rot; fruit can develop firm, round lesions that darken to brown or black. | Accepted as `record_specific` after the 2026-08-18 review returned 200 and the full data validation passed. |
| `strawberry_botrytis` | [PNW Plant Disease Management Handbook: Strawberry Gray Mold](https://pnwhandbooks.org/plantdisease/host-disease/strawberry-fragaria-spp-gray-mold-fruit-rot) | Brown blossom or fruit tissues progress to a characteristic gray fungal growth on the berry surface. | Accepted as `record_specific` after the 2026-08-18 review returned 200 and the full data validation passed. |
| `strawberry_powdery_mildew` | [PNW Plant Disease Management Handbook: Strawberry Powdery Mildew](https://pnwhandbooks.org/plantdisease/host-disease/strawberry-fragaria-spp-powdery-mildew) | Leaflet edges curl upward, exposing undersides with grayish-white powdery growth; affected leaves may redden or turn purplish. | Accepted as `record_specific` after the 2026-08-18 review returned 200 and the full data validation passed. |
| `strawberry_phytophthora_root_rot` | [UC IPM: Phytophthora Crown and Root Rot](https://ipm.ucanr.edu/agriculture/strawberry/phytophthora-crown-and-root-rot/) | Stunting, small leaves and possible plant collapse; cutting the crown reveals brown vascular or crown tissue and roots can rot brown to black. | Accepted as `record_specific` after the 2026-08-18 review returned 200 and the full data validation passed. |

## Tomato — direct University of Wisconsin and Maryland disease pages

| Candidate record | Direct university source | Confirmed image-match evidence | Initial decision |
|---|---|---|---|
| `tomato_alternaria_leaf_spot` — early blight | [UW Vegetable Pathology: Tomato Early Blight](https://vegpath.plantpath.wisc.edu/diseases/tomato-early-blight/) | Lower leaves and stems develop circular brown lesions with concentric target-like rings and often a yellow halo; lesions may merge and defoliate the lower canopy. | Accepted as `record_specific` after the 2026-08-18 review returned 200 and the full data validation passed. |
| `tomato_septoria` | [UW Vegetable Pathology: Tomato Septoria Leaf Spot](https://vegpath.plantpath.wisc.edu/diseases/tomato-septoria-leaf-spot/) | Lower leaves first show circular tan-to-gray spots with dark margins, dark raised pycnidia, and often a yellow halo. | Accepted as `record_specific` after the 2026-08-18 review returned 200 and the full data validation passed. |
| `tomato_late_blight` | [UW Vegetable Pathology: Tomato Late Blight](https://vegpath.plantpath.wisc.edu/diseases/tomato-late-blight/) | Above-ground tissue can show irregular green-to-brown patches with pale green/gray margins; wet conditions can yield water-soaked or greasy lesions and white fuzzy growth beneath leaves. | Accepted as a new `record_specific` profile after the 2026-08-18 review returned 200 and the full data validation passed. |
| `tomato_fusarium_wilt` | [University of Maryland Extension: Fusarium Wilt of Tomatoes](https://extension.umd.edu/resource/fusarium-wilt-tomatoes-home-garden) | Lower leaves yellow, sometimes one side of a plant or branch; splitting a stem reveals brown vascular tissue with a healthy pith. | Accepted as `record_specific` after the 2026-08-18 review returned 200 and the full data validation passed. |

## Potato — direct university and official disease pages

| Candidate record | Direct source | Confirmed image-match evidence | Initial decision |
|---|---|---|---|
| `potato_rhizoctonia` — black scurf | [PNW Plant Disease Management Handbook: Potato Rhizoctonia Canker (Black Scurf)](https://pnwhandbooks.org/plantdisease/host-disease/potato-solanum-tuberosum-rhizoctonia-canker-black-scurf) | Reddish-brown stem, stolon, root, or tuber lesions; black adherent scurf bodies on tuber surfaces; possible aerial tubers after severe girdling. | Accepted as `record_specific` after the 2026-08-18 review returned 200 and the full data validation passed. |
| `potato_late_blight` | [Colorado Department of Agriculture: Potato Late Blight](https://ag.colorado.gov/plants/plant-health/potato-late-blight-history-impacts-and-prevention) | Small dark-green or brown spots enlarge into dark, water-soaked blackish lesions; humid conditions may produce white growth beneath leaves; tubers develop firm brown or purple patches and reddish-brown internal rot. | Accepted as `record_specific` after the 2026-08-18 review returned 200 and the full data validation passed. |
| `potato_alternaria_leaf_spot` — early blight | [NDSU Extension: Early Blight of Potato](https://www.ndsu.edu/agriculture/extension/publications/early-blight-potato) | Older lower leaves develop dark brown to black spots with characteristic concentric target rings; lesions can coalesce with yellowing, and tubers may show dark sunken lesions with raised dark-brown borders. | The link returned 503 in a later 2026-08-18 review. It was removed from `record_specific` mapping and remains `source_mapped` pending a reachable direct replacement. |
| `potato_common_scab` | [PNW Plant Disease Management Handbook: Potato Common Scab](https://pnwhandbooks.org/plantdisease/host-disease/potato-solanum-tuberosum-common-scab) | Corky tuber-surface lesions can be superficial or form deep pits; the page identifies powdery scab as a field look-alike. | Accepted as a new `record_specific` tuber profile after the 2026-08-18 review returned 200 and the full data validation passed. |
| `potato_verticillium_wilt` | [UC IPM: Potato Verticillium Wilt](https://ipm.ucanr.edu/agriculture/potato/verticillium-wilt/) | Lower leaves yellow and wither, with symptoms progressing upward; stems near ground level show light-brown vascular tissue and some tubers show vascular-ring discoloration. | Accepted as `record_specific` after the 2026-08-18 review returned 200 and the full data validation passed. |

## Cucumber — direct university disease pages

| Candidate record | Direct university source | Confirmed image-match evidence | Initial decision |
|---|---|---|---|
| `cucumber_downy_mildew` | [PNW Plant Disease Management Handbook: Cucumber Downy Mildew](https://pnwhandbooks.org/plantdisease/host-disease/cucumber-cucumis-sativus-downy-mildew) | Angular yellow lesions on the upper leaf surface become brown as they expand; affected undersides show grayish-purple fluffy growth. | Accepted as `record_specific` after the 2026-08-18 review returned 200 and the full data validation passed. |
| `cucumber_gummy_stem_blight` | [PNW Plant Disease Management Handbook: Cucumber Gummy Stem Blight](https://pnwhandbooks.org/plantdisease/host-disease/cucumber-cucumis-sativus-gummy-stem-blight-vine-decline) | Brown-to-black marginal leaf spots, girdling stem infection, circular water-soaked fruit lesions, and a central gummy exudate; humid lesions may have white mycelium and tiny black fruiting bodies. | Accepted as `record_specific` after the 2026-08-18 review returned 200 and the full data validation passed; the matching generic profile already existed, so no duplicate record was created. |

## Pepper — direct university disease pages

| Candidate record | Direct university source | Confirmed image-match evidence | Initial decision |
|---|---|---|---|
| `pepper_bacterial_leaf_spot` | [PNW Plant Disease Management Handbook: Pepper Bacterial Spot](https://pnwhandbooks.org/plantdisease/host-disease/pepper-capsicum-spp-bacterial-spot) | Water-soaked leaf lesions turn dark brown with slightly raised and sometimes angular margins; tissues can dry and drop out, while fruit develops raised scab-like spots. | The original WVU candidate returned 403 in the automated review and was excluded. Its direct PNW university replacement was accepted as `record_specific` after the 2026-08-18 review returned 200 and full data validation passed. |
| `pepper_phytophthora_blight` | [NC State Extension: Phytophthora Blight of Peppers](https://content.ces.ncsu.edu/phytophthora-blight-of-peppers) | Wet conditions can produce wilt followed by collapse, a dark-brown crown lesion that girdles the stem, and water-soaked fruit rot with white powdery-to-cottony growth. | Accepted as `record_specific` after the 2026-08-18 review returned 200 and full data validation passed. |
| `pepper_anthracnose` | [PNW Plant Disease Management Handbook: Pepper Anthracnose](https://pnwhandbooks.org/plantdisease/host-disease/pepper-capsicum-spp-anthracnose) | Green or ripe fruit develops round-to-oval sunken lesions that may show concentric black, tan and orangish-pink rings; leaves or stems can have tan-to-brown lesions with darker borders. | Accepted as `record_specific` after the 2026-08-18 review returned 200 and full data validation passed. |
