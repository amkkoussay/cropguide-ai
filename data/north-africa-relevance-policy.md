# North-African Geographic Relevance Policy

## Purpose

CropGuide AI serves a field workflow in North Africa, but geographic context must never be confused with a diagnosis or a country-level occurrence claim. This policy therefore stores **North Africa as an operational context** for a record while keeping disease presence **unassessed** until a separate, organism-specific, country-specific source has been reviewed.

The reference context covers Algeria, Egypt, Libya, Morocco, and Tunisia. These countries are members of the Near East and North Africa Plant Protection Organization (NEPPO), an IPPC-recognised regional organisation whose functions include obtaining and sharing information on pest existence, outbreaks, and spread.[1]

| Dataset field | Current value | Interpretation | Ranking effect |
|---|---|---|---|
| `regionId` | `north-africa` | Operational region for language, scouting, and future validation | None |
| `regionalRelevanceStatus` | `contextual_only` | CropGuide supports use in this region; it is not a distribution assertion | None |
| `diseasePresenceStatus` | `not_assessed_per_record` | No per-record country-presence conclusion has been inferred | None |
| `countryPresence` | Omitted | Added only after a separately traced organism-and-country review | None until human approval |

## Evidence Boundary

The EPPO Global Database provides pest-specific information, including geographical distribution, host plants, categorisation, reporting articles, and supporting standards.[2] Its country reporting pages are useful discovery and monitoring inputs, but an entry on a page is not automatically copied into CropGuide as a current country-presence label. Reporting records are dated and can include first reports, updates, absence statements, surveys, or regulatory information. Tunisia's and Morocco's pages, for example, include both first reports and explicit absence/update entries.[3] [4]

> **Rule:** a missing report is never evidence of absence. An explicit absence or presence statement must be stored with its source URL, publication date, organism identity, country, and human review decision.

This restraint aligns with regional plant-health practice: NEPPO describes information exchange on outbreaks and spread as a regional function, while FAO's Near East and North Africa strategy emphasises cross-border cooperation and early warning rather than static assumptions.[1] [5]

## Future Promotion Path

An individual disease record may be promoted from `contextual_only` to `country_confirmed`, `country_historic`, or `country_explicitly_absent` only after a reviewer has preserved the organism–country–source relationship. A country label must not raise an image-match confidence score; it may only provide a clearly labelled context note after the visual and field-evidence workflow has already produced a tentative candidate.

## References

[1]: https://www.ippc.int/en/ippc-community/regional-plant-protection-organizations/neppo/ "IPPC — Near East and North Africa Plant Protection Organization"
[2]: https://gd.eppo.int/ "EPPO Global Database"
[3]: https://gd.eppo.int/country/TN/reporting "EPPO Global Database — Tunisia reporting articles"
[4]: https://gd.eppo.int/country/MA/reporting "EPPO Global Database — Morocco reporting articles"
[5]: https://www.fao.org/neareast/multimedia/videos/details/fao-near-east-and-north-africa-plant-health-strategy/en "FAO Near East and North Africa Plant Health Strategy"
