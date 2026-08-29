import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("expanded source review policy", () => {
  it("requires a monthly human-reviewed process with no automatic advice changes", () => {
    const policy = JSON.parse(fs.readFileSync(path.join(root, "data", "review-policy.json"), "utf8"));
    expect(policy.frequency).toBe("monthly");
    expect(policy.timezone).toBe("Africa/Tunis");
    expect(policy.autoApplyDiseaseChanges).toBe(false);
    expect(policy.humanApprovalRequired).toBe(true);
    expect(policy.outputDirectory).toBe("data/review-runs");
  });
});
