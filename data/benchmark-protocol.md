# CropGuide AI: independent benchmark protocol

This file is a plan, not a results report. It exists because a retrieval score and passing unit tests do not show diagnostic accuracy.

## Purpose

Evaluate the whole application on images that were not used to write the symptom profiles, rules, prompts, or tests. The aim is to measure safe behaviour as well as disease retrieval.

## Data to collect

Use one row per image in `benchmark-template.csv`. Keep the original image outside Git when it has field or personal data. Record a stable image ID, crop, reference label, label method, region, season, symptom stage, and whether the frame is healthy, non-plant, multi-subject, or uncertain.

Reference labels should come from an appropriate independent source, such as a plant-pathology review, laboratory result, or documented expert diagnosis. A filename, a model output, or the app's own result is not a reference label.

## Split before tuning

Freeze a test set before changing prompts, rules, thresholds, or symptom profiles. Keep the test images separated by field or farm when possible so near-duplicate leaves do not appear in both development and test data.

## Measures to report

Report crop top-1 and top-3 retrieval, disease top-1 and top-3 retrieval only for images with a valid disease reference, abstention rate, false-positive disease suggestions on healthy/non-plant images, and the rate of correct field-confirmation requests. Break results down by crop and image condition. Include counts and confidence intervals where sample size supports them.

Do not translate the internal `evidenceScore` into disease probability unless an independent calibration study has been designed, frozen, and completed.

## Review rules

Write the planned metrics before seeing the held-out results. Preserve failed cases. Have a domain reviewer inspect label disagreements and possible data leakage. Publish limitations, class imbalance, and the exact application version.
