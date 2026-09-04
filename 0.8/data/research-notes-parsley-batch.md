# Parsley direct-source batch research notes

**Research date:** 2026-08-18  
**Acceptance rule:** Promote only a crop-and-disease page with visible symptoms, a usable field distinction, conservative management context, and a URL that passes the full automated availability review.

## Candidate record evidence

| Record | Direct source | Visual evidence retained | Scope decision |
| --- | --- | --- | --- |
| `parsley_septoria_leaf_spot` | [PNW Plant Disease Management Handbook: Parsley Septoria Leaf Spot](https://pnwhandbooks.org/plantdisease/host-disease/parsley-petroselinum-crispum-septoria-leaf-spot) | Small grayish-brown, somewhat angular leaf spots; small oval petiole spots; tiny dark upper-surface specks as pycnidia develop. | Accepted as a dedicated `record_specific` parsley profile after the 2026-08-18 availability review returned 200 and the complete validation suite passed. |
| `parsley_bacterial_leaf_spot` | [PNW Plant Disease Management Handbook: Parsley Bacterial Leaf Spot](https://pnwhandbooks.org/plantdisease/host-disease/parsley-petroselinum-crispum-bacterial-leaf-spot) | Leaves, petioles and shoots develop brown necrotic lesions with a water-soaked appearance; severe plants can be stunted and yellowed. | Accepted as a dedicated `record_specific` parsley profile after the 2026-08-18 availability review returned 200 and the complete validation suite passed. |

## Diagnostic guardrail

Septoria and bacterial leaf spot can both produce brown lesions. The parsley records must preserve the source-specific contrast: look for **tiny dark pycnidia in dry grayish-brown, somewhat angular spots** for Septoria, versus **water-soaked brown necrosis across leaves, petioles and shoots** for bacterial leaf spot. Neither pattern should be presented as confirmed from one ordinary photo.
