# CropGuide Evidence Review Queue

## Review rule

No disease name, symptom set, field check, or management text changes automatically after a scheduled run. A reviewer must verify a crop-specific source, record the decision below, rebuild `data/cropguide.sqlite`, and rerun the data checks before publication.

## Open review work

| Priority | Scope | Required review | Status |
|---|---|---|---|
| High | Every `source_mapped` record | Attach or replace the crop-group link with a crop-and-disease-specific university, extension, or official plant-health source. | Open |
| High | Any source link marked unavailable by a monthly run | Check whether the source moved, is temporarily unavailable, or needs a reviewed replacement. | Open |
| Medium | Treatment language | Confirm that it remains general, label-directed, and appropriate for Tunisia before publishing a revision. | Open |

## Decision log

Add approved changes below with the date, reviewer, source URL, affected record IDs, and a brief reason. Keep rejected proposals here too, marked as rejected, to avoid reintroducing them later.
