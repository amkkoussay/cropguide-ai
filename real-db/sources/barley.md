# Barley sources — batch 2026-10-26

Every record in `batches/barley.jsonl` cites one actually-opened authoritative page about that exact disease on barley. No record rests on model memory or on a search snippet alone. EPPO codes are "" throughout — none of the opened pages showed one, and none was invented.

## Records and their sources

1. **Stripe rust** (`barley_stripe_rust`, Puccinia striiformis f. sp. hordei)
   - Source: Pacific Northwest Pest Management Handbooks, "Barley (Hordeum vulgare)-Stripe Rust"
   - URL: https://pnwhandbooks.org/plantdisease/host-disease/barley-hordeum-vulgare-stripe-rust
   - Used: obligate parasite P. striiformis f. sp. hordei; overwinters/oversummers on volunteer barley, rye, wild barleys, perennial grasses; wet mild winters with snow cover favour survival; linear orange-yellow pustules coalescing into stripes between veins; black spore stage as linear black pustules under the epidermis; cool wet weather favours explosive spread; resistant varieties and sowing-date cultural control; scouting from mid-tillering to flag-leaf emergence.

2. **Leaf rust** (`barley_leaf_rust`, Puccinia hordei)
   - Source: Pacific Northwest Pest Management Handbooks, "Barley (Hordeum vulgare)-Leaf Rust"
   - URL: https://pnwhandbooks.org/plantdisease/host-disease/barley-hordeum-vulgare-leaf-rust
   - Used: fungus Puccinia hordei (= P. anomala); round to oblong light orange-brown pustules on leaf sheaths and blades, later on heads of highly susceptible varieties; black telia as the crop ripens; promoted by moderate 59–71 °F temperatures and wet conditions; early-maturing varieties as cultural control; seed treatments may reduce seedling infections.

3. **Powdery mildew** (`barley_powdery_mildew`, Blumeria graminis f. sp. hordei)
   - Source: Field Crop Diseases Victoria (Agriculture Victoria), "Powdery Mildew of Barley"
   - URL: https://extensionaus.com.au/FieldCropDiseasesVic/docs/identification-management-of-field-crop-diseases-in-victoria/foliar-diseases-of-barley/powdery-mildew-of-barley/
   - Used: Blumeria graminis f. sp. hordei, obligate parasite of living barley plants, host-specific, does not infect wheat; first seen at tillering as small yellow spots, then white fluffy fungus spreading to all above-ground parts including the head; yellowing and early leaf death; small black specks in old infections near the base; infection needs high humidity from dew and 15–25 °C; symptoms 5–7 days after infection; carry-over via volunteers and grasses; volunteer removal, resistant varieties, avoiding excess nitrogen.
   - Note: the University of Delaware "Powdery Mildew on Small Grains" fact sheet was also opened but covers small grains generally, so the barley-specific Victorian page is the cited source.

4. **Net blotch** (`barley_net_blotch`, Pyrenophora teres)
   - Source: Pacific Northwest Pest Management Handbooks, "Barley (Hordeum vulgare)-Net Blotch"
   - URL: https://pnwhandbooks.org/plantdisease/host-disease/barley-hordeum-vulgare-net-blotch
   - Used: fungus Pyrenophora teres (asexual stage Drechslera teres); overwinters on barley residues, also seed-transmitted; infection favoured by long periods of high humidity/moisture; lesions start as small circular spots, enlarge into narrow dark-brown stripes across and down the leaf forming a distinct net-like pattern; stems, sheaths, kernels may be affected; pathogen-free seed, resistant varieties, ploughing under straw/stubble, rotation with non-susceptible crops for at least two seasons.

5. **Spot blotch** (`barley_spot_blotch`, Cochliobolus sativus)
   - Source: Montana State University Extension, "Fungal, Bacterial, and Physiological Leaf Diseases of Cereal Crops (wheat, durum, barley)"
   - URL: https://extension-store.montana.edu/montguides/fungal-bacterial-and-physiological-leaf-diseases-of-cereal-crops-wheat-durum-barley
   - Used (from the guide's "Net blotch, spot blotch, and scald diseases of barley" section, read in full): spot blotch (Bipolaris sorokiniana) causes round to oblong brown lesions surrounded by a chlorotic margin; glume blotch and shrivelling of seed; residue-borne, favoured by continuous barley cropping, minimum/no tillage and irrigation; crop rotation, variety selection, irrigation management, light tillage to reduce residue.
   - Note: no dedicated single-disease spot blotch page from an accepted source was found; the record uses Cochliobolus sativus (teleomorph of the Bipolaris sorokiniana named by the source) and states that relationship in its evidence.

6. **Scald** (`barley_scald`, Rhynchosporium commune)
   - Source: Field Crop Diseases Victoria (Agriculture Victoria), "Scald of Barley"
   - URL: https://extensionaus.com.au/FieldCropDiseasesVic/docs/identification-management-of-field-crop-diseases-in-victoria/foliar-diseases-of-barley/scald-of-barley/
   - Used: Rhynchosporium commune (formerly R. secalis); lesions on leaf blades and sheaths, starting water-soaked grey-green, turning straw-coloured with a brown margin, ovate to irregular; severe infections defoliate by coalescing lesions; survives summer/autumn on infected stubble; rain-splash dispersal; first seen in isolated patches at tillering/early stem elongation; rapid spread at 15–20 °C; most severe in above-average rainfall seasons; also seed-borne, survives on volunteers/barley grass; rotations avoiding consecutive barley, stubble/volunteer management, resistant varieties.

7. **Fusarium head blight** (`barley_fusarium_head_blight`, Fusarium graminearum)
   - Source: Montana State University Extension, "Fusarium Head Blight (scab) of Wheat and Barley"
   - URL: https://extension-store.montana.edu/montguides/fusarium-head-blight-scab-of-wheat-and-barley
   - Used: caused by Fusarium species, most commonly F. graminearum; overwinters on cereal stubble/corn residue; in barley starts as a discoloured lesion on the glume base and rachis spreading both ways along the spike; premature blight/bleaching of the head; salmon-pink to reddish mycelium on glume edges/spikelet bases in moist weather; infected kernels shrunken, greyish-brown towards the base; DON mycotoxin, zero tolerance for DON in malt barley; moist conditions at flowering favour infection; rotation to non-cereal, tillage incorporation of stubble, suspending irrigation before flowering until after anthesis, certified seed, removal of lightweight tombstone kernels.

8. **Barley yellow dwarf** (`barley_yellow_dwarf`, Barley yellow dwarf virus)
   - Source: Oklahoma State University Extension, "Barley Yellow Dwarf"
   - URL: https://extension.okstate.edu/programs/digital-diagnostics/plant-diseases/barley-yellow-dwarf?Forwared=entoweb.okstate.edu/ddd/diseases/byd.htm
   - Used: barley yellow dwarf virus; hosts wheat, barley, oats; transmitted by many aphid species, in Oklahoma mainly bird-cherry oat aphid (Rhopalosiphum padi) and greenbug (Schizaphis graminum); varying yellow, red and/or purple foliage, stronger toward leaf tips, in circular patches matching fall aphid infestations; red/purple replaced by chlorosis and necrosis as temperatures rise; fall-infected plants significantly shorter; tolerant varieties (none highly resistant), late planting reduces the fall aphid window.

9. **Loose smut** (`barley_loose_smut`, Ustilago nuda)
   - Source: University of Vermont Extension (Northwest Crops & Soils Program), "On the Lookout for Smut!"
   - URL: https://blog.uvm.edu/outcropn/2018/06/05/on-the-lookout-for-smut/
   - Used: loose smut of barley = U. nuda; diseased heads emerge slightly earlier than healthy ones as a mass of dark-brown spores covered by a paper-like membrane; membrane tears easily as healthy plants flower; windblown spores infect embryos of developing seed; fungus dormant in seed until planting, then grows with the new plant and produces smutted heads; infected plants otherwise normal; 100% of smutted heads lost; do not save seed, plant certified/disease-free seed, resistant varieties.

10. **Covered smut** (`barley_covered_smut`, Ustilago hordei)
    - Source: High Plains IPM (Bugwood wiki; compiled by Montana State University), "Covered Smut (barley)"
    - URL: https://wiki.bugwood.org/HPIPM:Covered_Smut_(barley)
    - Used: Ustilago hordei, one of the most common diseases of barley worldwide; infected plants normal until heading; smutted heads emerge at the same time or slightly later than healthy ones, sometimes trapped by the flag leaf sheath; kernels replaced by black smut sori covered by a grey membrane (the glume) usually intact until harvest/threshing; awns and floral bracts often remain intact; overwinters as teliospores on seed, germinating at 67–77 °F with low soil moisture to invade the coleoptile; seed treatment most effective, resistant cultivars.
    - Note for the Oct 30 merge: this is the weakest source in today's batch (a university-compiled IPM wiki page, not a standalone extension fact sheet). The PNW barley covered-smut page (https://pnwhandbooks.org/plantdisease/host-disease/barley-hordeum-vulgare-covered-smut, opened 2026-10-26 for corroboration) confirms the cause (U. hordei), overwintering on seed/soil, and the whitish/grey membrane symptom, but states infection is favoured by high soil moisture — the opposite moisture claim to the cited page — so the record's moisture wording follows its cited source only and should be re-checked at merge if the PNW page is preferred.
