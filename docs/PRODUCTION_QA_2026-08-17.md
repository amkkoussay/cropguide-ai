# Production QA Record — 17 August 2026

## Scope

This verification covered the public CropGuide AI Field Assistant at `https://cropguideai-vzxcd2cz.manus.space/`. Tests were run in a browser session without a mandatory sign-in flow. Image analysis used a gallery-uploaded olive-leaf photograph; the test record only stores the generated observation references and no private device location.

| Area | Evidence | Result |
|---|---|---|
| Plant.id request contract | The server now sends raw Base64 in `images` and omits the incompatible string `custom_id`. | Passed |
| Public analysis | A gallery image created **scan #60001** and completed with *Olea europaea* as the top suggestion at **80%**. | Passed |
| Result page | The completed observation rendered plant suggestions, the experimental-only notice, and no-health-candidates state. | Passed |
| Visitor archive | **Scan #60001** appeared in the anonymous visitor archive with thumbnail and timestamp. | Passed |
| GPS unavailable behavior | A browser session without location access continued after the short safe timeout and completed analysis. | Passed |
| GPS map behavior | A test-only coordinate (36.8065, 10.1815) produced **scan #90001**; the result showed “GPS attached,” and the map displayed one geotagged record with an `olive: field scan` marker. | Passed |
| Offline queue state | IndexedDB store `cropguide-offline/queued-scans` returned an empty list after the successful production flow. | Passed |
| Automated tests | Vitest completed with **6 files** and **12 tests** passing, including Plant.id payload, GPS timeout, offline-queue decision, and archive-health-label coverage. | Passed |

## Interpretation

The former production failure was caused by an invalid Plant.id v3 request shape: CropGuide sent the selected tree species as a string `custom_id`, while the provider accepts only an integer for that optional field. CropGuide keeps the species in its own observation record and now omits `custom_id` from the provider request. The production result confirms that the corrected request is accepted.

> Plant.id results remain **experimental only**. A returned image assessment is an observation aid, not a diagnosis or a stand-alone treatment or pesticide recommendation.

## Regression safeguards

The request payload, client-side GPS timeout, queue discard decision, and archive status label are covered by the test suite. The archive now reports **“no health signal returned”** when a completed provider response contains no health candidates, rather than incorrectly suggesting that the analysis is still pending.

## PWA update verification

After deployment of the versioned, network-first service worker, the same browser session reloaded the published archive and changed from the older **“assessment pending”** copy to **“no health signal returned”** for scans #90001, #60001, and #30001. This confirms that deployed application assets now update rather than remaining pinned to the older cache-first bundle.

## References

[1]: https://documenter.getpostman.com/view/24599534/2s93z5A4v2 "Plant.id API v3 documentation"
