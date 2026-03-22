import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/SmartEdu1/",
  plugins: [react()],
  server: {
    proxy: {
      "/jsp": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jsp/, "/SmartEdu1"),
      },
    },
  },
});