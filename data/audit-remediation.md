# Audit remediation notes

This note records the implementation response to the supplied forensic audit. CropGuide AI remains a **candidate-retrieval and field-triage tool**, not a plant-disease diagnostic system.

## Implemented safeguards

| Audit topic | Current implementation | What it does not prove |
|---|---|---|
| Crop identification | Alias matching uses whole tokens. A strong unsupported Plant.id suggestion is included when deciding whether the supported crop is ambiguous. | Plant.id accuracy for the user’s image. |
| Crop-to-vision coupling | The visual model receives a cross-crop observation vocabulary. The Plant.id name is stated as tentative and not as visual evidence. | That the vision model extracts every sign correctly. |
| Image validity | The visual response must classify the image as symptomatic plant, healthy/no clear symptoms, unrelated/multiple subject, or uncertain. Limited, healthy, unrelated, and uncertain images do not rank diseases. | Reliable image-quality calibration in field conditions. |
| Open vocabulary | An unfamiliar visible sign may be described separately. It is not converted into an invented disease feature. | Disease retrieval for a sign absent from the ontology. |
| Disease ranking | Candidate rows are compared directly against the other rows for the same crop. The base observation is grouped, while traceable organ/geometry/surface/pattern/progression detail is retained as a bounded extra evidence unit. | Clinical sensitivity, specificity, likelihood ratios, or calibrated probability. |
| Generic observations | A candidate matched only by high-level spot/yellowing evidence units, or by units common across the crop records, is capped at 55 and cannot pass the structural retrieval-sufficiency gate. This includes the reported `dark_brown_spot` + `yellow_halo` tomato pattern, checked directly against the SQLite records. | That 55 is a validated safety threshold or that all generic cues have been captured correctly. |
| Disease abstention | The API now returns candidates only when the leading row has at least two evidence units, is not generic-only, and has a token that separates it from at least one comparable candidate. A configured score no longer opens the API result by itself. | That the structural gate is medically optimal or empirically calibrated. |
| API language | The legacy `confidence` alias was removed. The response uses `evidenceScore`, which is a retrieval score, not probability. | User interpretation without usability testing. |
| Safety and sources | Generated conditional-care guidance is country-neutral and source scope is documented as record-level provenance, not support for every claim. | Product registration, label legality, or claim-by-claim evidence. |
| Correlated visual signs | Related generic signs are grouped before scoring. Detailed vectors such as `concentric_ring` remain a bounded detail unit in the score instead of being discarded with the generic spot. | Statistical independence of signs or a calibrated likelihood ratio. |
| Missing signs | Missing observations remain unknown. Only an explicitly supplied safe negative cue can reduce support; field-confirmation requirements become visible decisions with a conservative cap. | That a feature absent from the uploaded frame is biologically absent. |
| Provider resilience | Image bytes and decodable image structure are checked before analysis. Vision and crop-provider calls use bounded timeout, retry, and temporary circuit protection; vision output is checked for basic semantic consistency. | Availability or factual accuracy of any external service. |
| Benchmarking | A protocol and empty data template define the minimum fields needed for an independent field evaluation. No benchmark results or calibration claims are supplied. | Sensitivity, specificity, calibration, or generalisation before labeled independent data exists. |
| Claim provenance | Each record retains a source URL, source scope, and review status. | Claim → exact passage provenance for every symptom, care instruction, or contextual assertion. |
| Knowledge Graph and unfamiliar signs | The graph is a reproducible export, not a runtime reasoner. An unfamiliar visual phrase is retained for transparency but does not retrieve candidates. | Graph-based reasoning or safe disease retrieval from uncurated free text. |
| Deployment limits | Plant.id selection now examines the first 10 suggestions. The request limit is deliberately in memory and applies per server process. | A distributed rate limit across multiple instances. |

## Tests added or updated

The regression suite now checks an unsupported high-confidence plant suggestion, token-safe alias matching, structured image-validity output, unfamiliar visual observations, and the non-probabilistic response field. These tests protect code behaviour only. They do not validate diagnostic performance.

The later hardening tests also cover correlated-observation grouping, retention of a concentric-ring detail unit, the generic tomato spot-plus-halo ceiling, explicit field-confirmation decisions, declared-MIME versus byte-signature mismatch, semantic image-validity inconsistencies, Plant.id suggestion depth, and bounded provider failure behaviour. They remain software tests, not agricultural validation.

## Required before any diagnostic-performance claim

Create an independent image set with known crop and disease labels, include healthy leaves and non-plant images, preserve field context, define acceptance metrics in advance, and have results reviewed by plant-pathology expertise. Until then, the application should retain its conservative candidate and abstention wording.
