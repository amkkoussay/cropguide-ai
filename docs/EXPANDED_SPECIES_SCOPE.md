# Expanded Field Species Scope

## Product decision

CropGuide will retain its orchard focus and expand the selectable field species from the original five options to the following eight crop groups plus an explicit fallback:

| Identifier | Display concept | Reason for inclusion |
|---|---|---|
| `olive` | Olive | Existing core crop. |
| `pomegranate` | Pomegranate | Existing core crop. |
| `fig` | Fig | Existing core crop. |
| `almond` | Almond | Existing core crop and a major Tunisian fruit-tree crop. |
| `citrus` | Citrus | A practical orchard group for orange, lemon, mandarin, and related leaves. |
| `grapevine` | Grapevine | A field-relevant vine crop with established Tunisian propagation activity. |
| `date_palm` | Date palm | A highly relevant oasis crop in Tunisia. |
| `stone_fruit` | Stone fruit | A practical group for peach, apricot, plum, and related orchard trees. |
| `unknown` | Not sure / Other | Keeps analysis accessible when the crop is uncertain or outside the current field list. |

The selector identifies the grower’s intended crop context only. Plant.id remains the independent image-analysis provider, and the experimental-only notice remains visible on all result paths.

## Image-preparation boundary

Client-side preparation will correct rotation, preserve aspect ratio, use high-quality downscaling, and produce an efficient JPEG suitable for upload. It will also perform lightweight brightness and sharpness checks to warn about images that are too dark, washed out, or likely blurred. It will **not** use generative enlargement, lesion synthesis, or semantic image editing, because such changes could alter evidence relevant to a crop-health observation.

## Field relevance

Tunisian fruit-tree certification data records large production and/or propagation activity across almond, fig, pomegranate, stone fruits, citrus, olive, and grapevine.[1] A peer-reviewed study also identifies date palm as an agronomically valuable crop in Tunisian oasis systems.[2]

## References

[1]: https://om.ciheam.org/ressources/om/pdf/b45/03001789.pdf "Certification of fruit trees in Tunisia — CIHEAM"

[2]: https://pmc.ncbi.nlm.nih.gov/articles/PMC9929592/ "Agro-morphological traits assessment of Tunisian male date palms — Saudi Journal of Biological Sciences"
