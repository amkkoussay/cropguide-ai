# real-db changelog

Publish history of the source-backed CropGuide disease database in this folder.
Every publish was verified before it counted: each record's source page opened
and read, zero duplicate (crop, scientific name) pairs, zero template phrases.

| Date | Records | Crops | Commit | Notes |
| --- | ---: | ---: | --- | --- |
| 2026-10-25 | 84 | 8 | `871cac5` | First publish of the rebuilt database. |
| 2026-10-27 | 124 | 12 | `0a1b8be` | Added barley, cucumber, watermelon, onion. |
| 2026-10-29 | 164 | 16 | `8d3a0ba` | Added chickpea, faba bean, strawberry, maize. |
| 2026-10-31 | 184 | 18 | `fe948d2` | Final publish: almond + peach, `merged.jsonl`, final README. Build closed 30 Oct 2026. |

The SQLite build (`cropguide.sqlite`) stays local: the publish channel used
here is text-only. The full dataset in this folder (per-crop batch files plus
`merged.jsonl`) is the complete published form.
