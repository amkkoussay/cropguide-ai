import { trpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import "./index.css";

const SERVICE_WORKER_RELEASE = "20260817-ordinary-photo-api-worker-v9";
const SERVICE_WORKER_PATH = "/api/cropguide-worker";

if ("serviceWorker" in navigator) {
  let pageReloadedForWorker = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (pageReloadedForWorker) return;
    pageReloadedForWorker = true;
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("cg_release", SERVICE_WORKER_RELEASE);
    window.location.replace(currentUrl.toString());
  });

  window.addEventListener("load", () => {
    void navigator.serviceWorker
      .register(`${SERVICE_WORKER_PATH}?release=${SERVICE_WORKER_RELEASE}`, { scope: "/", updateViaCache: "none" })
      .then(registration => registration.update());
  });
}

const queryClient = new QueryClient();

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    console.error("[API Query Error]", event.query.state.error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    console.error("[API Mutation Error]", event.mutation.state.error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
