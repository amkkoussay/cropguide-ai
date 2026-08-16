# CropGuide AI — Concept Proposal

> **Project status:** Concept / proposal. This repository currently contains a product concept and technical direction only; it does not contain an implemented application, trained model, mobile client, API, or field-tested diagnostic workflow.

## Overview

CropGuide AI is a proposed agricultural decision-support concept for Tunisian farmers and field advisors. The idea is to explore how a phone image of an affected leaf or fruit could be combined with local weather and soil context to provide a probabilistic crop-health assessment and practical follow-up guidance.

This repository is intentionally a starting point for requirements discovery and systems design. It should not be presented as a shipped product or as an operational plant-disease diagnosis service.

## The problem to explore

Farmers may have limited access to agricultural extension services and may respond to crop symptoms without enough information. A carefully designed decision-support tool could help structure observations, surface possible explanations, and encourage appropriate consultation rather than promote blind treatment.

The concept is relevant to olive, cereal, and vegetable production in Tunisia, but the scope, data requirements, model performance, and field value still need to be validated with agricultural specialists and farmers.

## Proposed user workflow

The future product concept would allow a user to submit a photo of an affected plant part and provide contextual information such as crop type, location, recent weather, and soil conditions. A future implementation could then return:

- A ranked list of possible conditions with uncertainty clearly displayed.
- A request for additional images or information when the input is not reliable enough.
- Non-prescriptive guidance for observation, prevention, and consultation.
- Links to local agricultural extension resources.

Any recommendation would need to remain advisory and probabilistic. The system should not encourage pesticide use without appropriate local and professional guidance.

## Proposed technical direction

The following technologies are hypotheses for a future proof of concept, not technologies currently implemented in this repository:

- Image classification using a carefully curated and licensed dataset.
- Transfer learning with a model such as EfficientNet or a comparable mobile-friendly architecture.
- A rule-based context layer for weather, soil, crop stage, and local agronomy guidance.
- A lightweight API and mobile interface, potentially using Python with TensorFlow Lite and Flutter or React Native.
- Offline-first behaviour for basic image processing where the data and model quality justify it.

## Data, validation, and safety requirements

A credible implementation would require representative images collected under varied lighting, cultivars, growth stages, and disease conditions. It would also require documented data provenance, expert-labelled evaluation sets, bias analysis, calibration of confidence scores, and field testing with qualified agricultural professionals.

The proposed tool would not replace an agricultural engineer. It would need a clear notice that automated outputs are uncertain and should be checked by a specialist, especially before any treatment decision. No claim of accuracy, agronomic efficacy, environmental benefit, or regulatory approval is made by this concept repository.

## Suggested next steps

The next stage should be requirements interviews with farmers and agricultural advisors, followed by a small feasibility study using a properly licensed dataset. Only after that should a baseline model, evaluation protocol, and narrow prototype be built. Field testing in regions such as Sfax or Kairouan would be considered only after the safety, data, and governance prerequisites are defined.

## What is currently in this repository

At present, this repository contains this concept document only. There are no source-code modules, trained weights, datasets, deployment files, mobile screens, or production integrations included yet.

## License and attribution

Any future dataset, image, model, or library must be credited according to its original license. Potential references include the [PlantVillage Dataset](https://plantvillage.psu.edu/) and [TensorFlow Lite examples](https://www.tensorflow.org/lite/examples); neither reference implies that this repository currently uses or integrates those resources.
