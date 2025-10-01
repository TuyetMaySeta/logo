import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "52ebe45d1eb6.ngrok-free.app" // thêm host ngrok vào đây
    ]
  },
  base:
    process.env.VITE_BASE_PATH === "" ? "/app/v1/" : process.env.VITE_BASE_PATH,
  plugins: [
    react(),
    tailwindcss(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
