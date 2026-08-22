import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "server/_core/vite.ts"), "utf8");
const serverSource = readFileSync(resolve(process.cwd(), "server/_core/index.ts"), "utf8");

describe("production static asset policy", () => {
  it("does not substitute the application shell for a missing lazy-loaded asset", () => {
    expect(source).toContain('if (req.path.startsWith("/assets/"))');
    expect(source).toContain("res.sendStatus(404)");
  });

  it("revalidates the HTML shell while keeping fingerprinted assets immutable", () => {
    expect(source).toContain('res.setHeader("Cache-Control", "no-cache, max-age=0, must-revalidate")');
    expect(source).toContain('res.setHeader("Cache-Control", "public, max-age=31536000, immutable")');
    expect(source).toContain('filename.startsWith("sw-")');
  });

  it("serves the worker from a dynamic no-store route with root scope", () => {
    expect(serverSource).toContain('app.get("/api/cropguide-worker"');
    expect(serverSource).toContain('"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"');
    expect(serverSource).toContain('"CDN-Cache-Control": "no-store"');
    expect(serverSource).toContain('"Surrogate-Control": "no-store"');
    expect(serverSource).toContain('"Service-Worker-Allowed": "/"');
    expect(serverSource).toContain('"sw-ordinary-photo-v9.js"');
  });
});
