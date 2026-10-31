# real-db record schema

Every record in `batches/*.jsonl` (and in `merged.jsonl`) is one JSON object
with the same fields: the 25 application fields plus provenance.

## Fields

| Field | Meaning |
| --- | --- |
| `id` | Record identifier. |
| `crop_id` | Crop the record belongs to. |
| `scientific_name` | Pathogen scientific name, exactly as the source gives it (including f. sp. / pv. where stated). |
| `name_ar`, `name_fr`, `name_en` | Disease name in Arabic, French, English — faithful translations of the same content. |
| `symptoms_json` | Symptom tokens, only from the project's allowed token list. |
| `evidence_ar`, `evidence_fr`, `evidence_en` | Facts from the source: causal organism, distinguishing symptoms/signs, favoured conditions. Specific to this crop × disease. |
| `field_check_ar`, `field_check_fr`, `field_check_en` | What to check in the field to support or rule out this disease. |
| `immediate_care_ar`, `immediate_care_fr`, `immediate_care_en` | Immediate cultural / IPM measures from the source. |
| `conditional_care_ar`, `conditional_care_fr`, `conditional_care_en` | Conditional measures. No pesticide product names, no dosages — chemical control only as "follow local label / extension guidance". |
| `safety_ar`, `safety_fr`, `safety_en` | Honest limits: look-alikes, and when to send a sample to a lab. |
| `source_url` | The exact source page that was opened and read for this record. |
| `source_scope` | Always `record_specific`. |
| `review_status` | Always `source_verified`. |
| `source_title` | Title of the source page. |
| `source_publisher` | Publisher of the source (EPPO, CABI, UC IPM, a university extension service, …). |
| `eppo_code` | EPPO code only where the opened source page showed it; blank otherwise — never guessed. |
| `source_accessed` | Date the source was accessed for this record. |

## Rules the data was built under

- **No source, no record.** A record exists only because an authoritative page
  about that exact disease on that exact crop was opened and read.
- Accepted sources, in priority order: EPPO Global Database; CABI
  PlantwisePlus / Compendium; university extension and IPM fact sheets
  (UC IPM, Cornell, UF/IFAS, WSU, Clemson, LSU AgCenter, Penn State, MSU,
  NDSU, UNL, PNW Handbooks, APSnet); INRAE / FAO / national Mediterranean
  plant-protection institutes.
- No template sentences: any sentence frame reused across records was banned,
  and records that failed validation were dropped, never patched with
  invented content.
- Zero duplicate (`crop_id`, `scientific_name`) pairs in the published set.
