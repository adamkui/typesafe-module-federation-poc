import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "app-remote",
      filename: "remoteEntry.js",
      exposes: {
        "./components/AreaChart": "./src/components/AreaChart.tsx",
        "./components/LineChart": "./src/components/LineChart.tsx",
        "./utils": "./src/utils.ts",
      },
      shared: ["react", "react-dom", "lodash"],
    }),
    tailwindcss(),
  ],
  build: {
    target: "esnext",
    modulePreload: false,
    cssCodeSplit: false,
    minify: false,
  },
  server: {
    port: 5001,
  },
});
