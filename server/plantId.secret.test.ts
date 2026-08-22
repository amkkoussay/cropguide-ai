import { describe, expect, it } from "vitest";

const TINY_PNG =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

describe("Plant.id credential", () => {
  it("is accepted by the Plant.id v3 identification endpoint", async () => {
    const apiKey = process.env.PLANT_ID_API_KEY;
    expect(apiKey, "PLANT_ID_API_KEY must be configured").toBeTruthy();

    const response = await fetch("https://api.plant.id/v3/identification", {
      method: "POST",
      headers: {
        "Api-Key": apiKey as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images: [TINY_PNG] }),
    });

    // The deliberately tiny image can be rejected as unusable, but authorization
    // failures must never be accepted as a valid configuration.
    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  }, 20_000);
});
