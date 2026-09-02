# CropGuide AI

## Current release: 0.7

CropGuide AI is a web app for a first check of plant health from a photo.

The app checks the crop, reads visible signs, and shows possible diseases. It is not a final diagnosis.

## Releases

| Version | Folder | What changed |
|---|---|---|
| 0.1 | Repository root | Added the first working web app with photo checks and plant results. |
| 0.2 | Repository root | Added seven crops, crop checks, visible sign checks, and three languages. |
| 0.3 | `0.3/` | Added more crop data, symptom groups, source checks, and AI data files. |
| 0.4 | `0.4/` | Improved symptom details, result limits, source checks, and privacy notes. |
| 0.5 | `0.5/` | Improved result ranking, evidence ranges, and added validation notes. |
| 0.6 | `0.6/` | Improved handling for poor images, unknown signs, and added audit tracking. |
| 0.7 | `0.7/` | Added benchmarking tools, image size checks, and vision retry logic. |

## Run the current release

Open the release folder first:

```bash
cd 0.7
pnpm install
pnpm dev
```

For a production build:

```bash
pnpm build
pnpm start
```

## Important limit

The app gives possible results from visible signs. It cannot confirm a disease from a photo alone. Do not use it as treatment advice. Ask an agriculture expert before making treatment decisions.
