# CropGuide AI

## Version 0.6

This release improves how the app handles poor images and unknown signs.

## What is new

- Added checks to skip ranking for poor, healthy, or non-plant images.
- Added support for recording unknown visual signs.
- Added an audit remediation file to track assessment fixes.
- Improved logic for missing or internal signs.

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
