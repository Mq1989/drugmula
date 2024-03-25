import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/autocomplete": {
        target: "http://localhost:5500",
        changeOrigin: true,
      },
      "/drugautocomplete": {
        target: "http://localhost:5500",
        changeOrigin: true,
      },
      "/druginfo": {
        target: "http://localhost:5500",
        changeOrigin: true,
      },
      "/stockinfo": {
        target: "http://localhost:5500",
        changeOrigin: true,
      },
      "/getOngoingTrials": {
        target: "http://localhost:5500",
        changeOrigin: true,
      },
      "/companyNameAutoComplete": {
        target: "http://localhost:5500",
        changeOrigin: true,
      },
      "/getCompanyStudies": {
        target: "http://localhost:5500",
        changeOrigin: true,
      },
    },
  },
});
