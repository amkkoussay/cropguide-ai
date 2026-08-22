import { afterEach, describe, expect, it, vi } from "vitest";
import { buildPlantIdPayload, PlantIdRequestError, redactProviderResponse, requestPlantAnalysis, summarizePlantIdResponse } from "./plantId";

const originalApiKey = process.env.PLANT_ID_API_KEY;

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalApiKey === undefined) delete process.env.PLANT_ID_API_KEY;
  else process.env.PLANT_ID_API_KEY = originalApiKey;
});

describe("summarizePlantIdResponse", () => {
  it("extracts compact plant and health candidates from a provider response", () => {
    const summary = summarizePlantIdResponse({
      result: {
        is_plant: { binary: true },
        is_healthy: { binary: false },
        classification: {
          suggestions: [
            { name: "Olea europaea", probability: 0.94, details: { common_names: ["olive"] } },
          ],
        },
        disease: { suggestions: [{ name: "Leaf spot", probability: 0.72 }] },
      },
    });

    expect(summary).toMatchObject({
      isPlant: true,
      isHealthy: false,
      topPlant: { name: "Olea europaea", probability: 0.94, commonNames: ["olive"] },
      topHealth: { name: "Leaf spot", probability: 0.72 },
    });
  });

  it("returns safe empty candidates when health data is absent", () => {
    expect(summarizePlantIdResponse({ result: {} })).toMatchObject({
      isPlant: null,
      isHealthy: null,
      plantCandidates: [],
      healthCandidates: [],
    });
  });

  it("retains a provider status for request failures", () => {
    const error = new PlantIdRequestError(400, "Invalid inline image");
    expect(error).toMatchObject({ name: "PlantIdRequestError", status: 400, message: "Invalid inline image" });
  });
});

describe("buildPlantIdPayload", () => {
  it("removes the browser data URL prefix before calling Plant.id v3", () => {
    const payload = buildPlantIdPayload("data:image/jpeg;base64,ZmllbGQtbGVhZg==");

    expect(payload).toEqual({
      images: ["ZmllbGQtbGVhZg=="],
    });
    expect(payload).not.toHaveProperty("custom_id");
  });

  it("keeps the normalized full frame and derived detail frame in the same request", () => {
    expect(buildPlantIdPayload(["data:image/jpeg;base64,ZnVsbC1mcmFtZQ==", "ZGV0YWlsLWZyYW1l"]))
      .toEqual({ images: ["ZnVsbC1mcmFtZQ==", "ZGV0YWlsLWZyYW1l"] });
  });
});

describe("requestPlantAnalysis", () => {
  it("sends only Plant.id v3-compatible image fields and retains CropGuide species locally", async () => {
    process.env.PLANT_ID_API_KEY = "test-key";
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ access_token: "temporary-provider-token", result: {} }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const analysis = await requestPlantAnalysis({ imageBase64s: ["data:image/jpeg;base64,ZmllbGQtbGVhZg==", "ZGV0YWls"] });

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(options.body))).toEqual({ images: ["ZmllbGQtbGVhZg==", "ZGV0YWls"] });
    expect(analysis).toMatchObject({ raw: { result: {} } });
  });
});

describe("redactProviderResponse", () => {
  it("removes provider credentials while retaining nested analysis data", () => {
    expect(
      redactProviderResponse({
        access_token: "temporary-provider-token",
        result: { classification: { suggestions: [{ name: "Citrus × aurantium" }] } },
        trace: { Authorization: "Bearer should-not-persist" },
      }),
    ).toEqual({
      result: { classification: { suggestions: [{ name: "Citrus × aurantium" }] } },
      trace: {},
    });
  });
});
