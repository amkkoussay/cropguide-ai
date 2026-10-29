# CropGuide real database (source-backed)

## What this is

This folder holds a rebuilt CropGuide disease database in which **every
crop × disease record carries an authoritative source that was actually
opened and read** — EPPO, CABI PlantwisePlus, UC IPM, UF/IFAS, PNW Handbooks,
and university extension services. No source, no record.

This replaces the earlier shipped database approach, in which a large share of
the records were template-generated structured entries that were not
individually verified. Nothing in this folder is generated that way: each
record was written from its cited source page, and each record carries
`review_status="source_verified"` plus the source title, publisher, and URL.

There are no pesticide product names or dosages anywhere in these records, by
design. EPPO codes are recorded only where the code was actually shown on the
opened source page; everywhere else the field is left blank rather than
guessed.

## Status

Build in progress. Batches are added daily through 30 Oct 2026 and published
here as they are validated.

Counts as of 2026-10-29: **164 source-verified records across 16 crops.**

| Crop | Records | Batch files |
| --- | ---: | --- |
| Potato | 9 | `batches/potato.jsonl` |
| Tomato | 9 | `batches/tomato.jsonl` |
| Olive | 6 | `batches/olive.jsonl` |
| Wheat | 20 | `batches/wheat.jsonl` (9) + `batches/wheat-ext.jsonl` (11) |
| Date palm | 10 | `batches/date_palm.jsonl` |
| Citrus | 10 | `batches/citrus.jsonl` |
| Grapevine | 10 | `batches/grapevine.jsonl` |
| Pepper | 10 | `batches/pepper.jsonl` |
| Barley | 10 | `batches/barley.jsonl` |
| Cucumber | 10 | `batches/cucumber.jsonl` |
| Watermelon | 10 | `batches/watermelon.jsonl` |
| Onion | 10 | `batches/onion.jsonl` |
| Chickpea | 10 | `batches/chickpea.jsonl` |
| Faba bean | 10 | `batches/faba_bean.jsonl` |
| Strawberry | 10 | `batches/strawberry.jsonl` |
| Maize | 10 | `batches/maize.jsonl` |
| **Total** | **164** | |

## Files

- `batches/*.jsonl` — one JSON record per line, in the app record schema plus
  source fields (`source_title`, `source_publisher`, `source_url`,
  `source_accessed`, `eppo_code`, `review_status`).
- `sources/*.md` — per-crop notes listing every source page that was opened,
  what each record was taken from, and anything that was dropped and why
  (wheat has two notes files, matching its two batch files).

## Honest notes

Candidates that did not meet the rule were dropped, not padded in:

- **Olive sooty mold** was dropped: no olive-specific source could be found
  that names a causal genus for it.
- **Pepper Fusarium wilt** was dropped: no dedicated accepted source about
  Fusarium wilt specifically on pepper; it was replaced by two sourced pepper
  virus records, keeping pepper at 10 records.
- Two candidates opened on 24 Oct were turned away: a Thielaviopsis trunk rot
  record (same pathogen as the black scorch record already counted — it would
  have duplicated the key) and a Phytophthora gummosis record (the opened page
  named no species, so it would have collided with another record).
- **Chickpea rust** was dropped: no dedicated accepted source page (only
  slides, an encyclopedia entry, and a first-report abstract).
- **Faba bean Fusarium wilt, Fusarium solani root rot, bacterial blight,
  broad bean wilt virus (as a standalone record), and powdery mildew** were
  dropped: no dedicated accepted faba-bean pages for them.
- **Strawberry Fusarium wilt** was dropped: no dedicated accepted strawberry
  extension page was opened (only a journal abstract and news items); it was
  replaced by a sourced Phomopsis leaf blight record, keeping strawberry at
  10 records. Strawberry leather rot was not added: it is the same species
  as the crown rot record already counted and would have duplicated the key.

Correction, 2026-10-26: the citrus black spot record's provenance fields were
found scrambled in the 24 Oct file (the URL field held a title string, the
publisher field held the code). They were fixed to the EPPO datasheet URL,
title, and publisher with code GUIGCI, verified by opening the EPPO page;
the evidence text is untouched, and the record still counts in the 24 Oct
total, not in a later batch.

## Integration

The CropGuide app does not consume this folder yet. Wiring it into the app is
a separate step, to be decided after the build completes.
