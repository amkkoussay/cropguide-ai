import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "client",
  plugins: [react()],
  server: {
    allowedHosts: ["3000-isqjra44p4h9d7aoit7hb-3e7437eb.us4.manus.computer"],
  },
  build: { outDir: "../dist/public", emptyOutDir: true },
});
