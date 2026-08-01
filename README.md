# CropGuide AI

## Summary

An AI application that diagnoses plant diseases (olive trees, cereals, vegetables) from a phone photo of an affected leaf, and provides instant treatment, irrigation, and fertilization recommendations based on local weather and soil conditions in Tunisia.

---

## Background

**The problem:** Tunisian farmers often don't have easy access to a nearby agricultural engineer, so they resort to using pesticides at random, leading to financial losses and environmental pollution.

**Scale of the problem:** Agriculture represents 12% of Tunisia's GDP. Diseases such as olive fruit fly and powdery mildew affect thousands of hectares every year.

**Personal motivation:** Tunisia is an agricultural country, and most families depend directly or indirectly on olives and cereals. Helping farmers means stronger food security and a stronger local economy.

**Why it matters:** Reducing crop loss by 30% could save millions of Tunisian dinars annually across the sector.

---

## How to Use It

**Who uses it:** Tunisian farmers (individuals or small agricultural cooperatives), as well as field agricultural advisors who can use it as a quick support tool.

**Context of use:** Olive, cereal, and vegetable fields, especially in rural areas far from agricultural extension centers.

**Workflow:**
1. The farmer takes a photo of the affected leaf or fruit with their phone.
2. The application displays:
   - The likely disease name (e.g., olive leaf spot).
   - A confidence score (%).
   - A recommended treatment (pesticide or natural method).
   - A reminder for irrigation and fertilization timing based on local weather.
3. The app works offline (lightweight embedded model) for basic diagnosis, and only needs internet access for weather updates.

---

## Data Sources and AI Techniques

**Data required:**
- A dataset of healthy and diseased olive/wheat/tomato leaf images (from Tunisian agricultural research institutes such as INRAT).
- Weather data from Tunisian meteorological stations.
- Soil maps from the Ministry of Agriculture.

**Suitable techniques:**
- **CNN** (Convolutional Neural Network) for image classification.
- **Transfer Learning** using a pretrained model such as ResNet or EfficientNet to reduce the need for massive amounts of data.
- A **rule-based recommendation system** or decision tree to link diagnosis to treatment, irrigation, and fertilization advice.

---

## Challenges

**What the project does not solve:**
- The app is not a replacement for a qualified agricultural engineer, especially in complex or unusual cases.
- It does not guarantee 100% diagnostic accuracy, particularly for rare or visually similar diseases.

**Constraints:**
- Data quality: difficulty obtaining diverse images for every disease under different lighting conditions.
- Dialect: the app needs to support Tunisian Arabic (Derja) to make it accessible to farmers who may not be comfortable with standard Arabic or French.
- Connectivity: poor internet coverage in some rural areas requires the core model to run offline.

**Ethics:**
- The app must include a clear warning that the diagnosis is automated and probabilistic, not final, and is not a substitute for consulting a specialist when in doubt.

---

## Next Steps

1. Partner with **INRAT** and the Ministry of Agriculture to obtain reliable data.
2. Build an initial MVP using **Python** and **TensorFlow**.
3. Develop a simple mobile interface (**Flutter** or **React Native**).
4. Run a field test with real farmers in regions such as Sfax or Kairouan.
5. Later expand the app to cover livestock and poultry disease diagnosis.

---

## Acknowledgements

Inspired by open projects and resources, including:
- [PlantVillage Dataset](https://plantvillage.psu.edu/)
- [TensorFlow Lite examples](https://www.tensorflow.org/lite/examples)

Any library, dataset, or image used going forward will be credited with its original license explicitly.
