# Grape direct-source batch — research notes

## Candidate record evidence

| Record | Direct source | Visual evidence retained | Scope decision |
| --- | --- | --- | --- |
| `grapevine_powdery_mildew` | [PNW Plant Disease Management Handbook: Grape Powdery Mildew](https://pnwhandbooks.org/plantdisease/host-disease/grape-vitis-spp-powdery-mildew) | Whitish or grayish patches can cover leaf surfaces; later colonies darken with minute black dots. Berries can become grayish/whitish then brown-russeted, crack, and drop. Green canes may carry feathery dark patches. | Accepted as `record_specific` after the 2026-08-18 availability review returned 200 and the complete validation suite passed. |
| `grapevine_downy_mildew` | [PNW Plant Disease Management Handbook: Grape Downy Mildew](https://pnwhandbooks.org/plantdisease/host-disease/grape-vitis-spp-downy-mildew) | Yellowish oil spots or angular yellow-to-reddish-brown vein-limited lesions appear on green vine tissue; in moisture, a delicate dense white growth occurs on the leaf underside. Berries can show white downy infection and severely affected leaves drop. | Accepted as `record_specific` after the 2026-08-18 availability review returned 200 and the complete validation suite passed; the field-check warning for grape erineum mite remains. |
| `grapevine_botrytis` | [PNW Plant Disease Management Handbook: Grape Botrytis Bunch Rot](https://pnwhandbooks.org/plantdisease/host-disease/grape-vitis-spp-botrytis-bunch-rot) | Maturing berries show small brown spots, slip-skin, then characteristic gray fungal tufts. The rot can spread quickly through a bunch; shriveled or leaking berries can be subtler in red cultivars. | Accepted as `record_specific` after the 2026-08-18 availability review returned 200 and the complete validation suite passed; the field check remains to avoid conflating every wet bunch rot with Botrytis. |
| `grapevine_phomopsis_cane_leaf_spot` | [UC IPM: Phomopsis Cane and Leafspot](https://ipm.ucanr.edu/agriculture/grape/phomopsis-cane-and-leafspot/) | Tiny dark spots with yellowish margins occur on leaf blades and veins; basal leaves can distort. Basal shoots have black-centered spots that may crack and become scabby. Later fruit can shrivel and mummify; dormant canes can bleach with black pycnidia. | Added as a distinct grape-only `record_specific` profile and accepted after the 2026-08-18 availability review returned 200 and the complete validation suite passed. |

## Diagnostic guardrail

The downy-mildew source distinguishes its diffuse, moist-weather underside growth from the many white trichomes and puckering associated with grape erineum mite injury. The existing CropGuide outcome therefore remains a ranked candidate with a field-confirmation warning, not a definitive diagnosis.
