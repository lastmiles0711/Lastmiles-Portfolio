import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "child_process";

const FETCH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

function fetchReposPlugin() {
  return {
    name: "fetch-repos",

    // Run fetch on build start (covers both dev and production builds)
    buildStart() {
      console.log("[vite] Running fetch-repos…");
      try {
        execSync("node scripts/fetch-repos.js", { stdio: "inherit" });
      } catch {
        console.warn("[vite] fetch-repos failed — using stale data");
      }
    },

    // Schedule hourly re-fetch during dev
    configureServer() {
      const interval = setInterval(() => {
        console.log("[vite] Hourly re-fetch of repo data…");
        try {
          execSync("node scripts/fetch-repos.js", { stdio: "inherit" });
        } catch {
          console.warn("[vite] Hourly fetch failed — stale data kept");
        }
      }, FETCH_INTERVAL_MS);

      // Clean up on server close
      return () => clearInterval(interval);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [fetchReposPlugin(), react()],
});
