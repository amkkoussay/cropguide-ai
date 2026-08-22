# Olive Second-Opinion Research — 17 August 2026

The project needs a second opinion only when Plant.id successfully identifies the plant but returns no reliable health candidate. The second opinion must remain an uncertainty-aware screening aid, not a treatment recommendation or a claimed diagnosis.

| Finding | Relevance | Source |
|---|---|---|
| A peer-reviewed olive-leaf classification study reports a 3,400-image dataset with healthy, *Aculus olearius*, and peacock-spot categories. | It supports the feasibility of a focused olive visual classifier, but does not by itself provide a production-ready, field-validated API. | [PMC article](https://pmc.ncbi.nlm.nih.gov/articles/PMC9357740/) |
| A public GitHub repository provides the related 3,400-image olive-leaf dataset. | It could support a future purpose-built model after licence, data-split, Tunisian field validation, and bias review. It is not appropriate to present as an immediately validated diagnostic engine. | [sinanuguz/CNN_olive_dataset](https://github.com/sinanuguz/CNN_olive_dataset) |
| Roboflow Universe exposes community olive-disease datasets and hosted workflow options. | These are potential technical routes, but their class definitions, licensing, and field validity must be audited before use. | [Roboflow olive leaf diseases dataset](https://universe.roboflow.com/hahmedai-whou6/olive-s-leaf-diseases) |

The pragmatic near-term candidate is a constrained visual second opinion that returns only a limited evidence category such as **possible circular leaf-spot pattern**, **other visible leaf damage**, or **insufficient visual evidence**. It must cite that it is not a confirmed diagnosis and must not recommend pesticide use.

The open scientific review describes olive leaf spot (*Venturia oleaginea*, also called peacock’s eye) as circular brown-green upper-surface spots that may develop olive-green, grey, or dark-brown concentric rings; it also notes that diagnosis can be difficult for early and latent symptoms. The user-provided photo visibly contains many circular, layered lesions, so this pattern is suitable for a **possible leaf-spot pattern** screen but not for a confirmed disease label. [Frontiers review](https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2022.1061136/full)

The referenced dataset repository confirms 3,400 images and exactly three study classes: healthy, *Aculus olearius*, and olive peacock spot. Its narrow location, season, and class set mean a model trained from it would require licensing and field validation before being used as a general production diagnosis for Tunisian orchards. [Dataset repository](https://github.com/sinanuguz/CNN_olive_dataset)
