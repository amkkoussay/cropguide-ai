import { describe, expect, it } from "vitest";
import { conservativeTonePlan, dataUrlByteSize, detailCropCandidates, formatPreparedImageSize, imagePreparationPlan, selectDetailCrop } from "./imagePreparation";

describe("imagePreparationPlan", () => {
  it("downscales very large camera images without upscaling small images", () => {
    expect(imagePreparationPlan(4000, 3000)).toMatchObject({ width: 1800, height: 1350, jpegQuality: 0.88 });
    expect(imagePreparationPlan(640, 480)).toMatchObject({ width: 640, height: 480, lowDetail: true });
  });

  it("preserves usable detail flags for field guidance", () => {
    expect(imagePreparationPlan(1600, 1200).lowDetail).toBe(false);
    expect(imagePreparationPlan(500, 1500).lowDetail).toBe(true);
  });

  it("reports safe, human-readable metadata for the prepared JPEG", () => {
    expect(dataUrlByteSize("data:image/jpeg;base64,QUJDRA==")).toBe(4);
    expect(formatPreparedImageSize(1_572_864)).toBe("1.5 MB");
    expect(formatPreparedImageSize(1_024)).toBe("1 KB");
  });

  it("keeps automatic tone normalization inside conservative bounds", () => {
    expect(conservativeTonePlan(5, 0)).toMatchObject({ brightness: 1.07, contrast: 1.0675, saturation: 1.035 });
    expect(conservativeTonePlan(250, 100)).toMatchObject({ brightness: 0.95, contrast: 1.03, saturation: 1.035 });
  });

  it("creates and selects a texture-rich detail crop while preserving the full frame", () => {
    expect(detailCropCandidates(516, 387).length).toBeGreaterThan(1);
    const pixels = new Uint8ClampedArray(40 * 30 * 4).fill(245);
    for (let y = 16; y < 30; y += 1) for (let x = 24; x < 40; x += 1) {
      const index = (y * 40 + x) * 4;
      pixels[index] = 40;
      pixels[index + 1] = (x + y) % 2 ? 120 : 55;
      pixels[index + 2] = 35;
      pixels[index + 3] = 255;
    }
    const crop = selectDetailCrop(516, 387, { width: 40, height: 30, data: pixels });
    expect(crop).not.toBeNull();
    expect(crop!.x).toBeGreaterThan(0);
    expect(crop!.y).toBeGreaterThan(0);
  });
});
