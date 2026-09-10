# CropGuide AI

## Version 0.3

This release adds a larger plant data set and better symptom matching.

## What is new

- Added data for 40 crops.
- Added disease records and source links.
- Added common symptom groups and match rules.
- Added AI data files and a knowledge graph.
- Added source review tools.
- Added an olive photo result example.

## Run it

You need Node.js 22 or newer, pnpm, and Python 3.

```bash
pnpm install
pnpm dev
```

For a production build:

```bash
pnpm build
pnpm start
```

## Important limit

The app shows possible results from visible signs. It cannot confirm a disease from a photo alone. Do not use it as treatment advice. Ask an agriculture expert before making treatment decisions.

## License

MIT
