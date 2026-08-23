# CropGuide AI

## Version 0.2

CropGuide AI is a small web app for a first check of plant health from a photo.

## What is new

- Added support for seven crops: olive, almond, pomegranate, fig, grapevine, tomato, and potato.
- Added crop checks with Plant.id.
- Added checks for visible plant signs.
- Added local disease data and result matching.
- Added Arabic, French, and English support.
- Added short care and safety notes.

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

The server needs a `PLANT_ID_API_KEY`. Do not commit API keys or `.env` files.

## Important limit

The app gives possible results from visible signs. It cannot confirm a disease from a photo alone. Do not use it as treatment advice. Ask an agriculture expert before making treatment decisions.

## Release history

| Version | Notes |
|---|---|
| 0.1 | First working web app with photo checks and plant results. |
| 0.2 | Added seven crops, crop checks, visible sign checks, and three languages. |
