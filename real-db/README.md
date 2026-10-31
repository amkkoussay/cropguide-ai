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

## Status — FINAL

Build complete, 30 Oct 2026. No further batches are planned. This is the
final publish of the build (31 Oct 2026).

Final counts: **184 source-verified records across 18 crops.**

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
| Almond | 10 | `batches/almond.jsonl` |
| Peach | 10 | `batches/peach.jsonl` |
| **Total** | **184** | |

Final validation (30 Oct 2026 close, re-checked on the merged file at
publish time): all 19 batch files parse as JSON; every record has all 29
fields in the SPEC order; every record has a `source_url` (153 distinct
source URLs across the set) and `review_status="source_verified"`; zero
duplicate crop + scientific-name keys; zero banned phrases; all symptom
tokens in the allowed list. The validator reported 0 errors and 0 warnings
on the final run. The merged file `merged.jsonl` was checked to contain
exactly the same 184 records as the batches, with the same counts.

## Files

- `batches/*.jsonl` — one JSON record per line, in the app record schema plus
  source fields (`source_title`, `source_publisher`, `source_url`,
  `source_accessed`, `eppo_code`, `review_status`).
- `merged.jsonl` — the full dataset in one file: all 184 records from the
  batches, in the same schema and field order.
- `sources/*.md` — per-crop notes listing every source page that was opened,
  what each record was taken from, and anything that was dropped and why
  (wheat has two notes files, matching its two batch files).

Note on the SQLite build: the build also produced a `cropguide.sqlite`
database (crops + diseases tables, in the app schema plus provenance
columns), but it is a binary file and this repository push route is
text-only, so the SQLite file is **not** published here — it stays local.
The text files above carry the complete dataset.

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
- **Peach crown gall and oak root rot (Armillaria)** were available in an
  opened page but not added: the peach batch was already full, not for lack
  of sources. Peach ripe fruit rot was not added separately because it
  overlaps the brown rot record.

Correction, 2026-10-26: the citrus black spot record's provenance fields were
found scrambled in the 24 Oct file (the URL field held a title string, the
publisher field held the code). They were fixed to the EPPO datasheet URL,
title, and publisher with code GUIGCI, verified by opening the EPPO page;
the evidence text is untouched, and the record still counts in the 24 Oct
total, not in a later batch.

Final-close note, 2026-10-30: the olive and potato batch files were
normalized to the SPEC field order (content unchanged — verified record by
record against the previously published files). The merged file and the
SQLite build were generated from the normalized batches.

## Integration

The CropGuide app does not consume this folder yet. Wiring it into the app is
a separate step, to be decided by قصي.
