# Celery individual-source batch — research notes

## Candidate record evidence

| Record | Direct source | Visual evidence retained | Scope decision |
| --- | --- | --- | --- |
| `celery_early_blight` | [UC IPM: Celery Early Blight](https://ipm.ucanr.edu/agriculture/celery/early-blight/) | Small yellow spots visible on both leaf surfaces enlarge into gray circular lesions. Dry lesions become papery, split and crack; lesions can coalesce into a leaf blight. Gray fuzzy growth may occur in lesion centers, while the dark pycnidia of late blight are absent. | Accepted as a dedicated `record_specific` celery profile after the 2026-08-18 availability review returned 200 and the complete validation suite passed. |
| `celery_late_blight` | [PNW Plant Disease Management Handbook: Celery Late Blight](https://pnwhandbooks.org/plantdisease/host-disease/celery-apium-graveolens-var-dulce-late-blight-septoria-leaf-blight) | Small light-yellow spots develop on leaves and petioles, then turn brown. The variable-shaped spots may coalesce, and minute thickened black dots (pycnidia) are visible within them; heavily infected leaves die. | Accepted as a dedicated `record_specific` celery profile after the 2026-08-18 availability review returned 200 and the complete validation suite passed. |
| `celery_pink_rot` | [UC IPM: Celery Pink Rot](https://ipm.ucanr.edu/agriculture/celery/pink-rot/) | Brown petiole lesions near the soil line or in the canopy expand quickly into soft watery decay; surrounding tissue can turn pink. Advanced lesions may form white mycelium and hard irregular black sclerotia; petioles and the plant base can collapse. | Accepted as a dedicated `record_specific` celery profile after the 2026-08-18 availability review returned 200 and the complete validation suite passed. |

## Diagnostic guardrail

The early-blight and late-blight sources identify opposite diagnostic clues: late blight develops small dark pycnidia, while early blight does not. The field check must therefore keep the two celery leaf-blight candidates distinct and prevent a photo-only confirmation.

Pink rot shares white mycelium and black sclerotia with other Sclerotinia presentations, but the record should emphasize watery petiole decay, pink surrounding tissue, and plant-base collapse rather than imply that white growth alone confirms the disease.
