# CropGuide AI

## Version 0.5

This release improves how the app ranks diseases and shows results.

## What is new

- Improved how the app calculates evidence for each disease.
- Added descriptive ranges for visual signs (instead of just numbers).
- Improved logic for missing signs that distinguish between diseases.
- Added validation notes about project tests.
- Improved matching rules for better result ranking.

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

The app shows a range for visual evidence. This is not a diagnosis or a disease chance. Do not use it as treatment advice. Ask an agriculture expert before making treatment decisions.

## License

MIT
