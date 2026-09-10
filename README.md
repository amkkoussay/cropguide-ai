# CropGuide AI

## Version 0.8

This release clarifies result limits and improves how general signs are grouped.

## What is new

- Added clearer limits for internal software scores.
- Improved grouping for common signs like brown spots and yellow halos.
- Added logic to stop ranking if only general signs are found without distinct features.
- Improved Plant.id crop selection by checking the top 10 suggestions.
- Added notes about request limits and data exports.
- Clarified that benchmark templates are for future use.

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

The app shows a range for visual evidence. Numerical scores are internal software limits, not a diagnosis. Do not use it as treatment advice. Ask an agriculture expert before making treatment decisions.

## License

MIT
