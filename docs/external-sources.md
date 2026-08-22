# External integration notes

## Plant.id v3

CropGuide sends image data only from the server to the Plant.id v3 identification endpoint. The client never receives the API key. The request uses the `Api-Key` header and the `images` request field, with `health=all` requested for health-related output. Each `images` value is forwarded as a **raw Base64 string**; browser `data:image/...;base64,` prefixes are not accepted by the v3 provider example. The implementation preserves the complete provider response as observation metadata and exposes only a compact summary in the list and results views.

The selected orchard species is retained as a CropGuide field and sent as the request's `custom_id`; it is not presented to users as a provider-confirmed diagnosis. Plant.id output is **experimental only** in this project and must not be used alone to select treatment or pesticides.

## References

1. [Plant.id v3 API documentation](https://documenter.getpostman.com/view/24599534/2s93z5A4v2)
2. [Plant.id example repository](https://github.com/flowerchecker/plant-id-examples)
