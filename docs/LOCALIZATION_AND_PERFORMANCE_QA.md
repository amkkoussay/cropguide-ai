# Localization and mobile performance QA

## Local verification

The development build was reviewed at a **390 × 844** mobile viewport using direct language links.

| Check | Evidence | Result |
|---|---|---|
| Arabic scan screen | `/?lang=ar` renders Arabic copy, a right-to-left form, the language selector, and the experimental-only warning without horizontal overflow. | Passed |
| Arabic archive | `/history?lang=ar` renders within the viewport after RTL was scoped to the CropGuide shell rather than the browser document. | Passed |
| Arabic result fallback | `/results/90001?lang=ar` renders the Arabic missing-observation fallback within the viewport when that visitor record is not available locally. | Passed |
| French scan and map | `/?lang=fr` and `/map?lang=fr` render French navigation and field copy. | Passed |
| Direct locale links | `?lang=ar` and `?lang=fr` take precedence over a stored language preference; invalid links safely fall back to the stored locale or English. | Covered by tests |
| Regression suite | Vitest completed **9 files / 19 tests**, including translations, image preparation, species labels, offline queue, Plant.id request contract, and PWA cache policy. | Passed |
| Production build | The archive, map, result, and not-found routes build as deferred chunks. | Passed |

## Performance implementation

The scan route remains the initial working surface; archive, map, result, and not-found routes now load only when visited. Browser-side image preparation applies conservative canvas normalization—dimension reduction, orientation-safe rendering, and modest brightness/contrast correction—before upload. It does **not** generate missing visual detail or alter the biological content of a leaf.

> CropGuide remains experimental only. Image preprocessing improves upload consistency and visual legibility; it cannot validate a diagnosis or substitute for agronomic examination.

## Extended-species live contract verification

A live request using a 768 × 1024 JPEG citrus-leaf image was submitted through the same public tRPC analysis contract used by the browser. The request used `species: "citrus"`, a new CropGuide field type, and a test-only Tunisia coordinate. It completed successfully as **observation #150001**, with **Citrus × aurantium** as the leading Plant.id suggestion at **88.33%**. The same visitor-scoped record was returned by both the `citrus` archive filter and the map-points endpoint with its coordinates intact.

## Provider-response hygiene

Provider credentials are now recursively removed from raw responses before the observation is stored. The existing records were remediated: a pre-cleanup check found six raw responses containing the top-level provider access field, and the post-cleanup check returned zero. The values themselves were not queried, displayed, or included in this record.

## French archive verification

After clearing only the outdated local PWA cache in the development browser session, the visitor-scoped citrus archive loaded with the current French bundle. The browser rendered **Agrumes**, **Archives terrain**, **Aucun signal de santé renvoyé**, French navigation labels, and localized date formatting for both saved citrus scans. This confirms that the direct `?lang=fr` preference is correctly honored by the current client bundle; the earlier English screen came from a stale pre-update PWA bundle.

The matching French map view loaded its Google map tiles and reported **2 analyses géolocalisées** for the same visitor-scoped citrus records. Its heading, navigation, count, and privacy text all rendered from the French message set.

The two Google Maps marker elements also exposed the user-facing title **“Agrumes: analyse terrain”**, confirming that the map receives the same localized citrus label as the archive.

The French archive filter was opened in the browser and exposed all localized values: **Olivier**, **Grenadier**, **Figuier**, **Amandier**, **Agrumes**, **Vigne**, **Palmier dattier**, **Fruits à noyau**, and **Je ne sais pas / Autre**. This confirms that the new citrus type and the other expanded species are selectable from the user-facing filter.
