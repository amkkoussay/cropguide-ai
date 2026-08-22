# Ordinary Field Photo Pipeline QA — 17 August 2026

## Scope

This verification used the user-provided olive-leaf image containing visible circular lesions, without manual cropping, retouching, or background removal. The purpose was to verify the strengthened automatic pipeline—not to claim a medical or agricultural diagnosis.

| Check | Observed result |
|---|---|
| Client preparation | The Arabic scan card automatically produced a normalized **516 × 387** JPEG of **42 KB** from the ordinary source photo. |
| Analysis inputs | The provider response recorded **two input image URLs**: the complete normalized frame and one automatically selected detail crop. |
| Plant identification | The saved development scan **#360001** returned *Olea europaea* at **97%**. |
| Health assessment | The provider returned no reliable disease candidate even after the additional detail image. The UI now states this directly as an inconclusive disease assessment. |
| Regression suite | **26/26** Vitest tests passed, including payload normalization, automatic detail-crop selection, offline forwarding, and localized inconclusive-state copy. |

## Interpretation

The pipeline now accepts an ordinary field photo and automatically preserves the complete visual context while supplying a pixel-derived close detail to Plant.id. It improves the evidence available to the provider without inventing leaf features, hard-coding a disease label, or requiring the user to manually prepare the photo.

The test also establishes a limitation: Plant.id v3 may still return no health candidate for an image that visually appears diseased. In that case CropGuide must present an **inconclusive disease assessment**, not call the tree healthy and not invent a diagnosis.

> Automatic normalization and an extra detail crop can improve input quality and context, but they cannot guarantee disease-model coverage or replace an agronomist’s confirmation.

## Published-release observation

Immediately after the first deployment checkpoint, the public Arabic page still displayed the prior upload wording. Browser inspection showed an active `cropguide-shell-v4` service-worker cache registered with the earlier `release=20260817-multilingual` script URL. Published ordinary-photo QA remains blocked until the service worker reliably adopts the current release.

After the v5 worker-release deployment, the public domain returned a **500 Server Error** twice. Production log retrieval also reported that the active cloud service was not found. This must be resolved before treating the ordinary-photo release as production-verified.

After the deployment retry window, the published Arabic scan page recovered and displayed the current wording: **"ارفع صورة عادية من المعرض أو الملفات. يجهّزها CropGuide تلقائياً للتحليل."** The page also showed the new three-step automatic-normalization guidance. The remaining check is a complete uploaded ordinary-photo scan and active-worker inspection on the recovered release.

The recovered published page exposes the gallery input (`leaf-photo`) for JPEG, PNG, and WebP uploads. This confirms that the normal file-based field flow remains present after the PWA update.

The unedited lesion image was then uploaded successfully on the recovered public Arabic page. Before submission, the visible local preparation metadata was **516 × 387 / 42 KB**. The page’s current content had adopted the ordinary-photo release, but its active controller still reported the older multilingual worker URL. The final PWA check therefore includes upgrading that controller as well as completing the scan.

An explicit registration update then activated `sw.js?release=20260817-ordinary-photo` in the published browser. The ordinary-image metadata remained visible after this transition. The analysis-button element index changed during the worker-driven refresh, so submission is being retried using the current rendered control rather than a stale automation index.

The published analysis was saved as scan **#390001**, but its lazy-loaded result route failed to fetch `ObservationResult-C4qOJFgu.js`. This is a release-asset consistency issue, not a failed analysis. The worker must avoid serving an old application shell that references a removed hashed JavaScript module during or after a deployment.

The post-fix public page recovered with the current ordinary-photo copy, but initially reported the preceding ordinary-photo worker as active. The v6 worker is therefore being explicitly registered in the existing session before the final E2E scan; merely loading a new HTML shell is not accepted as sufficient PWA-adoption evidence.

The v6 registration completed with `sw.js?release=20260817-ordinary-photo-assets` as the active worker. Its controller-change reload briefly reset the page execution context, which is expected for release adoption; the upload verification resumes after the refreshed page becomes available.

After reopening the public URL, the Arabic page was stable and displayed the current ordinary-photo workflow copy. The final verification now checks the worker identity in this refreshed context, then repeats upload, automatic preparation, analysis, result rendering, and archive persistence.

Directly fetching `sw.js?release=20260817-ordinary-photo-assets` with `cache: "no-store"` still returned `cropguide-shell-v5`. The deployment’s static-serving layer is therefore caching the worker script itself despite the query string. The final PWA fix must apply no-cache headers specifically to `/sw.js`, so the browser can actually obtain and activate v6.

The uniquely named `sw-ordinary-photo-v7.js` was also unavailable with the expected v7 source immediately after deployment, while the preceding worker remained active. This points to deployment asset propagation rather than a client registration error. The final verification waits for the deployed static asset to become available before attempting activation again.

After the deployment completed, the public `sw-ordinary-photo-v7.js` response returned JavaScript containing `cropguide-shell-v7`, and the browser successfully activated that unique worker. This confirms the new worker can bypass the stale `sw.js` edge response; full upload-to-result verification continues in the same published session.

In the published Arabic session controlled by v7, the unedited user-supplied olive image displayed the automatic-preparation state **«جُهزت على الجهاز · 516 × 387 · 42 KB»** before submission. This confirms that the ordinary field-photo path is visible, local, and active without requiring cropping or other user-side preparation.

The same published session completed scan **#420001** and rendered its lazy-loaded Arabic result page successfully. Plant.id received two input image URLs (the normalized full image plus the automatic detail crop), identified *Olea europaea* at **97%**, and returned no reliable disease candidate. CropGuide displayed the explicit localized **inconclusive disease assessment** instead of calling the tree healthy or inventing a diagnosis. No missing JavaScript-chunk failure occurred.

Opening the Arabic archive from the same result showed **زيتون — فحص #420001** as the first saved record, with the localized no-health-signal status. The published trace is therefore complete: **ordinary source image → 516 × 387 / 42 KB local preparation → two provider inputs → result #420001 → archive #420001**.

## Existing-session update verification

The historical `/sw.js?release=20260817-ordinary-photo-assets` path now serves the v6 worker source, while the published application shell returns `Cache-Control: no-cache, no-store, must-revalidate`. An online session using a prior shell therefore obtains the current HTML on navigation; the current main bundle registers the uniquely named v7 worker with `updateViaCache: "none"` and requests an update. This complements the v7 activation and the successful #420001 lazy-route result verification above.

The hosting edge retains a `public, max-age=14400` header on the legacy worker response, so the v7 unique-path registration is intentionally preserved as a rollout escape hatch rather than relying on the legacy route alone.

## v9 dynamic-worker verification

The v9 dynamic endpoint was published successfully at `/api/cropguide-worker`: it returned `cropguide-shell-v9`, JavaScript content, `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`, `CDN-Cache-Control: no-store`, `Surrogate-Control: no-store`, and `Service-Worker-Allowed: /`.

An existing browser session initially remained controlled by v7. The v9 registration appeared with an `/api/` scope rather than the required root scope, so it could not replace the root-controlled worker. Root scope is now requested explicitly before the legacy-session criterion is completed.

After publishing the root-scope registration, the same browser session that was previously controlled by v7 opened the current Arabic page without any manual worker registration. It briefly entered a controller-change reload, then returned to the page with `cg_release=20260817-ordinary-photo-api-worker-v9` appended automatically. The final check now confirms that the root controller is v9.

The final browser inspection confirmed that both `navigator.serviceWorker.controller` and the active root-scoped registration are `/api/cropguide-worker?release=20260817-ordinary-photo-api-worker-v9`, with scope `/`. This proves an existing v7-controlled session upgraded automatically to v9 after navigating online to the current app, without a manual registration action.
