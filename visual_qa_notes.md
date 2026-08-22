# Visual QA Notes

## 2026-08-16 — Scan page

Desktop review at 1280 × 720 confirmed the calm, organic layout: the sidebar remains readable, the hero establishes the field-scanning purpose, and the scan form, species control, GPS capture, and experimental-only language are visually prominent.

Mobile review at 390 × 844 confirmed that the camera flow and primary action are legible and reachable. The review also revealed pressure at the right edge of the scan form, chiefly around the photo area and GPS row. The responsive stylesheet was immediately tightened with explicit shrink constraints, full-width photo containment, and a grid-based disclaimer so the scan form remains within the mobile viewport.

The archive empty state renders clearly. Google Maps failed to load in the local preview, so the orchard view now falls back automatically to a private coordinate plot that maintains relative pin positions and exact stored GPS coordinates rather than leaving a blank map panel.
