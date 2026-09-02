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
| Correlated visual signs | Related generic signs are grouped before scoring, and exact observation attributes remain available for differential checks. | Statistical independence of signs or a calibrated likelihood ratio. |
| Missing signs | Missing observations remain unknown. Only an explicitly supplied safe negative cue can reduce support; field-confirmation requirements become visible decisions with a conservative cap. | That a feature absent from the uploaded frame is biologically absent. |
| Provider resilience | Image bytes and decodable image structure are checked before analysis. Vision and crop-provider calls use bounded timeout, retry, and temporary circuit protection; vision output is checked for basic semantic consistency. | Availability or factual accuracy of any external service. |
| Benchmarking | A protocol and empty data template define the minimum fields needed for an independent field evaluation. No benchmark results or calibration claims are supplied. | Sensitivity, specificity, calibration, or generalisation before labeled independent data exists. |

## Tests added or updated

The regression suite now checks an unsupported high-confidence plant suggestion, token-safe alias matching, structured image-validity output, unfamiliar visual observations, and the non-probabilistic response field. These tests protect code behaviour only. They do not validate diagnostic performance.

The later hardening tests also cover correlated-observation grouping, explicit field-confirmation decisions, declared-MIME versus byte-signature mismatch, semantic image-validity inconsistencies, and bounded provider failure behaviour. They remain software tests, not agricultural validation.

## Required before any diagnostic-performance claim

Create an independent image set with known crop and disease labels, include healthy leaves and non-plant images, preserve field context, define acceptance metrics in advance, and have results reviewed by plant-pathology expertise. Until then, the application should retain its conservative candidate and abstention wording.
