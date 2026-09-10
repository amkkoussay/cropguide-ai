# CropGuide AI

## Version 0.4

This release improves symptom details, result limits, and source checks.

## What is new

- Added more details about visible plant signs.
- Improved matching for similar diseases.
- Lowered or limited results when key signs are missing.
- Improved source checks and source details.
- Added clearer notes about limits and privacy.

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

The app shows possible results from visible signs. A score is not a diagnosis or a disease chance. Do not use it as treatment advice. Ask an agriculture expert before making treatment decisions.

## License

MIT
