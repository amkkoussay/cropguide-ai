export type ImagePreparationPlan = {
  width: number;
  height: number;
  jpegQuality: number;
  lowDetail: boolean;
};

export type DetailCrop = { x: number; y: number; size: number };
export type TonePlan = { brightness: number; contrast: number; saturation: number };
type PixelSample = { width: number; height: number; data: Uint8ClampedArray };

export function imagePreparationPlan(sourceWidth: number, sourceHeight: number): ImagePreparationPlan {
  const longestEdge = Math.max(sourceWidth, sourceHeight);
  const scale = Math.min(1, 1800 / Math.max(1, longestEdge));
  return {
    width: Math.max(1, Math.round(sourceWidth * scale)),
    height: Math.max(1, Math.round(sourceHeight * scale)),
    jpegQuality: longestEdge > 2_600 ? 0.88 : 0.9,
    lowDetail: Math.min(sourceWidth, sourceHeight) < 520,
  };
}

/** Keeps corrections bounded so existing leaf details are never painted over or invented. */
export function conservativeTonePlan(meanLuminance: number, standardDeviation: number): TonePlan {
  const brightness = Math.min(1.07, Math.max(0.95, 1 + (138 - meanLuminance) / 900));
  const contrast = Math.min(1.1, Math.max(1.03, 1 + (54 - standardDeviation) / 800));
  return { brightness, contrast, saturation: 1.035 };
}

/** Overlapping candidates retain context while allowing the provider to inspect dense leaf detail. */
export function detailCropCandidates(width: number, height: number): DetailCrop[] {
  const size = Math.max(1, Math.round(Math.min(width, height) * 0.72));
  const maxX = Math.max(0, width - size);
  const maxY = Math.max(0, height - size);
  const candidates = [
    { x: 0, y: 0, size }, { x: maxX, y: 0, size }, { x: 0, y: maxY, size },
    { x: maxX, y: maxY, size }, { x: Math.round(maxX / 2), y: Math.round(maxY / 2), size },
  ];
  return candidates.filter((candidate, index, all) => all.findIndex(other => other.x === candidate.x && other.y === candidate.y && other.size === candidate.size) === index);
}

function luminance(red: number, green: number, blue: number) {
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function sampleTone(sample: PixelSample) {
  let count = 0;
  let total = 0;
  let squared = 0;
  for (let index = 0; index < sample.data.length; index += 16) {
    const value = luminance(sample.data[index], sample.data[index + 1], sample.data[index + 2]);
    total += value;
    squared += value * value;
    count += 1;
  }
  const mean = count ? total / count : 138;
  return { mean, standardDeviation: Math.sqrt(Math.max(0, squared / Math.max(1, count) - mean * mean)) };
}

/** Selects the crop with the richest non-background texture; it does not classify a disease. */
export function selectDetailCrop(sourceWidth: number, sourceHeight: number, sample: PixelSample): DetailCrop | null {
  if (Math.min(sourceWidth, sourceHeight) < 180) return null;
  const scaleX = sample.width / sourceWidth;
  const scaleY = sample.height / sourceHeight;
  let winner: DetailCrop | null = null;
  let winnerScore = Number.NEGATIVE_INFINITY;

  for (const candidate of detailCropCandidates(sourceWidth, sourceHeight)) {
    const startX = Math.max(0, Math.floor(candidate.x * scaleX));
    const endX = Math.min(sample.width, Math.ceil((candidate.x + candidate.size) * scaleX));
    const startY = Math.max(0, Math.floor(candidate.y * scaleY));
    const endY = Math.min(sample.height, Math.ceil((candidate.y + candidate.size) * scaleY));
    let count = 0;
    let total = 0;
    let squared = 0;
    let midTone = 0;
    let chroma = 0;
    for (let y = startY; y < endY; y += 2) for (let x = startX; x < endX; x += 2) {
      const index = (y * sample.width + x) * 4;
      const red = sample.data[index];
      const green = sample.data[index + 1];
      const blue = sample.data[index + 2];
      const value = luminance(red, green, blue);
      total += value;
      squared += value * value;
      chroma += Math.max(red, green, blue) - Math.min(red, green, blue);
      if (value > 24 && value < 238) midTone += 1;
      count += 1;
    }
    if (!count) continue;
    const mean = total / count;
    const deviation = Math.sqrt(Math.max(0, squared / count - mean * mean));
    const score = deviation * 0.75 + (midTone / count) * 42 + (chroma / count) * 0.2;
    if (score > winnerScore) {
      winner = candidate;
      winnerScore = score;
    }
  }
  return winner;
}

export function dataUrlByteSize(dataUrl: string) {
  const base64 = dataUrl.split(",", 2)[1] ?? "";
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

export function formatPreparedImageSize(byteSize: number) {
  return byteSize >= 1024 * 1024 ? `${(byteSize / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.ceil(byteSize / 1024))} KB`;
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas is unavailable");
  return { canvas, context };
}

export async function prepareFieldImage(file: File) {
  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  try {
    image.src = objectUrl;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Image decode failed"));
    });
    const plan = imagePreparationPlan(image.naturalWidth, image.naturalHeight);
    const toneSample = createCanvas(96, Math.max(1, Math.round((96 * plan.height) / plan.width)));
    toneSample.context.drawImage(image, 0, 0, toneSample.canvas.width, toneSample.canvas.height);
    const sample = sampleTone(toneSample.context.getImageData(0, 0, toneSample.canvas.width, toneSample.canvas.height));
    const tone = conservativeTonePlan(sample.mean, sample.standardDeviation);

    const full = createCanvas(plan.width, plan.height);
    full.context.imageSmoothingEnabled = true;
    full.context.imageSmoothingQuality = "high";
    full.context.filter = `brightness(${tone.brightness}) contrast(${tone.contrast}) saturate(${tone.saturation})`;
    full.context.drawImage(image, 0, 0, plan.width, plan.height);
    full.context.filter = "none";
    const dataUrl = full.canvas.toDataURL("image/jpeg", plan.jpegQuality);

    const detailSample = createCanvas(160, Math.max(1, Math.round((160 * plan.height) / plan.width)));
    detailSample.context.drawImage(full.canvas, 0, 0, detailSample.canvas.width, detailSample.canvas.height);
    const selectedCrop = selectDetailCrop(plan.width, plan.height, detailSample.context.getImageData(0, 0, detailSample.canvas.width, detailSample.canvas.height));
    const detailDataUrls: string[] = [];
    if (selectedCrop) {
      const detailEdge = Math.min(1120, Math.max(640, Math.round(selectedCrop.size * 1.3)));
      const detail = createCanvas(detailEdge, detailEdge);
      detail.context.imageSmoothingEnabled = true;
      detail.context.imageSmoothingQuality = "high";
      detail.context.drawImage(full.canvas, selectedCrop.x, selectedCrop.y, selectedCrop.size, selectedCrop.size, 0, 0, detailEdge, detailEdge);
      detailDataUrls.push(detail.canvas.toDataURL("image/jpeg", 0.9));
    }
    return { dataUrl, detailDataUrls, lowDetail: plan.lowDetail, dimensions: `${plan.width} × ${plan.height}`, byteSize: dataUrlByteSize(dataUrl) };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
