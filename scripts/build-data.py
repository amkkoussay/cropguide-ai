import json
import sqlite3
from pathlib import Path

from catalog import CROPS as CATALOG_CROPS

ROOT = Path(__file__).resolve().parents[1]
DATABASE_PATH = ROOT / "data" / "cropguide.sqlite"
REAL_DB_PATH = ROOT / "real-db" / "merged.jsonl"

SAFETY = {
    "ar": "لا تستخدم مبيداً أو جرعة من التطبيق وحده. تحقق من ملصق منتج مسجل في تونس واتبع معدات الوقاية وفترة الأمان قبل الحصاد.",
    "fr": "N’utilisez ni pesticide ni dose sur la seule base de l’application. Vérifiez l’étiquette d’un produit homologué en Tunisie, les EPI et le délai avant récolte.",
    "en": "Do not use a pesticide or dose from this app alone. Verify a product registered in Tunisia, PPE, and the pre-harvest interval on its label.",
}

# The knowledge base is built ONLY from the verified, source-backed
# export in real-db/merged.jsonl (184 records across 18 crops).
# Template-generated catalog records were removed on 2026-11-20 by the
# owner's standing rule: only source-backed records ship.
#
# real-db marks its records "source_verified"; the database vocabulary
# calls the same state "reviewed", so the loader maps it.
REVIEW_STATUS_MAP = {"source_verified": "reviewed"}


def _localized(record, stem):
    return {
        "ar": record[f"{stem}_ar"],
        "fr": record[f"{stem}_fr"],
        "en": record[f"{stem}_en"],
    }


def load_real_records():
    records = []
    for line in REAL_DB_PATH.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        raw = json.loads(line)
        symptoms = raw["symptoms_json"]
        if isinstance(symptoms, str):
            symptoms = json.loads(symptoms)
        records.append({
            "id": raw["id"],
            "crop_id": raw["crop_id"],
            "scientific_name": raw["scientific_name"],
            "name": _localized(raw, "name"),
            "symptoms": symptoms,
            "evidence": _localized(raw, "evidence"),
            "field": _localized(raw, "field_check"),
            "immediate": _localized(raw, "immediate_care"),
            "conditional": _localized(raw, "conditional_care"),
            "safety": {
                "ar": raw.get("safety_ar") or SAFETY["ar"],
                "fr": raw.get("safety_fr") or SAFETY["fr"],
                "en": raw.get("safety_en") or SAFETY["en"],
            },
            "source": raw["source_url"],
            "source_scope": raw.get("source_scope", "record_specific"),
            "review_status": REVIEW_STATUS_MAP.get(
                raw.get("review_status"), raw.get("review_status", "reviewed")
            ),
        })
    return records


DISEASES = load_real_records()

_CROP_IDS_WITH_RECORDS = {disease["crop_id"] for disease in DISEASES}
CROPS = [crop[:5] for crop in CATALOG_CROPS if crop[0] in _CROP_IDS_WITH_RECORDS]


def build_database():
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    if DATABASE_PATH.exists():
        DATABASE_PATH.unlink()
    connection = sqlite3.connect(DATABASE_PATH)
    cursor = connection.cursor()
    cursor.executescript("""
      CREATE TABLE crops (
        id TEXT PRIMARY KEY,
        name_ar TEXT NOT NULL,
        name_fr TEXT NOT NULL,
        name_en TEXT NOT NULL,
        scientific_name TEXT NOT NULL
      );
      CREATE TABLE diseases (
        id TEXT PRIMARY KEY,
        crop_id TEXT NOT NULL REFERENCES crops(id),
        scientific_name TEXT NOT NULL,
        name_ar TEXT NOT NULL,
        name_fr TEXT NOT NULL,
        name_en TEXT NOT NULL,
        symptoms_json TEXT NOT NULL,
        evidence_ar TEXT NOT NULL,
        evidence_fr TEXT NOT NULL,
        evidence_en TEXT NOT NULL,
        field_check_ar TEXT NOT NULL,
        field_check_fr TEXT NOT NULL,
        field_check_en TEXT NOT NULL,
        immediate_care_ar TEXT NOT NULL,
        immediate_care_fr TEXT NOT NULL,
        immediate_care_en TEXT NOT NULL,
        conditional_care_ar TEXT NOT NULL,
        conditional_care_fr TEXT NOT NULL,
        conditional_care_en TEXT NOT NULL,
        safety_ar TEXT NOT NULL,
        safety_fr TEXT NOT NULL,
        safety_en TEXT NOT NULL,
        source_url TEXT NOT NULL,
        source_scope TEXT NOT NULL CHECK(source_scope IN ('record_specific', 'crop_group')),
        review_status TEXT NOT NULL CHECK(review_status IN ('reviewed', 'source_mapped', 'pending_evidence'))
      );
      CREATE INDEX diseases_by_crop ON diseases(crop_id);
    """)
    cursor.executemany("INSERT INTO crops VALUES (?, ?, ?, ?, ?)", CROPS)
    for disease in DISEASES:
        cursor.execute("""
          INSERT INTO diseases VALUES (
            :id, :crop_id, :scientific_name, :name_ar, :name_fr, :name_en, :symptoms_json,
            :evidence_ar, :evidence_fr, :evidence_en, :field_check_ar, :field_check_fr, :field_check_en,
            :immediate_care_ar, :immediate_care_fr, :immediate_care_en,
            :conditional_care_ar, :conditional_care_fr, :conditional_care_en,
            :safety_ar, :safety_fr, :safety_en, :source_url, :source_scope, :review_status
          )
        """, {
          "id": disease["id"], "crop_id": disease["crop_id"], "scientific_name": disease["scientific_name"],
          "name_ar": disease["name"]["ar"], "name_fr": disease["name"]["fr"], "name_en": disease["name"]["en"],
          "symptoms_json": json.dumps(disease["symptoms"]),
          "evidence_ar": disease["evidence"]["ar"], "evidence_fr": disease["evidence"]["fr"], "evidence_en": disease["evidence"]["en"],
          "field_check_ar": disease["field"]["ar"], "field_check_fr": disease["field"]["fr"], "field_check_en": disease["field"]["en"],
          "immediate_care_ar": disease["immediate"]["ar"], "immediate_care_fr": disease["immediate"]["fr"], "immediate_care_en": disease["immediate"]["en"],
          "conditional_care_ar": disease["conditional"]["ar"], "conditional_care_fr": disease["conditional"]["fr"], "conditional_care_en": disease["conditional"]["en"],
          "safety_ar": disease["safety"]["ar"], "safety_fr": disease["safety"]["fr"], "safety_en": disease["safety"]["en"],
          "source_url": disease["source"],
          "source_scope": disease["source_scope"],
          "review_status": disease["review_status"],
        })
    connection.commit()
    connection.close()
    print(f"Built {DATABASE_PATH} with {len(CROPS)} crops and {len(DISEASES)} disease records.")


if __name__ == "__main__":
    build_database()
