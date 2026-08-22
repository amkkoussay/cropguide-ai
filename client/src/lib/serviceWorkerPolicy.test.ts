import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const workerSource = readFileSync(resolve(process.cwd(), "client/public/sw.js"), "utf8");
const releaseWorkerSource = readFileSync(resolve(process.cwd(), "client/public/sw-ordinary-photo-v9.js"), "utf8");
const registrationSource = readFileSync(resolve(process.cwd(), "client/src/main.tsx"), "utf8");

describe("service worker update policy", () => {
  it("uses a new cache namespace and does not serve application assets cache-first", () => {
    expect(workerSource).toContain('const CACHE = "cropguide-shell-v6"');
    expect(workerSource).toContain('new Request(event.request, { cache: "no-store" })');
    expect(workerSource).toContain('url.pathname.startsWith("/assets/")');
    expect(workerSource).toContain("fetch(networkRequest)\n      .then(response => {");
    expect(workerSource).not.toContain("caches.match(event.request).then(cached => cached || fetch(event.request)");
    expect(releaseWorkerSource).toContain('const CACHE = "cropguide-shell-v9"');
    expect(releaseWorkerSource).toContain('url.pathname.startsWith("/assets/")');
  });

  it("registers a versioned worker without using the HTTP cache", () => {
    expect(registrationSource).toContain('SERVICE_WORKER_RELEASE = "20260817-ordinary-photo-api-worker-v9"');
    expect(registrationSource).toContain('SERVICE_WORKER_PATH = "/api/cropguide-worker"');
    expect(registrationSource).toContain('{ scope: "/", updateViaCache: "none" }');
    expect(registrationSource).toContain('updateViaCache: "none"');
    expect(registrationSource).toContain("registration.update()");
    expect(registrationSource).toContain("controllerchange");
    expect(registrationSource).toContain("window.location.replace");
  });
});
