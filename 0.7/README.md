# CropGuide AI

## Version 0.7

This release adds benchmarking tools and better image checks.

## What is new

- Added a benchmark protocol for performance testing.
- Added a CSV template for recording benchmark results.
- Added server-side image size and structure checks.
- Added short retry logic for vision service issues.
- Improved how similar general signs are grouped.

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
