# Audit remediation notes

This note records the implementation response to the supplied forensic audit. CropGuide AI remains a **candidate-retrieval and field-triage tool**, not a plant-disease diagnostic system.

## Implemented safeguards

| Audit topic | Current implementation | What it does not prove |
|---|---|---|
| Crop identification | Alias matching uses whole tokens. A strong unsupported Plant.id suggestion is included when deciding whether the supported crop is ambiguous. | Plant.id accuracy for the user’s image. |
| Crop-to-vision coupling | The visual model receives a cross-crop observation vocabulary. The Plant.id name is stated as tentative and not as visual evidence. | That the vision model extracts every sign correctly. |
| Image validity | The visual response must classify the image as symptomatic plant, healthy/no clear symptoms, unrelated/multiple subject, or uncertain. Limited, healthy, unrelated, and uncertain images do not rank diseases. | Reliable image-quality calibration in field conditions. |
| Open vocabulary | An unfamiliar visible sign may be described separately. It is not converted into an invented disease feature. | Disease retrieval for a sign absent from the ontology. |
| Disease ranking | Exact observable tokens stay available for discrimination; shared differential signs cannot oppose themselves; positive differentiating signs add only a bounded bonus. | Clinical sensitivity, specificity, or calibrated probability. |
| Disease abstention | A disease list is withheld unless the leading evidence score reaches the configured conservative gate. | That the numeric gate is medically optimal. |
| API language | The legacy `confidence` alias was removed. The response uses `evidenceScore`, which is a retrieval score, not probability. | User interpretation without usability testing. |
| Safety and sources | Generated conditional-care guidance is country-neutral and source scope is documented as record-level provenance, not support for every claim. | Product registration, label legality, or claim-by-claim evidence. |

## Tests added or updated

The regression suite now checks an unsupported high-confidence plant suggestion, token-safe alias matching, structured image-validity output, unfamiliar visual observations, and the non-probabilistic response field. These tests protect code behaviour only. They do not validate diagnostic performance.

## Required before any diagnostic-performance claim

Create an independent image set with known crop and disease labels, include healthy leaves and non-plant images, preserve field context, define acceptance metrics in advance, and have results reviewed by plant-pathology expertise. Until then, the application should retain its conservative candidate and abstention wording.
