# Ordinary Field Photo Analysis — Technical Notes

CropGuide already asks Plant.id for a complete health assessment using `health=all`. Plant.id v3 documents that `images` is a required list that may contain **one or more** Base64-encoded images of the same plant. Its health block can include an `is_healthy` prediction, disease suggestions, and a follow-up question; an empty suggestion list therefore must remain inconclusive rather than be shown as healthy. [1]

This supports a conservative mobile strategy for ordinary field photos: preserve a normalized full-frame image, then attach one or two automatically derived detail crops of the **same photographed plant**. The app must not manufacture lesions, erase background semantics, or label a condition without a provider signal. Detail crops should only enlarge already-present pixels and retain the full-frame original for context.

Olive leaf spot (*Venturia oleaginea*, also called peacock’s-eye disease) commonly presents as circular green-brown to dark-brown leaf spots which may develop concentric rings and yellow halos. The appearance in one image is not sufficient to establish a diagnosis because field-image symptoms overlap. [2]

## Sources

[1] [Plant.id v3 API documentation — images and health assessment](https://documenter.getpostman.com/view/24599534/2s93z5A4v2)

[2] [Buonaurio et al., *Olive leaf spot caused by Venturia oleaginea: An updated review*, Frontiers in Plant Science](https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2022.1061136/full)
