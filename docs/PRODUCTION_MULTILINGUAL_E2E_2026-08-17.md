# Published Multilingual Browser E2E — 17 August 2026

## Test scope

The published CropGuide AI application was tested on the Arabic interface through the same browser controls available to a field user: gallery file picker, extended crop selector, analysis action, result screen, and visitor archive. This was an experimental product verification only; the olive-leaf image was used to test the newly available **citrus** record type and does not establish crop diagnosis accuracy.

| Step | Evidence | Outcome |
|---|---|---|
| Existing PWA session | The production session adopted the Arabic interface after the versioned service-worker release. | Passed |
| Gallery upload | A JPEG leaf file was selected using the Arabic gallery/file-picker interface. | Passed |
| Client preparation | The scan page reported a clear image, preserved a constrained 1600 px working image, and showed the localized preparation guidance before submission. The image-preparation unit tests also passed. | Passed |
| Extended type selection | The Arabic crop selector displayed and selected **حمضيات**. | Passed |
| Analysis request | The user-facing **ابدأ الفحص الميداني** action completed successfully. | Passed |
| Arabic result | Production result **#240001** rendered as **ملاحظة حمضيات** with the experimental-only warning, plant suggestions, and no-health-candidates state. | Passed |
| Arabic archive | The same session's archive listed #240001 with the **حمضيات** label, thumbnail, localized timestamp, and health state. | Passed |

## Privacy and interpretation

The request created an anonymous visitor-scoped record and no GPS location was attached. Provider access values were not displayed during verification; the server-side redaction regression test and a safe live response check both confirmed their absence from retained result data.

> Plant.id outputs and CropGuide’s client-side image preparation are **experimental support tools**. They do not determine disease, crop identity, treatment, or pesticide use on their own.
