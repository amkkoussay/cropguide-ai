import { describe, expect, it } from "vitest";
import { resolveInitialLocale } from "@/contexts/LanguageContext";
import { translate } from "./i18n";

describe("CropGuide translations", () => {
  it("renders every added field species in Arabic and French", () => {
    expect(translate("ar", "species.date_palm")).toBe("نخيل التمر");
    expect(translate("fr", "species.grapevine")).toBe("Vigne");
    expect(translate("fr", "species.stone_fruit")).toBe("Fruits à noyau");
  });

  it("interpolates live scan values", () => {
    expect(translate("ar", "history.scan", { id: 42 })).toBe("فحص #42");
    expect(translate("en", "map.count", { count: 3 })).toBe("3 geotagged scans");
    expect(translate("ar", "home.preparedImage", { dimensions: "1800 × 1350", size: "1.2 MB" })).toContain("1800 × 1350");
    expect(translate("fr", "home.preparedImage", { dimensions: "1800 × 1350", size: "1.2 MB" })).toContain("Préparée");
  });

  it("provides non-fallback field UI for Arabic and French", () => {
    const keys = ["nav.scan", "home.lowDetail", "history.filter", "result.experimental", "map.fallback", "notFound.title"];
    for (const locale of ["ar", "fr"] as const) {
      for (const key of keys) expect(translate(locale, key)).not.toBe(key);
    }
    expect(translate("ar", "home.lowDetail")).toContain("الصورة");
    expect(translate("fr", "result.experimental")).toBe("expérimental uniquement");
  });

  it("explains an inconclusive disease assessment without blaming ordinary field photos", () => {
    expect(translate("ar", "home.uploadHint")).toContain("صورة عادية");
    expect(translate("ar", "result.noHealth")).toContain("لم يُعد مرشح مرضي موثوق");
    expect(translate("ar", "result.noHealth")).not.toContain("صورة أوضح");
    expect(translate("fr", "result.inspectLead")).toContain("non concluante");
  });

  it("honours a valid language link before the stored preference", () => {
    expect(resolveInitialLocale("?lang=ar", "fr")).toBe("ar");
    expect(resolveInitialLocale("?lang=invalid", "fr")).toBe("fr");
    expect(resolveInitialLocale("", null)).toBe("en");
  });
});
