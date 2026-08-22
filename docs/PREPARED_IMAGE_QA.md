# Prepared Image UI Verification

## Current-bundle precondition

After removing only the local development PWA registration and cache, the Arabic scan page loaded the current bundle. It showed the Arabic file-picker guidance and the extended localized crop list, including **حمضيات**، **كروم العنب**، **نخيل التمر**، و**فواكه نَوَوية**. The next verification step is to select a file through the current browser file picker and record the non-sensitive prepared dimensions and compressed size displayed by the application.

The current file-picker control accepted `5Gzms2RMLSYV.jpg` and the application rendered its preview in the Arabic scan card. The prepared-image metadata sits below the current mobile viewport and is being checked next; no image content or provider payload is recorded in this note.

The scan card rendered the localized prepared-image indicator before submission: **"جُهّزت على الجهاز"**, **1280 × 744**, and **79 KB**. This is the compressed in-browser output metadata surfaced by CropGuide; it contains no image pixels, GPS value, provider payload, or credential. The image is therefore visibly prepared before the user activates the analysis action.

## Current-build file-picker confirmation

The current Arabic development build was exercised through its actual file-input change handler using a generated 2000 × 1500 JPEG test file in the browser session. Before the analysis action was activated, the scan card rendered the localized **"جُهّزت على الجهاز"** indicator with a prepared output of **1800 × 1350** and **111 KB**. This confirms that the visible size value now comes from the same local preparation path as the dimensions, rather than from image content or provider data.
