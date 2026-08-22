# Plant.id v3 request notes

The provider documentation states that `images` in a JSON identification request must be a list of either raw Base64-encoded image strings or public image URLs. Browser data-URL prefixes must therefore be removed before forwarding image bytes.

The same documentation defines `custom_id` as an optional **integer**. CropGuide records the orchard species as a string in its own observation record, so it must not forward that value through `custom_id`.

## Sources

- [Plant.id v3 Postman documentation](https://documenter.getpostman.com/view/24599534/2s93z5A4v2)
- [Official Plant.id example clients](https://github.com/flowerchecker/plant-id-examples)

Checked: 17 August 2026.
